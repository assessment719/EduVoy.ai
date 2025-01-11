import Router from "express";
import { resourceModel } from "./../../database";
import { userAuth } from "./../../Auth/user";

export const resourcesRouter = Router();

resourcesRouter.get("/", userAuth, async function (req, res) {

    try {
        const resources = await resourceModel.find();

        res.json({
            resources
        });
    } catch (error) {
        res.status(500).json({
            Message: "Error While Fetching",
            Error: `Error With Api: ${error}`
        });
    }
});