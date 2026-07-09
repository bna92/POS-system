import { z } from "zod";

export const openSessionSchema = z.object({
  user_id: z.coerce.number(),
  opening_amount: z.coerce.number().nonnegative(),
});

export const closeSessionSchema = z.object({
  closing_amount: z.coerce.number().nonnegative(),
});
