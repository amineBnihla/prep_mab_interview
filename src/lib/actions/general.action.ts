"use server"
import { db } from "@/firebase/admin"
import { google } from "@ai-sdk/google"
import { generateObject } from "ai"
import { feedbackSchema } from "../../../constants"

export async function getInterviewsByUser(userId:string): Promise<Interview[] | null>{

    try {
        const interviews = await db.collection('interviews').where('userid','==',userId).get()
        return interviews.docs.map((doc) => ({
            id:doc.id,
            ...doc.data()
        } as Interview))

    } catch (error) {
        console.log(error)
        return null
    }

}

export async function getInterviewsByOthers(params:GetLatestInterviewsParams): Promise<Interview[] | null>{
   const {userId,limit=20} = params
    try {
        const interviews = await db.collection('interviews').orderBy('createdAt',"desc").where('userid','!=',userId).where('finalized',"==",true).limit(limit).get()
      
        return interviews.docs.map((doc) => ({
            id:doc.id,
            ...doc.data()
        } as Interview))

    } catch (error) {
        console.log(error)
        return null
    }

}

export async function getInterview(id:string): Promise<Interview | null>{

    try {
        const interview = await db.collection('interviews').doc(id).get()
         console.log(interview.data())
        return interview.data() as Interview

    } catch (error) {
        console.log(error)
        return null
    }

}

export async function craeteFeedback(params:CreateFeedbackParams){
   const {interviewId,userId,transcript} = params
    console.log(interviewId,userId,transcript)
   try {
     const formattedTranscript = transcript
      .map(
        (sentence: { role: string; content: string }) =>
          `- ${sentence.role}: ${sentence.content}\n`
      )
      .join("");
     
    const {object} = await generateObject({
        model:google("gemini-2.0-flash-001"),
        schema:feedbackSchema,
        prompt:`
         You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out.
        Transcript:
        ${formattedTranscript}

        Please score the candidate from 0 to 100 in the following areas. Do not add categories other than the ones provided:
        - **Communication Skills**: Clarity, articulation, structured responses.
        - **Technical Knowledge**: Understanding of key concepts for the role.
        - **Problem-Solving**: Ability to analyze problems and propose solutions.
        - **Cultural & Role Fit**: Alignment with company values and job role.
        - **Confidence & Clarity**: Confidence in responses, engagement, and clarity.
        `,
          system:
        "You are a professional interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories",
  
    })

     const feedback = {
      interviewId: interviewId,
      userId: userId,
      totalScore: object.totalScore,
      categoryScores: object.categoryScores,
      strengths: object.strengths,
      areasForImprovement: object.areasForImprovement,
      finalAssessment: object.finalAssessment,
      createdAt: new Date().toISOString(),
    };

    const feedbackRes = await db.collection("feedback").add(feedback)
    return {success:false,feedbackId:feedbackRes.id}
   } catch (error) {
    console.log(error)
    return {success:false,feedbackId:""}
   }


}