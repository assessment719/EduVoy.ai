import Router from "express";
import { universityModel } from "./../../../database";
import { adminAuth } from "./../../../Auth/admin";

export const addRouter = Router();

addRouter.post("/", adminAuth, async function (req, res) {

    const { id, universityName, location, logoLink, universityWebsitePage, universityCoursePage } = req.body;

    try {
        await universityModel.create({
            id, universityName, location, logoLink, universityWebsitePage, universityCoursePage
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