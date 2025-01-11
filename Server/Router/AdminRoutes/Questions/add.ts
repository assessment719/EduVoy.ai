import Router from "express";
import { questionModel } from "./../../../database";
import { adminAuth } from "./../../../Auth/admin";

export const addRouter = Router();

addRouter.post("/", adminAuth, async function (req, res) {

    const { id, question, category, difficulty, expectedKeywords, evaluationPrompt } = req.body;

    try {
        await questionModel.create({
            id, question, category, difficulty, expectedKeywords, evaluationPrompt
        });

        res.json({
            Message: "You Have Added An Question"
        });
    } catch (error) {
        res.status(500).json({
            Message: "Error While Fetching",
            Error: `Error With Api: ${error}`
        });
    }
});