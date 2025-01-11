import Router from "express";
import { addRouter } from "./add";
import { updateRouter } from "./update";
import { deleteRouter } from "./delete";
import { ugUniversityModel } from "./../../../../database";
import { adminAuth } from "./../../../../Auth/admin";

export const ugUniversityRouter = Router();

ugUniversityRouter.get("/", adminAuth, async function (req, res) {

    try {
        const ugUniversities = await ugUniversityModel.find().sort({universityName: 1});

        res.json({
            ugUniversities
        });
    } catch (error) {
        res.status(500).json({
            Message: "Error While Fetching",
            Error: `Error With Api: ${error}`
        });
    }
});

ugUniversityRouter.get("/:universityId", adminAuth, async function (req, res) {

    const universityId = parseInt(req.params.universityId);

    try {
        const ugUniversity = await ugUniversityModel.findOne({ universityId });

        res.json({
            ugUniversity
        });
    } catch (error) {
        res.status(500).json({
            Message: "Error While Fetching",
            Error: `Error With Api: ${error}`
        });
    }
});

ugUniversityRouter.use("/add", addRouter);
ugUniversityRouter.use("/update", updateRouter);
ugUniversityRouter.use("/delete", deleteRouter);