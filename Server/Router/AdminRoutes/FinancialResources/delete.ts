import Router from "express";
import { scholarshipModel, loanModel, jobModel } from "./../../../database";
import { adminAuth } from "./../../../Auth/admin";

export const deleteRouter = Router();

deleteRouter.delete("/scholarship", adminAuth, async function (req, res) {

    const { id } = req.body;

    try {
        await scholarshipModel.deleteOne({
            id
        });

        res.json({
            Message: "You Have Deleted An Financial Resource",
        });
    } catch (error) {
        res.status(500).json({
            Message: "Error While Fetching",
            Error: `Error With Api: ${error}`
        });
    }
});

deleteRouter.delete("/loan", adminAuth, async function (req, res) {

    const { id } = req.body;

    try {
        await loanModel.deleteOne({
            id
        });

        res.json({
            Message: "You Have Deleted An Financial Resource",
        });
    } catch (error) {
        res.status(500).json({
            Message: "Error While Fetching",
            Error: `Error With Api: ${error}`
        });
    }
});

deleteRouter.delete("/job", adminAuth, async function (req, res) {

    const { id } = req.body;

    try {
        await jobModel.deleteOne({
            id
        });

        res.json({
            Message: "You Have Deleted An Financial Resource",
        });
    } catch (error) {
        res.status(500).json({
            Message: "Error While Fetching",
            Error: `Error With Api: ${error}`
        });
    }
});