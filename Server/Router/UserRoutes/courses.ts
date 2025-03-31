import Router from "express";
import { courseModel, userModel } from "./../../database";
import { userAuth } from "./../../Auth/user";

export const coursesRouter = Router();

coursesRouter.get("/", userAuth, async function (req, res) {
    const { search, universityId, courseType, intakes, facultyId, skip, limit } = req.query;

    const query: Partial<{ courseName: any, universityId: number; courseType: string; intakes: number; faculties: number }> = {};
    if (search && search !== '') query.courseName = { $regex: search, $options: 'i' };
    if (universityId && Number(universityId) !== 0) query.universityId = Number(universityId);
    if (courseType && courseType !== 'all') query.courseType = courseType as string;
    if (intakes && Number(intakes) !== 0) query.intakes = Number(intakes);
    if (facultyId && Number(facultyId) !== 0) query.faculties = Number(facultyId);

    try {
        const projection = {
            id: 1,
            universityId: 1,
            courseName: 1,
            courseType: 1,
            universityName: 1,
            campus: 1,
            duration: 1,
            fees: 1,
            intakes: 1
        }
        const courses = await courseModel
            .find(query, projection)
            .sort({ universityName: 1, courseType: 1, courseName: 1 })
            .skip(Number(skip))
            .limit(Number(limit));

        const count = await courseModel.countDocuments(query);

        res.json({
            data: { total: count, courses }
        });
    } catch (error) {
        res.status(500).json({
            Message: "Error While Fetching",
            Error: `Error With Api: ${error}`,
        });
    }
});

coursesRouter.get("/assessment", userAuth, async function (req, res) {
    const { universityIds, universityId, courseType, intakes, facultyId } = req.query;

    const query: Partial<{ courseName: any, universityId: any; courseType: string; intakes: number; faculties: number }> = {};

    if (universityIds) {
        if (typeof universityIds === 'string') {
            query.universityId = { $in: universityIds.split(',').map(id => Number(id)) };
        }
    }
    if (universityId) query.universityId = Number(universityId);
    if (courseType) query.courseType = courseType as string;
    if (intakes && Number(intakes) !== 0) query.intakes = Number(intakes);
    if (facultyId && Number(facultyId) !== 0) query.faculties = Number(facultyId);

    try {
        let eligibleCourses: string[] = []
        let result: string = "";
        const projection = {
            courseName: 1,
            universityName: 1,
        }
        const courses = await courseModel
            .find(query, projection)
            .sort({ universityName: 1, courseType: 1, courseName: 1 })

        if (courses.length === 0) {
            result = "Sorry! There are no courses that matches your qualification."
        } else if (courses.length === 1) {
            result = `You are eligible to apply in ${courses[0].courseName} - ${courses[0].universityName}.`
        } else {
            eligibleCourses.push(...courses.map(obj => (`${courses[0].courseName} - ${courses[0].universityName}`)));
            result = `You are elligible to apply in these courses ${eligibleCourses.join(", ")}.`
        }

        res.json({
            result
        });
    } catch (error) {
        res.status(500).json({
            Message: "Error While Fetching",
            Error: `Error With Api: ${error}`,
        });
    }
});

coursesRouter.get("/dreamCourses", userAuth, async function (req, res) {

    const { userId, courseType, skip, limit } = req.query;

    const response = await userModel.findOne({ id: userId }, { dreamCourses: 1 });

    try {
        const projection = {
            id: 1,
            universityId: 1,
            courseName: 1,
            courseType: 1,
            universityName: 1,
            campus: 1,
            duration: 1,
            fees: 1,
            intakes: 1
        }

        const courses = await courseModel
            .find({ id: { $in: response?.dreamCourses }, courseType: courseType }, projection)
            .sort({ universityName: 1, courseName: 1 })
            .skip(Number(skip))
            .limit(Number(limit));

        const count = await courseModel.countDocuments({ id: { $in: response?.dreamCourses }, courseType: courseType });

        res.json({
            data: { total: count, courses }
        });
    } catch (error) {
        res.status(500).json({
            Message: "Error While Fetching",
            Error: `Error With Api: ${error}`
        });
    }
});