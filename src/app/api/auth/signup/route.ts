import dbConnect from "@/libs/db";
import { User } from "@/models/user.model";
import { NextResponse } from "next/server";
import { z } from "zod";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

// Input validation schema
const SignupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  location: z.string().min(2, "Location is required"),
  businessType: z.string(),
  role: z.string()
});

export async function POST(request: Request) {
  try {
    // Connect to the database
    await dbConnect();

    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    // Validate request data
    let validatedData;
    try {
      validatedData = SignupSchema.parse(body);
    } catch (e) {
      if (e instanceof z.ZodError) {
        const errorMessage = e.issues.map(err => err.message).join(', ');
        return NextResponse.json(
          { error: errorMessage },
          { status: 400 }
        );
      }
      // Re-throw if it's not a ZodError, so the outer catch can handle it
      throw e;
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: validatedData.email });
    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    // Create a new user (password hashing is handled in pre-save middleware)
    const newUser = new User(validatedData);
    await newUser.save();

    // --- JWT Secret Check ---
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      console.error("JWT_SECRET environment variable is not set!");
      // This is a server configuration error, not a user error
      return NextResponse.json(
        { error: "Server configuration error: JWT secret missing." },
        { status: 500 }
      );
    }

    // Generate a JWT token
    const token = jwt.sign(
      { userId: newUser._id },
      JWT_SECRET, // Use the checked variable
      { expiresIn: '1h' }
    );

    // Create the response and then set the cookie
    const response = NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure in production
      maxAge: 60 * 60, // 1 hour
      path: '/',
      sameSite: 'lax', // or 'strict' depending on your needs
    });

    return response; // Return the response object after setting the cookie

  } catch (error) {
    console.error("Error creating user:", error); // Log the full error for debugging

    // Handle mongoose validation errors (e.g., from schema definition in model)
    if (error instanceof mongoose.Error.ValidationError) {
      const errorMessage = Object.values(error.errors)
        .map(err => err.message)
        .join(', ');
      return NextResponse.json(
        { error: errorMessage },
        { status: 400 }
      );
    }

    // Handle duplicate key errors from Mongoose/MongoDB
    // This typically happens if you have unique indexes (e.g., on email)
    if (error && typeof error === 'object' && 'code' in error && error.code === 11000) { // MongoDB duplicate key error code
        return NextResponse.json(
            { error: "An account with this email already exists." },
            { status: 409 }
        );
    }


    // Handle other general database errors (e.g., connection issues after initial connect)
    if (error instanceof mongoose.Error) {
      return NextResponse.json(
        { error: "Database error. Please try again later." },
        { status: 500 }
      );
    }

    // Catch any JWT specific errors, e.g., if the secret was invalid internally
    if (error instanceof Error && error.message.includes('secret or public key must be provided')) {
        return NextResponse.json(
            { error: "Server configuration error: JWT secret is invalid." },
            { status: 500 }
        );
    }


    // Fallback for any other unexpected errors
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." }, // More generic for user
      { status: 500 }
    );
  }
}