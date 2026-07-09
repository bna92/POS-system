import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "El nombre es muy corto"),
  email: z.email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  role: z.enum(["admin", "cashier", "supervisor"]).optional(),
});

export const loginSchema = z.object({
  email: z.email("Email inválido"),
  password: z.string().min(1, "La contraseña es requerida"),
});
