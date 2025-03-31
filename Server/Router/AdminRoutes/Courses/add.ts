import Router from "express";
import moment from 'moment';
import { courseModel } from "./../../../database";
import { adminAuth } from "./../../../Auth/admin";

export const addRouter = Router();

addRouter.post("/", adminAuth, async function (req, res) {

    const { universityId, courseName, courseType, universityName, campus, duration, fees, intakes, faculties, modeOfStudy, applicationFees, scholarship, courseModules, placementAvailability, carrer } = req.body;

    const uniqueId = moment().unix() + Math.floor((Math.random() * 100) + 1);

    try {
        await courseModel.create({
            id : uniqueId, universityId, courseName, courseType, universityName, campus, duration, fees, intakes, faculties, modeOfStudy, applicationFees, scholarship, courseModules, placementAvailability, carrer
        });

        res.json({
            Message: "You Have Added An Course"
        });
    } catch (error) {
        res.status(500).json({
            Message: "Error While Fetching",
            Error: `Error With Api: ${error}`
        });
    }
});