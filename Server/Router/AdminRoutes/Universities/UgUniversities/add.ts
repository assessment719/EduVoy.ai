import Router from "express";
import { ugUniversityModel } from "./../../../../database";
import { adminAuth } from "./../../../../Auth/admin";

export const addRouter = Router();

addRouter.post("/", adminAuth, async function (req, res) {

    const { universityId, universityName, academicReq, englishReq, ieltsReq, pteReq, toeflReq, duolingoReq, mathReq, placementCourses, topupCourses, fees, extraReqInfo } = req.body;

    try {
        await ugUniversityModel.create({
            universityId, universityName, academicReq, englishReq, ieltsReq, pteReq, toeflReq, duolingoReq, mathReq, placementCourses, topupCourses, fees, extraReqInfo
        });

        res.json({
            Message: "You Have Added An Undergraduate University"
        });
    } catch (error) {
        res.status(500).json({
            Message: "Error While Fetching",
            Error: `Error With Api: ${error}`
        });
    }
});