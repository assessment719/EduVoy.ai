import Router from "express";
import { universityModel, userModel } from "./../../database";
import { userAuth } from "./../../Auth/user";
import { exit } from "process";

export const finalUniversitiesRouter = Router();

finalUniversitiesRouter.get("/", userAuth, async function (req, res) {

    const { search, skip, limit } = req.query;

    const query: Partial<{ universityName: any }> = {};
    if (search && search !== '') query.universityName = { $regex: search, $options: 'i' };

    try {
        const projection = {
            id: 1,
            universityName: 1,
            location: 1,
            logoLink: 1,
            universityWebsitePage: 1,
            universityCoursePage: 1
        }

        const universities = await universityModel
            .find(query, projection)
            .sort({ universityName: 1 })
            .skip(Number(skip))
            .limit(Number(limit));

        const count = await universityModel.countDocuments(query);

        res.json({
            data: { total: count, universities }
        });
    } catch (error) {
        res.status(500).json({
            Message: "Error While Fetching",
            Error: `Error With Api: ${error}`
        });
    }
});

finalUniversitiesRouter.get("/dreamUnis", userAuth, async function (req, res) {

    const { userId, skip, limit } = req.query;

    const response = await userModel.findOne({id: userId}, { dreamUnis: 1});

    try {
        const projection = {
            id: 1,
            universityName: 1,
            location: 1,
            logoLink: 1,
            universityWebsitePage: 1,
            universityCoursePage: 1
        }

        const universities = await universityModel
            .find({id: {$in: response?.dreamUnis }}, projection)
            .sort({ universityName: 1 })
            .skip(Number(skip))
            .limit(Number(limit));

        const count = await universityModel.countDocuments({id: {$in: response?.dreamUnis }});

        res.json({
            data: { total: count, universities }
        });
    } catch (error) {
        res.status(500).json({
            Message: "Error While Fetching",
            Error: `Error With Api: ${error}`
        });
    }
});