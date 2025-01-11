import Router from "express";
import { pgUniversityRouter } from "./PgUniversities/universities";
import { ugUniversityRouter } from "./UgUniversities/universities";

export const universityRouter = Router();

universityRouter.use("/pguniversities", pgUniversityRouter);
universityRouter.use("/uguniversities", ugUniversityRouter);