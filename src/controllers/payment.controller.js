// import razorpay from "../utils/razorpay.js";
// import crypto from "crypto";

// export const createOrder = async (req, res) => {
//   const { amount, currency = "INR", receipt } = req.body;

//   try {
//     const options = {
//       amount: amount * 100, // amount in paise
//       currency,
//       receipt: receipt || `receipt_order_${Date.now()}`,
//     };

//     const order = await razorpay.orders.create(options);

//     res.status(200).json({
//       success: true,
//       order,
//     });
//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to create Razorpay order",
//       error: err.message,
//     });
//   }
// };

// export const verifyPayment = async (req, res) => {
//   const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

//   const sign = crypto
//     .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//     .update(razorpay_order_id + "|" + razorpay_payment_id)
//     .digest("hex");

//   if (sign === razorpay_signature) {
//     res.status(200).json({
//       success: true,
//       message: "Payment verified successfully",
//     });
//   } else {
//     res.status(400).json({
//       success: false,
//       message: "Invalid signature sent!",
//     });
//   }
// };
