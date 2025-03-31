import mongoose from "mongoose";
import type { features } from "process";
import { number } from "zod";

const Schema = mongoose.Schema;

const expensesSchema = new Schema({
    courseFees: {
        tuitionFees: { type: Number, default: 0 },
        books: { type: Number, default: 0 },
        research: { type: Number, default: 0 }
    },
    livingExpenses: {
        accommodation: { type: Number, default: 0 },
        food: { type: Number, default: 0 },
        transport: { type: Number, default: 0 },
        utilities: { type: Number, default: 0 },
        personal: { type: Number, default: 0 }
    },
    travelExp: {
        visaFees: { type: Number, default: 0 },
        flightCosts: { type: Number, default: 0 }
    },
    healthExp: {
        healthInsurance: { type: Number, default: 0 },
        biometricExp: { type: Number, default: 0 },
        tbTestExp: { type: Number, default: 0 },
        healthSurcharge: { type: Number, default: 0 }
    }
})

const incomesSchema = new Schema({
    income: {
        partTimeWork: { type: Number, default: 0 },
        familySupport: { type: Number, default: 0 },
        personalSavings: { type: Number, default: 0 },
        other: { type: Number, default: 0 }
    },
    savingsGoal: { type: Number, default: 0 },
    emergencyFund: { type: Number, default: 0 }
})

const loanSchema = new Schema({
    amount: { type: Number, default: 0 },
    interestRate: { type: Number, default: 0 },
    termYears: { type: Number, default: 0 }
})

// Default Expenses Object
const defaultExpenses = {
    courseFees: {
        tuitionFees: 0,
        books: 0,
        research: 0
    },
    livingExpenses: {
        accommodation: 0,
        food: 0,
        transport: 0,
        utilities: 0,
        personal: 0
    },
    travelExp: {
        visaFees: 0,
        flightCosts: 0
    },
    healthExp: {
        healthInsurance: 0,
        biometricExp: 0,
        tbTestExp: 0,
        healthSurcharge: 0
    }
};

// Default Incomes Object
const defaultIncomes = {
    income: {
        partTimeWork: 0,
        familySupport: 0,
        personalSavings: 0,
        other: 0
    },
    savingsGoal: 0,
    emergencyFund: 0
};

// Default Loan Object
const defaultLoan = {
    amount: 0,
    interestRate: 0,
    termYears: 0
};

const user = new Schema({
    id: { type: Number, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dreamUnis: { type: [Number], default: [] },
    dreamCourses: { type: [Number], default: [] },
    expenses: { type: expensesSchema, default: defaultExpenses },
    incomes: { type: incomesSchema, default: defaultIncomes },
    loan: { type: loanSchema, default: defaultLoan },
    scholarships: { type: [Number], default: [] },
    loans: { type: [Number], default: [] },
    jobs: { type: [Number], default: [] }
});

const admin = new Schema({
    id: { type: Number, unique: true, required: true },
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
    faculties: { type: [Number], required: true },
    modeOfStudy: { type: String, required: true },
    applicationFees: { type: Number, required: true },
    scholarship: { type: String, required: true },
    courseModules: { type: String, required: true },
    placementAvailability: { type: String, required: true },
    carrer: { type: String, required: true }
});

const universities = new Schema({
    id: { type: Number, unique: true, required: true },
    universityName: { type: String, unique: true, required: true },
    location: { type: String, required: true },
    logoLink: { type: String, unique: true, required: true },
    universityWebsitePage: { type: String, unique: true, required: true },
    universityCoursePage: { type: String, unique: true, required: true },
    globalRanking: { type: String, unique: true, required: true },
    accreditation: { type: String, unique: true, required: true },
    tutionFees: { type: String, unique: true, required: true },
    scholarships: { type: String, unique: true, required: true },
    researchFacilities: { type: String, unique: true, required: true },
    jobPlacementRate: { type: String, unique: true, required: true },
    livingCost: { type: String, unique: true, required: true },
    averageSalary: { type: String, unique: true, required: true },
    studentReview: { type: String, unique: true, required: true }
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

const scholarship = new Schema({
    id: { type: Number, unique: true, required: true },
    title: { type: String, required: true },
    provider: { type: String, required: true },
    type: { type: String, required: true },
    amount: { type: String, required: true },
    deadline: { type: String, required: true },
    eligibilities: { type: [String], required: true, default: [] },
    requirements: { type: [String], required: true, default: [] },
    faculties: { type: [String], required: true },
    link: { type: String, required: true }
})

const loan = new Schema({
    id: { type: Number, unique: true, required: true },
    title: { type: String, required: true },
    bankName: { type: String, required: true },
    interestRate: { type: String, required: true },
    maxAmount: { type: String, required: true },
    collateral: { type: String, required: true },
    features: { type: [String], required: true, default: [] },
    eligibility: { type: [String], required: true, default: [] },
    tenure: { type: String, required: true },
    processingFee: { type: String, required: true },
    link: { type: String, required: true }
})

const job = new Schema({
    id: { type: Number, unique: true, required: true },
    title: { type: String, required: true },
    avgHourlyRate: { type: String, required: true },
    hoursPerWeek: { type: String, required: true },
    locations: { type: [String], required: true, default: [] },
    requirements: { type: [String], required: true, default: [] },
    benefits: { type: [String], required: true, default: [] },
    tips: { type: String, required: true }
})

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
export const scholarshipModel = mongoose.model("scholarships", scholarship);
export const loanModel = mongoose.model("loans", loan);
export const jobModel = mongoose.model("jobs", job);