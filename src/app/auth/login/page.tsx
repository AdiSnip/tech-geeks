// This directive is required for client-side interactivity in Next.js 13+
"use client";

// Import necessary dependencies and icons
import React, { useState } from "react";
import { 
  Mail,  // Icon for email input
  Lock,  // Icon for password input
  LogIn  // Icon for login button
} from "lucide-react";

// Define the structure of our login form data
interface LoginData {
  email: string;     // User's email address
  password: string;  // User's password
}

// Define status message types for better type safety
type StatusMessage = string | null;

/**
 * LoginPage Component
 * 
 * A user authentication page that handles login functionality.
 * Features:
 * - Email and password form
 * - Input validation
 * - Error handling
 * - Success feedback
 */
const LoginPage: React.FC = () => {
  // Initialize form data with empty email and password
  const [formData, setFormData] = useState<LoginData>({ 
    email: "", 
    password: "" 
  });

  // State for error messages (null means no error)
  const [error, setError] = useState<StatusMessage>(null);

  // State for success messages (null means no success message)
  const [success, setSuccess] = useState<StatusMessage>(null);

  /**
   * Handles changes in form input fields
   * 
   * This function updates the form data whenever a user types in an input field.
   * It also clears any error or success messages to provide a fresh start.
   * 
   * @param e - The input change event containing the field name and new value
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
    setSuccess(null);
  };

  /**
   * Handles form submission
   * 
   * This function:
   * 1. Prevents the default form submission
   * 2. Validates the input fields
   * 3. Sends the login request to the server
   * 4. Handles the response appropriately
   * 
   * @param e - The form submission event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    // Prevent the form from submitting normally
    e.preventDefault();
    
    // Clear any previous messages
    setError(null);
    setSuccess(null);

    // Validate email format
    if (!formData.email.includes("@")) {
      setError("Please enter a valid email address (e.g., user@example.com)");
      return;
    }

    // Validate password
    if (!formData.password) {
      setError("Please enter your password");
      return;
    }

    try {
      // Send login request to the server
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      // Parse the response data
      const data = await response.json();

      // Check if the request was successful
      if (!response.ok) {
        setError(data.message || "Login failed. Please check your email and password.");
        return;
      }

      // Show success message
      setSuccess("Welcome back! Redirecting you to your dashboard...");
      
      // Log success (remove in production)
      console.log("User logged in:", data);

      // TODO: Redirect to dashboard
      // Will be implemented in the next step
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
        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
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
