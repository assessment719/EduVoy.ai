import Router from "express";
import { OpenAI } from 'openai';
import { OPENAI_API } from "../../../config";
import { userAuth } from "../../../Auth/user";

export const analysationRouter = Router();

const openai = new OpenAI({
    apiKey: OPENAI_API,
    dangerouslyAllowBrowser: true,
});

analysationRouter.post("/", userAuth, async (req, res) => {
    const { question, response, evaluationPrompt, expectedKeywords, university, course, intake, destination } = req.body;

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                { role: "system", content: "You are an expert visa interview evaluator. Provide concise, constructive feedback for student responses with a sample answer for the student." },
                {
                    role: "user", content: `
                Question: ${question}
                Student Response: ${response}
                Evaluation Instructions: ${evaluationPrompt}
                Expected Keywords: ${expectedKeywords}
                University Name: ${university}
                Course Name: ${course}
                Intake: ${intake}
                Study Destination: ${destination}
                
                Provide feedback in the following JSON format:
                {
                  "feedback": "detailed feedback here",
                  "sampleAnswer": "a sample answer for the respective question based on Student response",
                  "score": numeric_score_between_0_and_100
                }`,
                },
            ],
        });

        const content = completion.choices[0]?.message?.content;

        let reply;
        try {
            reply = JSON.parse(content as string);
        } catch (jsonError) {
            console.error("Invalid JSON format from OpenAI API:", content, jsonError);
            throw new Error("Invalid JSON format received from AI response.");
        }

        res.json({
            feedback: reply.feedback,
            sampleAnswer: reply.sampleAnswer,
            score: reply.score
        });
    } catch (error) {
        console.error(`Error with API or JSON Parsing: ${error}`);
        res.json({
            feedback: "Sorry, there was an error analyzing your response. Please try again.",
            sampleAnswer: "Sorry, please try once again.",
            score: 0,
        });
    }
});