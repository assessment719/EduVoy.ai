import Router from "express";
import { ugUniversityModel } from "./../../../../database";
import { adminAuth } from "./../../../../Auth/admin";

export const updateRouter = Router();

updateRouter.put("/", adminAuth, async function (req, res) {

  const { universityId, universityName, academicReq, englishReq, ieltsReq, pteReq, toeflReq, duolingoReq, mathReq, placementCourses, topupCourses, fees, extraReqInfo } = req.body;

  try {
    await ugUniversityModel.updateOne({
      universityId
    }, {
      universityId, universityName, academicReq, englishReq, ieltsReq, pteReq, toeflReq, duolingoReq, mathReq, placementCourses, topupCourses, fees, extraReqInfo
    });

    res.json({
      Message: "You Have Updated An Undergraduate University"
    });
  } catch (error) {
    res.status(500).json({
      Message: "Error While Fetching",
      Error: `Error With Api: ${error}`
    });
  }
});