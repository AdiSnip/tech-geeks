"use client";

import { useEffect } from "react";
import { useUser } from "@/context/userContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

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

      } catch (err) {
        console.error("Failed to fetch user:", err);
        router.push("/auth/login");
      }
    };

    if (!user) {
      fetchUser();
    } else {
      console.log("User already present:", user);
    }

  }, [user, setUser, router]);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-950 text-white selection:bg-blue-500 selection:text-white">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="inline-block py-1 px-3 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6 backdrop-blur-sm">
            Empowering Communities
          </span>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-gray-400">
            Make a Real Impact <br className="hidden md:block" />
            <span className="text-white">Together</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Join hands with NGOs and volunteers to drive meaningful change.
            Whether you want to donate, mentor, or contribute your time,
            we connect you with the right cause.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="/auth/signup"
            className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full bg-blue-600 px-8 font-medium text-white transition-all duration-300 hover:bg-blue-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            <span className="mr-2">Get Started</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </a>
          <a
            href="/explore"
            className="group inline-flex h-12 items-center justify-center rounded-full border border-gray-700 bg-gray-900/50 px-8 font-medium text-gray-300 backdrop-blur-sm transition-all duration-300 hover:bg-gray-800 hover:text-white hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            Explore Campaigns
          </a>
        </motion.div>

        {/* Stats or Social Proof (Optional addition for credibility) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-16 pt-8 border-t border-gray-800/50 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
        >
          {[
            { label: "Active NGOs", value: "500+" },
            { label: "Volunteers", value: "10k+" },
            { label: "Lives Impacted", value: "50k+" },
            { label: "Funds Raised", value: "$2M+" },
          ].map((stat, index) => (
            <div key={index} className="flex flex-col">
              <dt className="text-sm leading-6 text-gray-500">{stat.label}</dt>
              <dd className="order-first text-2xl font-semibold tracking-tight text-white">{stat.value}</dd>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
