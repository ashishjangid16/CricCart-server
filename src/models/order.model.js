import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  products: [  // 👈 your code expects 'products', not 'items'
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: Number,
    },
  ],
  totalAmount: Number,
  status: {
    type: String,
    default: "Pending",
  },
}, { timestamps: true });


export const Order = mongoose.model("Order", orderSchema);
