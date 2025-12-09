import dotenv from 'dotenv';
dotenv.config();
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const categoryFolders = {
  'Bats': 'Ecommerce/Bats',
  'Balls': 'Ecommerce/Balls',
  'Gloves': 'Ecommerce/Gloves',
  'Pads': 'Ecommerce/Pads',
  'Helmets': 'Ecommerce/Helmets',
  'Cricket Shoes': 'Ecommerce/Cricket Shoes',
  'Abdomen Guard': 'Ecommerce/Abdomen Guard'
};

(async () => {
  const imageMap = {};
  
  for (const [cat, folder] of Object.entries(categoryFolders)) {
    try {
      const res = await cloudinary.api.resources({
        type: 'upload',
        prefix: folder,
        max_results: 1
      });
      if (res.resources && res.resources.length > 0) {
        const img = res.resources[0];
        const url = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${img.public_id}`;
        imageMap[cat] = url;
        console.log(`${cat}: ${url}`);
      } else {
        console.log(`${cat}: NO IMAGES FOUND`);
      }
    } catch (err) {
      console.error(`Error fetching ${cat}:`, err.message);
    }
  }
  
  process.exit(0);
})();
