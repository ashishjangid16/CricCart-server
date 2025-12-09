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
        image: "https://res.cloudinary.com/dipl3qujh/image/upload/v1765265222/download_w5qmnq.jpg"
      },
      {
        title: "Kookaburra Surge Cricket Bat",
        description: "Lightweight and aggressive bat designed for modern batting. Features a large sweet spot and excellent power generation. Perfect for T20 cricket.",
        price: 9200,
        image: "https://res.cloudinary.com/dipl3qujh/image/upload/v1765265274/download_csjqcq.jpg"
      },
      {
        title: "Gray-Nicolls Kaboom Bat",
        description: "High-performance bat with explosive power. Suitable for all formats. Premium English willow construction with enhanced durability.",
        price: 7800,
        image: "https://res.cloudinary.com/dipl3qujh/image/upload/v1765265319/download_jc5x2c.jpg"
      },
      {
        title: "SG Nexus Cricket Bat",
        description: "Professional-grade bat with exceptional balance. Hand-picked English willow. Delivers consistent performance in all conditions.",
        price: 8900,
        image: "https://res.cloudinary.com/dipl3qujh/image/upload/v1765265359/download_lfbbj8.jpg"
      },
      {
        title: "MRF Champ Cricket Bat",
        description: "Trusted choice of champions. Superior quality English willow with excellent edge. Perfect for test and ODI cricket.",
        price: 9500,
        image: "https://res.cloudinary.com/dipl3qujh/image/upload/v1765265399/download_fz4whm.jpg"
      },
      {
        title: "New Balance Cricket Bat",
        description: "Modern design with innovative sweet spot technology. Lightweight construction reduces fatigue during long innings.",
        price: 7500,
        image: "https://res.cloudinary.com/dipl3qujh/image/upload/v1765265441/download_gk3kww.jpg"
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
        image: "https://res.cloudinary.com/dipl3qujh/image/upload/v1765261122/download_thd9ty.jpg"
      },
      {
        title: "Kookaburra White Cricket Ball",
        description: "High-visibility white ball designed for day-night cricket. Excellent durability and consistent performance.",
        price: 950,
        image: "https://res.cloudinary.com/dipl3qujh/image/upload/v1765261160/download_i7joxz.jpg"
      },
      {
        title: "SG Pink Cricket Ball",
        description: "Premium pink cricket ball for ODI matches. Superior quality leather with perfect balance and hardness.",
        price: 1100,
        image: "https://res.cloudinary.com/dipl3qujh/image/upload/v1765261226/download_rr7lsg.jpg"
      },
      {
        title: "MRF Red Cricket Ball",
        description: "Professional match-quality cricket ball. Consistent performance and excellent durability. Recommended for all age groups.",
        price: 890,
        image: "https://res.cloudinary.com/dipl3qujh/image/upload/v1765261228/download_r8a91c.jpg"
      },
      {
        title: "Sanspareill Green Cricket Ball",
        description: "Training quality cricket ball suitable for practice and domestic matches. Durable construction.",
        price: 600,
        image: "https://res.cloudinary.com/dipl3qujh/image/upload/v1765261328/download_uwmfjk.jpg"
      },
      {
        title: "Readers Cricket Ball",
        description: "Affordable training cricket ball. Good for beginners and recreational cricket. Decent quality at economical price.",
        price: 450,
        image: "https://res.cloudinary.com/dipl3qujh/image/upload/v1765261330/download_nm9a9o.jpg"
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
        image: "https://res.cloudinary.com/dipl3qujh/image/upload/v1765260662/download_lyu4fl.jpg"
      },
      {
        title: "Kookaburra Pace Cricket Gloves",
        description: "Lightweight gloves designed for aggressive batting. Enhanced wrist support and finger protection. Modern design.",
        price: 3200,
        image: "https://res.cloudinary.com/dipl3qujh/image/upload/v1765260543/download_qnry1m.jpg"
      },
      {
        title: "Club Cricket Gloves",
        description: "Durable batting gloves with excellent padding. Suitable for all playing conditions. Comfortable fit with good grip.",
        price: 2800,
        image: "https://res.cloudinary.com/dipl3qujh/image/upload/v1765260746/download_c4u6va.jpg"
      },
      {
        title: "SG Kriplani Cricket Gloves",
        description: "Professional cricket gloves with superior hand protection. Breathable material keeps hands cool during play.",
        price: 3400,
        image: "https://res.cloudinary.com/dipl3qujh/image/upload/v1765260576/download_sayztk.jpg"
      },
      {
        title: "Puma Cricket Gloves",
        description: "Sports performance gloves with modern cushioning technology. Excellent finger protection and flexibility.",
        price: 2900,
        image: "https://res.cloudinary.com/dipl3qujh/image/upload/v1765260744/download_kn5rft.jpg"
      },
      {
        title: "BDM Cricket Gloves",
        description: "Budget-friendly cricket gloves with decent protection. Good for practice and recreational play.",
        price: 1800,
        image: "https://res.cloudinary.com/dipl3qujh/image/upload/v1765260639/download_d7fltp.jpg"
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
        image: "https://res.cloudinary.com/dipl3qujh/image/upload/v1765261989/download_a1g44t.jpg"
      },
      {
        title: "SG Shield Batting Pads",
        description: "Durable batting pads with excellent impact resistance. Breathable material prevents sweat buildup. Ideal for all formats.",
        price: 4200,
        image: "https://res.cloudinary.com/dipl3qujh/image/upload/v1765262023/download_cr8yl7.jpg"
      },
      {
        title: "Gray-Nicolls Ultimate Pads",
        description: "High-performance batting pads with innovative design. Superior leg protection and comfort during extended innings.",
        price: 4800,
        image: "https://res.cloudinary.com/dipl3qujh/image/upload/v1765262032/download_bfuu9d.jpg"
      },
      {
        title: "Kookaburra Run Machine Pads",
        description: "Lightweight pads for enhanced mobility. Excellent protection without restricting movement. Perfect for aggressive batting.",
        price: 3900,
        image: "https://res.cloudinary.com/dipl3qujh/image/upload/v1765262075/download_tvincr.jpg"
      },
      {
        title: "Puma Cricket Pads",
        description: "Modern batting pads with ergonomic design. Combines style and functionality. Suitable for all age groups.",
        price: 3500,
        image: "https://res.cloudinary.com/dipl3qujh/image/upload/v1765262072/download_i2kgpv.jpg"
      },
      {
        title: "Niton Cricket Pads",
        description: "Affordable batting pads with good protection. Suitable for training and recreational cricket. Value for money.",
        price: 2200,
        image: "https://res.cloudinary.com/dipl3qujh/image/upload/v1765262079/download_f2wu1i.jpg"
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
        image: "https://res.cloudinary.com/dipl3qujh/image/upload/v1765261779/download_azrqcx.jpg"
      },
      {
        title: "Masuri Original Helmet",
        description: "Iconic cricket helmet with excellent visibility. Premium construction for maximum protection. Trusted by professionals.",
        price: 7200,
        image: "https://res.cloudinary.com/dipl3qujh/image/upload/v1765261796/download_eepkms.jpg"
      },
      {
        title: "Kookaburra Cricket Helmet",
        description: "Modern helmet design with superior comfort. Lightweight construction doesn't restrict neck movement. Great ventilation system.",
        price: 5800,
        image: "https://res.cloudinary.com/dipl3qujh/image/upload/v1765261799/download_jovoxf.jpg"
      },
      {
        title: "Forma Pro Cricket Helmet",
        description: "Professional cricket helmet meeting international safety standards. Adjustable fit for better comfort. Durable construction.",
        price: 5200,
        image: "https://res.cloudinary.com/dipl3qujh/image/upload/v1765261799/download_jovoxf.jpg"
      },
      {
        title: "Stanford Cricket Helmet",
        description: "Safety-certified helmet with enhanced protection. Comfortable foam padding for extended use. Excellent visibility.",
        price: 4500,
        image: "https://res.cloudinary.com/dipl3qujh/image/upload/v1765261884/download_spfqfa.jpg"
      },
      {
        title: "Niton Junior Cricket Helmet",
        description: "Perfect for young cricketers. Lightweight design with proper safety features. Growing with adjustable fit.",
        price: 2800,
        image: "https://res.cloudinary.com/dipl3qujh/image/upload/v1765261912/download_uo7kko.jpg"
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
        image: "https://res.cloudinary.com/dipl3qujh/image/upload/v1765261401/download_x7ojms.jpg"
      },
      {
        title: "Adidas Adizero Cricket Shoes",
        description: "High-performance cricket shoes for speed and agility. Excellent ankle support and cushioning. Perfect for all formats.",
        price: 7200,
        image: "https://res.cloudinary.com/dipl3qujh/image/upload/v1765261404/download_zlehop.jpg"
      },
      {
        title: "New Balance Cricket Shoes",
        description: "Comfort-focused cricket shoes with superior technology. Excellent arch support and stability. Durable construction.",
        price: 5800,
        image: "https://res.cloudinary.com/dipl3qujh/image/upload/v1765261433/download_wm3cpp.jpg"
      },
      {
        title: "Kookaburra Pro Cricket Shoes",
        description: "Professional cricket shoes with excellent grip. Designed for fast-paced cricket. Lightweight and responsive.",
        price: 5200,
        image: "https://res.cloudinary.com/dipl3qujh/image/upload/v1765261461/download_o0vlbr.jpg"
      },
      {
        title: "Spartan Cricket Shoes",
        description: "Budget-friendly cricket shoes with good grip and support. Suitable for training and match play.",
        price: 3500,
        image: "https://res.cloudinary.com/dipl3qujh/image/upload/v1765261483/download_auluvu.jpg"
      },
      {
        title: "Niton Junior Cricket Shoes",
        description: "Comfortable cricket shoes for young players. Proper arch support and ankle stability. Great value for young cricketers.",
        price: 2500,
        image: "https://res.cloudinary.com/dipl3qujh/image/upload/v1765261498/download_jn6qri.jpg"
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
        image: "https://res.cloudinary.com/dipl3qujh/image/upload/v1765261542/download_u4cenz.jpg"
      },
      {
        title: "SS Master Abdomen Guard",
        description: "Superior protection with comfortable fit. Reinforced padding for impact resistance. Essential safety gear for batsmen.",
        price: 1400,
        image: "https://res.cloudinary.com/dipl3qujh/image/upload/v1765261560/download_tjmqws.jpg"
      },
      {
        title: "SG Protective Guard",
        description: "Professional-quality abdomen guard with excellent flexibility. Doesn't restrict movement during play.",
        price: 1100,
        image: "https://res.cloudinary.com/dipl3qujh/image/upload/v1765261597/images_isdktn.jpg"
      },
      {
        title: "BDM Safety Guard",
        description: "Certified protective gear meeting safety standards. Comfortable padding and secure fit. Ideal for all levels.",
        price: 850,
        image: "https://res.cloudinary.com/dipl3qujh/image/upload/v1765261673/download_hnks0a.jpg"
      },
      {
        title: "DSC Pro Guard",
        description: "Reliable protection for sensitive areas. Lightweight design doesn't add bulk. Excellent comfort during play.",
        price: 950,
        image: "https://res.cloudinary.com/dipl3qujh/image/upload/v1765261676/download_krkwbt.jpg"
      },
      {
        title: "Niton Junior Guard",
        description: "Perfect for young cricketers. Proper protection with comfortable fit. Lightweight for growing children.",
        price: 600,
        image: "https://res.cloudinary.com/dipl3qujh/image/upload/v1765261716/download_ypo6gp.jpg"
      }
    ]
  }
];

const createProducts = async () => {
  await connectDB();

  const products = [];

  productsData.forEach((cat) => {
    cat.products.forEach((prod) => {
      products.push({
        title: prod.title,
        description: prod.description,
        price: prod.price,
        category: cat.category,
        stock: randomInt(5, 30),
        imageUrl: prod.image,
      });
    });
  });

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
