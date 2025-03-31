import Router from "express";
import moment from 'moment';
import Jwt from "jsonwebtoken";
import { z } from "zod";
import bcrypt from "bcrypt";
import { JWT_USER_PASSWORD } from "./../../config";
import { userAuth } from "../../Auth/user";
import { userModel } from "../../database";
import { questionsRouter } from "./questions";
import { resourcesRouter } from "./resources";
import { finResourcesRouter } from './financialResources';
import { universitiesRouter } from "./universities";
import { coursesRouter } from "./courses";
import { analysationRouter } from "./OpenAI/analysation";
import { sopRouter } from "./OpenAI/sop";
import { facultiesRouter } from "./OpenAI/faculties";
import { finalUniversitiesRouter } from "./ukuniversities";
import { optionsRouter } from './options';
import { chatRouter } from "./OpenAI/chat";
import { manualCompRouter } from "./OpenAI/manualComparision";

export const usersRouter = Router();

usersRouter.post("/signup", async (req, res) => {
    const requiredBody = z.object({
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

    const uniqueId = moment().unix() + Math.floor((Math.random() * 100) + 1);

    try {
        await userModel.create({
            id: uniqueId,
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
            userId: user.id,
            firstName: user.firstName,
            lastName: user.lastName
        })
    } else {
        res.status(500).json({
            Message: "Invalid Credentials"
        })
    }

});

usersRouter.get("/getField/:queryField/:userId", userAuth, async function (req, res) {
    const queryField = req.params.queryField;
    const id = parseInt(req.params.userId);

    try {
        const fieldDetails = await userModel.findOne({ id }, { [queryField] : 1 });

        res.json({
            fieldDetails
        });
    } catch (error) {
        res.status(500).json({
            Message: "Error While Fetching",
            Error: `Error With Api: ${error}`
        });
    }
});

usersRouter.put("/updateField/:queryField/:userId", userAuth, async (req, res) => {
    const queryField = req.params.queryField;
    const id = parseInt(req.params.userId);
    const { updatingField } = req.body;

    try {
        await userModel.updateOne({
            id
        }, {
            $set : updatingField
        });

        res.json({
            Message: "You Have Updated An Field"
        });
    } catch (error) {
        res.status(500).json({
            Message: "Error While Fetching",
            Error: `Error With Api: ${error}`
        });
    }
});

usersRouter.get("/authenticate", userAuth, async (req, res) => {
    res.status(200).json({
        Message: "Authenticated"
    })
});

usersRouter.use("/questions", questionsRouter);
usersRouter.use("/resources", resourcesRouter);
usersRouter.use("/finResources", finResourcesRouter);
usersRouter.use("/universities", universitiesRouter);
usersRouter.use("/courses", coursesRouter);
usersRouter.use("/finaluniversities", finalUniversitiesRouter);
usersRouter.use("/options", optionsRouter);
usersRouter.use("/openai/analysation", analysationRouter);
usersRouter.use("/openai/sop", sopRouter);
usersRouter.use("/openai/faculties", facultiesRouter);
usersRouter.use("/openai/chat", chatRouter);
usersRouter.use("/openai/manual", manualCompRouter);