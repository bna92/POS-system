import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  barcode: z.string().optional().nullable(),
  category_id: z.union([z.number(), z.string(), z.null()]).optional(),
  price: z.coerce.number().nonnegative("El precio no puede ser negativo"),
  cost: z.coerce.number().nonnegative("El costo no puede ser negativo"),
  stock: z.coerce.number().int().nonnegative("El stock no puede ser negativo"),
  min_stock: z.coerce.number().int().nonnegative().optional(),
  image_url: z.string().optional().nullable(),
});
