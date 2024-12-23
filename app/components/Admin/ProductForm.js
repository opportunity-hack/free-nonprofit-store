import { useState, useEffect } from "react";

export default function ProductForm({ product, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    description: "",
    price: "",
    image: "",
  });

  useEffect(() => {
    if (product) {
      console.log("Editing product:", product); // Debugging log
      setFormData(product); // Populate formData with the selected product for editing
    } else {
      setFormData({ id: null, name: "", description: "", price: "", image: "" });
    }
  }, [product]);

  // Reset the form fields to default values
  const resetForm = () => {
    setFormData({ id: null, name: "", description: "", price: "", image: "" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.id) {
      console.error("Product ID is missing:", formData); // Log if `id` is missing
    }
    // Validate required fields
  if (!formData.name || !formData.price || isNaN(formData.price)) {
    alert("Please fill out all required fields and ensure the price is a valid number.");
    return;
  }
  if (!formData.description || formData.description.trim() === "") {
    alert("Please provide a description.");
    return;
  }
  
  if (!formData.image || formData.image.trim() === "") {
    alert("Please provide an image URL.");
    return;
  }
    onSave({ ...formData, price: parseFloat(formData.price) }); // Include id when saving

    // Reset the form after saving a new product
    if (!formData.id) {
      resetForm();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">{product ? "Edit Product" : "Add Product"}</h2>
      <div>
        <label className="block font-bold mb-2">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="border p-2 w-full text-black"
        />
      </div>
      <div>
        <label className="block font-bold mb-2">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="border p-2 w-full text-black"
        />
      </div>
      <div>
        <label className="block font-bold mb-2">Price</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          className="border p-2 w-full text-black"
        />
      </div>
      <div>
        <label className="block font-bold mb-2">Image URL</label>
        <input
          type="text"
          name="image"
          value={formData.image}
          onChange={handleChange}
          className="border p-2 w-full text-black"
        />
      </div>
      <div className="flex space-x-4">
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
          Save
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-500 text-white py-2 px-4 rounded"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
