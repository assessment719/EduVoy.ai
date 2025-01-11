import Router from "express";
import { universityModel } from "./../../../database";
import { ugUniversityModel } from "./../../../database";
import { pgUniversityModel } from "./../../../database";
import { courseModel } from "./../../../database";
import { adminAuth } from "./../../../Auth/admin";

export const deleteRouter = Router();

deleteRouter.delete("/", adminAuth, async function (req, res) {

    const { id } = req.body;

    try {
        await universityModel.deleteOne({
            id
        });

        // To Delete UG University Requirement
        const ugUniversity = await ugUniversityModel.findOne({
            universityId: id
        });

        if (ugUniversity) {
            await ugUniversityModel.deleteOne({
                universityId: id
            });
        }

        // To Delete PG University Requirement
        const pgUniversity = await pgUniversityModel.findOne({
            universityId: id
        });

        if (pgUniversity) {
            await pgUniversityModel.deleteOne({
                universityId: id
            });
        }

        // To Delete Courses Of Deleting University
        const courses = await courseModel.findOne({
            universityId: id
        });

        if (courses) {
            await courseModel.deleteMany({
                universityId: id
            });
        }

        res.json({
            Message: "You Have Deleted An University",
        });
    } catch (error) {
        res.status(500).json({
            Message: "Error While Fetching",
            Error: `Error With Api: ${error}`
        });
    }
});