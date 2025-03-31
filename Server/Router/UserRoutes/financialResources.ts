import Router from "express";
import { scholarshipModel, loanModel, jobModel } from "./../../database";
import { userAuth } from "./../../Auth/user";

export const finResourcesRouter = Router();

finResourcesRouter.get("/scholarship", userAuth, async function (req, res) {

    try {
        const resources = await scholarshipModel.find();

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

finResourcesRouter.get("/loan", userAuth, async function (req, res) {

    try {
        const resources = await loanModel.find();

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

finResourcesRouter.get("/job", userAuth, async function (req, res) {

    try {
        const resources = await jobModel.find();

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