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
        const response = await fetch("/api/user", {
          credentials: "include",
        });

        if (!response.ok) {
          console.error(`Error fetching user: ${response}`);
          router.push("/auth/login");
          return;
        }

        const data = await response.json();

        if (!data || data.error) {
          console.error("Invalid user data received:", data);
          router.push("/auth/login");
          return;
        }

        // Update context only if needed
        if (!user || user !== data) {
          setUser(data);
          console.log("User context updated:", data);
        } else {
          console.log("User already in context:", user);
        }

        // Redirect to dashboard after setting user
        router.push("/main/dashboard");

      } catch (err) {
        console.error("Failed to fetch user:", err);
        router.push("/auth/login");
      }
    };

    if (!user) {
      fetchUser();
    } else {
      console.log("User already present:", user);
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
