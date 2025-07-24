import express from "express";
import { uploadToCloudinary } from "../controllers/upload.controller.js";
import { upload } from "../middleware/upload.middleware.js";

const router = express.Router();


router.post("/", upload.single("image"), uploadToCloudinary);

export default router;
