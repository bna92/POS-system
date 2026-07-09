import { z } from "zod";

export const customerSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  phone: z.string().optional().nullable(),
  email: z.union([z.email("Email inválido"), z.literal(""), z.null()]).optional(),
});
