import type { Quiz } from "./quiz";
import type { Question } from "./question";

export interface GameSessionResponse {
  user: string;
  question: string;
  answer: string;
  timeTaken: number;
  powerUpUsed?: "double_points" | "skip" | "none";
}

export interface IndividualScore {
  user: string;
  score: number;
}

export interface Team {
  name: string;
  members: string[];
  score: number;
}

export interface GameSession {
  _id: string;
  quiz: Quiz;
  players: {
    _id: string;
    name: string;
    email: string;
  }[];
  teams: Team[];
  startTime?: string;
  endTime?: string;
  responses: {
    user: {
      _id: string;
      name: string;
      email: string;
    };
    question: Question;
    answer: string;
    timeTaken: number;
    powerUpUsed: "double_points" | "skip" | "none";
  }[];
  individualScores: IndividualScore[];
  status: "waiting" | "started" | "finished";
  createdAt: string;
  updatedAt: string;
}

export interface GameSessionSummary {
  sessionId: string;
  quizTitle: string;
  startTime?: string;
  endTime?: string;
  totalQuestions: number;
  score: number;
}
