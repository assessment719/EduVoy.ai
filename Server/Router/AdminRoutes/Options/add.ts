import Router from "express";
import moment from 'moment';
import { boardsOptionModel, unisOptionModel, moiOptionModel, facultiesOptionModel, intakesOptionModel, ugUniversityModel, pgUniversityModel } from "./../../../database";
import { adminAuth } from "./../../../Auth/admin";

export const addRouter = Router();

addRouter.post("/board", adminAuth, async function (req, res) {
    const { option } = req.body;

    const uniqueId = moment().unix() + Math.floor((Math.random() * 100) + 1);

    try {
        const boards = await boardsOptionModel.find();
        const ugUnis = await ugUniversityModel.find();
        const pgUnis = await pgUniversityModel.find();

        await boardsOptionModel.create({
            id : uniqueId, option
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
                            { [`academicReq.${uniqueId}`]: { $exists: false } },
                            { $set: { [`academicReq.${uniqueId}`]: academicRequirement } }
                        );
                    }

                    if (englishRequirement !== undefined) {
                        await ugUniversityModel.updateMany(
                            { [`englishReq.${uniqueId}`]: { $exists: false } },
                            { $set: { [`englishReq.${uniqueId}`]: englishRequirement } }
                        );
                    }

                    if (mathRequirement !== undefined) {
                        await ugUniversityModel.updateMany(
                            { [`mathReq.${uniqueId}`]: { $exists: false } },
                            { $set: { [`mathReq.${uniqueId}`]: mathRequirement } }
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
                            { [`englishReq.${uniqueId}`]: { $exists: false } },
                            { $set: { [`englishReq.${uniqueId}`]: englishRequirement } }
                        );
                    }

                    if (mathRequirement !== undefined) {
                        await pgUniversityModel.updateMany(
                            { [`mathReq.${uniqueId}`]: { $exists: false } },
                            { $set: { [`mathReq.${uniqueId}`]: mathRequirement } }
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
    const { option } = req.body;

    const uniqueId = moment().unix() + Math.floor((Math.random() * 100) + 1);

    try {
        const unis = await unisOptionModel.find();
        const pgUnis = await pgUniversityModel.find();

        await unisOptionModel.create({
            id : uniqueId, option
        });

        if (unis.length !== 0) {
            const otherUnisId = 1;

            if (pgUnis.length !== 0) {
                const otherUni = await pgUniversityModel.findOne({}, { [`academicReq.${otherUnisId}`]: 1 });

                if (otherUni && otherUni.academicReq && otherUni.academicReq[otherUnisId] !== undefined) {
                    const academicRequirement = otherUni.academicReq[otherUnisId];

                    await pgUniversityModel.updateMany(
                        { [`academicReq.${uniqueId}`]: { $exists: false } },
                        { $set: { [`academicReq.${uniqueId}`]: academicRequirement } }
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

    const { option } = req.body;

    const uniqueId = moment().unix() + Math.floor((Math.random() * 100) + 1);

    try {
        await moiOptionModel.create({
            id : uniqueId, option
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

    const { option } = req.body;

    const uniqueId = moment().unix() + Math.floor((Math.random() * 100) + 1);

    try {
        await facultiesOptionModel.create({
            id : uniqueId, option
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

    const { option } = req.body;

    const uniqueId = moment().unix() + Math.floor((Math.random() * 100) + 1);

    try {
        await intakesOptionModel.create({
            id : uniqueId, option
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