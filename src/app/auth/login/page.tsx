"use client";
import React, { useState } from "react";
import { Mail, Lock, LogIn } from "lucide-react";

interface LoginData {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState<LoginData>({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Update input values
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
    setSuccess(null);
  };

  // Submit form and send POST request
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formData.email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!formData.password) {
      setError("Password cannot be empty.");
      return;
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed. Please try again.");
        return;
      }

      setSuccess("Login successful! Redirecting...");
      console.log("User logged in:", data);

      // Example: redirect to dashboard
      // router.push("/dashboard");
    } catch {
      setError("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-md p-6 space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Welcome Back</h1>
          <p className="text-gray-600">Sign in to continue</p>
        </div>

        {/* Messages */}
        {error && <p className="text-sm text-red-600">{error}</p>}
        {success && <p className="text-sm text-green-600">{success}</p>}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <span className="flex items-center gap-1">
                <Mail size={16} /> Email
              </span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full border rounded-md p-2 
                         focus:ring focus:ring-green-300 
                         text-gray-900 placeholder-gray-600"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <span className="flex items-center gap-1">
                <Lock size={16} /> Password
              </span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full border rounded-md p-2 
                         focus:ring focus:ring-green-300 
                         text-gray-900 placeholder-gray-600"
              required
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 
                       bg-green-600 text-white py-2 rounded-md font-semibold 
                       hover:bg-green-700 transition"
          >
            <LogIn size={18} /> Log In
          </button>
        </form>

        {/* Footer */}
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
