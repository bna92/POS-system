import { Router } from "express";
import {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "../controllers/customer.controller";
import { validate } from "../middleware/validate.middleware";
import { customerSchema } from "../validations/customer.schema";

const router = Router();

router.get("/", getCustomers);
router.post("/", validate(customerSchema), createCustomer);
router.put("/:id", validate(customerSchema), updateCustomer);
router.delete("/:id", deleteCustomer);

export default router;
