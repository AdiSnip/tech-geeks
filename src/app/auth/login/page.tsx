"use client";

import React, { useState } from "react";
import { Mail, Lock, LogIn } from "lucide-react";
import { useUser } from "@/context/userContext";
import { useRouter } from "next/navigation";

interface LoginData {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState<LoginData>({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const { setUser } = useUser();
  const router = useRouter();

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
    setSuccess(null);
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!formData.email.includes("@")) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include", // ✅ Important for sending/receiving cookies
      });

      const data = await res.json();
      console.log("Response data:", data);

      if (!res.ok) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }

      if (!data.user) {
        setError("Login failed: no user data returned.");
        setLoading(false);
        return;
      }

      setUser(data.user); // ✅ Set user context
      setSuccess("Login successful! Redirecting...");
      console.log("User logged in:", data.user);

      // Redirect to dashboard
      router.push("/main/dashboard");

    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-md p-6 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Welcome Back</h1>
          <p className="text-gray-600">Sign in to continue</p>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {success && <p className="text-sm text-green-600">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="flex items-center gap-1 text-sm font-medium text-gray-700">
              <Mail size={16} /> Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full border rounded-md p-2 text-gray-900 placeholder-gray-600 focus:ring focus:ring-green-300"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-1 text-sm font-medium text-gray-700">
              <Lock size={16} /> Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full border rounded-md p-2 text-gray-900 placeholder-gray-600 focus:ring focus:ring-green-300"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 ${
              loading ? "bg-green-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
            } text-white py-2 rounded-md font-semibold transition`}
          >
            {loading ? "Logging in..." : (<><LogIn size={18} /> Log In</>)}
          </button>
        </form>

        <div className="text-center text-sm text-gray-600">
          <a href="/forgot-password" className="text-green-600 hover:underline">
            Forgot password?
          </a>
          <p>
            Don’t have an account?{" "}
            <a href="/auth/signup" className="text-green-600 font-medium hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
