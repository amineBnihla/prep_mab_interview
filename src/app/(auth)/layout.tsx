import { isAuthenticated } from "@/lib/actions/auth.action"
import { redirect } from "next/navigation"

const AuthLayout = async ({children}:{children:React.ReactNode}) => {

  const isAuthenticat = await isAuthenticated()
   
  if(isAuthenticat)  redirect('/')

  return (
    <div className="auth-layout">
      {children}
    </div>
  )
}

export default AuthLayout
