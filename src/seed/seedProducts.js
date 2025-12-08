import dotenv from "dotenv";
dotenv.config();

import connectDB from "../utils/db.js";
import { Product } from "../models/product.model.js";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const productsData = [
  {
    category: "Bats",
    products: [
      {
        title: "SS Master Classic Bat",
        description: "Premium English willow bat with perfect balance and stroke play. Ideal for professional and intermediate players. Superior edge and middle with extended sweet spot.",
        price: 8500,
        image: "https://via.placeholder.com/600x400?text=SS+Cricket+Bat"
      },
      {
        title: "Kookaburra Surge Cricket Bat",
        description: "Lightweight and aggressive bat designed for modern batting. Features a large sweet spot and excellent power generation. Perfect for T20 cricket.",
        price: 9200,
        image: "https://via.placeholder.com/600x400?text=Kookaburra+Bat"
      },
      {
        title: "Gray-Nicolls Kaboom Bat",
        description: "High-performance bat with explosive power. Suitable for all formats. Premium English willow construction with enhanced durability.",
        price: 7800,
        image: "https://via.placeholder.com/600x400?text=Gray+Nicolls+Bat"
      },
      {
        title: "SG Nexus Cricket Bat",
        description: "Professional-grade bat with exceptional balance. Hand-picked English willow. Delivers consistent performance in all conditions.",
        price: 8900,
        image: "https://via.placeholder.com/600x400?text=SG+Cricket+Bat"
      },
      {
        title: "MRF Champ Cricket Bat",
        description: "Trusted choice of champions. Superior quality English willow with excellent edge. Perfect for test and ODI cricket.",
        price: 9500,
        image: "https://via.placeholder.com/600x400?text=MRF+Cricket+Bat"
      },
      {
        title: "New Balance Cricket Bat",
        description: "Modern design with innovative sweet spot technology. Lightweight construction reduces fatigue during long innings.",
        price: 7500,
        image: "https://via.placeholder.com/600x400?text=New+Balance+Bat"
      }
    ]
  },
  {
    category: "Balls",
    products: [
      {
        title: "Duke Red Cricket Ball",
        description: "Premium leather cricket ball used in international matches. Excellent seam and hardness. Perfect for test cricket.",
        price: 1200,
        image: "https://via.placeholder.com/600x400?text=Duke+Cricket+Ball"
      },
      {
        title: "Kookaburra White Cricket Ball",
        description: "High-visibility white ball designed for day-night cricket. Excellent durability and consistent performance.",
        price: 950,
        image: "https://via.placeholder.com/600x400?text=Kookaburra+Ball"
      },
      {
        title: "SG Pink Cricket Ball",
        description: "Premium pink cricket ball for ODI matches. Superior quality leather with perfect balance and hardness.",
        price: 1100,
        image: "https://via.placeholder.com/600x400?text=SG+Cricket+Ball"
      },
      {
        title: "MRF Red Cricket Ball",
        description: "Professional match-quality cricket ball. Consistent performance and excellent durability. Recommended for all age groups.",
        price: 890,
        image: "https://via.placeholder.com/600x400?text=MRF+Ball"
      },
      {
        title: "Sanspareill Green Cricket Ball",
        description: "Training quality cricket ball suitable for practice and domestic matches. Durable construction.",
        price: 600,
        image: "https://via.placeholder.com/600x400?text=Sanspareill+Ball"
      },
      {
        title: "Readers Cricket Ball",
        description: "Affordable training cricket ball. Good for beginners and recreational cricket. Decent quality at economical price.",
        price: 450,
        image: "https://via.placeholder.com/600x400?text=Readers+Ball"
      }
    ]
  },
  {
    category: "Gloves",
    products: [
      {
        title: "SS Master Cricket Gloves",
        description: "Premium batting gloves with superior padding and comfort. Leather palms for excellent grip. Professional-grade protection.",
        price: 3500,
        image: "https://via.placeholder.com/600x400?text=SS+Gloves"
      },
      {
        title: "Kookaburra Pace Cricket Gloves",
        description: "Lightweight gloves designed for aggressive batting. Enhanced wrist support and finger protection. Modern design.",
        price: 3200,
        image: "https://via.placeholder.com/600x400?text=Kookaburra+Gloves"
      },
      {
        title: "Club Cricket Gloves",
        description: "Durable batting gloves with excellent padding. Suitable for all playing conditions. Comfortable fit with good grip.",
        price: 2800,
        image: "https://via.placeholder.com/600x400?text=Club+Gloves"
      },
      {
        title: "SG Kriplani Cricket Gloves",
        description: "Professional cricket gloves with superior hand protection. Breathable material keeps hands cool during play.",
        price: 3400,
        image: "https://via.placeholder.com/600x400?text=SG+Gloves"
      },
      {
        title: "Puma Cricket Gloves",
        description: "Sports performance gloves with modern cushioning technology. Excellent finger protection and flexibility.",
        price: 2900,
        image: "https://via.placeholder.com/600x400?text=Puma+Gloves"
      },
      {
        title: "BDM Cricket Gloves",
        description: "Budget-friendly cricket gloves with decent protection. Good for practice and recreational play.",
        price: 1800,
        image: "https://via.placeholder.com/600x400?text=BDM+Gloves"
      }
    ]
  },
  {
    category: "Pads",
    products: [
      {
        title: "SS Master Batting Pads",
        description: "Premium leg protection with lightweight design. Superior comfort and mobility. Professional-grade padding for maximum protection.",
        price: 4500,
        image: "https://via.placeholder.com/600x400?text=SS+Pads"
      },
      {
        title: "SG Shield Batting Pads",
        description: "Durable batting pads with excellent impact resistance. Breathable material prevents sweat buildup. Ideal for all formats.",
        price: 4200,
        image: "https://via.placeholder.com/600x400?text=SG+Pads"
      },
      {
        title: "Gray-Nicolls Ultimate Pads",
        description: "High-performance batting pads with innovative design. Superior leg protection and comfort during extended innings.",
        price: 4800,
        image: "https://via.placeholder.com/600x400?text=Gray+Nicolls+Pads"
      },
      {
        title: "Kookaburra Run Machine Pads",
        description: "Lightweight pads for enhanced mobility. Excellent protection without restricting movement. Perfect for aggressive batting.",
        price: 3900,
        image: "https://via.placeholder.com/600x400?text=Kookaburra+Pads"
      },
      {
        title: "Puma Cricket Pads",
        description: "Modern batting pads with ergonomic design. Combines style and functionality. Suitable for all age groups.",
        price: 3500,
        image: "https://via.placeholder.com/600x400?text=Puma+Pads"
      },
      {
        title: "Niton Cricket Pads",
        description: "Affordable batting pads with good protection. Suitable for training and recreational cricket. Value for money.",
        price: 2200,
        image: "https://via.placeholder.com/600x400?text=Niton+Pads"
      }
    ]
  },
  {
    category: "Helmets",
    products: [
      {
        title: "Shrey Master Class Helmet",
        description: "Premium cricket helmet with superior safety standards. Comfortable fit with excellent ventilation. Professional-grade protection.",
        price: 6500,
        image: "https://via.placeholder.com/600x400?text=Shrey+Helmet"
      },
      {
        title: "Masuri Original Helmet",
        description: "Iconic cricket helmet with excellent visibility. Premium construction for maximum protection. Trusted by professionals.",
        price: 7200,
        image: "https://via.placeholder.com/600x400?text=Masuri+Helmet"
      },
      {
        title: "Kookaburra Cricket Helmet",
        description: "Modern helmet design with superior comfort. Lightweight construction doesn't restrict neck movement. Great ventilation system.",
        price: 5800,
        image: "https://via.placeholder.com/600x400?text=Kookaburra+Helmet"
      },
      {
        title: "BDM Pro Cricket Helmet",
        description: "Professional cricket helmet meeting international safety standards. Adjustable fit for better comfort. Durable construction.",
        price: 5200,
        image: "https://via.placeholder.com/600x400?text=BDM+Helmet"
      },
      {
        title: "Stanford Cricket Helmet",
        description: "Safety-certified helmet with enhanced protection. Comfortable foam padding for extended use. Excellent visibility.",
        price: 4500,
        image: "https://via.placeholder.com/600x400?text=Stanford+Helmet"
      },
      {
        title: "Niton Junior Cricket Helmet",
        description: "Perfect for young cricketers. Lightweight design with proper safety features. Growing with adjustable fit.",
        price: 2800,
        image: "https://via.placeholder.com/600x400?text=Niton+Helmet"
      }
    ]
  },
  {
    category: "Cricket Shoes",
    products: [
      {
        title: "Puma evoSPEED Cricket Shoes",
        description: "Lightweight and fast. Designed for explosive movements and quick footwork. Superior grip on any surface.",
        price: 6500,
        image: "https://via.placeholder.com/600x400?text=Puma+Shoes"
      },
      {
        title: "Adidas Adizero Cricket Shoes",
        description: "High-performance cricket shoes for speed and agility. Excellent ankle support and cushioning. Perfect for all formats.",
        price: 7200,
        image: "https://via.placeholder.com/600x400?text=Adidas+Shoes"
      },
      {
        title: "New Balance Cricket Shoes",
        description: "Comfort-focused cricket shoes with superior technology. Excellent arch support and stability. Durable construction.",
        price: 5800,
        image: "https://via.placeholder.com/600x400?text=New+Balance+Shoes"
      },
      {
        title: "Kookaburra Pro Cricket Shoes",
        description: "Professional cricket shoes with excellent grip. Designed for fast-paced cricket. Lightweight and responsive.",
        price: 5200,
        image: "https://via.placeholder.com/600x400?text=Kookaburra+Shoes"
      },
      {
        title: "Spartan Cricket Shoes",
        description: "Budget-friendly cricket shoes with good grip and support. Suitable for training and match play.",
        price: 3500,
        image: "https://via.placeholder.com/600x400?text=Spartan+Shoes"
      },
      {
        title: "Niton Junior Cricket Shoes",
        description: "Comfortable cricket shoes for young players. Proper arch support and ankle stability. Great value for young cricketers.",
        price: 2500,
        image: "https://via.placeholder.com/600x400?text=Niton+Shoes"
      }
    ]
  },
  {
    category: "Abdomen Guard",
    products: [
      {
        title: "Kookaburra Pro Abdomen Guard",
        description: "Premium protective gear for vital organs. Lightweight construction for maximum mobility. Professional-grade protection.",
        price: 1200,
        image: "https://via.placeholder.com/600x400?text=Kookaburra+Guard"
      },
      {
        title: "SS Master Abdomen Guard",
        description: "Superior protection with comfortable fit. Reinforced padding for impact resistance. Essential safety gear for batsmen.",
        price: 1400,
        image: "https://via.placeholder.com/600x400?text=SS+Guard"
      },
      {
        title: "SG Protective Guard",
        description: "Professional-quality abdomen guard with excellent flexibility. Doesn't restrict movement during play.",
        price: 1100,
        image: "https://via.placeholder.com/600x400?text=SG+Guard"
      },
      {
        title: "BDM Safety Guard",
        description: "Certified protective gear meeting safety standards. Comfortable padding and secure fit. Ideal for all levels.",
        price: 850,
        image: "https://via.placeholder.com/600x400?text=BDM+Guard"
      },
      {
        title: "Masuri Pro Guard",
        description: "Reliable protection for sensitive areas. Lightweight design doesn't add bulk. Excellent comfort during play.",
        price: 950,
        image: "https://via.placeholder.com/600x400?text=Masuri+Guard"
      },
      {
        title: "Niton Junior Guard",
        description: "Perfect for young cricketers. Proper protection with comfortable fit. Lightweight for growing children.",
        price: 600,
        image: "https://via.placeholder.com/600x400?text=Niton+Guard"
      }
    ]
  }
];

const createProducts = async () => {
  await connectDB();
  const products = [];

  // Upload local category images to Cloudinary (fallback to prod.image when needed)
  const categoryLocalMap = {
    Bats: './src/seed/images/bats.svg',
    Balls: './src/seed/images/balls.svg',
    Gloves: './src/seed/images/gloves.svg',
    Pads: './src/seed/images/pads.svg',
    Helmets: './src/seed/images/helmets.svg',
    'Cricket Shoes': './src/seed/images/shoes.svg',
    'Abdomen Guard': './src/seed/images/abdomen_guard.svg',
  };

  for (const cat of productsData) {
    const localImage = categoryLocalMap[cat.category];
    for (const prod of cat.products) {
      let finalImage = prod.image;
      const uploadSource = localImage || prod.image;
      try {
        const res = await cloudinary.uploader.upload(uploadSource, {
          folder: `Ecommerce/${cat.category}`,
          resource_type: 'image',
        });
        if (res && res.secure_url) finalImage = res.secure_url;
      } catch (uploadErr) {
        console.error(`Image upload failed for ${prod.title}:`, uploadErr.message || uploadErr);
        finalImage = prod.image; // keep original URL as fallback
      }

      products.push({
        title: prod.title,
        description: prod.description,
        price: prod.price,
        category: cat.category,
        stock: randomInt(5, 30),
        imageUrl: finalImage,
      });
    }
  }

  try {
    const result = await Product.insertMany(products);
    console.log(`Inserted ${result.length} products`);
    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
};

createProducts();
