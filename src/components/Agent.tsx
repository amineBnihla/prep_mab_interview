import Image from "next/image"

enum CallStatus {
   INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}
const Agent = ({username}:{username:string}) => {

  const callSattus = CallStatus.ACTIVE

    const Messages = ["Hello, I am your AI Interviewer. I will ask you a series of questions to help you prepare for your interview.", "Let's get started!", "Please tell me about your previous work experience.", "What are your strengths and weaknesses?", "Why do you want to work for this company?", "What are your salary expectations?", "Do you have any questions for me?"]
  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 p-4">
      <div className="blue-gradient-dark p-7  rounded-lg flex-center flex-col gap-3  border-2 border-primary-200/50 h-[400px] flex-1 sm:basis-1/2">
         <div className="relative size-[120px] bg-blue-100 rounded-full flex-center">
            <Image src="/ai-avatar.png" alt="agent" className="w-20 h-20" width={80} height={80}/>
         <span className="absolute animate-speak size-full animate-ping top-0 left-0 rounded-full bg-primary-200 opacity-75"></span>
         </div>
           <h3>AI Interviewer</h3>
      </div>
       <div className="dark-gradient hidden md:flex-center p-7  rounded-lg  flex-col gap-3  border-2 border-primary-200/50 h-[400px] flex-1 sm:basis-1/2">
         <div className="size-[120px] bg-blue-100 rounded-full flex-center">
            <Image src="/user-avatar.png" alt="agent" className="w-20 h-20" width={80} height={80} />
         </div>
           <h3>{username}</h3>
      </div>
     </div>
     {
        Messages.length > 0 && (
             <div className="w-full flex-center dark-gradient rounded-lg p-4">
       <span>What job experience level are you targeting?</span>
     </div>
        )
     }
     <div className="w-full flex-center">
       {
        callSattus !== "ACTIVE" ?
        <button className="relative btn-call">
          <span className="">

          </span>
          <span className="relative">
              {callSattus === "INACTIVE" || callSattus === "FINISHED"
                ? "Call"
                : ". . ."}
          </span>
        </button>
        :
        <button className="btn-disconnect">
          Call
        </button>
       }
     </div>
    
    </>
  )
}

export default Agent
