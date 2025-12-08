import dotenv from 'dotenv';
dotenv.config();

import connectDB from '../utils/db.js';
import { Product } from '../models/product.model.js';

const inspect = async () => {
  await connectDB();
  const products = await Product.find({}).limit(10).select('title imageUrl image');
  console.log('Found', products.length, 'products');
  products.forEach((p, i) => {
    console.log(`${i+1}. ${p.title}`);
    console.log('   imageUrl:', p.imageUrl);
    console.log('   image:', p.image);
  });
  process.exit(0);
};

inspect();
