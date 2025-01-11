import Router from "express";
import { OpenAI } from 'openai';
import { OPENAI_API } from "../../../config";
import { userAuth } from "../../../Auth/user";

export const facultiesRouter = Router();

const openai = new OpenAI({
    apiKey: OPENAI_API,
    dangerouslyAllowBrowser: true,
});

facultiesRouter.post("/", userAuth, async (req, res) => {
    const { desiredCourseType, firstSub = null, secondSub = null, thirdSub = null, fourthSub = null, prevDegree = null } = req.body;

    const response = await fetch("http://localhost:2000/users/options/faculty", {
        method: "GET"
    });
    const data: { faculties: { id: number, option: string }[] } = await response.json();

    const ugContent = `My best of 4 subjects in Higher Secondary Examination are: ${firstSub}, ${secondSub}, ${thirdSub}, ${fourthSub}. Now suggest me those faculties for which I am eligible to apply between the below faculties: ${JSON.stringify(data.faculties)}. Strictly provide feedback only in the following JSON format: { eligiableFaculties: [ {id: Exact id Of Choosen Faculty Option, faculty: 'String'}, {id: Exact id Of Choosen Faculty Option, faculty: 'String'}, ....] }. Don't include any text in the response as i have to parse it into JSON. }`;

    const pgContent = `I have studied ${prevDegree}. Now suggest me those faculties for which I am eligible to apply between the below faculties: ${JSON.stringify(data.faculties)}. Strictly provide feedback only in the following JSON format: { eligiableFaculties: [ {id: Exact id Of Choosen Faculty Option, faculty: 'String'}, {id: Exact id Of Choosen Faculty Option, faculty: 'String'}, ....] }. Don't include any text in the response as i have to parse it into JSON.`;

    if (data) {
        try {
            const completion = await openai.chat.completions.create({
                model: "gpt-4",
                messages: [
                    { role: "system", content: "You Are A Study Abroad Advisor. Who Suggests Courses Based On The Previous Study." },
                    { role: "user", content: desiredCourseType === 'Postgraduate' ? pgContent : ugContent },
                ],
            });

            const content = completion.choices[0]?.message?.content;

            const fixedContent = (content as string).replace(/'/g, '"');

            const reply = JSON.parse(fixedContent);

            const suggestedFaculties = reply.eligiableFaculties;

            res.json({
                suggestedFaculties
            })
        } catch (error) {
            console.log(`Error With Api: ${error}`);
            res.json({
                Message: "Sorry, there was an error while suggesting faculties. Please try again.",
            });
        }
    } else {
        console.log("Error While gathering the faculties!");
        return
    }
});