import Router from "express";
import { questionModel } from "./../../database";
import { userAuth } from "./../../Auth/user";

export const questionsRouter = Router();

questionsRouter.get("/", userAuth, async function (req, res) {

    try {
        const questions = await questionModel.find();

        res.json({
            questions
        });
    } catch (error) {
        console.log(`Error With Api: ${error}`);
        res.status(500).json({ Message: "Error While Fetching" });
    }
});