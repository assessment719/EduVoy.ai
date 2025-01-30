import Router from "express";
import { universityModel } from "../../../database";
import { addRouter } from "./add";
import { updateRouter } from "./update";
import { deleteRouter } from "./delete";
import { adminAuth } from "../../../Auth/admin";

export const finalUniversitiesRouter = Router();

finalUniversitiesRouter.get("/", adminAuth, async function (req, res) {
    const { search, skip, limit } = req.query;

    const query: Partial<{ universityName: any }> = {};
    if (search && search !== '') query.universityName = { $regex: search, $options: 'i' };

    try {
        const universities = await universityModel
            .find(query)
            .sort({ universityName: 1 })
            .skip(Number(skip))
            .limit(Number(limit));

        const count = await universityModel.countDocuments(query);

        res.json({
            data: { total: count, universities }
        });
    } catch (error) {
        res.status(500).json({
            Message: "Error While Fetching",
            Error: `Error With Api: ${error}`
        });
    }
});

finalUniversitiesRouter.get("/:id", adminAuth, async function (req, res) {

    const id = parseInt(req.params.id);

    try {
        const university = await universityModel.findOne({ id });

        res.json({
            university
        });
    } catch (error) {
        res.status(500).json({
            Message: "Error While Fetching",
            Error: `Error With Api: ${error}`
        });
    }
});

finalUniversitiesRouter.use("/add", addRouter);
finalUniversitiesRouter.use("/update", updateRouter);
finalUniversitiesRouter.use("/delete", deleteRouter);