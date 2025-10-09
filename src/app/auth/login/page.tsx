'use client';

import React, { useState } from "react";
import { Mail, Lock, LogIn, Eye, EyeOff } from "lucide-react";
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
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const { setUser } = useUser();
  const router = useRouter();

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value.trimStart() }));
    setError(null);
    setSuccess(null);
  };

  // Email validation helper
  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) return;
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Client-side validation
    if (!isValidEmail(formData.email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed. Check your credentials.");
        return;
      }

      if (!data.user) {
        setError("Login failed: No user data returned.");
        return;
      }

      setUser(data.user);
      setSuccess("Login successful! Redirecting...");

      // Redirect after short delay
      setTimeout(() => {
        router.push("/main/dashboard");
      }, 1200);
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-8 space-y-6 border border-gray-200">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-800">Welcome Back 👋</h1>
          <p className="text-gray-500 mt-1">Sign in to continue your journey</p>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="bg-red-50 text-red-700 border border-red-200 rounded-md px-3 py-2 text-sm animate-fadeIn">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 text-green-700 border border-green-200 rounded-md px-3 py-2 text-sm animate-fadeIn">
            {success}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div className="space-y-1 relative">
            <label htmlFor="email" className="flex items-center gap-1 text-sm font-medium text-gray-700">
              <Mail size={16} /> Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full border border-gray-300 rounded-md p-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
              required
            />
          </div>

          {/* Password */}
          <div className="space-y-1 relative">
            <label htmlFor="password" className="flex items-center gap-1 text-sm font-medium text-gray-700">
              <Lock size={16} /> Password
            </label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full border border-gray-300 rounded-md p-2 pr-10 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(prev => !prev)}
              className="absolute top-8 right-2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-md text-white font-semibold transition-all ${
              loading
                ? "bg-green-400 cursor-not-allowed animate-pulse"
                : "bg-green-600 hover:bg-green-700 shadow-md"
            }`}
          >
            {loading ? "Logging in..." : <><LogIn size={18} /> Log In</>}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center text-sm text-gray-600 space-y-1 mt-2">
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
