import { Order } from "../models/order.model.js";
import { Cart } from "../models/cart.model.js";


// 🔒 PLACE ORDER (uses Cart)
export const placeOrder = async (req, res) => {
  try {
    const { items, totalAmount } = req.body;

    const products = items.map((item) => ({
      productId: item._id,
      quantity: item.quantity || 1,
    }));
   
    const order = new Order({
      user: req.user._id,
      products,
      totalAmount,
    });

    console.log("Order details:", order);
    await order.save();

    //  Clear the cart after placing order
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

    res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error("Order error:", error.message);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// CREATE ORDER (manual version from frontend payload)
export const createOrder = async (req, res) => {
  try {
    const { cartItems, totalAmount, shippingAddress } = req.body;
    const userId = req.user?._id; // or use req.userId fallback

    const order = await Order.create({
      user: userId,
      cartItems,
      totalAmount,
      shippingAddress,
      status: "Pending",
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (err) {
    console.error("Order creation failed:", err);
    res.status(500).json({ success: false, message: "Order failed" });
  }
};


// 📦 MY ORDERS (user's past orders)
export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user?.id || "64ab2c13c567f342b1c9d123";

    const orders = await Order.find({ user: userId }).populate("products.productId");

    res.status(200).json(orders);
  } catch (err) {
    console.error("❌ Fetch orders failed:", err);
    res.status(500).json({ message: "Unable to fetch orders" });
  }
};
