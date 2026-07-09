import { Router } from "express";
import {
  getActiveSession,
  openSession,
  closeSession,
  getSessionHistory,
  deleteSession,
} from "../controllers/cashRegister.controller";
import { validate } from "../middleware/validate.middleware";
import { openSessionSchema, closeSessionSchema } from "../validations/cashRegister.schema";
import { requireRole } from "../middleware/role.middleware";

const router = Router();

router.get("/active", getActiveSession);
router.get("/history", getSessionHistory);
router.post("/open", validate(openSessionSchema), openSession);
router.put("/:id/close", validate(closeSessionSchema), closeSession);
router.delete("/:id", requireRole("admin"), deleteSession);

export default router;
