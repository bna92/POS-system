import { Router } from "express";
import {
  getMovements,
  createMovement,
} from "../controllers/inventory.controller";
import { validate } from "../middleware/validate.middleware";
import { movementSchema } from "../validations/inventory.schema";

const router = Router();

router.get("/", getMovements);
router.post("/", validate(movementSchema), createMovement);

export default router;
