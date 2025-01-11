import Router from "express";
import { questionModel } from "./../../../database";
import { adminAuth } from "./../../../Auth/admin";

export const deleteRouter = Router();

deleteRouter.delete("/", adminAuth, async function (req, res) {

    const { id } = req.body;

    try {
        await questionModel.deleteOne({
            id
        });

        const questions = await questionModel.find().sort({ _id: 1 });

        const bulkOps = questions.map((question, index) => ({
            updateOne: {
                filter: { _id: question._id },
                update: { $set: { id: index + 1 } },
            },
        }));

        await questionModel.bulkWrite(bulkOps);

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