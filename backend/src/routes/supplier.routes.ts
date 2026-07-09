import { Router } from "express";
import {
  getSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from "../controllers/supplier.controller";
import { validate } from "../middleware/validate.middleware";
import { supplierSchema } from "../validations/supplier.schema";

const router = Router();

router.get("/", getSuppliers);
router.post("/", validate(supplierSchema), createSupplier);
router.put("/:id", validate(supplierSchema), updateSupplier);
router.delete("/:id", deleteSupplier);

export default router;
