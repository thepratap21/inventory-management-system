import React, { useEffect, useState } from "react";
import API from "./api";

function App() {
  // ---------------- PRODUCTS ----------------
  const [products, setProducts] = useState([]);
  const [productForm, setProductForm] = useState({
    sku: "",
    name: "",
    price: "",
    stock: ""
  });

  // ---------------- CUSTOMERS ----------------
  const [customers, setCustomers] = useState([]);
  const [customerForm, setCustomerForm] = useState({
    name: "",
    email: ""
  });

  // ---------------- ORDERS ----------------
  const [orderForm, setOrderForm] = useState({
    customer_id: "",
    product_id: "",
    quantity: ""
  });

  // ---------------- FETCH PRODUCTS ----------------
  const fetchProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ---------------- FETCH CUSTOMERS ----------------
  const fetchCustomers = async () => {
    try {
      const res = await API.get("/customers");
      setCustomers(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ---------------- LOAD DATA ----------------
  useEffect(() => {
    fetchProducts();
    fetchCustomers();
  }, []);

  // ---------------- ADD PRODUCT ----------------
  const addProduct = async () => {
    try {
      await API.post("/products", {
        sku: productForm.sku,
        name: productForm.name,
        price: Number(productForm.price),
        stock: Number(productForm.stock)
      });

      alert("Product added");

      setProductForm({ sku: "", name: "", price: "", stock: "" });
      fetchProducts();
    } catch (err) {
      console.log(err);
      alert("Failed to add product");
    }
  };

  // ---------------- ADD CUSTOMER ----------------
  const addCustomer = async () => {
    try {
      await API.post("/customers", customerForm);

      alert("Customer added");

      setCustomerForm({ name: "", email: "" });
      fetchCustomers();
    } catch (err) {
      console.log(err);
      alert("Failed to add customer");
    }
  };

  // ---------------- PLACE ORDER ----------------
  const placeOrder = async () => {
    try {
      await API.post("/orders", {
        customer_id: Number(orderForm.customer_id),
        product_id: Number(orderForm.product_id),
        quantity: Number(orderForm.quantity)
      });

      alert("Order placed successfully");

      setOrderForm({
        customer_id: "",
        product_id: "",
        quantity: ""
      });

      fetchProducts(); // refresh stock
    } catch (err) {
      console.log(err);
      alert("Failed to place order");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Inventory Management System</h1>

      {/* ================= PRODUCTS ================= */}
      <h2>Products</h2>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>SKU</th>
            <th>Name</th>
            <th>Price</th>
            <th>Stock</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.sku}</td>
              <td>{p.name}</td>
              <td>{p.price}</td>
              <td>{p.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Add Product</h3>
      <input
        placeholder="SKU"
        value={productForm.sku}
        onChange={(e) =>
          setProductForm({ ...productForm, sku: e.target.value })
        }
      />
      <input
        placeholder="Name"
        value={productForm.name}
        onChange={(e) =>
          setProductForm({ ...productForm, name: e.target.value })
        }
      />
      <input
        placeholder="Price"
        value={productForm.price}
        onChange={(e) =>
          setProductForm({ ...productForm, price: e.target.value })
        }
      />
      <input
        placeholder="Stock"
        value={productForm.stock}
        onChange={(e) =>
          setProductForm({ ...productForm, stock: e.target.value })
        }
      />
      <button onClick={addProduct}>Add Product</button>

      {/* ================= CUSTOMERS ================= */}
      <h2 style={{ marginTop: "40px" }}>Customers</h2>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
          </tr>
        </thead>

        <tbody>
          {customers.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.name}</td>
              <td>{c.email}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Add Customer</h3>
      <input
        placeholder="Name"
        value={customerForm.name}
        onChange={(e) =>
          setCustomerForm({ ...customerForm, name: e.target.value })
        }
      />
      <input
        placeholder="Email"
        value={customerForm.email}
        onChange={(e) =>
          setCustomerForm({ ...customerForm, email: e.target.value })
        }
      />
      <button onClick={addCustomer}>Add Customer</button>

      {/* ================= ORDERS ================= */}
      <h2 style={{ marginTop: "40px" }}>Place Order</h2>

      <input
        placeholder="Customer ID"
        value={orderForm.customer_id}
        onChange={(e) =>
          setOrderForm({ ...orderForm, customer_id: e.target.value })
        }
      />

      <input
        placeholder="Product ID"
        value={orderForm.product_id}
        onChange={(e) =>
          setOrderForm({ ...orderForm, product_id: e.target.value })
        }
      />

      <input
        placeholder="Quantity"
        value={orderForm.quantity}
        onChange={(e) =>
          setOrderForm({ ...orderForm, quantity: e.target.value })
        }
      />

      <button onClick={placeOrder}>Place Order</button>
    </div>
  );
}

export default App;