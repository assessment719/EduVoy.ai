import Router from "express";
import { universityModel } from "./../../database";
import { userAuth } from "./../../Auth/user";

export const finalUniversitiesRouter = Router();

finalUniversitiesRouter.get("/", userAuth, async function (req, res) {

    try {
        const universities = await universityModel.find().sort({ universityName: 1 });

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