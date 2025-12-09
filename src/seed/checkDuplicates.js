import dotenv from 'dotenv';
dotenv.config();
import connectDB from '../utils/db.js';
import { Product } from '../models/product.model.js';

await connectDB();
const count = await Product.countDocuments();
const byCategory = await Product.aggregate([
  { $group: { _id: '$category', count: { $sum: 1 } } },
  { $sort: { _id: 1 } }
]);

console.log('Total products:', count);
console.log('\nProducts by category:');
byCategory.forEach(cat => {
  console.log(`  ${cat._id}: ${cat.count}`);
});

// Check for duplicates by title
const duplicates = await Product.aggregate([
  { $group: { _id: '$title', count: { $sum: 1 }, ids: { $push: '$_id' } } },
  { $match: { count: { $gt: 1 } } }
]);

if (duplicates.length > 0) {
  console.log(`\nFound ${duplicates.length} duplicate titles:`);
  duplicates.slice(0, 5).forEach(dup => {
    console.log(`  "${dup._id}": ${dup.count} copies`);
  });
}

process.exit(0);
