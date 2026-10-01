import { Product } from "../models/product.model.js";
import { v2 as cloudinary } from "cloudinary";

const parseAvailableSizes = (sizes) => {
  if (Array.isArray(sizes)) {
    return sizes
      .map(String)
      .map((size) => size.trim())
      .filter(Boolean);
  }

  if (typeof sizes === "string") {
    return sizes
      .split(",")
      .map((size) => size.trim())
      .filter(Boolean);
  }

  return undefined;
};

export const createProduct = async (req, res) => {
  try {
    console.log("req.body:", req.body);
    console.log("req.file:", req.file);

    if (!req.file) {
      return res.status(400).json({
        message: "Product image is required",
      });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "CricCart",
    });

    console.log("result.secure_url");
    console.log("Cloudinary upload result:", result);

    const { title, description, price, category, stock } = req.body;

    const availableSizes = parseAvailableSizes(
      req.body.availableSizes
    );

    if (!title || !price || !category) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    const product = await Product.create({
      title,
      description,
      price,
      category,
      ...(availableSizes && { availableSizes }),
      stock,
      imageUrl: result.secure_url,
    });

    console.log("Product saved:", product);

    res.status(201).json({
      message: "Product created",
      product,
    });
  } catch (err) {
    console.error("Product creation failed:", err);

    res.status(500).json({
      message: "Product creation failed",
      error: err.message || err.toString(),
    });
  }
};


/* =========================================================
   GET ALL PRODUCTS WITH PAGINATION
   10 PRODUCTS PER PAGE
========================================================= */

export const getProducts = async (req, res) => {
  try {
    const requestedPage = Number.parseInt(req.query.page, 10) || 1;
    const page = Math.max(1, requestedPage);
    const limit = 10;
    const skip = (page - 1) * limit;

    const search = String(req.query.search || "").trim().slice(0, 100);
    const category = String(req.query.category || "").trim();

    // MongoDB filter
    const filter = {};

    // Require each search word to match at least one product field.
    const searchTerms = search.split(/\s+/).filter(Boolean);
    if (searchTerms.length) {
      filter.$and = searchTerms.map((term) => {
        const safeTerm = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        return {
          $or: [
            { title: { $regex: safeTerm, $options: "i" } },
            { description: { $regex: safeTerm, $options: "i" } },
            { category: { $regex: safeTerm, $options: "i" } },
          ],
        };
      });
    }

    // Category filter
    if (category && category !== "All") {
      filter.category = category;
    }

    // Get filtered products with pagination
    const [products, totalProducts, categories, featuredProducts, heroProduct] = await Promise.all([
      Product.find(filter)
        .sort({ category: 1, title: 1 })
        .skip(skip)
        .limit(limit),
      Product.countDocuments(filter),
      Product.distinct("category"),
      Product.aggregate([
        { $sort: { category: 1, title: 1 } },
        { $group: { _id: "$category", product: { $first: "$$ROOT" } } },
        { $replaceRoot: { newRoot: "$product" } },
        { $sort: { category: 1, title: 1 } },
      ]),
      Product.findOne({ title: /MRF/i, category: /bat/i }).sort({ title: 1 }),
    ]);

    const totalPages = Math.ceil(totalProducts / limit);

    res.status(200).json({
      products,
      currentPage: page,
      totalPages,
      totalProducts,
      categories: categories.sort((left, right) => left.localeCompare(right)),
      featuredProducts,
      heroProduct,
    });
  } catch (error) {
    console.error("Failed to fetch products:", error);

    res.status(500).json({
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};


export const getProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      message: "Product not found",
    });
  }

  res.status(200).json(product);
};


export const updateProduct = async (req, res) => {
  const availableSizes = parseAvailableSizes(
    req.body.availableSizes
  );

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      ...req.body,
      ...(availableSizes && { availableSizes }),
      ...(req.file && { imageUrl: req.file.path }),
    },
    {
      new: true,
    }
  );

  res.status(200).json({
    message: "Product updated",
    product,
  });
};


export const deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);

  res.status(200).json({
    message: "Product deleted",
  });
};