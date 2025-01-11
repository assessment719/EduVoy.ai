export interface Question {
    id: number;
    question: string;
    category: string;
    difficulty: string;
    expectedKeywords: string;
    evaluationPrompt: string;
  }