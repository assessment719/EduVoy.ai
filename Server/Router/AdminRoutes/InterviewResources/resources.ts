import Router from "express";
import { resourceModel } from "./../../../database";
import { addRouter } from "./add";
import { updateRouter } from "./update";
import { deleteRouter } from "./delete";
import { adminAuth } from "./../../../Auth/admin";

export const resourcesRouter = Router();

resourcesRouter.get("/", adminAuth, async function (req, res) {

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

resourcesRouter.use("/add", addRouter);
resourcesRouter.use("/update", updateRouter);
resourcesRouter.use("/delete", deleteRouter);