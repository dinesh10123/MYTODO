"use client";
import React, { useEffect, useState } from "react";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import Todo from "../todo/page";
function Dashboard() {
  const auth = getAuth();
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        router.push("/");
      }
    });

    return () => unsubscribe();
  }, [auth, router]);
  const handleLogOut = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  return (
    <div className="flex flex-col p-5 items-center justify-center fixed w-full">
      <div className="flex   rounded-lg shadow-md">
        <h1 className="text-3xl p-7 font-bold mb-4">
          Welcome to Todo List, {user ? user.displayName : "Guest"}!
        </h1>
        <button
          onClick={handleLogOut}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Logout
        </button>
      </div>
      <Todo />
    </div>
  );
}
export default Dashboard;
