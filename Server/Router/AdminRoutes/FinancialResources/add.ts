import Router from "express";
import moment from 'moment';
import { scholarshipModel, loanModel, jobModel } from "./../../../database";
import { adminAuth } from "./../../../Auth/admin";

export const addRouter = Router();

addRouter.post("/scholarship", adminAuth, async function (req, res) {

    const { title, provider, type, amount, deadline, eligibilities, requirements, faculties, link } = req.body;

    const uniqueId = moment().unix() + Math.floor((Math.random() * 100) + 1);

    try {
        await scholarshipModel.create({
            id : uniqueId, title, provider, type, amount, deadline, eligibilities, requirements, faculties, link
        });

        res.json({
            Message: "You Have Added An Financial Resource"
        });
    } catch (error) {
        res.status(500).json({
            Message: "Error While Fetching",
            Error: `Error With Api: ${error}`
        });
    }
});

addRouter.post("/loan", adminAuth, async function (req, res) {

    const { title, bankName, interestRate, maxAmount, collateral, features, eligibility, tenure, processingFee, link } = req.body;

    const uniqueId = moment().unix() + Math.floor((Math.random() * 100) + 1);

    try {
        await loanModel.create({
            id : uniqueId, title, bankName, interestRate, maxAmount, collateral, features, eligibility, tenure, processingFee, link
        });

        res.json({
            Message: "You Have Added An Financial Resource"
        });
    } catch (error) {
        res.status(500).json({
            Message: "Error While Fetching",
            Error: `Error With Api: ${error}`
        });
    }
});

addRouter.post("/job", adminAuth, async function (req, res) {

    const { title, avgHourlyRate, hoursPerWeek, locations, requirements, benefits, tips } = req.body;

    const uniqueId = moment().unix() + Math.floor((Math.random() * 100) + 1);

    try {
        await jobModel.create({
            id : uniqueId, title, avgHourlyRate, hoursPerWeek, locations, requirements, benefits, tips
        });

        res.json({
            Message: "You Have Added An Financial Resource"
        });
    } catch (error) {
        res.status(500).json({
            Message: "Error While Fetching",
            Error: `Error With Api: ${error}`
        });
    }
});