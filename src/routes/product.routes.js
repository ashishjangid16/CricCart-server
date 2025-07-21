import express from "express";
import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";

import { upload } from "../middleware/upload.middleware.js";

const router = express.Router();


router.post("/create", upload.single("image"), createProduct);

router.get("/", getProducts);
router.get("/:id", getProduct);
router.put("/:id", upload.single("image"), updateProduct);
router.delete("/:id", deleteProduct);

export default router;





















// import express from "express";
// import {
//   createProduct,
//   getProducts,
//   getProduct,
//   updateProduct,
//   deleteProduct
// } from "../controllers/product.controller.js";
// // import { protect } from "../middleware/auth.middleware.js";
// // import { isAdmin } from "../middleware/role.middleware.js";
// import { upload } from "../middleware/upload.middleware.js";


// const router = express.Router();

// // Public
// router.post("/create", upload.single("image"), createProduct);
// router.get("/", getProducts);
// router.get("/:id", getProduct);




// // Temporary remove auth middlewares for testing
// //router.post("/", upload.single("image"), createProduct);
// router.put("/:id", upload.single("image"), updateProduct);
// router.delete("/:id", deleteProduct);

// export default router;















// // import express from "express";
// // import {
// //   createProduct,
// //   getProducts,
// //   getProduct,
// //   updateProduct,
// //   deleteProduct
// // } from "../controllers/product.controller.js";
// // import { protect } from "../middleware/auth.middleware.js";
// // import { isAdmin } from "../middleware/role.middleware.js";
// // import { upload } from "../middleware/upload.middleware.js";



// // const router = express.Router();

// // // Public
// // router.get("/", getProducts);
// // router.get("/:id", getProduct);

// // // Admin protected
// // router.post("/", protect, isAdmin, upload.single("image"), createProduct);
// // router.put("/:id", protect, isAdmin, upload.single("image"), updateProduct);
// // router.delete("/:id", protect, isAdmin, deleteProduct);

// // export default router;
