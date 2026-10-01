import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  imageUrl: {
    type: String,
  },
  category: {
    type: String,
    required: true,
  },
  availableSizes: {
    type: [String],
    default: undefined,
  },
  stock: {
    type: Number,
    min: 0,
    default: 50,
    validate: Number.isInteger,
  },
}, { timestamps: true });

export const Product = mongoose.model("Product", productSchema);
