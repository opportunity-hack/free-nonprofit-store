const { v4 } = require('uuid'); // Import UUID generator
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "utils/products.json");


// Helper function to read products from the file
const readProducts = () => {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading products file:", error);
    return [];
  }
};

// Helper function to write products to the file
const writeProducts = (products) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
  } catch (error) {
    console.error("Error writing products file:", error);
  }
};

let products = readProducts();

export default function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).json(products);
  }

  if (req.method === "POST") {
    const generatedId = v4();
    console.log("Generated UUID:", generatedId); // Log the generated ID
    console.log("Request Body Before Creating New Product:", req.body); 
    const newProduct = { ...req.body, id: generatedId };
    console.log("New Product Object Before Saving:", newProduct); // Debugging log
  
    products.push(newProduct);
    console.log("Products Array After Adding New Product:", products); // Debugging log
  
    writeProducts(products); // Persist to JSON
    return res.status(201).json(newProduct); // 
  }
  

  if (req.method === "PUT") {
    const { id, ...updatedProduct } = req.body;
  
    if (!id) {
      console.error("Missing ID in PUT request."); // Debugging
      return res.status(400).json({ error: "Product ID is required for updates." });
    }
  
    console.log("Updating product with ID:", id); // Debugging
  
    let productFound = false;
    products = products.map((p) => {
      if (p.id === id) {
        productFound = true;
        return { id, ...updatedProduct };
      }
      return p;
    });
  
    if (!productFound) {
      console.error("Product not found for ID:", id); // Debugging
      return res.status(404).json({ error: "Product not found." });
    }
  
    writeProducts(products); // Persist to the JSON file
  
    return res.status(200).json({ id, ...updatedProduct }); // Return the updated product
  }
  

  if (req.method === "DELETE") {
    const { id } = req.query;
  
    if (!id) {
      console.error("Missing ID in DELETE request."); // Debugging
      return res.status(400).json({ error: "Product ID is required for deletion." });
    }
  
    console.log("Deleting product with ID:", id); // Debugging
  
    const initialLength = products.length;
    products = products.filter((p) => p.id !== id);
  
    if (products.length === initialLength) {
      console.error("Product not found for ID:", id); // Debugging
      return res.status(404).json({ error: "Product not found." });
    }
  
    writeProducts(products); // Persist to the JSON file
  
    return res.status(204).end(); // Return no content
  }
  

  res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}




// Use it remove invalid products
// const cleanInvalidProducts = () => {
//   // Filter out products without a valid ID
//   const validProducts = products.filter((product) => product.id);
//   if (validProducts.length !== products.length) {
//     console.log("Cleaning up invalid products...");
//     products = validProducts; // Update the in-memory array
//     writeProducts(products); // Persist the cleaned products
//     console.log("Invalid products removed.");
//   } else {
//     console.log("No invalid products found.");
//   }
// };

// // Run cleanup on server startup
// cleanInvalidProducts();
