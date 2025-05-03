import Router from "express";
import { querriesModel } from "./../../../database";
import { adminAuth } from "./../../../Auth/admin";

export const deleteRouter = Router();

deleteRouter.delete("/", adminAuth, async function (req, res) {

    const { id } = req.body;

    try {
        await querriesModel.deleteOne({
            id
        });

        res.json({
            Message: "You Have Deleted An Query",
        });
    } catch (error) {
        res.status(500).json({
            Message: "Error While Fetching",
            Error: `Error With Api: ${error}`
        });
    }
});