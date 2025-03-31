import Router from "express";
import { userAuth } from "./../../../Auth/user";
import { ugUniversityModel } from "./../../../database";

export const undergraduateRouter = Router();

undergraduateRouter.get("/", userAuth, async function (req, res) {
    const {
        boardId,
        acadMarks,
        waiverMarks,
        mathMarks,
        courseType,
        fees,
        testName,
        overall,
        listening,
        reading,
        writing,
        speaking

    } = req.query;

    const query: { [key: string]: any } = {};

    // Query for academic requirements
    if (boardId && acadMarks) {
        query[`academicReq.${boardId}`] = { $lte: Number(acadMarks) };
    }

    // Query for waiver requirements
    if (waiverMarks) {
        query[`englishReq.${boardId}`] = { $lte: Number(waiverMarks) };
    }

    // Query for math requirements
    if (mathMarks) {
        query[`mathReq.${boardId}`] = { $lte: Number(mathMarks) };
    }
    
    // Query for fees
    if (fees) {
        query.fees = { $lte: Number(fees) };
    }

    // Query for course type availability
    if (courseType) {
        query[`${courseType}`] = "Yes";
    }

    // Query for english language tests
    if (testName && overall) {
        query[`${testName}.overall`] = { $lte: Number(overall) };
    }
    if (testName && listening) {
        query[`${testName}.listening`] = { $lte: Number(listening) };
    }
    if (testName && reading) {
        query[`${testName}.reading`] = { $lte: Number(reading) };
    }
    if (testName && writing) {
        query[`${testName}.writing`] = { $lte: Number(writing) };
    }
    if (testName && speaking) {
        query[`${testName}.speaking`] = { $lte: Number(speaking) };
    }

    try {
        const projection = {universityId: 1, universityName: 1}
        const universities = await ugUniversityModel
            .find(query, projection)
            .sort({ universityName: 1 });

        res.json({
            universities,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error While Fetching Universities",
            error: `Error With API: ${error}`,
        });
    }
});

undergraduateRouter.get("/assessment", userAuth, async function (req, res) {
    const {
        instituteId,
        academicMarks,
        boardId,
        waiverMarks,
        eltTest,
        overall,
        listning,
        reading,
        writing,
        speaking,
        mathBoardId,
        mathMarks
    } = req.query;

    const query: { [key: string]: any } = {};

    // Query for academic requirements
    if (instituteId && academicMarks) {
        query[`academicReq.${instituteId}`] = { $lte: Number(academicMarks) };
    }

    // Query for waiver requirements
    if (waiverMarks) {
        query[`englishReq.${boardId}`] = { $lte: Number(waiverMarks) };
    }

    // Query for math requirements
    if (mathMarks) {
        query[`mathReq.${mathBoardId}`] = { $lte: Number(mathMarks) };
    }

    // Query for english language tests
    if (eltTest && overall) {
        query[`${eltTest}.overall`] = { $lte: Number(overall) };
    }
    if (eltTest && listning) {
        query[`${eltTest}.listening`] = { $lte: Number(listning) };
    }
    if (eltTest && reading) {
        query[`${eltTest}.reading`] = { $lte: Number(reading) };
    }
    if (eltTest && writing) {
        query[`${eltTest}.writing`] = { $lte: Number(writing) };
    }
    if (eltTest && speaking) {
        query[`${eltTest}.speaking`] = { $lte: Number(speaking) };
    }

    try {
        let data: { result: string, universityIds: any[] } = {
            result: "",
            universityIds: []
        }
        let uniNames: string[] = []
        const projection = { universityId: 1, universityName: 1 }
        const universities = await ugUniversityModel
            .find(query, projection)
            .sort({ universityName: 1 });

        if (universities.length !== 0) {
            uniNames.push(...universities.map(obj => (obj.universityName)));
            data = {
                result: `You are elligible to apply in ${uniNames.join(", ")}.`,
                universityIds: universities
            }
        } else {
            data = {
                result: "Sorry! You are not eligible for any universities.",
                universityIds: []
            }
        }

        res.json({
            data
        });
    } catch (error) {
        res.status(500).json({
            message: "Error While Fetching Universities",
            error: `Error With API: ${error}`,
        });
    }
});

undergraduateRouter.get("/:queryField/:universityId", userAuth, async function (req, res) {

    const queryField = req.params.queryField;
    const universityId = parseInt(req.params.universityId);

    try {
        const projection: { [key: string]: number } = {};
        projection[queryField] = 1
        projection.extraReqInfo = 1
        
        const university = await ugUniversityModel.findOne({ universityId }, projection);

        res.json({
            university
        });
    } catch (error) {
        res.status(500).json({
            Message: "Error While Fetching",
            Error: `Error With Api: ${error}`
        });
    }
});