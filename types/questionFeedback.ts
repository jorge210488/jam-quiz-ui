// types/questionFeedback.ts
export interface QuestionFeedback {
  _id: string;
  question: {
    _id: string;
    questionText: string;
    quiz?: {
      _id: string;
      title: string;
      description?: string;
    };
  };
  user: {
    _id: string;
    name: string;
    email: string;
  };
  isClear: boolean;
  comment?: string;
  createdAt: string;
  updatedAt: string;
}
