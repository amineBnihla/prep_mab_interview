import { getRandomInterviewCover } from "@/lib/utils";
import Image from "next/image";
import dayjs from "dayjs";
import Link from "next/link";
import TechStackIcons from "./TechStackIcons";
const InterviewCard = ({
      interviewId,
  userId,
  role,
  type,
  techstack,
  createdAt,
}:InterviewCardProps) => {

    const feedback = null as Feedback | null;
    const normalizedTyp = /mix/gi.test(type) ? "Mixed" : type
    const formatedDate = dayjs(feedback?.createdAt || createdAt || Date.now()).format("MMM D, YYYY")

  return (
    <div className="card-border w-[360px] max-sm:w-full min-h-96 ">
      <div className="card-interview">
        <div>

       <div className="absolute top-0 right-0 rounded-bl-2xl py-2 px-3 text-center w-fit bg-[#24273A] ">
              <p>{normalizedTyp}</p>                   
       </div>
         <Image src={getRandomInterviewCover()} alt="cover-image" width={90} height={90} className="rounded-full object-fill" />
          <h3 className="mt-5 capitalize">{role} Interview</h3>
         <div className="flex mt-3 gap-4">
          <div className="flex gap-1">
            <Image src="/calendar.svg" alt="calendar" width={22} height={22}  />
            <p>{formatedDate}</p>
          </div>
           <div className="flex gap-1">
            <Image src="/star.svg" alt="star" width={22} height={22} />
            <p>{feedback?.totalScore || '---'}/100</p>
          </div>
         </div>
         <p className="line-clamp-3 mt-2 text-sm">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Molestias non, hic ut earum nam magnam quaerat dolor omnis beatae vel!
         </p>
        </div>
        <div className="flex justify-between">
          <TechStackIcons techStack={techstack} />
         <button className="btn-primary">
           <Link href={feedback ? `/interviews/${interviewId}/feedback` : `/interviews/${interviewId}`}>
            {feedback ? "Check Feedback" : "View Questions"}
            </Link>
         </button>
        </div>

      </div>
    </div>
  )
}

export default InterviewCard
