// Import the functions you need from the SDKs you need
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getApp, getApps, initializeApp } from "firebase/app";// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAo36yxLUqx7IbMtXEAQprYXgUXgyAHLs0",
  authDomain: "prepmab-f3fb3.firebaseapp.com",
  projectId: "prepmab-f3fb3",
  storageBucket: "prepmab-f3fb3.firebasestorage.app",
  messagingSenderId: "307497919014",
  appId: "1:307497919014:web:6066336e2963d46908fce7",
  measurementId: "G-EJTBS72XBT"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
// const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);