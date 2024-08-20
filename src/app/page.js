"use client";

import { useState, useEffect } from "react";
import app from "./config";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/navigation";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import Dashboard from "./dashboard/dashboard.js";

const Home = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);
  const signInWithGoogle = async () => {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push("/");
    } catch (error) {
      console.log("Error signing in Google", error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {user ? (
        <Dashboard />
      ) : (
        <button
          onClick={signInWithGoogle}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Sign In With Google
        </button>
      )}
    </div>
  );
};

export default Home;
