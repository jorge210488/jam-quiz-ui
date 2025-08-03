// types/user.ts
import type { Badge } from "./badge";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  badges?: Badge[];
  createdAt?: string;
  updatedAt?: string;
}
