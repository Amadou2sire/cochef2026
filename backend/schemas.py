from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime
from models import UserRole, OrderStatus

# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    name: str # Keep for compatibility
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(UserBase):
    id: int
    role: UserRole
    created_at: datetime
    
    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None

class PasswordChange(BaseModel):
    current_password: str
    new_password: str

# Admin User Management Schemas
class UserAdminCreate(BaseModel):
    email: EmailStr
    name: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    password: str
    role: UserRole

class UserAdminUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    role: Optional[UserRole] = None
    password: Optional[str] = None  # Optional password reset

# Product Schemas
class ProductBase(BaseModel):
    name: str
    category: str
    subcategory: Optional[str] = None
    description: Optional[str] = None
    base_price: float
    product_type: str
    image_url: Optional[str] = None
    available: int = 1
    supplement_ids: Optional[List[int]] = []

class ProductCreate(ProductBase):
    pass

class Product(ProductBase):
    id: int
    available: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Supplement Schemas
class SupplementBase(BaseModel):
    name: str
    price: float
    available: int = 1
    image_url: Optional[str] = None

class SupplementCreate(SupplementBase):
    pass

class Supplement(SupplementBase):
    id: int
    
    class Config:
        from_attributes = True

# Update Product to include supplements in read
class ProductWithSupplements(Product):
    supplements: List[Supplement] = []

# Order Detail Schemas
class OrderDetailBase(BaseModel):
    product_id: int
    quantity: int
    options: Optional[Dict[str, Any]] = None
    unit_price: float
    total_price: float

class OrderDetailCreate(OrderDetailBase):
    pass

class OrderDetail(OrderDetailBase):
    id: int
    order_id: int
    product: Optional[Product] = None
    
    class Config:
        from_attributes = True

# Order Schemas
class OrderBase(BaseModel):
    total_price: float

class OrderCreate(OrderBase):
    order_details: List[OrderDetailCreate]

class Order(OrderBase):
    id: int
    user_id: int
    status: OrderStatus
    created_at: datetime
    updated_at: datetime
    order_details: List[OrderDetail] = []
    
    class Config:
        from_attributes = True

# Event Schemas
class EventBase(BaseModel):
    title: str
    description: str
    date: datetime
    total_places: int
    occupied_places: int = 0
    tables_required: int = 0
    image_url: Optional[str] = None

class EventCreate(EventBase):
    pass

class Event(EventBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Setting Schemas
class SettingBase(BaseModel):
    key: str
    value: str

class Setting(SettingBase):
    id: int
    
    class Config:
        from_attributes = True

# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None
