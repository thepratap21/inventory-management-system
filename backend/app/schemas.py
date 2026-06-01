from pydantic import BaseModel

# -------- PRODUCT --------
class ProductCreate(BaseModel):
    sku: str
    name: str
    price: float
    stock: int


class ProductOut(ProductCreate):
    id: int

    class Config:
        from_attributes = True


# -------- CUSTOMER --------
class CustomerCreate(BaseModel):
    name: str
    email: str


class CustomerOut(CustomerCreate):
    id: int

    class Config:
        from_attributes = True


# -------- ORDER --------
class OrderCreate(BaseModel):
    customer_id: int
    product_id: int
    quantity: int