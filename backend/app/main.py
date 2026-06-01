from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session

from . import models, schemas, database

from fastapi.middleware.cors import CORSMiddleware

# Create DB tables
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

# ---------------- CORS ----------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ---------------- ROOT ----------------
@app.get("/")
def root():
    return {"message": "Inventory Management API is running"}

# ---------------- PRODUCTS ----------------
@app.get("/products")
def get_products(db: Session = Depends(get_db)):
    return db.query(models.Product).all()


@app.post("/products")
def add_product(product: schemas.ProductCreate, db: Session = Depends(get_db)):
    new_product = models.Product(
        sku=product.sku,
        name=product.name,
        price=product.price,
        stock=product.stock
    )
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product


# ---------------- CUSTOMERS ----------------
@app.get("/customers")
def get_customers(db: Session = Depends(get_db)):
    return db.query(models.Customer).all()


@app.post("/customers")
def add_customer(customer: schemas.CustomerCreate, db: Session = Depends(get_db)):
    new_customer = models.Customer(
        name=customer.name,
        email=customer.email
    )
    db.add(new_customer)
    db.commit()
    db.refresh(new_customer)
    return new_customer


# ---------------- ORDERS ----------------
@app.post("/orders")
def place_order(order: schemas.OrderCreate, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == order.product_id).first()

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    if product.stock < order.quantity:
        raise HTTPException(status_code=400, detail="Not enough stock")

    product.stock -= order.quantity

    new_order = models.Order(
        customer_id=order.customer_id,
        product_id=order.product_id,
        quantity=order.quantity
    )

    db.add(new_order)
    db.commit()
    db.refresh(new_order)

    return new_order