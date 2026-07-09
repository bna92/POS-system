export type UserRole = "admin" | "cashier" | "supervisor";

export interface AppUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
  created_at?: string;
}
