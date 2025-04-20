"use server"

import { db,auth } from "@/firebase/admin"

import { cookies } from "next/headers"

const ONE_WEEK = 60 * 60 * 24 * 7  // 1 week in milliseconds

export async function setSessionCookie(idToken: string) {
  const cookieStore = await cookies();

  // Create session cookie
  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: ONE_WEEK * 1000, // milliseconds
  });

  // Set cookie in the browser
  cookieStore.set("session", sessionCookie, {
    maxAge: ONE_WEEK,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });
}

export async function SignUp(UserCredential:SignUpParams){
const {uid,name,email} = UserCredential
    try {
    const getUser = await db.collection('users').doc(uid).get()
    console.log(getUser)
    if(getUser.exists) {
        return{
            success:false,
            message:"Account already exist with the Email"
        }
    }
    await db.collection('users').doc(uid).set({
        name,
        email,
    })
   return{
        success:true,
        message:"Account created successfully"
    }
    
   
    } catch (error:any) {
        console.log(error)
            if (error.code === "auth/email-already-exists") {
      return {
        success: false,
        message: "This email is already in use",
      };
    }

    return {
      success: false,
      message: "Failed to create account. Please try again.",
    };

    }

}

export async function SignIn(UserCredential:SignInParams){
    const {email,idToken} = UserCredential
    try {
        const getUser = await auth.getUserByEmail(email)
        if(!getUser) {
            return{
                success:false,
                message:"Account does not exist with the Email"
            }
        }
       await setSessionCookie(idToken)
        return{
            success:true,
            message:"Sign in successful"
        }
    } catch (error:any) {
        console.log(error)
        return{
            success:false,
            message:"Failed to sign in. Please try again."
        }
    }
}

export async function getUserAuth() : Promise<User | null> {

    const cookieStore = await cookies()
    const sessionId = cookieStore.get("session")?.value
    console.log(sessionId)
    if(!sessionId) return null
    try {
        
        const userSession = await auth.verifySessionCookie(sessionId,true)

        const checkUser = await db.collection('users').doc(userSession.uid).get()
        if(!checkUser.exists) return null

        return{
           ...checkUser.data()
        } as User

    } catch (error) {
        console.log(error)
        return null
    }

}

export async function isAuthenticated() {
    
    const isAuthCheck = await getUserAuth()

    return !!isAuthCheck

}