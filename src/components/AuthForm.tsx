"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {Form} from "@/components/ui/form"
import FormField from "./FormField"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {createUserWithEmailAndPassword, signInWithEmailAndPassword} from 'firebase/auth'
import { auth } from "@/firebase/client"
import { SignIn, SignUp } from "@/lib/actions/auth.action"
const authValidation = (typ:'sign-in' | 'sign-up')=>{

  return z.object({
    name: typ === "sign-up"? z.string().min(1): z.string().optional(),
    email: z.string().email(),
    password: z.string().min(8),
  })
}



const AuthForm = ({type}:{type:'sign-in' | 'sign-up'}) => {
  const router = useRouter()
  const formSchema = authValidation(type)
     const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })
 
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    try {
      const {email, password} = values
      if(type === "sign-in") {
        // sign in logic here
      const userCredentiel = await signInWithEmailAndPassword(auth,email,password) 
    const tokenID = await userCredentiel.user.getIdToken()
    const result = await SignIn({email, idToken:tokenID})
    if(!result.success) { 
      toast.error(result.message)
      return
    }
        toast.success("Sign in successful")
        router.push('/')
      }
      if(type === "sign-up") {
      const {name,email, password} = values
       const userLogin = await createUserWithEmailAndPassword(auth, email, password)
       const result = await SignUp({uid:userLogin.user.uid,name:name!,email,password})
       console.log(result)
       if(!result.success) {
        toast.error(result.message)
        return
        }
      toast.success("Sign up successful")
    router.push('/sign-in')
    }
    } catch (error) {
      toast.error("Something went wrong")
    console.log(error)
    }
     }
  const isSignIn = type === "sign-in"
  return (
    <div className="card-border lg:min-w-[566px]">
      <div className="card flex flex-col gap-6 justify-center items-center bg-card py-14 px-10">
          <div className="flex gap-2 items-center">
           <Image src="/logo.svg" alt="logo" height={32} width={38} />
           <h2 className="text-primary-200">PrepWise</h2>
          </div>
           <h3>Practice job interviews with AI</h3>
      
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full ">
          {!isSignIn && 
          <FormField
          control={form.control}
          name="name"
          placeHolder="Name"
          label="Name"
          type="text"
          />}
          <FormField
          control={form.control}
          name="email"
          placeHolder="Email"
          label="Email"
          type="email"
          />
          <FormField
          control={form.control}
          name="password"
          placeHolder="Password"
          label="Password"
          type="password"
          />
        <Button type="submit" className="w-full">{isSignIn ? "Sign in":"Create an account"}</Button>
      </form>
      
    </Form>
    <p className="text-center">
       {isSignIn ? "Don't have an account?":"Already have an account?"}
       <Link href={isSignIn ? "/sign-up":"/sign-in"} className="text-user-primary font-bold"> {isSignIn ? "Sign up":"Sign in"}</Link>
    </p>
    </div>
    </div>
  )
}

export default AuthForm
