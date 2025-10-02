"use client";
import { useEffect } from "react";
import { useUser } from "@/context/userContext";
import { useRouter } from "next/navigation";

export default function Hero() {
  const { user, setUser } = useUser();
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/user", { credentials: "include" });
        const data = await response.json();


        if (!data) {
          console.log("fetched data is not available");
          router.push('/auth/login')
          return;
        }

        if (response.status === 500){
          console.error("Server error while fetching user data");
          router.push('/auth/login');
          return;
        }

        if(user != data){
          setUser(data);
          console.log("userContext updated", user);
          router.push("/main/dashboard"); // client-side redirect
        }else{
          console.log("user context does not need update",user)
          router.push("/main/dashboard")
        }

      } catch (err) {
        console.error(err);
      }
    };

    // Only fetch if user is not already in context
    if (!user) {
      fetchUser();
    } else {
      console.log("user already in context", user);
      router.push("/main/dashboard");
    }
  }, [user, setUser, router]);
  
  return (
    <section className="relative bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 py-20 text-center lg:py-32 lg:px-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-6xl">
          Empowering Change Together 🌍
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
          Join hands with NGOs and volunteers to make a real impact. 
          Whether you want to donate, mentor, or contribute your time, 
          we connect you with the right cause.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <a
            href="/auth/signup"
            className="rounded-lg bg-blue-600 px-6 py-3 text-white font-medium shadow hover:bg-blue-700"
          >
            Get Started
          </a>
          <a
            href="/explore"
            className="rounded-lg border border-gray-300 px-6 py-3 text-gray-700 font-medium hover:bg-gray-100"
          >
            Explore Campaigns
          </a>
        </div>
      </div>
    </section>
  );
}
