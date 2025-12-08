import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      title: String,
      price: Number,
      quantity: Number,
      image: String,
      category: String,
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  shippingAddress: {
    name: String,
    phone: String,
    address1: String,
    address2: String,
    city: String,
    state: String,
    pincode: String,
    instructions: String,
  },
  status: {
    type: String,
    enum: ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"],
    default: "Pending",
  },
}, { timestamps: true });


export const Order = mongoose.model("Order", orderSchema);
