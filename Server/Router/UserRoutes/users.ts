import Router from "express";
import Jwt from "jsonwebtoken";
import { z } from "zod";
import bcrypt from "bcrypt";
import { JWT_USER_PASSWORD } from "./../../config";
import { userAuth } from "../../Auth/user";
import { userModel } from "../../database";
import { questionsRouter } from "./questions";
import { resourcesRouter } from "./resources";
import { universitiesRouter } from "./universities";
import { coursesRouter } from "./courses";
import { analysationRouter } from "./OpenAI/analysation";
import { sopRouter } from "./OpenAI/sop";
import { facultiesRouter } from "./OpenAI/faculties";
import { finalUniversitiesRouter } from "./ukuniversities";
import { optionsRouter } from './options'

export const usersRouter = Router();

usersRouter.post("/signup", async (req, res) => {
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
        await userModel.create({
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

usersRouter.post("/signin", async (req, res) => {
    const { email, password } = req.body;

    const user = await userModel.findOne({
        email: email
    });

    if (!user) {
        res.status(500).json({
            Message: "Email Doesn't Exist"
        });
        return
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!JWT_USER_PASSWORD) {
        res.status(500).json({
            Message: "Server configuration error: Missing JWT_SECRET"
        });
        return
    }

    if (user && passwordMatch) {
        const token = Jwt.sign(
            { id: user._id.toString() },
            JWT_USER_PASSWORD,
            { expiresIn: '1d' }
        );

        res.json({
            token,
            firstName: user.firstName,
            lastName: user.lastName
        })
    } else {
        res.status(500).json({
            Message: "Invalid Credentials"
        })
    }

});

usersRouter.get("/authenticate", userAuth, async (req, res) => {
    res.status(200).json({
        Message: "Authenticated"
    })
});

usersRouter.use("/questions", questionsRouter);
usersRouter.use("/resources", resourcesRouter);
usersRouter.use("/universities", universitiesRouter);
usersRouter.use("/courses", coursesRouter);
usersRouter.use("/finaluniversities", finalUniversitiesRouter);
usersRouter.use("/options", optionsRouter);
usersRouter.use("/openai/analysation", analysationRouter);
usersRouter.use("/openai/sop", sopRouter);
usersRouter.use("/openai/faculties", facultiesRouter);