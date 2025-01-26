import Router from "express";
import { OpenAI } from 'openai';
import { OPENAI_API } from "../../../config";
import { userAuth } from "../../../Auth/user";

export const chatRouter = Router();

const openai = new OpenAI({
    apiKey: OPENAI_API,
    dangerouslyAllowBrowser: true,
});

chatRouter.post("/", userAuth, async (req, res) => {
    const { message } = req.body;

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                { role: "system", content: "You Are A Study Abroad Advisor. Who Helps Student's Query Regarding Study Abroad. You Thinks Critically To Solve Query And Give Answers In A Short Sentence. Don't Use Any Signs." },
                { role: "user", content: message },
            ],
        });

        const content = completion.choices[0]?.message?.content;

        res.json({
            reply: content
        })
    } catch (error) {
        console.log(`Error With Api: ${error}`);
        res.json({
            Message: "Sorry, there was an error while replying. Please try again.",
        });
    }
});