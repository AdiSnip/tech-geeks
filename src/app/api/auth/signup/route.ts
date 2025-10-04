// src/app/api/auth/signup/route.ts

import dbConnect from "@/libs/db";
import { User } from "@/models/user.model";
import { NextResponse } from "next/server";
import { z } from "zod";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

// Schema for validating signup input
const SignupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  location: z.string().min(2, "Location is required"),
  businessType: z.string(),
  role: z.string(),
});

export async function POST(request: Request) {
  try {
    await dbConnect();

    // Step 1: Parse and validate request body
    const body = await request.json();
    const validatedData = SignupSchema.parse(body);

    // Step 2: Check for duplicate user
    const existingUser = await User.findOne({ email: validatedData.email });
    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    // Step 3: Create new user (password hashing is assumed to be in schema pre-save middleware)
    const newUser = new User(validatedData);
    await newUser.save();

    // Step 4: JWT generation
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      console.error("JWT_SECRET is not defined in environment variables.");
      return NextResponse.json(
        { error: "Server configuration error. Please try again later." },
        { status: 500 }
      );
    }

    const token = jwt.sign(
      { userId: newUser._id },
      JWT_SECRET,
      { expiresIn: "10d" } // ✅ 10-day token expiry
    );

    // Step 5: Send response with token in secure cookie
    const response = NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 10 * 24 * 60 * 60, // ✅ 10 days in seconds
      path: "/",
      sameSite: "lax",
    });

    return response;

  } catch (error) {
    // 🔍 Mongoose validation error
    if (error instanceof mongoose.Error.ValidationError) {
      const errorMessage = Object.values(error.errors)
        .map(err => err.message)
        .join(", ");
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    // 🔍 Duplicate key (MongoDB unique index error)
    if (error && typeof error === "object" && "code" in error && error.code === 11000) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    // 🔍 JWT or internal config error
    if (error instanceof Error && error.message.includes("secret or public key must be provided")) {
      return NextResponse.json(
        { error: "JWT secret configuration error." },
        { status: 500 }
      );
    }

    // 🔍 Fallback
    console.error("Unexpected error during signup:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
