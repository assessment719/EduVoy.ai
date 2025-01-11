import Router from "express";
import Jwt from "jsonwebtoken";
import { z } from "zod";
import bcrypt from "bcrypt";
import { JWT_ADMIN_PASSWORD } from "./../../config";
import { adminAuth } from "./../../Auth/admin";
import { adminModel } from "../../database";
import { questionsRouter } from "./Questions/questions";
import { resourcesRouter } from "./InterviewResources/resources";
import { universityRouter } from "./Universities/universities";
import { coursesRouter } from "./Courses/courses";
import { finalUniversitiesRouter } from "./FinalUniversities/universities";
import { optionsRouter } from "./Options/options";

export const adminRouter = Router();

adminRouter.post("/signup", async (req, res) => {
    const requiredBody = z.object ({
        email: z.string().email(),
        password: z.string().min(5).max(20),
        firstName: z.string(),
        lastName: z.string()
    });

    const parsedBody = requiredBody.safeParse(req.body);

    if (!parsedBody.success) {
        res.status(500).json({
            Message: "Not Matching The Entry Crieteria",
            Error: parsedBody.error
        });
        return
    }

    const { email, password, firstName, lastName } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        await adminModel.create({
            email,
            password: hashedPassword,
            firstName,
            lastName
        });
    } catch (err) {
        res.status(500).json({
            Message: "Error While Sign Up",
            Error: err
        });
    }

    res.json({
        Message: "You Are Signed UP"
    });
});

adminRouter.post("/signin", async (req, res) => {
    const { email, password } = req.body;

    const admin = await adminModel.findOne({
        email: email
    });

    if (!admin) {
        res.status(500).json({
            Message: "Email Doesn't Exist"
        });
        return
    }

    const passwordMatch = await bcrypt.compare(password, admin.password);

    if (!JWT_ADMIN_PASSWORD) {
        res.status(500).json({
            Message: "Server configuration error: Missing JWT_SECRET"
        });
        return
    }

    if (admin && passwordMatch) {
        const token = Jwt.sign(
            { id: admin._id.toString() },
            JWT_ADMIN_PASSWORD,
            { expiresIn: '1d' }
        );

        res.json({
            token,
            firstName: admin.firstName,
            lastName: admin.lastName
        })
    } else {
        res.status(500).json({
            Message: "Invalid Credentials"
        })
    }
});

adminRouter.get("/authenticate", adminAuth, async (req, res) => {
    res.status(200).json({
        Message: "Authenticated"
    })
});

adminRouter.use("/questions", questionsRouter);
adminRouter.use("/resources", resourcesRouter);
adminRouter.use("/universities", universityRouter);
adminRouter.use("/courses", coursesRouter);
adminRouter.use("/finaluniversities", finalUniversitiesRouter);
adminRouter.use("/options", optionsRouter);