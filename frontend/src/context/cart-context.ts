import { createContext } from "react";
import type { CartItem } from "../types/cart.types.ts";
import type { Product } from "../types/product.types";

export interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  increaseQuantity: (productId: number) => void;
  decreaseQuantity: (productId: number) => void;
  clearCart: () => void;
  total: number;
}

export const CartContext = createContext<CartContextType | null>(null);
