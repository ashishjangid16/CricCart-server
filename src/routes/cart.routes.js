import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { addToCart, getCart, removeFromCart } from "../controllers/cart.controller.js";

const router = express.Router();

router.use(protect);

router.get("/", getCart);
router.post("/add",protect, addToCart);
router.delete("/:productId", removeFromCart);

export default router;
