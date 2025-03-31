import Router from "express";
import { resourceModel } from "./../../../database";
import { adminAuth } from "./../../../Auth/admin";

export const updateRouter = Router();

updateRouter.put("/", adminAuth, async function (req, res) {

    const { id, title, type, category, downloadUrl } = req.body;

    try {
        await resourceModel.updateOne({
            id
        }, {
            title, type, category, downloadUrl
        });

        res.json({
            Message: "You Have Updated An Interview Resource"
        });
    } catch (error) {
        res.status(500).json({
            Message: "Error While Fetching",
            Error: `Error With Api: ${error}`
        });
    }
});