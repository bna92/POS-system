export interface PurchaseItem {
  product_id: number;
  product_name?: string;
  quantity: number;
  cost: number;
  subtotal: number;
}

export interface Purchase {
  id: number;
  supplier_id: number;
  supplier_name?: string;
  user_id: number;
  user_name?: string;
  total: number;
  created_at: string;
  items?: PurchaseItem[];
}
