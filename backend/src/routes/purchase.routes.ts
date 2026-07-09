import { Router } from "express";
import {
  createPurchase,
  getPurchases,
  getPurchaseById,
  deletePurchase,
} from "../controllers/purchase.controller";
import { validate } from "../middleware/validate.middleware";
import { purchaseSchema } from "../validations/purchase.schema";
import { requireRole } from "../middleware/role.middleware";

const router = Router();

router.get("/", getPurchases);
router.get("/:id", getPurchaseById);
router.post("/", validate(purchaseSchema), createPurchase);
router.delete("/:id", requireRole("admin"), deletePurchase);

export default router;
