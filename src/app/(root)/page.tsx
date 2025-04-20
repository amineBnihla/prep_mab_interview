import Image from "next/image";
import Link from "next/link"
import { dummyInterviews } from "../../../constants";
import InterviewCard from "@/components/InterviewCard";


export default function Home() {
  return (
    <>
    <section className="card-cta">
     <div className="flex flex-col gap-6">
      <h2 className="text-primary-200">Get Interview-Ready with AI-Powered Practice & Feedback</h2>
       <p className="text-lg">Practice real interview questions & get instant feedback.</p>
       <button className=" btn-primary max-sm:w-full">
        <Link href="/interview">Start an Interview</Link>
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
      /* Map through the interviews and display them here */
      dummyInterviews.map((interview) => <InterviewCard key={interview.id}  userId={interview?.userId}
                interviewId={interview.id}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.createdAt} />)
      
      }

      </div>
    </section>
    </>
  );
}
