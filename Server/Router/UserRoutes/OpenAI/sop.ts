import Router from "express";
import { OpenAI } from 'openai';
import { OPENAI_API } from "../../../config";
import { userAuth } from "../../../Auth/user";

export const sopRouter = Router();

const openai = new OpenAI({
    apiKey: OPENAI_API,
    dangerouslyAllowBrowser: true,
});

sopRouter.post("/", userAuth, async (req, res) => {
    const { courseType, stuDestination, stuCountry, university, course, stuName, stuCity, stuState, stuBoard, stu12Year, stu12Marks, stuUGDegree, stuUni, stuUGYear, stuUGMarks, stuJobTitle, stuJobCompany, stuJobStartDate, stuJobEndDate } = req.body;

    const ugMessage = `Please write a detailed unique long Statement of purpose in 2000 words from the student's point of view for admission considering the educational background and other personal details with the proper headings and 3 points of all the reasons.

Introduction (Within 100 Words)
Educational Background (Within 100 Words)
Why the ${stuDestination} for higher studies (Within 250 Words with a long - 100 Words intro and 3 points)
Why Not ${stuCountry} for higher studies (Within 250 Words with a long - 100 Words intro and 3 points)
Why ${university} (Within 250 Words with a long - 100 Words intro and 3 points)
Why ${course} (Within 250 Words with a long - 100 Words intro and 3 points based on previous study)
Future Opportunities (Within 250 Words)


Key Inputs: 

Personal Details: 

Student Name : ${stuName}
Address : ${stuCity},${stuState},${stuCountry}


           
Education Qualification Details:

Higher Secondary Education Details:
Board Name : ${stuBoard}
Year of passing : ${stu12Year}
Marks : ${stu12Marks}

Work Experience:
Job Title : ${stuJobTitle === "" ? "Not Applicable" : stuJobTitle}
Organisation Name : ${stuJobCompany === "" ? "Not Applicable" : stuJobCompany}
Duration of Work : ${stuJobStartDate === "" ? "Not Applicable" : stuJobStartDate} To ${stuJobEndDate === "" ? "Not Applicable" : stuJobEndDate}

Note: Kindly ignore those fields if it is filled with “Not Applicable”. Please don’t use any signs like “*” or, "#" in the headings to make it bold or underlined, write and return only the whole SOP in normal text and it is important to not use those signs. Don't include anything extra arther than SOP.`;

            const pgMessage = `Please write a detailed unique long Statement of purpose in 2000 words from the student's point of view for admission considering the educational background and other personal details with the proper headings and 3 points of all the reasons.

        Introduction (Within 100 Words)
Educational Background (Within 100 Words)
Why the ${stuDestination} for higher studies (Within 250 Words with a long - 100 Words intro and 3 points)
Why Not ${stuCountry} for higher studies (Within 250 Words with a long - 100 Words intro and 3 points)
Why ${university} (Within 250 Words with a long - 100 Words intro and 3 points)
Why ${course} (Within 250 Words with a long - 100 Words intro and 3 points based on previous study)
Future Opportunities (Within 250 Words)


Key Inputs: 

Personal Details: 

Student Name : ${stuName}
Address : ${stuCity},${stuState},${stuCountry}


           
Education Qualification Details:

Higher Secondary Education Details:
Board Name : ${stuBoard}
Year of passing : ${stu12Year}
Marks : ${stu12Marks}

Undergraduate Education Details:
Degree : ${stuUGDegree}
Degree Institution Name : ${stuUni}
Year of passing : ${stuUGYear}
Marks : ${stuUGMarks}

Work Experience:
Job Title : ${stuJobTitle === "" ? "Not Applicable" : stuJobTitle}
Organisation Name : ${stuJobCompany === "" ? "Not Applicable" : stuJobCompany}
Duration of Work : ${stuJobStartDate === "" ? "Not Applicable" : stuJobStartDate} To ${stuJobEndDate === "" ? "Not Applicable" : stuJobEndDate}

Note: Kindly ignore those fields if it is filled with “Not Applicable”. Please don’t use any signs like “*” or, "#" in the headings to make it bold or underlined, write and return only the whole SOP in normal text and it is important to not use those signs. Don't include anything extra arther than SOP.`

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                { role: "system", content: "You are an expert content writer. Please write an detailed personalised Statement of Purpose for students who are willing to study abroad with their personal details." },
                { role: "user", content: courseType === 'Undergraduate' ? ugMessage : pgMessage },
            ],
        });

        const content = completion.choices[0]?.message?.content;

        const formattedReply = new URLSearchParams({ text: content as string }).toString();

        const conversionResponse = await fetch("https://aitohumanconverter.com/v2/en/process.php", {
            method: "POST",
            body: formattedReply,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const finalData = await conversionResponse.json();

        const nonPlagarisedSOP = finalData.data;

        const unorganisedSOP = `Can you rewrite the below SOP only by replacing all instances of spelled-out numbers with numerals Ex: "ninety five" change to 95? Other than this doesn't change anything words or sentence.
        ${nonPlagarisedSOP}
        Note: Please don’t use any signs like “*” or, "#" in the headings to make it bold or underlined, write the whole SOP in normal text and it is important to not use those signs.`

        const final = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [{ role: "user", content: unorganisedSOP }],
        });

        const organisedSOP = final.choices[0].message.content;

        res.json({
            organisedSOP
        })
    } catch (error) {
        console.log(`Error With Api: ${error}`);
        res.json({
            Message: "Sorry, there was an error while writting your SOP. Please try again.",
        });
    }
});