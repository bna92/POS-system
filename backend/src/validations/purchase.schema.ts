import { z } from "zod";

export const purchaseSchema = z.object({
  supplier_id: z.coerce.number(),
  user_id: z.coerce.number(),
  total: z.coerce.number().positive("El total debe ser mayor a 0"),
  items: z
    .array(
      z.object({
        product_id: z.coerce.number(),
        quantity: z.coerce.number().int().positive(),
        cost: z.coerce.number().nonnegative(),
        subtotal: z.coerce.number().nonnegative(),
      })
    )
    .min(1, "La compra debe tener al menos un producto"),
});
