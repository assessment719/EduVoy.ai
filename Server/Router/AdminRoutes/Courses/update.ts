import Router from "express";
import { courseModel } from "./../../../database";
import { adminAuth } from "./../../../Auth/admin";

export const updateRouter = Router();

updateRouter.put("/", adminAuth, async function (req, res) {

  const { id, universityId, courseName, courseType, universityName, campus, duration, fees, intakes, faculties, modeOfStudy, applicationFees, scholarship, courseModules, placementAvailability, carrer } = req.body;

  try {
    await courseModel.updateOne({
      id
    }, {
      id, universityId, courseName, courseType, universityName, campus, duration, fees, intakes, faculties, modeOfStudy, applicationFees, scholarship, courseModules, placementAvailability, carrer
    });

    res.json({
      Message: "You Have Updated An Course"
    });
  } catch (error) {
    res.status(500).json({
      Message: "Error While Fetching",
      Error: `Error With Api: ${error}`
    });
  }
});