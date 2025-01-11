import Router from "express";
import { questionModel } from "./../../../database";
import { addRouter } from "./add";
import { updateRouter } from "./update";
import { deleteRouter } from "./delete";
import { adminAuth } from "./../../../Auth/admin";

export const questionsRouter = Router();

questionsRouter.get("/", adminAuth, async function (req, res) {

    try {
        const questions = await questionModel.find();

        res.json({
            questions
        });
    } catch (error) {
        res.status(500).json({
            Message: "Error While Fetching",
            Error: `Error With Api: ${error}`
        });
    }
});

questionsRouter.use("/add", addRouter);
questionsRouter.use("/update", updateRouter);
questionsRouter.use("/delete", deleteRouter);