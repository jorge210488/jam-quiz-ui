// types/question.ts
export interface QuestionTranslation {
  questionText: string;
  options: string[];
  correctAnswer: string;
  _id?: string;
}

export type Question = {
  _id?: string;
  quiz: string | null | { _id: string; title: string };
  questionText: string;
  options: string[];
  correctAnswer: string;
  timeLimit?: number;
  translations?: Record<string, QuestionTranslation>;
};
