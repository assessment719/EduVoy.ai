import Router from "express";
import { undergraduateRouter } from "./Universities/undergraduate";
import { postgraduateRouter } from "./Universities/postgraduate";

export const universitiesRouter = Router();

universitiesRouter.use("/undergraduate", undergraduateRouter);
universitiesRouter.use("/postgraduate", postgraduateRouter);