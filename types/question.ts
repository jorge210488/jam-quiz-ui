// types/question.ts
export interface QuestionTranslation {
  questionText: string;
  options: string[];
  correctAnswer: string;
}

export interface Question {
  _id?: string;
  quiz: string; // Referencia al quiz (ObjectId como string)
  questionText: string;
  options: string[];
  correctAnswer: string;
  timeLimit?: number;
  translations?: Record<string, QuestionTranslation>; // Mapeo para las traducciones
  createdAt?: string;
  updatedAt?: string;
}
