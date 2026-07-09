export type MovementType = "in" | "out";

export interface InventoryMovement {
  id: number;
  product_id: number;
  product_name?: string;
  user_id: number;
  user_name?: string;
  movement_type: MovementType;
  quantity: number;
  previous_stock: number;
  new_stock: number;
  notes?: string;
  created_at: string;
}
