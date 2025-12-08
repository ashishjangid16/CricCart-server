import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { addToCart, getCart, removeFromCart, syncCart, clearCart } from "../controllers/cart.controller.js";

const router = express.Router();

router.use(protect);

router.get("/", getCart);
router.post("/add", addToCart);
router.post("/sync", syncCart);
router.delete("/clear", clearCart);
router.delete("/:productId", removeFromCart);

export default router;
