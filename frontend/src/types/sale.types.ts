export type PaymentMethod = "cash" | "card" | "transfer" | "mixed";

export interface Sale {
  id: number;
  folio?: string;
  user_id: number;
  cashier_name?: string;
  customer_id?: number;
  customer_name?: string;
  cash_register_id?: number;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  payment_method: PaymentMethod;
  cash_received: number;
  change_amount: number;
  status: "completed" | "cancelled";
  created_at: string;
}

export interface SaleReceiptItem {
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface SaleReceipt extends Sale {
  items: SaleReceiptItem[];
}
