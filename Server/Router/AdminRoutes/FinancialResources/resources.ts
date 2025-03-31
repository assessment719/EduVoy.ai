import Router from "express";
import { scholarshipModel, loanModel, jobModel } from "./../../../database";
import { addRouter } from "./add";
import { updateRouter } from "./update";
import { deleteRouter } from "./delete";
import { adminAuth } from "./../../../Auth/admin";

export const finResourcesRouter = Router();

finResourcesRouter.get("/scholarship", adminAuth, async function (req, res) {
    const { skip, limit } = req.query;

    try {
        const resources = await scholarshipModel
            .find()
            .skip(Number(skip))
            .limit(Number(limit));

        const count = await scholarshipModel.countDocuments();

        res.json({
            data: { total: count, resources }
        });
    } catch (error) {
        res.status(500).json({
            Message: "Error While Fetching",
            Error: `Error With Api: ${error}`
        });
    }
});

finResourcesRouter.get("/loan", adminAuth, async function (req, res) {
    const { skip, limit } = req.query;

    try {
        const resources = await loanModel
            .find()
            .skip(Number(skip))
            .limit(Number(limit));

        const count = await loanModel.countDocuments();

        res.json({
            data: { total: count, resources }
        });
    } catch (error) {
        res.status(500).json({
            Message: "Error While Fetching",
            Error: `Error With Api: ${error}`
        });
    }
});

finResourcesRouter.get("/job", adminAuth, async function (req, res) {
    const { skip, limit } = req.query;

    try {
        const resources = await jobModel
            .find()
            .skip(Number(skip))
            .limit(Number(limit));

        const count = await jobModel.countDocuments();

        res.json({
            data: { total: count, resources }
        });
    } catch (error) {
        res.status(500).json({
            Message: "Error While Fetching",
            Error: `Error With Api: ${error}`
        });
    }
});

finResourcesRouter.get("/scholarship/:id", adminAuth, async function (req, res) {

    const id = parseInt(req.params.id);

    try {
        const resource = await scholarshipModel.findOne({ id });

        res.json({
            resource
        });
    } catch (error) {
        res.status(500).json({
            Message: "Error While Fetching",
            Error: `Error With Api: ${error}`
        });
    }
});

finResourcesRouter.get("/loan/:id", adminAuth, async function (req, res) {

    const id = parseInt(req.params.id);

    try {
        const resource = await loanModel.findOne({ id });

        res.json({
            resource
        });
    } catch (error) {
        res.status(500).json({
            Message: "Error While Fetching",
            Error: `Error With Api: ${error}`
        });
    }
});

finResourcesRouter.get("/job/:id", adminAuth, async function (req, res) {

    const id = parseInt(req.params.id);

    try {
        const resource = await jobModel.findOne({ id });

        res.json({
            resource
        });
    } catch (error) {
        res.status(500).json({
            Message: "Error While Fetching",
            Error: `Error With Api: ${error}`
        });
    }
});

finResourcesRouter.use("/add", addRouter);
finResourcesRouter.use("/update", updateRouter);
finResourcesRouter.use("/delete", deleteRouter);