import Router from "express";
import { universityModel } from "../../../database";
import { addRouter } from "./add";
import { updateRouter } from "./update";
import { deleteRouter } from "./delete";
import { adminAuth } from "../../../Auth/admin";

export const finalUniversitiesRouter = Router();

finalUniversitiesRouter.get("/", adminAuth, async function (req, res) {

    try {
        const universities = await universityModel.find().sort({universityName: 1});

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

finalUniversitiesRouter.get("/:id", adminAuth, async function (req, res) {

    const id = parseInt(req.params.id);

    try {
        const university = await universityModel.findOne({ id });

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

finalUniversitiesRouter.use("/add", addRouter);
finalUniversitiesRouter.use("/update", updateRouter);
finalUniversitiesRouter.use("/delete", deleteRouter);