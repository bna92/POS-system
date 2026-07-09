import { NextFunction, Response } from "express";
import { AuthRequest } from "./auth.middleware";

export function requireRole(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "No tienes permiso para esta acción" });
    }

    next();
  };
}
