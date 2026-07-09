import { Router } from "express";
import { login, register } from "../controllers/auth.controller";
import { validate } from "../middleware/validate.middleware";
import { registerSchema, loginSchema } from "../validations/auth.schema";
import { authMiddleware } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";

const router = Router();

router.post("/register", authMiddleware, requireRole("admin"), validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);

export default router;
