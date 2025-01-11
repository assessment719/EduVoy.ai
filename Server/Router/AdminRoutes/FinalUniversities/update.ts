import Router from "express";
import { universityModel } from "./../../../database";
import { ugUniversityModel } from "./../../../database";
import { pgUniversityModel } from "./../../../database";
import { courseModel } from "./../../../database";
import { adminAuth } from "./../../../Auth/admin";

export const updateRouter = Router();

updateRouter.put("/", adminAuth, async function (req, res) {

  const { id, universityName, location, logoLink, universityWebsitePage, universityCoursePage } = req.body;

  try {
    await universityModel.updateOne({
      id
    }, {
      id, universityName, location, logoLink, universityWebsitePage, universityCoursePage
    });

    await ugUniversityModel.updateOne({
      universityId: id
    }, {
      universityName
    });

    await pgUniversityModel.updateOne({
      universityId: id
    }, {
      universityName
    });

    await courseModel.updateMany({
      universityId: id
    }, {
      universityName
    });

    res.json({
      Message: "You Have Updated An University"
    });
  } catch (error) {
    res.status(500).json({
      Message: "Error While Fetching",
      Error: `Error With Api: ${error}`
    });
  }
});