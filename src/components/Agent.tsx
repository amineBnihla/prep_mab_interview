"use client"
import { vapi } from "@/lib/vapi.sdk"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { interviewer } from "../../constants"
import { craeteFeedback } from "@/lib/actions/general.action"

enum CallStatus {
   INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

interface MessageSaved {
  role: "user" | "assistant"| "system",
  content: string
}

const Agent = ({userName,userId,type,questions,interviewId}:AgentProps) => {
   const router = useRouter()
  const [callStatus,setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE)
const [isSpeaking,setIsSpeaking] = useState(false)
const [Messages,setMessages] = useState<MessageSaved[]>([])
const lastmessage = Messages[Messages.length - 1]?.content
useEffect(() => {
const onCallStart = () => setCallStatus(CallStatus.ACTIVE)
const onCallEnd = () => setCallStatus(CallStatus.FINISHED)
const onMessage = (message:Message)=>{
  if(message.type === "transcript" && message.transcriptType === "final"){
   const newMessage = {role:message.role,content:message.transcript}
  setMessages((prev)=> [...prev,newMessage])
  }}
const onMessageError = (error:Error) => {
  console.error("Error:",error)
}
const onSpeechStart = () => setIsSpeaking(true)
const onSpeechEnd = () => setIsSpeaking(false)

vapi.on("call-start",onCallStart)
vapi.on("call-end",onCallEnd)
vapi.on("message",onMessage)
vapi.on("speech-start",onSpeechStart)
vapi.on("speech-end",onSpeechEnd)
vapi.on("error",onMessageError)

return () => {
vapi.off("call-start",onCallStart)
vapi.off("call-end",onCallEnd)
vapi.off("message",onMessage)
vapi.off("speech-start",onSpeechStart)
vapi.off("speech-end",onSpeechEnd)
vapi.off("error",onMessageError)

}

},[])
useEffect(() => {

  async function generateSomeFedback(){
    console.log(userId,interviewId,Messages)
    const {success,feedbackId} = await craeteFeedback({interviewId:interviewId!,userId:userId!,transcript:Messages})
    if(success && feedbackId){
      router.push(`/Interview/${interviewId}/feedback`)
    }else{
      console.log("Error generating feedback")
      router.push("/")
    }
   }
if(callStatus === CallStatus.FINISHED){
  if(type === "interview"){
    generateSomeFedback()
  }else if(type === "generate"){
   router.push("/")
  }
} 
},[callStatus,Messages,type,userId,router,interviewId])

const handleCall = async ()=>{
  setCallStatus(CallStatus.CONNECTING)
    
  if(type == "generate"){
  try {
    await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!,{
      variableValues:{
        username:userName,
        userid:userId,
      }
    })
  } catch (error) {
    console.log(error)
  }
}else{
  const questionList = JSON.parse(questions)
  console.log(questionList,questionList.length)
  const questionListnew =JSON.parse(questionList)
let formatQuestiions = ""
if(questions){
  formatQuestiions  = questionListnew.map((question)=>('- '+question)).join("\n")
    try {
    await vapi.start(interviewer,{
      variableValues:{
        questions:formatQuestiions,
      }
    })
  } catch (error) {
    console.log(error)
  }
}

  }

}

const endCall =  ()=>{
  setCallStatus(CallStatus.FINISHED)
   vapi.stop()
}
  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 p-4">
      <div className="blue-gradient-dark p-7  rounded-lg flex-center flex-col gap-3  border-2 border-primary-200/50 h-[400px] flex-1 sm:basis-1/2">
         <div className="relative size-[120px] bg-blue-100 rounded-full flex-center">
            <Image src="/ai-avatar.png" alt="agent" className="w-20 h-20" width={80} height={80}/>
        {isSpeaking && <span className="absolute  size-full animate-ping top-0 left-0 rounded-full bg-primary-200 opacity-75"></span>} 
         </div>
           <h3>AI Interviewer</h3>
      </div>
       <div className="dark-gradient hidden md:flex-center p-7  rounded-lg  flex-col gap-3  border-2 border-primary-200/50 h-[400px] flex-1 sm:basis-1/2">
         <div className="size-[120px] bg-blue-100 rounded-full flex-center">
            <Image src="/user-avatar.png" alt="agent" className="w-20 h-20" width={80} height={80} />
         </div>
           <h3>{userName}</h3>
      </div>
     </div>
     {
        Messages.length > 0 && (
             <div className="w-full flex-center dark-gradient rounded-lg p-4">
       <span>{lastmessage}</span>
     </div>
        )
     }
     <div className="w-full flex-center">
       {
        callStatus !== "ACTIVE" ?
        <button className="relative btn-call" onClick={handleCall}>
          <span className="">

          </span>
          <span className="relative">
              {callStatus === "INACTIVE" || callStatus === "FINISHED"
                ? "Call"
                : ". . ."}
          </span>
        </button>
        :
        <button className="btn-disconnect" onClick={endCall}>
          Call
        </button>
       }
     </div>
    
    </>
  )
}

export default Agent
