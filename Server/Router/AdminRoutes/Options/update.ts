import Router from "express";
import { boardsOptionModel } from "./../../../database";
import { unisOptionModel } from "./../../../database";
import { moiOptionModel } from "./../../../database";
import { facultiesOptionModel } from "./../../../database";
import { intakesOptionModel } from "./../../../database";
import { adminAuth } from "./../../../Auth/admin";

export const updateRouter = Router();

updateRouter.put("/board", adminAuth, async function (req, res) {

  const { id, option } = req.body;

  try {
    await boardsOptionModel.updateOne({
      id
    }, {
      id, option
    });

    res.json({
      Message: "You Have Updated An Board"
    });
  } catch (error) {
    res.status(500).json({
      Message: "Error While Fetching",
      Error: `Error With Api: ${error}`
    });
  }
});

updateRouter.put("/university", adminAuth, async function (req, res) {

  const { id, option } = req.body;

  try {
    await unisOptionModel.updateOne({
      id
    }, {
      id, option
    });

    res.json({
      Message: "You Have Updated An Board"
    });
  } catch (error) {
    res.status(500).json({
      Message: "Error While Fetching",
      Error: `Error With Api: ${error}`
    });
  }
});

updateRouter.put("/moiunis", adminAuth, async function (req, res) {

  const { id, option } = req.body;

  try {
    await moiOptionModel.updateOne({
      id
    }, {
      id, option
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

updateRouter.put("/faculty", adminAuth, async function (req, res) {

  const { id, option } = req.body;

  try {
    await facultiesOptionModel.updateOne({
      id
    }, {
      id, option
    });

    res.json({
      Message: "You Have Updated An Faculty"
    });
  } catch (error) {
    res.status(500).json({
      Message: "Error While Fetching",
      Error: `Error With Api: ${error}`
    });
  }
});

updateRouter.put("/intake", adminAuth, async function (req, res) {

  const { id, option } = req.body;

  try {
    await intakesOptionModel.updateOne({
      id
    }, {
      id, option
    });

    res.json({
      Message: "You Have Updated An Intake"
    });
  } catch (error) {
    res.status(500).json({
      Message: "Error While Fetching",
      Error: `Error With Api: ${error}`
    });
  }
});