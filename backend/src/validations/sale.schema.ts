import { z } from "zod";

export const saleSchema = z.object({
  user_id: z.coerce.number(),
  customer_id: z.union([z.number(), z.null()]).optional(),
  cash_register_id: z.union([z.number(), z.null()]).optional(),
  payment_method: z.enum(["cash", "card", "transfer", "mixed"]),
  cash_received: z.coerce.number().nonnegative(),
  change_amount: z.coerce.number(),
  total: z.coerce.number().positive("El total debe ser mayor a 0"),
  items: z
    .array(
      z.object({
        product_id: z.coerce.number(),
        quantity: z.coerce.number().int().positive(),
        price: z.coerce.number().nonnegative(),
        subtotal: z.coerce.number().nonnegative(),
      })
    )
    .min(1, "La venta debe tener al menos un producto"),
});
