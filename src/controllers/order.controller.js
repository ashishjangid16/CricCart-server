import mongoose from "mongoose";
import { Order } from "../models/order.model.js";
import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";


export const placeOrder = async (req, res) => {
  const reservedItems = [];
  let orderSaved = false;

  try {
    const { items, shippingAddress } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    if (!shippingAddress || !shippingAddress.name || !shippingAddress.phone || !shippingAddress.address1 || !shippingAddress.city || !shippingAddress.state || !shippingAddress.pincode) {
      return res.status(400).json({ message: "Incomplete shipping address" });
    }

    const requestedItems = new Map();
    for (const item of items) {
      const productId = String(item.productId || item._id || item.product || "");
      const quantity = Number(item.quantity ?? 1);

      if (!mongoose.isValidObjectId(productId)) {
        return res.status(400).json({ message: "Cart contains an invalid product." });
      }
      if (!Number.isInteger(quantity) || quantity < 1) {
        return res.status(400).json({ message: "Product quantities must be positive whole numbers." });
      }

      requestedItems.set(productId, (requestedItems.get(productId) || 0) + quantity);
    }

    const productIds = [...requestedItems.keys()];
    const products = await Product.find({ _id: { $in: productIds } });
    const productsById = new Map(products.map((product) => [product._id.toString(), product]));
    const formattedItems = [];
    let totalAmount = 0;

    for (const [productId, quantity] of requestedItems) {
      const product = productsById.get(productId);
      if (!product) {
        const error = new Error("A product in your cart is no longer available.");
        error.statusCode = 404;
        throw error;
      }

      await Product.updateOne(
        { _id: productId, stock: null },
        { $set: { stock: 50 } },
      );

      const reservedProduct = await Product.findOneAndUpdate(
        { _id: productId, stock: { $gte: quantity } },
        { $inc: { stock: -quantity } },
        { new: true },
      );

      if (!reservedProduct) {
        const error = new Error(`${product.title} does not have ${quantity} unit(s) available.`);
        error.statusCode = 409;
        throw error;
      }

      reservedItems.push({ productId, quantity });
      formattedItems.push({
        productId: product._id,
        title: product.title,
        price: product.price,
        quantity,
        image: product.imageUrl,
        category: product.category,
      });
      totalAmount += product.price * quantity;
    }

    const order = new Order({
      user: req.user._id,
      items: formattedItems,
      totalAmount: Math.round(totalAmount * 100) / 100,
      shippingAddress,
      status: "Pending",
    });

    await order.save();
    orderSaved = true;

    try {
      await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
    } catch (cartError) {
      console.error("Order succeeded but cart could not be cleared:", cartError.message);
    }

    res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    if (!orderSaved && reservedItems.length) {
      const rollbackResults = await Promise.allSettled(
        reservedItems.map(({ productId, quantity }) =>
          Product.updateOne({ _id: productId }, { $inc: { stock: quantity } }),
        ),
      );
      rollbackResults
        .filter((result) => result.status === "rejected")
        .forEach((result) => console.error("Stock rollback failed:", result.reason));
    }

    console.error("Order error:", error.message);
    res.status(error.statusCode || 500).json({
      message: error.statusCode ? error.message : "Something went wrong",
    });
  }
};


export const createOrder = async (req, res) => {
  // This function is kept for backwards compatibility but delegates to placeOrder
  return placeOrder(req, res);
};



export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const orders = await Order.find({ user: userId }).populate("items.productId").sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (err) {
    console.error("Fetch orders failed:", err);
    res.status(500).json({ message: "Unable to fetch orders" });
  }
};
