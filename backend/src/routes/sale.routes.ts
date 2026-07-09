import { Router } from "express";
import {
  createSale,
  getSales,
  getDailySummary,
  getSaleReceipt,
  printSaleReceipt,
} from "../controllers/sale.controller";
import { validate } from "../middleware/validate.middleware";
import { saleSchema } from "../validations/sale.schema";

const router = Router();

router.get("/", getSales);
router.get("/daily-summary", getDailySummary);
router.get("/:id/receipt", getSaleReceipt);
router.post("/:id/print", printSaleReceipt);
router.post("/", validate(saleSchema), createSale);

export default router;
