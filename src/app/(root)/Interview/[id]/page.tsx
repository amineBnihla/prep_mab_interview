import Agent from "@/components/Agent"
import TechStackIcons from "@/components/TechStackIcons"
import { getUserAuth } from "@/lib/actions/auth.action"
import { getInterview } from "@/lib/actions/general.action"
import { getRandomInterviewCover } from "@/lib/utils"
import Image from "next/image"
import { redirect } from "next/navigation"

const InterviewPage = async ({params}:RouteParams) => {
   const user = await getUserAuth()
    const {id} = await params
    
    const interview = await getInterview(id)
    if(!interview) redirect("/")

  return (
    <>
      <div className="flex justify-between">
      <div className="flex flex-col gap-3">
        <div className="flex gap-2 items-center">
          <Image src={getRandomInterviewCover()} width={70} height={70} alt="cover-image" className="rounded-full object-fill" />
          <h1 className="text-2xl font-bold ">{interview?.role}</h1>
        </div>
       <TechStackIcons techStack={interview?.techstack} />
      </div>
      
      <div className="h-fit flex-center text-blue-100 rounded-lg px-3 py-2">
      <h2>{interview?.type}</h2> 
      </div>
      </div>
      <Agent userName={user?.name || ""} interviewId={id} questions={interview.questions}  userId={user?.id} type="interview"/>
      
    </>
  )
}

export default InterviewPage
