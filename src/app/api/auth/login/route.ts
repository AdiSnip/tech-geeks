import dbConnect from "@/libs/db";
import { User } from "@/models/user.model";
import { Entrepreneur } from "@/models/entrepreneur.model";
import { NextResponse } from "next/server";
import { z } from "zod";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

// ✅ Zod schema for login input validation
const LoginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(request: Request) {
  try {
    await dbConnect();

    // Step 1: Validate input
    const body = await request.json();
    const { email, password } = LoginSchema.parse(body);

    // Step 2: Find user by email
    console.log("Login attempt:", email);
    const user = await User.findOne({ email }).select("+password") || await Entrepreneur.findOne({ email }).select("+password");
    console.log("User found:", !!user, user?.role);
    if (user) console.log("User password hash:", user.password);
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // Step 3: Compare passwords
    const isMatch = await bcrypt.compare(password, user.password || "");
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // Step 4: Generate JWT
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      console.error("JWT_SECRET not found in environment variables");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: "10d" }
    );

    // Step 5: Send response + cookie
    const response = NextResponse.json(
      {
        message: "Login successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 200 }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 10 * 24 * 60 * 60,
      path: "/",
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      const msg = Object.values(error.errors).map(e => e.message).join(", ");
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    console.error("Login error:", error);
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}
