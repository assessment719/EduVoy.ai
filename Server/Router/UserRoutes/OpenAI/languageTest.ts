import Router from "express";
import { OpenAI } from 'openai';
import { OPENAI_API } from "../../../config";
import { userAuth } from "../../../Auth/user";

export const englishTestRouter = Router();

const openai = new OpenAI({
    apiKey: OPENAI_API,
    dangerouslyAllowBrowser: true,
});

//Listening Test
englishTestRouter.get("/listeningTest", userAuth, async (req: any, res: any) => {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            temperature: 0.8,
            response_format: { "type": "json_object" },
            messages: [
                {
                    role: "user",
                    content: `You are an English Language Test evaluator (for IELTS, TOEFL, PTE, and Duolingo). Your task is to simulate a Listening Test for students.

                Please generate:

                1. A listening passage of approximately 500 words based on an educational topic (e.g., environment, science, history, technology, health).
                2. The passage title, difficulty level (Beginner, Intermediate, or Advanced), and topic.
                3. 15 comprehension questions related to the passage:
                    - 5 True/False questions
                    - 5 Multiple Choice Questions (each with 4 options)
                    - 5 Fill in the Blanks questions

                Return the result strictly in the following valid JSON format:

                {
                    "passage": "<The full 500-word passage text>",
                    "passageDetails": {
                        "title": "<Title of the passage>",
                        "level": "<Beginner | Intermediate | Advanced>",
                        "topic": "<Topic name>"
                    },
                    "questions": {
                        "trueFalse": [
                            {
                                "id": 1,
                                "question": "<True/False question based on the passage>",
                                "correctAnswer": "True" // or "False"
                            }
                        ],
                        "mcq": [
                            {
                                "id": 1,
                                "question": "<MCQ question based on the passage>",
                                "options": ["Option A", "Option B", "Option C", "Option D"],
                                "correctAnswer": "<Correct option>"
                            }
                        ],
                        "fillInTheBlanks": [
                            {
                                "id": 1,
                                "question": "<A sentence with a missing word, e.g., 'The capital of India is _____'>",
                                "correctAnswer": "<Correct word or phrase>"
                            }
                        ]
                    }
                }
            
                Requirements:
                - All questions must be based strictly on the passage.
                - Do not include any explanations or extra text outside the JSON.
                - Ensure the JSON is valid and properly formatted.`
                }
            ]
        });

        const content = completion.choices[0].message.content;

        if (!content) {
            return res.status(500).json({ Message: "No content returned from EduVoy.ai." });
        }

        const parsedContent = JSON.parse(content);

        if (parsedContent.passage) {
            try {
                const response = await openai.audio.speech.create({
                    model: 'gpt-4o-mini-tts',
                    voice: 'nova',
                    input: parsedContent.passage,
                    response_format: "wav",
                });

                const audioBuffer = Buffer.from(await response.arrayBuffer());

                parsedContent.passage = audioBuffer.toString('base64');

                res.status(200).json(parsedContent);
            } catch (error) {
                console.log(`Error With Listening Test Audio Generation: ${error}`);
                res.status(500).json({
                    Message: "Sorry, there was an error while generating the Listening test audio. Please try again.",
                });
            }
        } else {
            res.status(500).json({
                Message: "Sorry, there was an error while generating the Listening test passage. Please try again.",
            });
        }
    } catch (error) {
        console.log(`Error With Listening Test Generation: ${error}`);
        res.status(500).json({
            Message: "Sorry, there was an error while generating the Listening test passage. Please try again.",
        });

    }
});

//Reading Test
englishTestRouter.get("/readingTest", userAuth, async (req: any, res: any) => {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            temperature: 0.8,
            response_format: { "type": "json_object" },
            messages: [
                {
                    role: "user",
                    content: `You are an English Language Test evaluator (for IELTS, TOEFL, PTE, and Duolingo). Your task is to simulate a Reading Test for students.

                    Please generate:
                    1. A reading passage of approximately 500 words based on an educational topic (e.g., environment, science, history, technology, health).
                    2. The passage should be written in 4 or 5 paragraphs, and each paragraph must be separated by '{{paraBreak}}' so it can be rendered with spacing in HTML.
                    3. The passage title, difficulty level (Beginner, Intermediate, or Advanced), and topic.
                    4. 15 comprehension questions related to the passage:
                        - 5 True/False questions
                        - 5 Multiple Choice Questions (each with 4 options)
                        - 5 Fill in the Blanks questions
                    
                    Return the result strictly in the following valid JSON format:

{
  "passage": "<The full 500-word passage text with '{{paraBreak}}' between paragraphs>",
  "passageDetails": {
    "title": "<Title of the passage>",
    "level": "<Beginner | Intermediate | Advanced>",
    "topic": "<Topic name>"
  },
  "questions": {
    "trueFalse": [
      {
        "id": 1,
        "question": "<True/False question based on the passage>",
        "correctAnswer": "True" // or "False"
      }
    ],
    "mcq": [
      {
        "id": 1,
        "question": "<MCQ question based on the passage>",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctAnswer": "<Correct option>"
      }
    ],
    "fillInTheBlanks": [
      {
        "id": 1,
        "question": "<A sentence with a missing word, e.g., 'The capital of India is _____'>",
        "correctAnswer": "<Correct word or phrase>"
      }
    ]
  }
}

Requirements:
- All questions must be based strictly on the passage.
- Do not include any explanations or extra text outside the JSON.
- Ensure the JSON is valid and properly formatted.
- Use '{{paraBreak}}' to visually separate paragraphs within the passage text.`
                }
            ]
        });

        const content = completion.choices[0].message.content;

        if (!content) {
            return res.status(500).json({ Message: "No content returned from EduVoy.ai." });
        }

        const parsedContent = JSON.parse(content);

        res.status(200).json(parsedContent);
    } catch (error) {
        console.log(`Error With Reading Test Generation: ${error}`);
        res.status(500).json({
            Message: "Sorry, there was an error while generating the reading test passage. Please try again.",
        });
    }
});

//Writting Test
englishTestRouter.get("/writingTest", userAuth, async (req: any, res: any) => {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            temperature: 0.7,
            response_format: { "type": "json_object" },
            messages: [
                {
                    role: "user",
                    content: `You are an English Language Test evaluator (for IELTS, TOEFL, PTE, and Duolingo). Your task is to simulate a Writing Test for students.

Generate a long and detailed writing test prompt of minimum 100 words for students.

Requirements:
1. Suggest one educational topic suitable for a 250-word essay to be completed in 10 minutes.
2. The topic must be clear, realistic, and related to common IELTS-style themes (e.g., environment, technology, education, science, society, health).
3. Also provide:
   - A short and relevant title
   - The topic area (e.g., Environment, Education, etc.)
   - The difficulty level (Beginner, Intermediate, or Advanced)

Return the response strictly in the following valid JSON format:

{
  "writingTopic": "<A clear and concise essay topic>",
  "essayTopicDetails": {
    "title": "<Title of the passage>",
    "level": "<Beginner | Intermediate | Advanced>",
    "topic": "<Topic name>"
  }
}

Do not include any extra explanations or text outside this JSON. Ensure valid and properly formatted JSON output only.`
                }
            ]
        });

        const content = completion.choices[0].message.content;

        if (!content) {
            return res.status(500).json({ Message: "No content returned from EduVoy.ai." });
        }

        const parsedContent = JSON.parse(content);

        res.status(200).json(parsedContent);
    } catch (error) {
        console.log(`Error With Writing Test Generation: ${error}`);
        res.status(500).json({
            Message: "Sorry, there was an error while generating the writing test topic. Please try again.",
        });
    }
});

//Speaking Test - Cue Card Part
englishTestRouter.get("/speakingTest/cueCard", userAuth, async (req: any, res: any) => {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            temperature: 0.7,
            response_format: { "type": "json_object" },
            messages: [
                {
                    role: "user",
                    content: `You are an English Language Test evaluator (for IELTS, TOEFL, PTE, and Duolingo). Your task is to simulate a Speaking Test for students.

Generate a Cue Card Speaking Test prompt in the following format:

1. A cue card topic (short and relevant to everyday life or education).
2. 4 to 5 bullet points guiding the student on what to cover while speaking.

The topic should be realistic, relatable, and appropriate for English speaking practice. Students should be given 1 minute to prepare and must speak continuously for 5 minutes.

Return the result strictly in this valid JSON format:

{
  "cueCardTopic": "<Cue card speaking topic>",
  "instructions": [
    "<Point 1>",
    "<Point 2>",
    "<Point 3>",
    "<Point 4>",
    "<Point 5>" // optional, if only 4 make sense
  ]
}

Requirements:
- Do not include explanations outside the JSON.
- Make sure the JSON is valid and well-formatted.
- Instructions must help students structure a 5-minute spoken response.`
                }
            ]
        });

        const content = completion.choices[0].message.content;

        if (!content) {
            return res.status(500).json({ Message: "No content returned from EduVoy.ai." });
        }

        const parsedContent = JSON.parse(content);

        res.status(200).json(parsedContent);
    } catch (error) {
        console.log(`Error Generating Cue Card: ${error}`);
        res.status(500).json({
            Message: "Sorry, there was an error while generating the speaking cue card. Please try again.",
        });
    }
});

//Speaking Test - Abstract Discussion Part
englishTestRouter.get("/speakingTest/abstractDiscussion", userAuth, async (req: any, res: any) => {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            temperature: 0.7,
            response_format: { "type": "json_object" },
            messages: [
                {
                    role: "user",
                    content: `You are an English Language Test evaluator (for IELTS, TOEFL, PTE, and Duolingo). Your task is to simulate a Speaking Test for students.

Simulate an Abstract Discussion Speaking Test.

Requirements:
1. Include:
   - Title of the topic
   - Topic area (e.g., Technology, Society, Environment, etc.)
   - Difficulty level (Beginner, Intermediate, or Advanced)
2. Create 5 thoughtful discussion questions based on the topic.
3. Each question should allow the student to speak for around 1 minute in detail.

Return strictly in this valid JSON format:

{
  "discussionDetails": {
    "title": "<Descriptive title>",
    "level": "<Beginner | Intermediate | Advanced>",
    "topic": "<Topic area>"
  },
  "questions": [
    "<Question 1>",
    "<Question 2>",
    "<Question 3>",
    "<Question 4>",
    "<Question 5>"
  ]
}

Do not include any explanation or content outside the JSON. The JSON must be valid and properly formatted.`
                }
            ]
        });

        const content = completion.choices[0].message.content;

        if (!content) {
            return res.status(500).json({ Message: "No content returned from EduVoy.ai." });
        }

        const parsedContent = JSON.parse(content);

        res.status(200).json(parsedContent);
    } catch (error) {
        console.log(`Error Generating Abstract Discussion: ${error}`);
        res.status(500).json({
            Message: "Sorry, there was an error while generating the abstract discussion. Please try again.",
        });
    }
});

//Writting Test - Image Descriotion Evaluation
englishTestRouter.post("/writingTest/imageDescription/evaluation", userAuth, async (req: any, res: any) => {
    const { imageDetails: { imagePrompt, imageDescription }, studentDescription } = req.body;

    if (!imagePrompt || !imageDescription || !studentDescription) {
        return res.status(400).json({ message: "Missing required fields." });
    }

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            temperature: 0.7,
            response_format: { "type": "json_object" },
            messages: [
                {
                    role: "user",
                    content: `You are an expert IELTS Writing evaluator.

Evaluate the student's image-based descriptive writing task. The student was given the following image prompt:

Image Prompt: "${imagePrompt}"

Reference Description of the Image: "${imageDescription}"

Student's Response:
"""
${studentDescription}
"""

Evaluate the student's response based on the following 5 categories:
1. Task Response
2. Coherence and Cohesion
3. Lexical Resource
4. Grammar and Accuracy
5. Overall Quality

For each category, assign marks out of 100 and give brief long feedback (50 words).

Also, generate a high-quality sample description (200 words) that would score close to full marks for this task.

Return the result strictly in this valid JSON format:

{
  "marks": {
    "overall": <number>,
    "taskResponse": <number>,
    "coherenceAndCohesion": <number>,
    "lexicalResource": <number>,
    "grammarAndAccuracy": <number>
  },
  "feedback": {
    "overall": "<long and detailed feedback>",
    "taskResponse": "<long and detailed feedback>",
    "coherenceAndCohesion": "<long and detailed feedback>",
    "lexicalResource": "<long and detailed feedback>",
    "grammarAndAccuracy": "<long and detailed feedback>"
  },
  "sampleDescription": "<sample 200-word image description>"
}

Requirements:
- JSON only. No extra commentary.
- Ensure the JSON is valid.
- Base the evaluation strictly on the student's writing and the reference image description.
`
                }
            ]
        });

        const content = completion.choices[0].message.content;

        if (!content) {
            return res.status(500).json({ Message: "No content returned from EduVoy.ai." });
        }

        const parsedContent = JSON.parse(content);

        res.status(200).json(parsedContent);
    } catch (error) {
        console.log("Error evaluating image description:", error);
        res.status(500).json({
            message: "An error occurred while evaluating the response. Please try again later."
        });
    }
});

//Writting Test - Essay Writing Evaluation
englishTestRouter.post("/writingTest/essayWriting/evaluation", userAuth, async (req: any, res: any) => {
    const { essayDetails: { essayTopic, title, level, topic }, studentEssay } = req.body;

    if (!essayTopic || !title || !level || !topic || !studentEssay) {
        return res.status(400).json({ message: "Missing required fields." });
    }

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            temperature: 0.7,
            response_format: { "type": "json_object" },
            messages: [
                {
                    role: "user",
                    content: `You are an expert IELTS Writing evaluator.

Evaluate the following 250-word student essay based on this prompt:

Essay Topic: "${essayTopic}"
Title: "${title}"
Level: "${level}"
Main Topic: "${topic}"

Student's Essay:
"""
${studentEssay}
"""

Evaluate the essay using the following categories:
1. Task Response
2. Coherence and Cohesion
3. Lexical Resource
4. Grammar and Accuracy
5. Overall Quality

Instructions:
- Assign marks out of 100 for each category.
- Provide brief long feedback (50 words) for each category.
- Also generate a high-quality 250-word sample essay for the same topic that would score close to full marks.

Return strictly the following valid JSON format:

{
  "marks": {
    "overall": <number>,
    "taskResponse": <number>,
    "coherenceAndCohesion": <number>,
    "lexicalResource": <number>,
    "grammarAndAccuracy": <number>
  },
  "feedback": {
    "overall": "<long and detailed feedback>",
    "taskResponse": "<long and detailed feedback>",
    "coherenceAndCohesion": "<long and detailed feedback>",
    "lexicalResource": "<long and detailed feedback>",
    "grammarAndAccuracy": "<long and detailed feedback>"
  },
  "sampleDescription": "<A high-quality sample essay response (approx. 250 words)>"
}

Requirements:
- Do not include anything outside the JSON.
- Ensure all feedback and marks are strictly based on the provided student essay and the topic.
`
                }
            ]
        });

        const content = completion.choices[0].message.content;

        if (!content) {
            return res.status(500).json({ Message: "No content returned from EduVoy.ai." });
        }

        const parsedContent = JSON.parse(content);

        res.status(200).json(parsedContent);
    } catch (error) {
        console.log("Error evaluating essay:", error);
        res.status(500).json({
            message: "An error occurred while evaluating the essay. Please try again later."
        });
    }
});

//Speaking Test - Introduction and Interview Part Evaluation
englishTestRouter.post("/speakingTest/interviewPart/evaluation", userAuth, async (req: any, res: any) => {
    const { InterviewQuestions, studentTranscript } = req.body;

    if (!InterviewQuestions || !studentTranscript) {
        return res.status(400).json({ message: "Missing required fields." });
    }

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            temperature: 0.7,
            response_format: { "type": "json_object" },
            messages: [
                {
                    role: "user",
                    content: `You are an experienced English speaking test evaluator for IELTS, TOEFL, PTE, and Duolingo.

Evaluate a student's response to a personal interview speaking section.

Interview Questions (10):
${JSON.stringify(InterviewQuestions, null, 2)}

Student's Transcript:
"""
${studentTranscript}
"""

Instructions:
- Evaluate the student's transcript as if it were their recorded answers to the above 10 personal interview questions.
- Give marks out of 100 in the following categories:
  - Fluency And Coherence
  - Lexical Resource
  - Grammar and Accuracy
  - Pronunciation
  - Overall

- Provide short feedback (2-3 sentences) for each category.
- Finally, provide **6 personalized improvement tips** to help the student enhance their spoken English in future interviews.

Return the result strictly in the following valid JSON format:
{
  "marks": {
    "overall": <number>,
    "fluencyAndCoherence": <number>,
    "lexicalResource": <number>,
    "grammarAndAccuracy": <number>,
    "pronunciation": <number>
  },
  "feedback": {
    "overall": "<long and detailed feedback>",
    "fluencyAndCoherence": "<long and detailed feedback>",
    "lexicalResource": "<long and detailed feedback>",
    "grammarAndAccuracy": "<long and detailed feedback>",
    "pronunciation": "<long and detailed feedback>"
  },
  "improvementTips": [
    "<Tip 1>",
    "<Tip 2>",
    "<Tip 3>",
    "<Tip 4>",
    "<Tip 5>",
    "<Tip 6>"
  ]
}

Requirements:
- Do not include any extra text outside of the JSON.
- Keep all feedback and tips based strictly on the transcript.
`
                }
            ]
        });

        const content = completion.choices[0].message.content;

        if (!content) {
            return res.status(500).json({ Message: "No content returned from EduVoy.ai." });
        }

        const parsedContent = JSON.parse(content);

        res.status(200).json(parsedContent);
    } catch (error) {
        console.log("Error evaluating speaking interview:", error);
        res.status(500).json({
            message: "An error occurred while evaluating the interview. Please try again."
        });
    }
});

//Speaking Test - Cue Card Part Evaluation
englishTestRouter.post("/speakingTest/cueCardPart/evaluation", userAuth, async (req: any, res: any) => {
    const { cueCardDetails: { cueCardTopic, instructions }, studentTranscript } = req.body;

    if (!cueCardTopic || !instructions || !studentTranscript) {
        return res.status(400).json({ message: "Missing required fields." });
    }

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            temperature: 0.7,
            response_format: { "type": "json_object" },
            messages: [
                {
                    role: "user",
                    content: `You are an expert English speaking test evaluator for IELTS, TOEFL, PTE, and Duolingo.

Evaluate the student's Cue Card response.

Cue Card Topic: ${cueCardTopic}
Instructions:
${instructions.map((inst: string, idx: number) => `${idx + 1}. ${inst}`).join("\n")}

Student's Transcript:
"""
${studentTranscript}
"""

Instructions:
- Assess the spoken response based on fluency, relevance to topic, vocabulary, coherence, and grammar.
- Assign marks out of 100 for the following:
  - Fluency And Coherence
  - Lexical Resource
  - Grammar and Accuracy
  - Pronunciation
  - Overall

- Give brief feedback (2-3 lines) for each scoring category.
- Suggest 6 personalized improvement tips based on transcript performance.

Return the result strictly in the following valid JSON format:
{
  "marks": {
    "overall": <number>,
    "fluencyAndCoherence": <number>,
    "lexicalResource": <number>,
    "grammarAndAccuracy": <number>,
    "pronunciation": <number>
  },
  "feedback": {
    "overall": "<long and detailed feedback>",
    "fluencyAndCoherence": "<long and detailed feedback>",
    "lexicalResource": "<long and detailed feedback>",
    "grammarAndAccuracy": "<long and detailed feedback>",
    "pronunciation": "<long and detailed feedback>"
  },
  "improvementTips": [
    "<Tip 1>",
    "<Tip 2>",
    "<Tip 3>",
    "<Tip 4>",
    "<Tip 5>",
    "<Tip 6>"
  ]
}

Do not include anything else. Strictly return valid JSON only.`
                }
            ]
        });

        const content = completion.choices[0].message.content;

        if (!content) {
            return res.status(500).json({ Message: "No content returned from EduVoy.ai." });
        }

        const parsedContent = JSON.parse(content);

        res.status(200).json(parsedContent);
    } catch (error) {
        console.error("Cue Card Evaluation Error:", error);
        res.status(500).json({
            message: "An error occurred while evaluating the Cue Card response."
        });
    }
});

//Speaking Test - Abstract Discussion Part Evaluation
englishTestRouter.post("/speakingTest/abstractDiscussionPart/evaluation", userAuth, async (req: any, res: any) => {
    const { abstractDetails: { abstractTopic, discussionDetails: { title, level }, questions }, studentTranscript } = req.body;

    if (!abstractTopic || !title || !level || !questions || !studentTranscript) {
        return res.status(400).json({ message: "Missing required fields." });
    }

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            temperature: 0.7,
            response_format: { "type": "json_object" },
            messages: [
                {
                    role: "user",
                    content: `You are an expert evaluator for abstract discussion in English speaking tests like IELTS or TOEFL.

Evaluate the following student's discussion.

Topic: ${abstractTopic}
Discussion Context: Title - ${title}, Level - ${level}
Questions Asked: ${questions.map((q: string, idx: number) => `${idx + 1}. ${q}`).join("\n")}

Student's Transcript:
"""
${studentTranscript}
"""

Instructions:
- Evaluate how well the student addressed each question.
- Grade fluency, vocabulary, coherence, and grammatical accuracy.
- Provide scores out of 100 for:
  - Fluency And Coherence
  - Lexical Resource
  - Grammar and Accuracy
  - Pronunciation
  - Overall

- Give concise feedback (2-3 lines) for each scoring area.
- Provide 6 personalized improvement tips.

Return the result strictly in the following valid JSON format:
{
  "marks": {
    "overall": <number>,
    "fluencyAndCoherence": <number>,
    "lexicalResource": <number>,
    "grammarAndAccuracy": <number>,
    "pronunciation": <number>
  },
  "feedback": {
    "overall": "<long and detailed feedback>",
    "fluencyAndCoherence": "<long and detailed feedback>",
    "lexicalResource": "<long and detailed feedback>",
    "grammarAndAccuracy": "<long and detailed feedback>",
    "pronunciation": "<long and detailed feedback>"
  },
  "improvementTips": [
    "<Tip 1>",
    "<Tip 2>",
    "<Tip 3>",
    "<Tip 4>",
    "<Tip 5>",
    "<Tip 6>"
  ]
}

Do not include anything else. Strictly return valid JSON only.`
                }
            ]
        });

        const content = completion?.choices[0].message.content;

        if (!content) {
            return res.status(500).json({ Message: "No content returned from EduVoy.ai." });
        }

        const parsedContent = JSON.parse(content);

        res.status(200).json(parsedContent);
    } catch (error) {
        console.error("Abstract Discussion Evaluation Error:", error);
        res.status(500).json({
            message: "An error occurred while evaluating the abstract discussion."
        });
    }
});
