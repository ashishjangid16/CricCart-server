import { Order } from "../models/order.model.js";
import { Cart } from "../models/cart.model.js";


export const placeOrder = async (req, res) => {
  try {
    const { items, totalAmount, shippingAddress } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    if (!shippingAddress || !shippingAddress.name || !shippingAddress.phone || !shippingAddress.address1 || !shippingAddress.city || !shippingAddress.state || !shippingAddress.pincode) {
      return res.status(400).json({ message: "Incomplete shipping address" });
    }

    const formattedItems = items.map((item) => ({
      productId: item._id,
      title: item.title,
      price: item.price,
      quantity: item.quantity || 1,
      image: item.image || item.imageUrl,
      category: item.category,
    }));
   
    const order = new Order({
      user: req.user._id,
      items: formattedItems,
      totalAmount,
      shippingAddress,
      status: "Pending",
    });

    console.log("Order details:", order);
    await order.save();

    // Clear cart after order
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
