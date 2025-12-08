import dotenv from "dotenv";
dotenv.config();

import connectDB from "../utils/db.js";
import { Product } from "../models/product.model.js";

const cleanProducts = async () => {
  await connectDB();

  try {
    const result = await Product.deleteMany({});
    console.log(`Deleted ${result.deletedCount} products`);
    
    const count = await Product.countDocuments();
    console.log(`Total products remaining: ${count}`);
    
    process.exit(0);
  } catch (err) {
    console.error("Deletion error:", err);
    process.exit(1);
  }
};

cleanProducts();
