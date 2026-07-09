import { Router } from "express";
import {
  createSale,
  getSales,
  getDailySummary,
} from "../controllers/sale.controller";

const router = Router();

router.get("/", getSales);
router.get("/daily-summary", getDailySummary);
router.post("/", createSale);

export default router;