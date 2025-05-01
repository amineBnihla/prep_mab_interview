import Image from "next/image";
import Link from "next/link"
// import { dummyInterviews } from "../../../constants";
import InterviewCard from "@/components/InterviewCard";
import { getUserAuth } from "@/lib/actions/auth.action";
import { getInterviewsByOthers, getInterviewsByUser } from "@/lib/actions/general.action";


export default async  function Home() {
     const user = await getUserAuth()
     const [Interviews,InterviewsOthers] =await Promise.all([await getInterviewsByUser(user?.id),await getInterviewsByOthers({userId:user?.id!})])
    // const Interviews = 
    // const InterviewsOthers = 

    const hasIntewiews = Interviews && Interviews.length > 0
    const hasIntewiewsOther = InterviewsOthers && InterviewsOthers.length > 0
  return (
    <>
    <section className="card-cta">
     <div className="flex flex-col gap-6">
      <h2 className="text-primary-200">Get Interview-Ready with AI-Powered Practice & Feedback</h2>
       <p className="text-lg">Practice real interview questions & get instant feedback.</p>
       <button className=" btn-primary max-sm:w-full">
        <Link href="/Interview">Start an Interview</Link>
       </button>
     </div>
     <Image
      src="/robot.png"
      alt="robo-dude"
      width={400}
      height={400}
      className="max-sm:hidden"
      />
    </section>
    <section className="mt-8">
     <h2 >Your Post Interviews</h2>
     <div className="interviews-section mt-6">
      {
        hasIntewiews ?

      /* Map through the interviews and display them here */
      Interviews.map((interview) => <InterviewCard key={interview.id}  userId={interview?.userId}
                interviewId={interview.id}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.createdAt} />)
      : 
      <p className="text-center text-lg">You have no interviews yet. Start one now!</p>
      }

      </div>
    </section>
    <section className="mt-8">
     <h2 >Other Post Interviews</h2>
     <div className="interviews-section mt-6">
      {
        hasIntewiewsOther ?

      /* Map through the interviews and display them here */
      InterviewsOthers.map((interview) => <InterviewCard key={interview.id}  userId={interview?.userId}
                interviewId={interview.id}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.createdAt} />)
      : 
      <p className="text-center text-lg">There are no interviews yet.</p>
      }

      </div>
    </section>
    </>
  );
}
