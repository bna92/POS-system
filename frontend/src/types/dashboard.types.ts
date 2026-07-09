export interface DailySummary {
  total_sales: number;
  total_income: number;
}

export interface SalesTrendPoint {
  date: string;
  total_sales: number;
  total_income: number;
}

export interface TopProduct {
  id: number;
  name: string;
  units_sold: number;
  total_income: number;
}

export interface LowStockProduct {
  id: number;
  name: string;
  stock: number;
  min_stock: number;
}
