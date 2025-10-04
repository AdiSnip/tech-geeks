// src/app/api/User/route.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { User } from "@/models/user.model";
import dbConnect from "@/libs/db";

// Utility: Parse cookies from headers
function parseCookies(req: Request): Record<string, string> {
  const cookieHeader = req.headers.get("cookie") || "";
  return Object.fromEntries(
    cookieHeader
      .split(";")
      .map(c => c.trim().split("="))
      .map(([k, v]) => [k, decodeURIComponent(v)])
  );
}

// Utility: Verify JWT and return userId
function verifyToken(token: string): { userId: string } {
  return jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
}

// GET: Fetch current user
export async function GET(req: Request) {

  await dbConnect()
  
  const cookies = parseCookies(req);
  const token = cookies["token"];

  if (!token) {
    return NextResponse.json({ error: "Authentication token not found" }, { status: 401 });
  }

  try {
    const { userId } = verifyToken(token);
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Invalid token" },
      { status: 401 }
    );
  }
}

// POST: Update user data
export async function POST(req: Request) {
  const cookies = parseCookies(req);
  const token = cookies["token"];

  if (!token) {
    return NextResponse.json({ error: "Authentication token not found" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      email,
      password,
      role,
      name,
      location,
      profilePicture,
      businessType,
      profileComplete,
    }: {
      email?: string;
      password?: string;
      role?: string;
      name?: string;
      location?: string;
      profilePicture?: string;
      businessType?: string;
      profileComplete?: boolean;
    } = body;

    const { userId } = verifyToken(token);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        email,
        password,
        role,
        name,
        location,
        profilePicture,
        businessType,
        profileComplete,
      },
      { new: true, runValidators: true }
    ).select("+password");

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Something went wrong" },
      { status: 400 }
    );
  }
}
