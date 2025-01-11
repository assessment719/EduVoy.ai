import Router from "express";
import { questionModel } from "./../../../database";
import { adminAuth } from "./../../../Auth/admin";

export const updateRouter = Router();

updateRouter.put("/", adminAuth, async function (req, res) {

  const { id, question, category, difficulty, expectedKeywords, evaluationPrompt } = req.body;

  try {
    await questionModel.updateOne({
      id
    }, {
      id, question, category, difficulty, expectedKeywords, evaluationPrompt
    });

    res.json({
      Message: "You Have Updated An Question"
    });
  } catch (error) {
    res.status(500).json({
      Message: "Error While Fetching",
      Error: `Error With Api: ${error}`
    });
  }
});