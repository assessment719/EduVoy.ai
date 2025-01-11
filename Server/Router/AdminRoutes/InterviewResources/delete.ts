import Router from "express";
import { resourceModel } from "./../../../database";
import { adminAuth } from "./../../../Auth/admin";

export const deleteRouter = Router();

deleteRouter.delete("/", adminAuth, async function (req, res) {

    const { id } = req.body;

    try {
        await resourceModel.deleteOne({
            id
        });

        const resources = await resourceModel.find().sort({ _id: 1 });

        const bulkOps = resources.map((resource, index) => ({
            updateOne: {
                filter: { _id: resource._id },
                update: { $set: { id: index + 1 } },
            },
        }));

        await resourceModel.bulkWrite(bulkOps);

        res.json({
            Message: "Question Deleted And All Question IDs Updated Sequentially",
        });
    } catch (error) {
        res.status(500).json({
            Message: "Error While Fetching",
            Error: `Error With Api: ${error}`
        });
    }
});