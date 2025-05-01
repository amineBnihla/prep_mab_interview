import Agent from "@/components/Agent"
import { getUserAuth } from "@/lib/actions/auth.action"

const Interview = async () => {
     const user = await getUserAuth()
         console.log(user)

  return (
    <>
      <h3>Interview generation</h3>
       <Agent userName={user!.name} userId={user?.id} type="generate" />
    </>
  )
}

export default Interview
