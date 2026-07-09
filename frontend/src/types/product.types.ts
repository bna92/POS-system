export interface Product {
  id: number;
  name: string;
  barcode?: string;
  category_id?: number;
  category_name?: string;
  price: number;
  cost: number;
  stock: number;
  image_url?: string;
  active: boolean;
}