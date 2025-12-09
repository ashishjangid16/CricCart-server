import dotenv from 'dotenv';
dotenv.config();
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

(async () => {
  try {
    const res = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'Ecommerce',
      max_results: 100
    });
    
    console.log(`\nTotal resources in Ecommerce folder: ${res.total_count}`);
    console.log('\nAll resources:');
    
    const imagesByFolder = {};
    
    res.resources.forEach(img => {
      const folder = img.folder || 'root';
      if (!imagesByFolder[folder]) {
        imagesByFolder[folder] = [];
      }
      const url = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${img.public_id}`;
      imagesByFolder[folder].push({
        name: img.public_id.split('/').pop(),
        url: url
      });
    });
    
    for (const [folder, images] of Object.entries(imagesByFolder)) {
      console.log(`\n${folder}:`);
      images.forEach(img => {
        console.log(`  - ${img.url}`);
      });
    }
  } catch (err) {
    console.error('Error:', err.message);
  }
  
  process.exit(0);
})();
