import { Router } from "express";
import {
  createPurchase,
  getPurchases,
  getPurchaseById,
} from "../controllers/purchase.controller";
import { validate } from "../middleware/validate.middleware";
import { purchaseSchema } from "../validations/purchase.schema";

const router = Router();

router.get("/", getPurchases);
router.get("/:id", getPurchaseById);
router.post("/", validate(purchaseSchema), createPurchase);

export default router;
