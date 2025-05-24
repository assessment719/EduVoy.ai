import Router from "express";
import { OpenAI } from 'openai';
import { OPENAI_API } from "../../../config";
import { userAuth } from "../../../Auth/user";

export const interviewProRouter = Router();

const openai = new OpenAI({
    apiKey: OPENAI_API,
    dangerouslyAllowBrowser: true,
});

interviewProRouter.post("/answerSpeech", userAuth, async (req: any, res: any) => {
    const { question, evaluationPrompt, expectedKeywords, response, destination, university, course, intake, voice } = req.body;

    let reply;

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: `You are a highly skilled and professional interviewer who helps Indian students prepare for overseas education interviews.

                    You must always:
                    - Respond strictly in JSON format (do not include any other text).
                    - Avoid greetings, explanations, or any text outside the JSON.
                    - Escape double quotes properly inside values.
                    - Return only one JSON object with 3 specific keys: feedbackWithSampleAnswer, clarityOfResponses, confidenceLevel, questionComprehension.
                    - Use a neutral, articulate tone in feedback, include a sample answer, and end with a warm offer to clarify doubts.
                    - Return all numeric values as integers between 0 and 100.

                    Example output:
                    {
                        "feedbackWithSampleAnswer": "Your answer lacked structure. Try to elaborate more on your course interest... Sample answer: 'I chose this course because...'. Do you have any doubts you'd like me to clarify?",
                        "clarityOfResponses": 70,
                        "confidenceLevel": 60,
                        "questionComprehension": 75
                    }`
                },
                {
                    role: "user",
                    content: `
                    Question: ${question}
                    Student Response: ${response}
                    Evaluation Instructions: ${evaluationPrompt}
                    Expected Keywords: ${expectedKeywords}
                    Study Destination: ${destination}
                    University Name: ${university}
                    Course Name: ${course}
                    Intake: ${intake}
          
                    IMPORTANT: ONLY return a valid JSON object in the below format. Do NOT add markdown, code block, comments, or extra text.

                    {
                        "feedbackWithSampleAnswer": "...",
                        "clarityOfResponses": clarity_score_between_0_to_100,
                        "confidenceLevel": confidence_score_between_0_to_100,
                        "questionComprehension": comprehension_score_between_0_to_100
                    }`
                }
            ]
        });

        const content = completion.choices[0]?.message?.content;

        try {
            reply = JSON.parse(content as string);
        } catch (jsonError) {
            console.error("Invalid JSON format from OpenAI API:", content, jsonError);
            throw new Error("Invalid JSON format received from AI response.");
        }

        if (reply.feedbackWithSampleAnswer) {
            try {
                const response = await openai.audio.speech.create({
                    model: 'gpt-4o-mini-tts',
                    voice: voice,
                    input: reply.feedbackWithSampleAnswer,
                    response_format: "wav",
                });

                const audioBuffer = Buffer.from(await response.arrayBuffer());

                return res.json({
                    success: true,
                    message: 'Speech generated successfully (WAV format)',
                    feedbackText: reply.feedbackWithSampleAnswer,
                    feedbackAudio: audioBuffer.toString('base64'),
                    format: 'wav',
                    voice: voice,
                    clarityOfResponses: reply.clarityOfResponses,
                    confidenceLevel: reply.confidenceLevel,
                    questionComprehension: reply.questionComprehension
                });
            } catch (error) {
                console.error("Sorry! Speech generation unsuccessful. (WAV format). Response not generated as required:", content, error);
                res.json({
                    success: false,
                    message: 'Sorry! Speech generation unsuccessful.',
                    error: error
                });
            }
        }
    } catch (error) {
        console.error(`There was an error during alayzation or generating the speech: ${error}`);
        res.json({
            success: false,
            message: 'Sorry! There was an error during alayzation or generating the speech',
            error: error
        });
    }
});

interviewProRouter.post("/doubtSpeech", userAuth, async (req: any, res: any) => {
    const { question, response, aiResponse, doubt, destination, university, course, intake, voice } = req.body;

    let reply;

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                { role: "system", content: "You are a highly skilled and professional interviewer specializing in preparing Indian students for overseas education interviews. Your tone is confident, articulate, and encouraging, with a neutral yet slightly formal accent (clear and globally understandable English, with a mild Indian inflection if preferred). You provide structured, insightful, and supportive feedback while maintaining a warm and approachable demeanor. The student having a doubt regarding a question and answer kindly give hiv a feedback. And lastly inform student that we are jumping onto the next question." },
                {
                    role: "user", content: `
                Question: ${question}
                Student Response: ${response}
                Your Feedback: ${aiResponse}
                Student Doubt: ${doubt}
                Study Destination: ${destination}
                University Name: ${university}
                Course Name: ${course}
                Intake: ${intake}`
                },
            ],
        });

        const content = completion.choices[0]?.message?.content;

        if (content) {
            try {
                const response = await openai.audio.speech.create({
                    model: 'gpt-4o-mini-tts',
                    voice: voice,
                    input: content,
                    response_format: "wav",
                });

                const audioBuffer = Buffer.from(await response.arrayBuffer());

                return res.json({
                    success: true,
                    message: 'Speech generated successfully (WAV format)',
                    feedbackText: content,
                    feedbackAudio: audioBuffer.toString('base64'),
                    format: 'wav',
                    voice: voice
                });
            } catch (error) {
                console.error("Sorry! Speech generation unsuccessful. (WAV format). Response not generated as required:", content, error);
                res.json({
                    success: false,
                    message: 'Sorry! Speech generation unsuccessful.',
                    error: error
                });
            }
        }
    } catch (error) {
        console.error(`There was an error during alayzation or generating the speech: ${error}`);
        res.json({
            success: false,
            message: 'Sorry! There was an error during alayzation or generating the speech',
            error: error
        });
    }
});

interviewProRouter.post('/speech', userAuth, async (req: any, res: any) => {
    const { text, voice } = req.body;

    if (!text) {
        return res.status(400).json({
            success: false,
            message: 'Text is required'
        });
    }

    try {
        const response = await openai.audio.speech.create({
            model: 'gpt-4o-mini-tts',
            voice: voice,
            input: text,
            response_format: "wav",
        });

        const audioBuffer = Buffer.from(await response.arrayBuffer());

        return res.json({
            success: true,
            message: 'Speech generated successfully (WAV format)',
            audio: audioBuffer.toString('base64'),
            format: 'wav',
            voice: voice
        });
    } catch (error) {
        console.error('Error generating speech:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to generate speech',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});