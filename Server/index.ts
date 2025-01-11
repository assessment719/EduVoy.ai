import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { adminRouter } from "./Router/AdminRoutes/admin";
import { usersRouter } from "./Router/UserRoutes/users";
import * as dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = 2000;

app.use(express.json());
app.use(cors());

app.use("/users", usersRouter);
app.use("/admin", adminRouter);

async function main() {
    await mongoose.connect(`${process.env.MONGODB_URL}`);
    console.log("Connected to MongoDB");

    app.listen(PORT, () => {
        console.log(`Server is running at http://localhost:${PORT}`);
    });
}

main();