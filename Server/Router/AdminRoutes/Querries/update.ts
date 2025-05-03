import Router from "express";
import { querriesModel } from "./../../../database";
import { adminAuth } from "./../../../Auth/admin";

export const updateRouter = Router();

updateRouter.put("/", adminAuth, async function (req, res) {

  const { id, answer } = req.body;

  try {
    await querriesModel.updateOne({
      id
    }, {
      status : "answered", answer, updatedAt : new Date()
    });

    res.json({
      Message: "You Have Updated An Review Video"
    });
  } catch (error) {
    res.status(500).json({
      Message: "Error While Fetching",
      Error: `Error With Api: ${error}`
    });
  }
});