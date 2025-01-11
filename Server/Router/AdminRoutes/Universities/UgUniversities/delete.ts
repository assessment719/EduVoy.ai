import Router from "express";
import { ugUniversityModel } from "./../../../../database";
import { universityModel } from "./../../../../database";
import { adminAuth } from "./../../../../Auth/admin";

export const deleteRouter = Router();

deleteRouter.delete("/", adminAuth, async function (req, res) {

    const { universityId } = req.body;

    try {
        const foundUniversity = await universityModel.findOne({
            universityId
        });

        if (!foundUniversity) {
            try {
                await ugUniversityModel.deleteOne({
                    universityId
                });
        
                res.json({
                    Message: "You Have Deleted An Undergraduate University",
                });
            } catch (error) {
                res.status(500).json({
                    Message: "Error While Fetching",
                    Error: `Error With Api: ${error}`
                });
            }
        } else {
            res.json({
                Message: "The University Requirements Can't Be Deleted"
            });
        }
    } catch (error) {
        res.status(500).json({
            Message: "Error While Fetching",
            Error: `Error With Api: ${error}`
        });
    }
});