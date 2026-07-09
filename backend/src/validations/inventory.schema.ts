import { z } from "zod";

export const movementSchema = z.object({
  product_id: z.coerce.number(),
  user_id: z.coerce.number(),
  type: z.enum(["in", "out"]),
  quantity: z.coerce.number().int().positive("La cantidad debe ser mayor a 0"),
  reason: z.string().min(1, "El motivo es requerido"),
});
