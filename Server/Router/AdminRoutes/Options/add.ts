import Router from "express";
import { boardsOptionModel } from "./../../../database";
import { unisOptionModel } from "./../../../database";
import { moiOptionModel } from "./../../../database";
import { facultiesOptionModel } from "./../../../database";
import { intakesOptionModel } from "./../../../database";
import { ugUniversityModel } from "./../../../database";
import { pgUniversityModel } from "./../../../database";
import { adminAuth } from "./../../../Auth/admin";

export const addRouter = Router();

addRouter.post("/board", adminAuth, async function (req, res) {
    const { id, option } = req.body;

    try {
        const boards = await boardsOptionModel.find();
        const ugUnis = await ugUniversityModel.find();
        const pgUnis = await pgUniversityModel.find();

        await boardsOptionModel.create({
            id, option
        });

        if (boards.length !== 0) {
            const otherBoardsId = 1;

            if (ugUnis.length !== 0) {
                const ugUni = await ugUniversityModel.findOne({}, { 
                    [`academicReq.${otherBoardsId}`]: 1, 
                    [`englishReq.${otherBoardsId}`]: 1, 
                    [`mathReq.${otherBoardsId}`]: 1 
                });

                if (ugUni) {
                    const academicRequirement = ugUni.academicReq?.[otherBoardsId];
                    const englishRequirement = ugUni.englishReq?.[otherBoardsId];
                    const mathRequirement = ugUni.mathReq?.[otherBoardsId];

                    if (academicRequirement !== undefined) {
                        await ugUniversityModel.updateMany(
                            { [`academicReq.${id}`]: { $exists: false } },
                            { $set: { [`academicReq.${id}`]: academicRequirement } }
                        );
                    }

                    if (englishRequirement !== undefined) {
                        await ugUniversityModel.updateMany(
                            { [`englishReq.${id}`]: { $exists: false } },
                            { $set: { [`englishReq.${id}`]: englishRequirement } }
                        );
                    }

                    if (mathRequirement !== undefined) {
                        await ugUniversityModel.updateMany(
                            { [`mathReq.${id}`]: { $exists: false } },
                            { $set: { [`mathReq.${id}`]: mathRequirement } }
                        );
                    }
                }
            }

            if (pgUnis.length !== 0) {
                const pgUni = await pgUniversityModel.findOne({}, { 
                    [`englishReq.${otherBoardsId}`]: 1, 
                    [`mathReq.${otherBoardsId}`]: 1 
                });

                if (pgUni) {
                    const englishRequirement = pgUni.englishReq?.[otherBoardsId];
                    const mathRequirement = pgUni.mathReq?.[otherBoardsId];

                    if (englishRequirement !== undefined) {
                        await pgUniversityModel.updateMany(
                            { [`englishReq.${id}`]: { $exists: false } },
                            { $set: { [`englishReq.${id}`]: englishRequirement } }
                        );
                    }

                    if (mathRequirement !== undefined) {
                        await pgUniversityModel.updateMany(
                            { [`mathReq.${id}`]: { $exists: false } },
                            { $set: { [`mathReq.${id}`]: mathRequirement } }
                        );
                    }
                }
            }
        }

        res.json({
            Message: "You Have Added A Board"
        });
    } catch (error) {
        res.status(500).json({
            Message: "Error While Fetching",
            Error: `Error With API: ${error}`
        });
    }
});

addRouter.post("/university", adminAuth, async function (req, res) {
    const { id, option } = req.body;

    try {
        const unis = await unisOptionModel.find();
        const pgUnis = await pgUniversityModel.find();

        await unisOptionModel.create({
            id, option
        });

        if (unis.length !== 0) {
            const otherUnisId = 1;

            if (pgUnis.length !== 0) {
                const otherUni = await pgUniversityModel.findOne({}, { [`academicReq.${otherUnisId}`]: 1 });

                if (otherUni && otherUni.academicReq && otherUni.academicReq[otherUnisId] !== undefined) {
                    const academicRequirement = otherUni.academicReq[otherUnisId];

                    await pgUniversityModel.updateMany(
                        { [`academicReq.${id}`]: { $exists: false } },
                        { $set: { [`academicReq.${id}`]: academicRequirement } }
                    );
                }
            }
        }

        res.json({
            Message: "You Have Added A University"
        });
    } catch (error) {
        res.status(500).json({
            Message: "Error While Fetching",
            Error: `Error With API: ${error}`
        });
    }
});

addRouter.post("/moiunis", adminAuth, async function (req, res) {

    const { id, option } = req.body;

    try {
        await moiOptionModel.create({
            id, option
        });

        res.json({
            Message: "You Have Added An University"
        });
    } catch (error) {
        res.status(500).json({
            Message: "Error While Fetching",
            Error: `Error With Api: ${error}`
        });
    }
});

addRouter.post("/faculty", adminAuth, async function (req, res) {

    const { id, option } = req.body;

    try {
        await facultiesOptionModel.create({
            id, option
        });

        res.json({
            Message: "You Have Added An Faculty"
        });
    } catch (error) {
        res.status(500).json({
            Message: "Error While Fetching",
            Error: `Error With Api: ${error}`
        });
    }
});

addRouter.post("/intake", adminAuth, async function (req, res) {

    const { id, option } = req.body;

    try {
        await intakesOptionModel.create({
            id, option
        });

        res.json({
            Message: "You Have Added An Intake"
        });
    } catch (error) {
        res.status(500).json({
            Message: "Error While Fetching",
            Error: `Error With Api: ${error}`
        });
    }
});