import path from "path";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import { app } from "./app.js";

const envPath = path.resolve(process.cwd(), ".env");
dotenv.config({ path: envPath });

connectDB()
  .then(() => {
    const port = process.env.PORT || 8001;
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
  });
