import Router from "express";
import { pgUniversityModel } from "./../../../../database";
import { adminAuth } from "./../../../../Auth/admin";

export const addRouter = Router();

addRouter.post("/", adminAuth, async function (req, res) {

    const { universityId, universityName, academicReq, englishReq, moiUniversities, ieltsReq, pteReq, toeflReq, duolingoReq, mathReq, placementCourses, topupCourses, resCourses, fees, extraReqInfo } = req.body;

    try {
        await pgUniversityModel.create({
            universityId, universityName, academicReq, englishReq, moiUniversities, ieltsReq, pteReq, toeflReq, duolingoReq, mathReq, placementCourses, topupCourses, resCourses, fees, extraReqInfo
        });

        res.json({
            Message: "You Have Added An Postgraduate University"
        });
    } catch (error) {
        res.status(500).json({
            Message: "Error While Fetching",
            Error: `Error With Api: ${error}`
        });
    }
});