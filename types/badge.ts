// types/badge.ts
export interface Badge {
  _id: string;
  name: string;
  description?: string;
  iconUrl?: string;
  condition: string;
}
