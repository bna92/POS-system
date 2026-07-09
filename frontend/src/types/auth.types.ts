import type { AppUser } from "./user.types";

export interface LoginResponse {
  token: string;
  user: AppUser;
}
