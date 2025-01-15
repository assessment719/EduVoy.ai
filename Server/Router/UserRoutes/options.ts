import Router from "express";
import { boardsOptionModel } from "./../../database";
import { unisOptionModel } from "./../../database";
import { moiOptionModel } from "./../../database"
import { facultiesOptionModel } from "./../../database";
import { intakesOptionModel } from "./../../database";
import { userAuth } from "./../../Auth/user";

export const optionsRouter = Router();

optionsRouter.get("/board", userAuth, async function (req, res) {

    try {
        const boards = await boardsOptionModel.find().sort({option: 1});

        res.json({
            boards
        });
    } catch (error) {
        console.log(`Error With Api: ${error}`);
        res.status(500).json({ Message: "Error While Fetching" });
    }
});

optionsRouter.get("/university", userAuth, async function (req, res) {

    try {
        const universities = await unisOptionModel.find().sort({option: 1});

        res.json({
            universities
        });
    } catch (error) {
        console.log(`Error With Api: ${error}`);
        res.status(500).json({ Message: "Error While Fetching" });
    }
});

optionsRouter.get("/moiunis", userAuth, async function (req, res) {

    try {
        const moiunis = await moiOptionModel.find().sort({option: 1});

        res.json({
            moiunis
        });
    } catch (error) {
        console.log(`Error With Api: ${error}`);
        res.status(500).json({ Message: "Error While Fetching" });
    }
});

optionsRouter.get("/faculty", userAuth, async function (req, res) {

    try {
        const faculties = await facultiesOptionModel.find().sort({option: 1});

        res.json({
            faculties
        });
    } catch (error) {
        console.log(`Error With Api: ${error}`);
        res.status(500).json({ Message: "Error While Fetching" });
    }
});

optionsRouter.get("/intake", userAuth, async function (req, res) {

    try {
        const intakes = await intakesOptionModel.find().sort({id: 1});

        res.json({
            intakes
        });
    } catch (error) {
        console.log(`Error With Api: ${error}`);
        res.status(500).json({ Message: "Error While Fetching" });
    }
});