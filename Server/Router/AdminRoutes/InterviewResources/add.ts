import Router from "express";
import { resourceModel } from "./../../../database";
import { adminAuth } from "./../../../Auth/admin";

export const addRouter = Router();

addRouter.post("/", adminAuth, async function (req, res) {

    const { id, title, type, category, downloadUrl } = req.body;

    try {
        await resourceModel.create({
            id, title, type, category, downloadUrl
        });

        res.json({
            Message: "You Have Added An Interview Resource"
        });
    } catch (error) {
        res.status(500).json({
            Message: "Error While Fetching",
            Error: `Error With Api: ${error}`
        });
    }
});