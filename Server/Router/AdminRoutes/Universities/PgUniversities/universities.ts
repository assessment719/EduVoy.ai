import Router from "express";
import { addRouter } from "./add";
import { updateRouter } from "./update";
import { deleteRouter } from "./delete";
import { pgUniversityModel } from "./../../../../database";
import { adminAuth } from "./../../../../Auth/admin";

export const pgUniversityRouter = Router();

pgUniversityRouter.get("/", adminAuth, async function (req, res) {

    try {
        const pgUniversities = await pgUniversityModel.find().sort({universityName: 1});

        res.json({
            pgUniversities
        });
    } catch (error) {
        res.status(500).json({
            Message: "Error While Fetching",
            Error: `Error With Api: ${error}`
        });
    }
});

pgUniversityRouter.get("/:universityId", adminAuth, async function (req, res) {

    const universityId = parseInt(req.params.universityId);

    try {
        const pgUniversity = await pgUniversityModel.findOne({ universityId });

        res.json({
            pgUniversity
        });
    } catch (error) {
        res.status(500).json({
            Message: "Error While Fetching",
            Error: `Error With Api: ${error}`
        });
    }
});

pgUniversityRouter.use("/add", addRouter);
pgUniversityRouter.use("/update", updateRouter);
pgUniversityRouter.use("/delete", deleteRouter);