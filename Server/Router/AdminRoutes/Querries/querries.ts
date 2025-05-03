import Router from "express";
import { querriesModel } from "./../../../database";
import { updateRouter } from "./update";
import { deleteRouter } from "./delete";
import { adminAuth } from "./../../../Auth/admin";

export const querriesRouter = Router();

querriesRouter.get("/", adminAuth, async function (req, res) {
    const { skip, limit } = req.query;

    try {
        const querries = await querriesModel
        .find()
        .sort({updatedAt: -1})
        .skip(Number(skip))
        .limit(Number(limit));

    const count = await querriesModel.countDocuments();

    res.json({
        data: { total: count, querries }
    });
    } catch (error) {
        res.status(500).json({
            Message: "Error While Fetching",
            Error: `Error With Api: ${error}`
        });
    }
});

querriesRouter.use("/update", updateRouter);
querriesRouter.use("/delete", deleteRouter);