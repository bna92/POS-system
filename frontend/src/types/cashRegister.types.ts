export interface CashSessionSummary {
  total_sales: number;
  total_income: number;
  cash_income: number;
}

export interface CashSession {
  id: number;
  user_id: number;
  user_name?: string;
  opening_amount: number;
  closing_amount?: number;
  expected_amount?: number;
  difference_amount?: number;
  status: "open" | "closed";
  opened_at: string;
  closed_at?: string;
  summary?: CashSessionSummary;
}
