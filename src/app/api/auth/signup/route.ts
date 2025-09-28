import dbConnect from "@/libs/db";
import { User } from "@/models/user.model";
import { NextResponse } from "next/server";
import { z } from "zod";
import mongoose from "mongoose";

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

    return NextResponse.json(
      { message: "User created successfully" }, 
      { status: 201 }
    );

  } catch (error) {
    console.error("Error creating user:", error);
    
    // Handle mongoose validation errors
    if (error instanceof mongoose.Error.ValidationError) {
      const errorMessage = Object.values(error.errors)
        .map(err => err.message)
        .join(', ');
      return NextResponse.json(
        { error: errorMessage },
        { status: 400 }
      );
    }

    // Handle other database errors
    if (error instanceof mongoose.Error) {
      return NextResponse.json(
        { error: "Database error. Please try again later." },
        { status: 500 }
      );
    }

    // Handle any other unexpected errors
    return NextResponse.json(
      { error: "Something went wrong. Please try again." }, 
      { status: 500 }
    );
  }
}