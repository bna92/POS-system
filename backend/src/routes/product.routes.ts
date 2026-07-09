import { Router } from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller";
import { validate } from "../middleware/validate.middleware";
import { productSchema } from "../validations/product.schema";

const router = Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", validate(productSchema), createProduct);
router.put("/:id", validate(productSchema), updateProduct);
router.delete("/:id", deleteProduct);

export default router;
