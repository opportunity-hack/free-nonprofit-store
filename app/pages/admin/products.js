import { useState, useEffect } from "react";
import ProductList from "../../components/Admin/ProductList";
import ProductForm from "../../components/Admin/ProductForm";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null); // For editing
  const [message, setMessage] = useState("");

  // Fetch products on page load
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error(err.message);
        setMessage("Error fetching products.");
      }
    }

    fetchProducts();
  }, []);

  // Handle adding or editing a product
  const handleSaveProduct = async (product) => {
    const isEdit = Boolean(product.id); // Check if it's an edit operation
    console.log("Saving product. Is edit:", isEdit, "Product data:", product); // Debugging log
  
    try {
      const res = await fetch("/api/products", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
  
      const responseData = await res.json();
      console.log("Response from API:", responseData); // Log the API response
  
      if (!res.ok) throw new Error(isEdit ? "Failed to update product" : "Failed to add product");
  
      setProducts((prev) =>
        isEdit
          ? prev.map((p) => (p.id === responseData.id ? responseData : p)) // Update edited product
          : [...prev, responseData] // Add new product
      );
  
      setMessage(isEdit ? "Product updated successfully!" : "Product added successfully!");
      setSelectedProduct(null); // Reset form
    } catch (err) {
      console.error("Error saving product:", err.message);
      setMessage("Error saving product.");
    }
  };
  

  // Handle deleting a product
  const handleDeleteProduct = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
  
    try {
      const res = await fetch(`/api/products?id=${id}`, { method: "DELETE" }); // Pass ID correctly
      if (!res.ok) throw new Error("Failed to delete product");
  
      setProducts((prev) => prev.filter((p) => p.id !== id)); // Remove product from the list
      setMessage("Product deleted successfully!");
    } catch (err) {
      console.error(err.message);
      setMessage("Error deleting product.");
    }
  };
  

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Manage Products</h1>
      {message && <p className="mb-4">{message}</p>}
      <ProductForm
        product={selectedProduct}
        onSave={(product) => {
            console.log("Saving product:", product); 
            handleSaveProduct(product);
          }}
        onCancel={() => setSelectedProduct(null)}
      />
      <ProductList
        products={products}
        onEdit={(product) => {
            console.log("Editing product:", product); 
            setSelectedProduct(product);
          }}
        onDelete={handleDeleteProduct}
      />
    </div>
  );
}
