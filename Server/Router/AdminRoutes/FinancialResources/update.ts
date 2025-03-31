import Router from "express";
import { scholarshipModel, loanModel, jobModel } from "./../../../database";
import { adminAuth } from "./../../../Auth/admin";

export const updateRouter = Router();

updateRouter.put("/scholarship", adminAuth, async function (req, res) {

    const { id, title, provider, type, amount, deadline, eligibilities, requirements, faculties, link } = req.body;

    try {
        await scholarshipModel.updateOne({
            id
        }, {
            title, provider, type, amount, deadline, eligibilities, requirements, faculties, link
        });

        res.json({
            Message: "You Have Updated An Financial Resource"
        });
    } catch (error) {
        res.status(500).json({
            Message: "Error While Fetching",
            Error: `Error With Api: ${error}`
        });
    }
});

updateRouter.put("/loan", adminAuth, async function (req, res) {

    const { id, title, bankName, interestRate, maxAmount, collateral, features, eligibility, tenure, processingFee, link } = req.body;

    try {
        await loanModel.updateOne({
            id
        }, {
            title, bankName, interestRate, maxAmount, collateral, features, eligibility, tenure, processingFee, link
        });

        res.json({
            Message: "You Have Updated An Financial Resource"
        });
    } catch (error) {
        res.status(500).json({
            Message: "Error While Fetching",
            Error: `Error With Api: ${error}`
        });
    }
});

updateRouter.put("/job", adminAuth, async function (req, res) {

    const { id, title, avgHourlyRate, hoursPerWeek, locations, requirements, benefits, tips } = req.body;

    try {
        await jobModel.updateOne({
            id
        }, {
            title, avgHourlyRate, hoursPerWeek, locations, requirements, benefits, tips
        });

        res.json({
            Message: "You Have Updated An Financial Resource"
        });
    } catch (error) {
        res.status(500).json({
            Message: "Error While Fetching",
            Error: `Error With Api: ${error}`
        });
    }
});