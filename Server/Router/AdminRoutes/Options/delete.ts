import Router from "express";
import { boardsOptionModel, unisOptionModel, moiOptionModel, facultiesOptionModel, intakesOptionModel, ugUniversityModel, pgUniversityModel, courseModel } from "./../../../database";
import { adminAuth } from "./../../../Auth/admin";

export const deleteRouter = Router();

deleteRouter.delete("/board", adminAuth, async function (req, res) {

    const { id } = req.body;

    try {
        const ugUnis = await ugUniversityModel.find();
        const pgUnis = await pgUniversityModel.find();

        await boardsOptionModel.deleteOne({
            id
        });

        if (ugUnis.length !== 0) {

            // Update All UG University's Requirements
            await ugUniversityModel.updateMany(
                { [`academicReq.${id}`]: { $exists: true } },
                { $unset: { [`academicReq.${id}`]: "" } }
            );

            await ugUniversityModel.updateMany(
                { [`englishReq.${id}`]: { $exists: true } },
                { $unset: { [`academicReq.${id}`]: "" } }
            );

            await ugUniversityModel.updateMany(
                { [`mathReq.${id}`]: { $exists: true } },
                { $unset: { [`mathReq.${id}`]: "" } }
            );
        }

        if (pgUnis.length !== 0) {

            // Update All PG University's Requirements
            await pgUniversityModel.updateMany(
                { [`englishReq.${id}`]: { $exists: true } },
                { $unset: { [`englishReq.${id}`]: "" } }
            );

            await pgUniversityModel.updateMany(
                { [`mathReq.${id}`]: { $exists: true } },
                { $unset: { [`mathReq.${id}`]: "" } }
            );
        }

        res.json({
            Message: "You Have Deleted An Board",
        });
    } catch (error) {
        res.status(500).json({
            Message: "Error While Fetching",
            Error: `Error With Api: ${error}`
        });
    }
});

deleteRouter.delete("/university", adminAuth, async function (req, res) {

    const { id } = req.body;

    try {
        const pgUnis = await pgUniversityModel.find();

        await unisOptionModel.deleteOne({
            id
        });

        if (pgUnis.length !== 0) {

            // Update All PG University's Requirements
            await pgUniversityModel.updateMany(
                { [`academicReq.${id}`]: { $exists: true } },
                { $unset: { [`academicReq.${id}`]: "" } }
            );
        }

        res.json({
            Message: "You Have Deleted An University",
        });
    } catch (error) {
        res.status(500).json({
            Message: "Error While Fetching",
            Error: `Error With Api: ${error}`
        });
    }
});

deleteRouter.delete("/moiunis", adminAuth, async function (req, res) {

    const { id } = req.body;

    try {
        await moiOptionModel.deleteOne({
            id
        });

        await pgUniversityModel.updateMany(
            { moiUniversities: id },
            { $pull: { moiUniversities: id } }
        );

        res.json({
            Message: "You Have Deleted An University",
        });
    } catch (error) {
        res.status(500).json({
            Message: "Error While Fetching",
            Error: `Error With Api: ${error}`
        });
    }
});

deleteRouter.delete("/faculty", adminAuth, async function (req, res) {

    const { id } = req.body;

    try {
        await facultiesOptionModel.deleteOne({
            id
        });

        await courseModel.updateMany(
            { faculties: id },
            { $pull: { faculties: id } }
        );

        res.json({
            Message: "You Have Deleted An Faculty",
        });
    } catch (error) {
        res.status(500).json({
            Message: "Error While Fetching",
            Error: `Error With Api: ${error}`
        });
    }
});

deleteRouter.delete("/intake", adminAuth, async function (req, res) {

    const { id } = req.body;

    try {
        await intakesOptionModel.deleteOne({
            id
        });

        await courseModel.updateMany(
            { intakes: id },
            { $pull: { intakes: id } }
        );

        res.json({
            Message: "You Have Deleted An Intake",
        });
    } catch (error) {
        res.status(500).json({
            Message: "Error While Fetching",
            Error: `Error With Api: ${error}`
        });
    }
});