import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { placeOrder, getMyOrders, createOrder } from "../controllers/order.controller.js";

const router = express.Router();
router.use(protect);
router.post("/", placeOrder);
router.get("/my", getMyOrders);
router.post("/create", createOrder);
export default router;
