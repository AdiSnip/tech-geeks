"use client";

import React from "react";
import { useUser } from "@/context/userContext";

const Page = () => {
  const { user } = useUser();
  console.log("User data:", user);

  return (
    <div className="h-full w-full bg-amber-50 p-4">
      <h1 className="text-3xl font-bold">
        {user ? `Welcome, ${user.name}!` : "Loading..."}
      </h1>
    </div>
  );
};

export default Page;
