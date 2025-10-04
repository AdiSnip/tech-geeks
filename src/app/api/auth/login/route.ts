// src/app/api/auth/login/route.ts

import { NextResponse } from "next/server";
import dbConnect from "@/libs/db";
import { User } from "@/models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find user (case-insensitive email)
    const user = await User.findOne({
      email: { $regex: `^${email.trim()}$`, $options: "i" },
    }).select("+password");

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password || "");
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // --- Generate JWT ---
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      console.error("JWT_SECRET is not defined.");
      return NextResponse.json(
        { error: "Server configuration error. Please try again." },
        { status: 500 }
      );
    }

    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: "10d" } // ✅ 10-day expiry
    );

    // --- Build user object to return ---
    const userData = {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      location: user.location,
      profilePicture: user.profilePicture,
      businessType: user.businessType,
      profileComplete: user.profileComplete,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    // --- Set JWT Cookie ---
    const response = NextResponse.json(
      {
        message: "Login successful",
        user: userData, // ✅ Optional: Return user object
      },
      { status: 200 }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 10 * 24 * 60 * 60, // ✅ 10 days in seconds
      path: "/",
      sameSite: "lax",
    });

    return response;

  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
