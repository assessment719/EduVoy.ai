import Router from "express";
import moment from 'moment';
import { querriesModel } from "./../../database";

export const querriesRouter = Router();

querriesRouter.post("/", async function (req, res) {

    const { fullName, email, phoneNo, subject, message } = req.body;

    const uniqueId = moment().unix() + Math.floor((Math.random() * 100) + 1);

    try {
        await querriesModel.create({
            id : uniqueId, fullName, email, phoneNo, subject, message, status : "notAnswered", answer : "", createdAt : new Date(), updatedAt : new Date()
        });

        res.json({
            Message: "You Have Added An Query"
        });
    } catch (error) {
        res.status(500).json({
            Message: "Error While Fetching",
            Error: `Error With Api: ${error}`
        });
    }
});