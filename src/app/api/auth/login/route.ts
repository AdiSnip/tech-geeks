import { NextResponse } from "next/server";
import dbConnect from "@/libs/db";
import { User } from "@/models/user.model";
import bcrypt from "bcrypt";

// Simple login route
export async function POST(request: Request) {
  try {
    // Connect to MongoDB
    await dbConnect();

    // Parse request body
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }
    console.log("User email from DB:", email);
    console.log("Password from request:", password);


    // Find user in DB
    const user = await User.findOne({ email: { $regex: `^${email.trim()}$`, $options: "i" } }).select("+password");

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password || "");
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // Successful login
    return NextResponse.json({
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
