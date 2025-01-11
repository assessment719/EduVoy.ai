import Router from "express";
import { courseModel } from "./../../../database";
import { addRouter } from "./add";
import { updateRouter } from "./update";
import { deleteRouter } from "./delete";
import { adminAuth } from "./../../../Auth/admin";

export const coursesRouter = Router();

coursesRouter.get("/", adminAuth, async function (req, res) {
    const { universityId, courseType, intakes } = req.query;

    const query: Partial<{ universityId: number; courseType: string; intakes: number }> = {};
    if (universityId && Number(universityId) !== 0) query.universityId = Number(universityId);
    if (courseType && courseType !== 'all') query.courseType = courseType as string;
    if (intakes && Number(intakes) !== 0) query.intakes = Number(intakes);

    try {
        const courses = await courseModel
            .find(query)
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

coursesRouter.get("/:id", adminAuth, async function (req, res) {

    const id = parseInt(req.params.id);

    try {
        const course = await courseModel.findOne({ id });

        res.json({
            course
        });
    } catch (error) {
        res.status(500).json({
            Message: "Error While Fetching",
            Error: `Error With Api: ${error}`
        });
    }
});

coursesRouter.use("/add", addRouter);
coursesRouter.use("/update", updateRouter);
coursesRouter.use("/delete", deleteRouter);