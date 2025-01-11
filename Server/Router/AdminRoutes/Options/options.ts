import Router from "express";
import { boardsOptionModel } from "./../../../database";
import { unisOptionModel } from "./../../../database";
import { moiOptionModel } from "./../../../database";
import { facultiesOptionModel } from "./../../../database";
import { intakesOptionModel } from "./../../../database";
import { addRouter } from "./add";
import { updateRouter } from "./update";
import { deleteRouter } from "./delete";
import { adminAuth } from "./../../../Auth/admin";

export const optionsRouter = Router();

optionsRouter.get("/board", adminAuth, async function (req, res) {

    try {
        const boards = await boardsOptionModel.find().sort({option: 1});

        res.json({
            boards
        });
    } catch (error) {
        res.status(500).json({
            Message: "Error While Fetching",
            Error: `Error With Api: ${error}`
        });
    }
});

optionsRouter.get("/university", adminAuth, async function (req, res) {

    try {
        const universities = await unisOptionModel.find().sort({option: 1});

        res.json({
            universities
        });
    } catch (error) {
        res.status(500).json({
            Message: "Error While Fetching",
            Error: `Error With Api: ${error}`
        });
    }
});

optionsRouter.get("/moiunis", adminAuth, async function (req, res) {

    try {
        const universities = await moiOptionModel.find().sort({option: 1});

        res.json({
            universities
        });
    } catch (error) {
        res.status(500).json({
            Message: "Error While Fetching",
            Error: `Error With Api: ${error}`
        });
    }
});

optionsRouter.get("/faculty", adminAuth, async function (req, res) {

    try {
        const faculties = await facultiesOptionModel.find().sort({option: 1});

        res.json({
            faculties
        });
    } catch (error) {
        res.status(500).json({
            Message: "Error While Fetching",
            Error: `Error With Api: ${error}`
        });
    }
});

optionsRouter.get("/intake", adminAuth, async function (req, res) {

    try {
        const intakes = await intakesOptionModel.find().sort({id: 1});

        res.json({
            intakes
        });
    } catch (error) {
        res.status(500).json({
            Message: "Error While Fetching",
            Error: `Error With Api: ${error}`
        });
    }
});

optionsRouter.get("/board/:id", adminAuth, async function (req, res) {

    const id = parseInt(req.params.id);

    try {
        const board = await boardsOptionModel.findOne({ id });

        res.json({
            board
        });
    } catch (error) {
        res.status(500).json({
            Message: "Error While Fetching",
            Error: `Error With Api: ${error}`
        });
    }
});

optionsRouter.get("/university/:id", adminAuth, async function (req, res) {

    const id = parseInt(req.params.id);

    try {
        const university = await unisOptionModel.findOne({ id });

        res.json({
            university
        });
    } catch (error) {
        res.status(500).json({
            Message: "Error While Fetching",
            Error: `Error With Api: ${error}`
        });
    }
});

optionsRouter.get("/moiunis/:id", adminAuth, async function (req, res) {

    const id = parseInt(req.params.id);

    try {
        const university = await moiOptionModel.findOne({ id });

        res.json({
            university
        });
    } catch (error) {
        res.status(500).json({
            Message: "Error While Fetching",
            Error: `Error With Api: ${error}`
        });
    }
});

optionsRouter.get("/faculty/:id", adminAuth, async function (req, res) {

    const id = parseInt(req.params.id);

    try {
        const faculty = await facultiesOptionModel.findOne({ id });

        res.json({
            faculty
        });
    } catch (error) {
        res.status(500).json({
            Message: "Error While Fetching",
            Error: `Error With Api: ${error}`
        });
    }
});

optionsRouter.get("/intake/:id", adminAuth, async function (req, res) {

    const id = parseInt(req.params.id);

    try {
        const intake = await intakesOptionModel.findOne({ id });

        res.json({
            intake
        });
    } catch (error) {
        res.status(500).json({
            Message: "Error While Fetching",
            Error: `Error With Api: ${error}`
        });
    }
});

optionsRouter.use("/add", addRouter);
optionsRouter.use("/update", updateRouter);
optionsRouter.use("/delete", deleteRouter);