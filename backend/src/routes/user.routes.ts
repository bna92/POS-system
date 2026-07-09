import { Router } from "express";
import {
  getUsers,
  createUser,
  updateUser,
  deactivateUser,
  activateUser,
} from "../controllers/user.controller";
import { validate } from "../middleware/validate.middleware";
import { createUserSchema, updateUserSchema } from "../validations/user.schema";

const router = Router();

router.get("/", getUsers);
router.post("/", validate(createUserSchema), createUser);
router.put("/:id", validate(updateUserSchema), updateUser);
router.put("/:id/deactivate", deactivateUser);
router.put("/:id/activate", activateUser);

export default router;
