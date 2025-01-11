import Router from "express";
import { courseModel } from "./../../../database";
import { adminAuth } from "./../../../Auth/admin";

export const deleteRouter = Router();

deleteRouter.delete("/", adminAuth, async function (req, res) {

    const { id } = req.body;

    try {
        await courseModel.deleteOne({
            id
        });

        res.json({
            Message: "You Have Deleted An Course",
        });
    } catch (error) {
        res.status(500).json({
            Message: "Error While Fetching",
            Error: `Error With Api: ${error}`
        });
    }
});