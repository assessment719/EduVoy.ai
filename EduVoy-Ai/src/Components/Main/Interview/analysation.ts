import { BACKEND_URL } from '../../../config'

let sessionCount = 1;
let previousQuestion = '';
const initialScores: Array<{ session: number; score: number }> = [
  { session: 0, score: 0 },
];

let recentScores = [...initialScores];

export async function analyzeResponse(
  question: string,
  response: string,
  evaluationPrompt: string,
  expectedKeywords: string,
  university: string,
  course: string,
  intake: string,
  destination: string
) {
  try {
    if (previousQuestion !== question) {
      sessionCount = 1;
      recentScores = [...initialScores];
      previousQuestion = question;
    }

    const token = localStorage.getItem('token');

    if (!token) {
      return;
    }

    const result = await fetch(`${BACKEND_URL}/users/openai/analysation`, {
      method: "POST",
      headers: {
        'token': `${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question,
        response,
        evaluationPrompt,
        expectedKeywords,
        university,
        course,
        intake,
        destination,
      }),
    });
    const data = await result.json();

    recentScores.push({ session: sessionCount, score: data.score });

    sessionCount++;

    exportRecentScores();

    return {
      feedback: data.feedback,
      sampleAnswer: data.sampleAnswer,
      score: data.score,
    };
  } catch (error) {
    console.error("Error analyzing response:", error);

    recentScores.push({ session: sessionCount, score: 0 });

    sessionCount++;

    exportRecentScores();

    return {
      feedback: "Sorry, there was an error analyzing your response. Please try again.",
      sampleAnswer: "Sorry, please try once again.",
      score: 0,
    };
  }
}

export function exportRecentScores() {
  return recentScores;
}