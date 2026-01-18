from fastapi import FastAPI, Depends, HTTPException, status, File, UploadFile
from pydantic import BaseModel
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from typing import List
from fastapi.responses import StreamingResponse
from sqlalchemy import func
import io
import openpyxl
from datetime import datetime, date

import models
import schemas
import auth

# Initialize database
models.init_db()

import os
UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

app = FastAPI(title="CoChef API", version="0.1.0")

# Serve static files
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# CORS configuration
origins = [
    "http://localhost:5173",  # Vite default
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

# Dependency to get current user
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(models.get_db)):
    token_data = auth.decode_access_token(token)
    if token_data is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user = db.query(models.User).filter(models.User.email == token_data.email).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.get("/")
def read_root():
    return {"message": "Welcome to CoChef API"}

# Auth endpoints
@app.post("/auth/register", response_model=schemas.User)
def register(user: schemas.UserCreate, db: Session = Depends(models.get_db)):
    # Check if user already exists
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(
        name=user.name,
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        password_hash=hashed_password,
        phone=user.phone
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.post("/auth/login", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(models.get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.email, "role": user.role},
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/auth/me", response_model=schemas.User)
def get_current_user_info(current_user: models.User = Depends(get_current_user)):
    return current_user

@app.put("/auth/me", response_model=schemas.User)
def update_user_info(
    user_update: schemas.UserUpdate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(models.get_db)
):
    if user_update.first_name is not None:
        current_user.first_name = user_update.first_name
    if user_update.last_name is not None:
        current_user.last_name = user_update.last_name
    if user_update.phone is not None:
        current_user.phone = user_update.phone
    
    current_user.name = f"{current_user.first_name or ''} {current_user.last_name or ''}".strip() or current_user.name
    
    db.commit()
    db.refresh(current_user)
    return current_user

@app.put("/auth/change-password")
def change_password(
    password_data: schemas.PasswordChange,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(models.get_db)
):
    if not auth.verify_password(password_data.current_password, current_user.password_hash):
        raise HTTPException(status_code=400, detail="Incorrect current password")
    
    current_user.password_hash = auth.get_password_hash(password_data.new_password)
    db.commit()
    return {"message": "Password updated successfully"}

# User Management endpoints (Superadmin only)
@app.get("/users", response_model=List[schemas.User])
def get_all_users(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(models.get_db)
):
    if current_user.role != models.UserRole.SUPERADMIN:
        raise HTTPException(status_code=403, detail="Not authorized")
    return db.query(models.User).all()

@app.post("/users", response_model=schemas.User)
def create_user_admin(
    user: schemas.UserAdminCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(models.get_db)
):
    if current_user.role != models.UserRole.SUPERADMIN:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Check if user already exists
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(
        name=user.name,
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        password_hash=hashed_password,
        phone=user.phone,
        role=user.role
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.put("/users/{user_id}", response_model=schemas.User)
def update_user_admin(
    user_id: int,
    user_update: schemas.UserAdminUpdate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(models.get_db)
):
    if current_user.role != models.UserRole.SUPERADMIN:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user_update.first_name is not None:
        db_user.first_name = user_update.first_name
    if user_update.last_name is not None:
        db_user.last_name = user_update.last_name
    if user_update.phone is not None:
        db_user.phone = user_update.phone
    if user_update.role is not None:
        db_user.role = user_update.role
    if user_update.password is not None:
        db_user.password_hash = auth.get_password_hash(user_update.password)
    
    db_user.name = f"{db_user.first_name or ''} {db_user.last_name or ''}".strip() or db_user.name
    
    db.commit()
    db.refresh(db_user)
    return db_user

@app.delete("/users/{user_id}")
def delete_user_admin(
    user_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(models.get_db)
):
    if current_user.role != models.UserRole.SUPERADMIN:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Prevent deleting yourself
    if db_user.id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot delete yourself")
    
    db.delete(db_user)
    db.commit()
    return {"message": "User deleted successfully"}

# Product endpoints
@app.get("/menu", response_model=List[schemas.ProductWithSupplements])
def get_menu(category: str = None, db: Session = Depends(models.get_db)):
    query = db.query(models.Product).filter(models.Product.available == 1)
    if category:
        query = query.filter(models.Product.category == category)
    return query.all()

@app.get("/products/{product_id}", response_model=schemas.Product)
def get_product(product_id: int, db: Session = Depends(models.get_db)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@app.post("/products", response_model=schemas.ProductWithSupplements)
def create_product(
    product: schemas.ProductCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(models.get_db)
):
    # Only webmaster can create products
    if current_user.role != models.UserRole.WEBMASTER:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    db_product = models.Product(
        name=product.name,
        category=product.category,
        subcategory=product.subcategory,
        description=product.description,
        base_price=product.base_price,
        product_type=product.product_type,
        image_url=product.image_url,
        available=product.available
    )
    
    if product.supplement_ids:
        supplements = db.query(models.Supplement).filter(models.Supplement.id.in_(product.supplement_ids)).all()
        db_product.supplements = supplements

    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

@app.put("/products/{product_id}", response_model=schemas.ProductWithSupplements)
def update_product(
    product_id: int,
    product_update: schemas.ProductCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(models.get_db)
):
    if current_user.role != models.UserRole.WEBMASTER:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    for key, value in product_update.dict().items():
        if key != "supplement_ids":
            setattr(db_product, key, value)
    
    if product_update.supplement_ids is not None:
        supplements = db.query(models.Supplement).filter(models.Supplement.id.in_(product_update.supplement_ids)).all()
        db_product.supplements = supplements
    
    db.commit()
    db.refresh(db_product)
    return db_product

@app.delete("/products/{product_id}")
def delete_product(
    product_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(models.get_db)
):
    if current_user.role != models.UserRole.WEBMASTER:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    db.delete(db_product)
    db.commit()
    return {"message": "Product deleted"}

# Order endpoints
@app.post("/orders", response_model=schemas.Order)
def create_order(
    order: schemas.OrderCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(models.get_db)
):
    # Create order
    db_order = models.Order(
        user_id=current_user.id,
        total_price=order.total_price
    )
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    
    # Create order details
    for detail in order.order_details:
        db_detail = models.OrderDetail(
            order_id=db_order.id,
            **detail.dict()
        )
        db.add(db_detail)
    
    db.commit()
    db.refresh(db_order)
    return db_order

@app.get("/orders", response_model=List[schemas.Order])
def get_orders(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(models.get_db)
):
    if current_user.role == models.UserRole.CLIENT:
        # Clients see only their orders
        return db.query(models.Order).filter(models.Order.user_id == current_user.id).all()
    else:
        # Caissier and Gerant see all orders
        return db.query(models.Order).all()

@app.get("/orders/{order_id}", response_model=schemas.Order)
def get_order(
    order_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(models.get_db)
):
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Check authorization
    if current_user.role == models.UserRole.CLIENT and order.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    return order

@app.patch("/orders/{order_id}/status")
def update_order_status(
    order_id: int,
    status: models.OrderStatus,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(models.get_db)
):
    # Only caissier and gerant can update status
    if current_user.role == models.UserRole.CLIENT:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    order.status = status
    db.commit()
    return {"message": "Order status updated", "order_id": order_id, "status": status}

# Stats endpoint for gerant
@app.get("/admin/stats")
def get_stats(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(models.get_db)
):
    if current_user.role != models.UserRole.GERANT and current_user.role != models.UserRole.WEBMASTER:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # 1. Total Sales
    total_sales = db.query(func.sum(models.Order.total_price)).scalar() or 0.0
    
    # 2. Today's Sales & Orders
    today = datetime.utcnow().date()
    
    # SQLite stores datetime as string usually, so we might need careful comparison
    # but SQLAlchemy often handles python datetime objects well.
    # For SQLite specifically with datetime string:
    today_start = datetime.combine(today, datetime.min.time())
    
    today_sales = db.query(func.sum(models.Order.total_price)).filter(models.Order.created_at >= today_start).scalar() or 0.0
    today_orders_count = db.query(models.Order).filter(models.Order.created_at >= today_start).count()
    
    # 3. Average Order Value
    total_orders_count = db.query(models.Order).count()
    avg_order = (total_sales / total_orders_count) if total_orders_count > 0 else 0.0

    # 4. Top Products
    top_products_query = db.query(
        models.Product.name,
        models.Product.image_url,
        func.sum(models.OrderDetail.quantity).label('total_quantity')
    ).join(models.OrderDetail).group_by(models.Product.id).order_by(func.sum(models.OrderDetail.quantity).desc()).limit(5).all()
    
    top_products = [
        {"name": p.name, "sales": f"{p.total_quantity} v.", "img": p.image_url or "https://placehold.co/100"}
        for p in top_products_query
    ]

    # 5. Sales by Category
    category_stats = db.query(
        models.Product.category,
        func.count(models.OrderDetail.id).label('count'),
        func.sum(models.OrderDetail.total_price).label('total_sales')
    ).join(models.Product.order_details).group_by(models.Product.category).all()
    
    sales_by_category = [
        {"category": c.category, "count": c.count, "total": f"{c.total_sales or 0:.2f}"}
        for c in category_stats
    ]

    return {
        "total_sales": f"{total_sales:.2f}",
        "today_sales": f"{today_sales:.2f}",
        "orders_today": today_orders_count,
        "average_order": f"{avg_order:.2f}",
        "top_products": top_products,
        "sales_by_category": sales_by_category
    }

@app.get("/admin/export")
def export_data(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(models.get_db)
):
    if current_user.role != models.UserRole.GERANT and current_user.role != models.UserRole.WEBMASTER:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Create Excel
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "Commandes"
    
    # Headers
    headers = ["ID", "Date", "Client", "Total", "Statut"]
    ws.append(headers)
    
    orders = db.query(models.Order).order_by(models.Order.created_at.desc()).all()
    for order in orders:
        ws.append([
            order.id,
            order.created_at.strftime("%Y-%m-%d %H:%M"),
            order.user.name if order.user else "Inconnu",
            order.total_price,
            order.status
        ])
        
    stream = io.BytesIO()
    wb.save(stream)
    stream.seek(0)
    
    return StreamingResponse(
        stream,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f"attachment; filename=cochef_export_{datetime.now().strftime('%Y%m%d')}.xlsx"}
    )

# Event endpoints
@app.get("/events", response_model=List[schemas.Event])
def get_events(db: Session = Depends(models.get_db)):
    return db.query(models.Event).order_by(models.Event.date.asc()).all()

@app.post("/events", response_model=schemas.Event)
def create_event(
    event: schemas.EventCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(models.get_db)
):
    if current_user.role != models.UserRole.WEBMASTER:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    db_event = models.Event(**event.dict())
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event

@app.put("/events/{event_id}", response_model=schemas.Event)
def update_event(
    event_id: int,
    event_update: schemas.EventCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(models.get_db)
):
    if current_user.role != models.UserRole.WEBMASTER:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    db_event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not db_event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    for key, value in event_update.dict().items():
        setattr(db_event, key, value)
    
    db.commit()
    db.refresh(db_event)
    return db_event

@app.delete("/events/{event_id}")
def delete_event(
    event_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(models.get_db)
):
    if current_user.role != models.UserRole.WEBMASTER:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    db_event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not db_event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    db.delete(db_event)
    db.commit()
    return {"message": "Event deleted"}

@app.get("/kitchen/occupancy")
def get_kitchen_occupancy(db: Session = Depends(models.get_db)):
    # 1. Manual Occupancy (from Caissier)
    manual_setting = db.query(models.Setting).filter(models.Setting.key == "kitchen_occupied_manual").first()
    manual_occupied = int(manual_setting.value) if manual_setting else 0
    
    # 2. Event Occupancy (for TODAY)
    from datetime import datetime, time
    today_start = datetime.combine(datetime.now().date(), time.min)
    today_end = datetime.combine(datetime.now().date(), time.max)
    
    events_today = db.query(models.Event).filter(
        models.Event.date >= today_start,
        models.Event.date <= today_end
    ).all()
    
    event_occupied = sum(event.tables_required for event in events_today)
    
    # Total Occupied
    total_occupied = manual_occupied + event_occupied
    
    # Max Capacity
    capacity_setting = db.query(models.Setting).filter(models.Setting.key == "kitchen_capacity").first()
    max_capacity = int(capacity_setting.value) if capacity_setting else 10
    
    free_tables = max(0, max_capacity - total_occupied)
    
    return {
        "occupied_places": total_occupied, # keeping key for compatibility, now means tables
        "manual_occupied": manual_occupied,
        "event_occupied": event_occupied,
        "max_capacity": max_capacity,
        "free_tables": free_tables,
        "percentage": (total_occupied / max_capacity) * 100 if max_capacity > 0 else 0
    }

class KitchenUpdate(BaseModel):
    manual_occupied: int
    max_capacity: int

@app.post("/kitchen/occupancy")
def update_kitchen_occupancy(
    data: KitchenUpdate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(models.get_db)
):
    if current_user.role not in [models.UserRole.CAISSIER, models.UserRole.GERANT, models.UserRole.WEBMASTER]:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    # Update Manual Occupancy
    manual_setting = db.query(models.Setting).filter(models.Setting.key == "kitchen_occupied_manual").first()
    if manual_setting:
        manual_setting.value = str(data.manual_occupied)
    else:
        db.add(models.Setting(key="kitchen_occupied_manual", value=str(data.manual_occupied)))
        
    # Update Max Capacity
    capacity_setting = db.query(models.Setting).filter(models.Setting.key == "kitchen_capacity").first()
    if capacity_setting:
        capacity_setting.value = str(data.max_capacity)
    else:
        db.add(models.Setting(key="kitchen_capacity", value=str(data.max_capacity)))
        
    db.commit()
    return {"message": "Kitchen occupancy updated"}

# Setting endpoints
@app.get("/admin/settings", response_model=List[schemas.Setting])
def get_settings(current_user: models.User = Depends(get_current_user), db: Session = Depends(models.get_db)):
    if current_user.role != models.UserRole.WEBMASTER:
        raise HTTPException(status_code=403, detail="Not authorized")
    return db.query(models.Setting).all()

@app.post("/admin/settings", response_model=schemas.Setting)
def update_setting(
    setting: schemas.SettingBase,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(models.get_db)
):
    if current_user.role != models.UserRole.WEBMASTER:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    db_setting = db.query(models.Setting).filter(models.Setting.key == setting.key).first()
    if db_setting:
        db_setting.value = setting.value
    else:
        db_setting = models.Setting(**setting.dict())
        db.add(db_setting)
    
    db.commit()
    db.refresh(db_setting)
    return db_setting

@app.get("/settings", response_model=List[schemas.Setting])
def get_public_settings(db: Session = Depends(models.get_db)):
    return db.query(models.Setting).all()

@app.post("/upload")
async def upload_file(file: UploadFile = File(...), current_user: models.User = Depends(get_current_user)):
    if current_user.role != models.UserRole.WEBMASTER:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    file_extension = file.filename.split(".")[-1]
    if file_extension.lower() not in ["jpg", "jpeg", "png", "mp4", "webm"]:
        raise HTTPException(status_code=400, detail="Only jpg, jpeg, png, mp4 and webm files are allowed")
    
    import uuid
    filename = f"{uuid.uuid4()}.{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, filename)
    
    with open(file_path, "wb") as buffer:
        import shutil
        shutil.copyfileobj(file.file, buffer)
    
    return {"url": f"http://localhost:8000/uploads/{filename}"}

# Supplement endpoints
@app.get("/supplements", response_model=List[schemas.Supplement])
def get_supplements(db: Session = Depends(models.get_db)):
    return db.query(models.Supplement).filter(models.Supplement.available == 1).all()

@app.get("/admin/supplements", response_model=List[schemas.Supplement])
def admin_get_supplements(current_user: models.User = Depends(get_current_user), db: Session = Depends(models.get_db)):
    if current_user.role != models.UserRole.WEBMASTER:
        raise HTTPException(status_code=403, detail="Not authorized")
    return db.query(models.Supplement).all()

@app.post("/admin/supplements", response_model=schemas.Supplement)
def create_supplement(supplement: schemas.SupplementCreate, current_user: models.User = Depends(get_current_user), db: Session = Depends(models.get_db)):
    if current_user.role != models.UserRole.WEBMASTER:
        raise HTTPException(status_code=403, detail="Not authorized")
    db_supplement = models.Supplement(**supplement.dict())
    db.add(db_supplement)
    db.commit()
    db.refresh(db_supplement)
    return db_supplement

@app.put("/admin/supplements/{supplement_id}", response_model=schemas.Supplement)
def update_supplement(supplement_id: int, supplement_update: schemas.SupplementCreate, current_user: models.User = Depends(get_current_user), db: Session = Depends(models.get_db)):
    if current_user.role != models.UserRole.WEBMASTER:
        raise HTTPException(status_code=403, detail="Not authorized")
    db_supplement = db.query(models.Supplement).filter(models.Supplement.id == supplement_id).first()
    if not db_supplement:
        raise HTTPException(status_code=404, detail="Supplement not found")
    for var, value in vars(supplement_update).items():
        if value is not None:
            setattr(db_supplement, var, value)
    db.commit()
    db.refresh(db_supplement)
    return db_supplement

@app.delete("/admin/supplements/{supplement_id}")
def delete_supplement(supplement_id: int, current_user: models.User = Depends(get_current_user), db: Session = Depends(models.get_db)):
    if current_user.role != models.UserRole.WEBMASTER:
        raise HTTPException(status_code=403, detail="Not authorized")
    db_supplement = db.query(models.Supplement).filter(models.Supplement.id == supplement_id).first()
    if not db_supplement:
        raise HTTPException(status_code=404, detail="Supplement not found")
    db.delete(db_supplement)
    db.commit()
    return {"message": "Supplement deleted"}

# Seed dummy data if needed (optional helper)
@app.post("/admin/seed-events")
def seed_events(current_user: models.User = Depends(get_current_user), db: Session = Depends(models.get_db)):
    if current_user.role != models.UserRole.WEBMASTER:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Check if events already exist
    if db.query(models.Event).count() > 0:
        return {"message": "Events already exist"}
    
    from datetime import datetime, timedelta
    events = [
        models.Event(
            title="Atelier Risotto de Printemps",
            description="Apprenez les secrets du risotto parfait avec notre Chef Marc Antoine.",
            date=datetime.now() + timedelta(days=5),
            total_places=12,
            occupied_places=8,
            image_url="https://images.unsplash.com/photo-1476124369491-e7addf5db371?q=80&w=800"
        ),
        models.Event(
            title="Dégustation Vins & Fromages",
            description="Une soirée conviviale pour découvrir les meilleurs accords du terroir.",
            date=datetime.now() + timedelta(days=12),
            total_places=20,
            occupied_places=15,
            image_url="https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=800"
        ),
        models.Event(
            title="Masterclass Pâtisserie",
            description="Réalisez vos propres éclairs et choux comme un pro.",
            date=datetime.now() + timedelta(days=19),
            total_places=10,
            occupied_places=3,
            image_url="https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=800"
        )
    ]
    db.add_all(events)
    db.commit()
    return {"message": "Dummy events seeded"}
