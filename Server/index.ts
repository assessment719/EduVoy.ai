import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { adminRouter } from "./Router/AdminRoutes/admin";
import { usersRouter } from "./Router/UserRoutes/users";
import * as dotenv from 'dotenv';
import './Router/UserRoutes/reminderMails'
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", function (req, res) {
    res.json({
        message: "Health Check Passed"
    });
});

app.use("/users", usersRouter);
app.use("/admin", adminRouter);

async function main() {
    await mongoose.connect(`${process.env.MONGODB_URL}`);
    console.log("Connected to MongoDB");

    app.listen(process.env.PORT || 2000, () => {
        console.log(`Server is running at http://localhost:${process.env.PORT || 2000}`);
    });
}

main();