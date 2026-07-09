import { Router } from "express";
import {
  getActiveSession,
  openSession,
  closeSession,
  getSessionHistory,
} from "../controllers/cashRegister.controller";
import { validate } from "../middleware/validate.middleware";
import { openSessionSchema, closeSessionSchema } from "../validations/cashRegister.schema";

const router = Router();

router.get("/active", getActiveSession);
router.get("/history", getSessionHistory);
router.post("/open", validate(openSessionSchema), openSession);
router.put("/:id/close", validate(closeSessionSchema), closeSession);

export default router;
