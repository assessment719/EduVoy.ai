import Router from "express";
import { courseModel } from "./../../database";
import { userAuth } from "./../../Auth/user";

export const coursesRouter = Router();

coursesRouter.get("/", userAuth, async function (req, res) {
    const { universityId, courseType, intakes, facultyId } = req.query;

    const query: Partial<{ universityId: number; courseType: string; intakes: number; faculties: number }> = {};
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
            .sort({ universityName: 1, courseType: 1, courseName: 1 });

        res.json({
            courses,
        });
    } catch (error) {
        res.status(500).json({
            Message: "Error While Fetching",
            Error: `Error With Api: ${error}`,
        });
    }
});