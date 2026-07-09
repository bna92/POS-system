import { Router } from "express";
import {
  getSalesTrend,
  getTopProducts,
  getLowStock,
} from "../controllers/dashboard.controller";

const router = Router();

router.get("/sales-trend", getSalesTrend);
router.get("/top-products", getTopProducts);
router.get("/low-stock", getLowStock);

export default router;
