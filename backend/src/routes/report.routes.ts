import { Router } from "express";
import { getSalesReportPdf } from "../controllers/report.controller";

const router = Router();

router.get("/sales", getSalesReportPdf);

export default router;
