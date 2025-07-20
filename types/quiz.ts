// types/quiz.ts
export interface Quiz {
  _id: string;
  title: string;
  description?: string; // 👈 la hacemos opcional
  createdBy: {
    _id: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
