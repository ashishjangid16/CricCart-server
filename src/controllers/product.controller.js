import { Product } from "../models/product.model.js";
import { v2 as cloudinary } from "cloudinary";


export const createProduct = async (req, res) => {
  try {
    console.log("📦 req.body:", req.body);
    console.log("🖼️ req.file:", req.file);


    if (!req.file) {
      return res.status(400).json({ message: "Product image is required" });
    }

    // ✅ Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "Ecommerce",
    });
    console.log("✅ Cloudinary upload result:", result);

    const { title, description, price, category, stock } = req.body;

    if (!title || !price || !category) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // ✅ Save image URL from Cloudinary
    const product = await Product.create({
      title,
      description,
      price,
      category,
      stock,
      imageUrl: result.secure_url, // ← NOT req.file.path
    });

    console.log("✅ Product saved:", product);

    res.status(201).json({ message: "Product created", product });
  } catch (err) {
  console.error("Product creation failed:", err);
  res.status(500).json({ 
    message: "Product creation failed", 
    error: err.message || err.toString(),  //✅ log actual error
  });
}

};


// Get all products
export const getProducts = async (req, res) => {
  const products = await Product.find({});
  res.status(200).json(products);
};

// Get single product
export const getProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.status(200).json(product);
};

// Update product
export const updateProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, {
    ...req.body,
    ...(req.file && { imageUrl: req.file.path }),
  }, { new: true });

  res.status(200).json({ message: "Product updated", product });
};

// Delete product
export const deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: "Product deleted" });
};
