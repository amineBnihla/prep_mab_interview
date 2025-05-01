
import {generateText} from "ai"
import { google } from "@ai-sdk/google"


import { db } from "@/firebase/admin";
import { getRandomInterviewCover } from "@/lib/utils";
export async function GET() {

    return new Response("Hello, this is the interview route!");

}

export async function POST(request: Request) {
  const {role,type,level,techstack, amount, userid } = await request.json()

  try {
    const { text:questions } = await generateText({
model: google("gemini-1.5-pro-latest"),
prompt: `You are an assistant that only outputs valid JSON arrays.
Prepare interview questions based on the following information:
The job role is: ${role}.
The experience level is: ${level}.
The tech stack is: ${techstack}.
The focus between behavioral and technical questions is: ${type}.
The number of questions to generate: ${amount}.

IMPORTANT:
- Return ONLY a valid JSON array of strings, no markdown formatting.
- DO NOT wrap the array inside any quotes.
- DO NOT add any extra characters like \\, \\n, /, or special characters.
- Example output: ["Question 1", "Question 2", "Question 3"]

No explanation, no formatting, just pure JSON array.
`
})
console.log(questions,JSON.parse(questions))
  
    let cleanedQuestions = questions.trim();

// First parse outer quotes if necessary
if (cleanedQuestions.startsWith('"') && cleanedQuestions.endsWith('"')) {
  cleanedQuestions = JSON.parse(cleanedQuestions);
}

// Then parse the real array
const questionsArray = JSON.parse(cleanedQuestions);
    try {

      if (!Array.isArray(questionsArray)) {
        throw new Error('Parsed result is not an array');
      }
    } catch (e) {
      console.error('Failed to parse questions correctly', e);
      return new Response("Invalid questions format", { status: 400 });
    }
const interview = {
      role: role,
    type: type,
    level: level,
    techstack: techstack.split(","),
    amount: amount,
    finalized:true,
    coverImage:getRandomInterviewCover(),
    questions: questionsArray,
    createdAt: new Date().toISOString(),
    userid: userid,
}

await db.collection("interviews").add(interview)
 return Response.json({success:true},{status: 200})
  } catch (error) {
    console.log(error)
    return new Response("Error generating interview questions", { status: 500 });
  }

}
