import { Router } from "express";
import {
  createSale,
  getSales,
  getDailySummary,
  getSaleReceipt,
  printSaleReceipt,
  deleteSale,
} from "../controllers/sale.controller";
import { validate } from "../middleware/validate.middleware";
import { saleSchema } from "../validations/sale.schema";
import { requireRole } from "../middleware/role.middleware";

const router = Router();

router.get("/", getSales);
router.get("/daily-summary", getDailySummary);
router.get("/:id/receipt", getSaleReceipt);
router.post("/:id/print", printSaleReceipt);
router.post("/", validate(saleSchema), createSale);
router.delete("/:id", requireRole("admin"), deleteSale);

export default router;
