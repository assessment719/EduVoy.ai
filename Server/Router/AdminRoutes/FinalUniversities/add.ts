import Router from "express";
import moment from 'moment';
import { universityModel } from "./../../../database";
import { adminAuth } from "./../../../Auth/admin";

export const addRouter = Router();

addRouter.post("/", adminAuth, async function (req, res) {

    const { universityName, location, logoLink, universityWebsitePage, universityCoursePage, globalRanking, accreditation, tutionFees, scholarships, researchFacilities, jobPlacementRate, livingCost, averageSalary, studentReview } = req.body;

    const uniqueId = moment().unix() + Math.floor((Math.random() * 100) + 1);

    try {
        await universityModel.create({
            id : uniqueId, universityName, location, logoLink, universityWebsitePage, universityCoursePage, globalRanking, accreditation, tutionFees, scholarships, researchFacilities, jobPlacementRate, livingCost, averageSalary, studentReview
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