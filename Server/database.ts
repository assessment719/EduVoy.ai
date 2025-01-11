import mongoose from "mongoose";
import { boolean } from "zod";

const Schema = mongoose.Schema;

const user = new Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true }
});

const admin = new Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true }
});

const question = new Schema({
    id: { type: Number, unique: true, required: true },
    question: { type: String, required: true },
    category: { type: String, required: true },
    difficulty: { type: String, required: true },
    expectedKeywords: { type: String, required: true },
    evaluationPrompt: { type: String, required: true }
});

const resource = new Schema({
    id: { type: Number, unique: true, required: true },
    title: { type: String, unique: true, required: true },
    type: { type: String, required: true },
    category: { type: String, required: true },
    downloadUrl: { type: String, unique: true, required: true }
});

const uguniversity = new Schema({
    universityId: { type: Number, unique: true, required: true },
    universityName: { type: String, unique: true, required: true },
    academicReq: { type: Object, required: true },
    englishReq: { type: Object, required: true },
    ieltsReq: { type: Object, required: true },
    pteReq: { type: Object, required: true },
    toeflReq: { type: Object, required: true },
    duolingoReq: { type: Object, required: true },
    mathReq: { type: Object, required: true },
    placementCourses: { type: String, required: true },
    topupCourses: { type: String, required: true },
    fees: { type: Number, required: true },
    extraReqInfo: { type: String, required: true },
});

const pguniversity = new Schema({
    universityId: { type: Number, unique: true, required: true },
    universityName: { type: String, unique: true, required: true },
    academicReq: { type: Object, required: true },
    englishReq: { type: Object, required: true },
    moiUniversities: { type: [Number], required: true },
    ieltsReq: { type: Object, required: true },
    pteReq: { type: Object, required: true },
    toeflReq: { type: Object, required: true },
    duolingoReq: { type: Object, required: true },
    mathReq: { type: Object, required: true },
    placementCourses: { type: String, required: true },
    topupCourses: { type: String, required: true },
    resCourses: { type: String, required: true },
    fees: { type: Number, required: true },
    extraReqInfo: { type: String, required: true }
});

const course = new Schema({
    id: { type: Number, unique: true, required: true },
    universityId: { type: Number, required: true },
    courseName: { type: String, required: true },
    courseType: { type: String, required: true },
    universityName: { type: String, required: true },
    campus: { type: String, required: true },
    duration: { type: String, required: true },
    fees: { type: Number, required: true },
    intakes: { type: [Number], required: true },
    faculties: { type: [Number], required: true }
});

const universities = new Schema({
    id: { type: Number, unique: true, required: true },
    universityName: { type: String, unique: true, required: true },
    location: { type: String, required: true },
    logoLink: { type: String, unique: true, required: true },
    universityWebsitePage: { type: String, unique: true, required: true },
    universityCoursePage: { type: String, unique: true, required: true }
});

const boardsoption = new Schema({
    id: { type: Number, unique: true, required: true },
    option: { type: String, unique: true, required: true }
});

const unioption = new Schema({
    id: { type: Number, unique: true, required: true },
    option: { type: String, unique: true, required: true }
});

const facultiesoption = new Schema({
    id: { type: Number, unique: true, required: true },
    option: { type: String, unique: true, required: true }
});

const intakeoption = new Schema({
    id: { type: Number, unique: true, required: true },
    option: { type: String, unique: true, required: true }
});

const moioption = new Schema({
    id: { type: Number, unique: true, required: true },
    option: { type: String, unique: true, required: true }
});

export const userModel = mongoose.model("users", user);
export const adminModel = mongoose.model("admins", admin);
export const questionModel = mongoose.model("questions", question);
export const resourceModel = mongoose.model("resources", resource);
export const ugUniversityModel = mongoose.model("uguniversities", uguniversity);
export const pgUniversityModel = mongoose.model("pguniversities", pguniversity);
export const courseModel = mongoose.model("courses", course);
export const universityModel = mongoose.model("universities", universities);
export const boardsOptionModel = mongoose.model("boardsoptions", boardsoption);
export const unisOptionModel = mongoose.model("unisoptions", unioption);
export const moiOptionModel = mongoose.model("moioptions", moioption);
export const facultiesOptionModel = mongoose.model("facultiesoptions", facultiesoption);
export const intakesOptionModel = mongoose.model("intakeoptions", intakeoption);