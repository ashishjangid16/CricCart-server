import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";  // 👈 Step 8: Import here
import cartRoutes from "./routes/cart.routes.js";
import orderRoutes from "./routes/order.routes.js";
// import paymentRoutes from "./routes/payment.routes.js";
// app.use("/api/payment", paymentRoutes);



const app = express();
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);       // For register/login
app.use("/api/products", productRoutes); // 👈 Mount product routes here

app.get("/", (req, res) => {
  res.send("E-Commerce API is running 🚀");
});

export { app };
