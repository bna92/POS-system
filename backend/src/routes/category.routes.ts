import { Router } from "express";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller";
import { validate } from "../middleware/validate.middleware";
import { categorySchema } from "../validations/category.schema";

const router = Router();

router.get("/", getCategories);
router.post("/", validate(categorySchema), createCategory);
router.put("/:id", validate(categorySchema), updateCategory);
router.delete("/:id", deleteCategory);

export default router;
