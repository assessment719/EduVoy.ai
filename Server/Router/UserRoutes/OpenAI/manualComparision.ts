import Router from "express";
import { OpenAI } from 'openai';
import { OPENAI_API } from "../../../config";
import { userAuth } from "../../../Auth/user";
import { universityModel, courseModel } from "../../../database";
import { University, Course } from "./../../../interfaces";

export const manualCompRouter = Router();

const openai = new OpenAI({
    apiKey: OPENAI_API,
    dangerouslyAllowBrowser: true,
});

manualCompRouter.get("/university", userAuth, async (req, res) => {
    const { uniId1, uniId2 } = req.query;

    const projection = {
        id: 1,
        universityName: 1,
        globalRanking: 1,
        accreditation: 1,
        tutionFees: 1,
        scholarships: 1,
        researchFacilities: 1,
        location: 1,
        livingCost: 1,
        jobPlacementRate: 1,
        averageSalary: 1,
        studentReview: 1
    }

    const universityData = await universityModel.find({ id: { $in: [`${uniId1}`, `${uniId2}`] } }, projection);

    const featureValues = ['Global Ranking', 'Accreditation', 'Tuition Fees', 'Scholarships', 'Research Facilities', 'Location', 'Living Costs / Year', 'Job Placement Rate', 'Average Graduate Salary', 'Student Reviews & Ratings'];

    const featureTags = ['globalRanking', 'accreditation', 'tutionFees', 'scholarships', 'researchFacilities', 'location', 'livingCost', 'jobPlacementRate', 'averageSalary', 'studentReview'];

    let comparisionResult: any[] = [];
    const university1 = universityData[0] as University;
    const university2 = universityData[1] as University;

    featureValues.forEach((feature, index) => {
        comparisionResult.push({
            featureTitle: feature,
            uni1: { value: university1[featureTags[index] as keyof University], result: 'Imperfect' },
            uni2: { value: university2[featureTags[index] as keyof University], result: 'Imperfect' }
        });
    });

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                { role: "system", content: "You Are A Study Abroad Advisor. Who Helps Student's To Choose One Best University Between Two Universities By Comparing Different Aspects And Rankings Of Those Universities." },
                {
                    role: "user", content: `The Universities You Have To Compare Are ${university1.universityName} And ${university2.universityName}. ${JSON.stringify(comparisionResult)} - This Is All Aspects To Compare Them Without Changing The Feature Titles And Feature Values Of Any University, Only Modify The Result Value And Strictly Maintain This Rule. If You Think Global Ranking Of uni1 Is Better Than uni2 Then Change The result To "Perfect" for uni1. Example:
                {
                    "featureTitle": "Global Ranking",
                    "uni1": {
                        "value": "50",
                        "result": "Perfect"
                    },
                    "uni2": {
                        "value": "80",
                        "result": "Imperfect"
                    }
                }. After All The Evaluation Strictly Provide Feedback Only In The Exact Given comparisionResult - Array Format And Don't Include Any Extra Words Or Line As I have To Parse It Into JSON.` },
            ],
        });

        const content = completion.choices[0]?.message?.content;

        const fixedContent = (content as string).replace(/'/g, '"');

        const finalComparisionResult = JSON.parse(fixedContent);

        res.json({
            finalComparisionResult
        });
    } catch (error) {
        console.log(`Error With Api: ${error}`);
        res.json({
            Message: "Sorry, there was an error while replying. Please try again.",
        });
    }
});

manualCompRouter.get("/course", userAuth, async (req, res) => {
    const { courseId1, courseId2 } = req.query;

    const projection = {
        id: 1,
        courseName: 1,
        universityName: 1,
        duration: 1,
        modeOfStudy: 1,
        applicationFees: 1,
        fees: 1,
        scholarship: 1,
        courseModules: 1,
        placementAvailability: 1,
        carrer: 1
    }

    const courseData = await courseModel.find({ id: { $in: [`${courseId1}`, `${courseId2}`] } }, projection);

    const featureValues = ['University Name', 'Course Duration', 'Mode of Study', 'Application Fees', 'Course Fees', 'Scholarships & Financial Aid', 'Course Modules', 'Internship/Work Placement', 'Career Paths & Job Roles'];

    const featureTags = ['universityName', 'duration', 'modeOfStudy', 'applicationFees', 'fees', 'scholarship', 'courseModules', 'placementAvailability', 'carrer'];

    let comparisionResult: any[] = [];
    const course1 = courseData[0] as Course;
    const course2 = courseData[1] as Course;

    featureValues.forEach((feature, index) => {
        comparisionResult.push({
            featureTitle: feature,
            course1: { value: course1[featureTags[index] as keyof Course], result: 'Imperfect' },
            course2: { value: course2[featureTags[index] as keyof Course], result: 'Imperfect' }
        });
    });

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                { role: "system", content: "You Are A Study Abroad Advisor. Who Helps Student's To Choose One Best Course Between Two Courses By Comparing Different Aspects And Rankings Of Those Universities." },
                {
                    role: "user", content: `The Universities You Have To Compare Are ${course1.courseName} And ${course2.courseName}. ${JSON.stringify(comparisionResult)} - This Is All Aspects To Compare Them Without Changing The Feature Titles And Feature Values Of Any Course, Only Modify The Result Value And Strictly Maintain This Rule. If You Think Global Ranking Of course1 Is Better Than course2 Then Change The result To "Perfect" for course1. Example:
                {
                    "featureTitle": "Course Duration",
                    "course1": {
                        "value": "1 Years",
                        "result": "Perfect"
                    },
                    "course2": {
                        "value": "3 Years",
                        "result": "Imperfect"
                    }
                }. After All The Evaluation Strictly Provide Feedback Only In The Exact Given comparisionResult - Array Format And Don't Include Any Extra Words Or Line As I have To Parse It Into JSON.` },
            ],
        });

        const content = completion.choices[0]?.message?.content;

        const fixedContent = (content as string).replace(/'/g, '"');

        const finalComparisionResult = JSON.parse(fixedContent);

        res.json({
            finalComparisionResult
        });
    } catch (error) {
        console.log(`Error With Api: ${error}`);
        res.json({
            Message: "Sorry, there was an error while replying. Please try again.",
        });
    }
});