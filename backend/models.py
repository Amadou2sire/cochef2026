from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, ForeignKey, JSON, Enum, Table
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime
import enum

# Database URL - Update with your actual database credentials
# DATABASE_URL = "postgresql://user:password@localhost/cochef_db"
# For development with SQLite:
DATABASE_URL = "sqlite:///./cochef.db"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class UserRole(str, enum.Enum):
    CLIENT = "client"
    CAISSIER = "caissier"
    GERANT = "gerant"
    WEBMASTER = "webmaster"

class OrderStatus(str, enum.Enum):
    PENDING = "pending"
    PREPARING = "preparing"
    READY = "ready"
    CLOSED = "closed"

# Association table for Product and Supplement
product_supplements = Table(
    "product_supplements",
    Base.metadata,
    Column("product_id", Integer, ForeignKey("products.id"), primary_key=True),
    Column("supplement_id", Integer, ForeignKey("supplements.id"), primary_key=True)
)

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(Enum(UserRole), default=UserRole.CLIENT)
    phone = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    orders = relationship("Order", back_populates="user")

class Product(Base):
    __tablename__ = "products"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    category = Column(String, nullable=False)  # entrees, plats, sandwichs, pizzas, boissons
    subcategory = Column(String, nullable=True)
    description = Column(String, nullable=True)
    base_price = Column(Float, nullable=False)
    product_type = Column(String, nullable=False)  # plat, sandwich, pizza, etc.
    available = Column(Integer, default=1)  # 1 = available, 0 = unavailable
    image_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    order_details = relationship("OrderDetail", back_populates="product")
    supplements = relationship("Supplement", secondary=product_supplements, back_populates="products")

class Supplement(Base):
    __tablename__ = "supplements"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    available = Column(Integer, default=1)
    image_url = Column(String, nullable=True)
    
    # Relationships
    products = relationship("Product", secondary=product_supplements, back_populates="supplements")

class Order(Base):
    __tablename__ = "orders"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    total_price = Column(Float, nullable=False)
    status = Column(Enum(OrderStatus), default=OrderStatus.PENDING)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="orders")
    order_details = relationship("OrderDetail", back_populates="order", cascade="all, delete-orphan")

class OrderDetail(Base):
    __tablename__ = "order_details"
    
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    quantity = Column(Integer, default=1)
    options = Column(JSON, nullable=True)  # For sandwich customization: {"viandes": ["poulet"], "sauces": ["blanche"], "supplements": ["fromage"]}
    unit_price = Column(Float, nullable=False)
    total_price = Column(Float, nullable=False)
    
    # Relationships
    order = relationship("Order", back_populates="order_details")
    product = relationship("Product", back_populates="order_details")

class Event(Base):
    __tablename__ = "events"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    date = Column(DateTime, nullable=False)
    total_places = Column(Integer, nullable=False)
    occupied_places = Column(Integer, default=0)
    tables_required = Column(Integer, default=0)
    image_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Setting(Base):
    __tablename__ = "settings"
    
    id = Column(Integer, primary_key=True, index=True)
    key = Column(String, unique=True, index=True, nullable=False)
    value = Column(String, nullable=False)

# Create all tables
def init_db():
    Base.metadata.create_all(bind=engine)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
