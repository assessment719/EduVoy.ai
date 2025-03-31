import Router from "express";
import { pgUniversityModel } from "./../../../../database";
import { adminAuth } from "./../../../../Auth/admin";

export const updateRouter = Router();

updateRouter.put("/", adminAuth, async function (req, res) {

  const { universityId, universityName, academicReq, englishReq, moiUniversities, ieltsReq, pteReq, toeflReq, duolingoReq, mathReq, placementCourses, topupCourses, resCourses, fees, extraReqInfo } = req.body;

  try {
    await pgUniversityModel.updateOne({
      universityId
    }, {
      universityName, academicReq, englishReq, moiUniversities, ieltsReq, pteReq, toeflReq, duolingoReq, mathReq, placementCourses, topupCourses, resCourses, fees, extraReqInfo
    });

    res.json({
      Message: "You Have Updated An Postgraduate University"
    });
  } catch (error) {
    res.status(500).json({
      Message: "Error While Fetching",
      Error: `Error With Api: ${error}`
    });
  }
});