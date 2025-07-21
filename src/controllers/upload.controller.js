import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({ folder: "Ecommerce" }, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }).end(req.file.buffer);
    });

    res.status(200).json({ url: result.secure_url, message: "Upload success" });
  } catch (error) {
    console.error("Cloudinary error:", error);
    res.status(500).json({ message: "Upload failed" });
  }
};
