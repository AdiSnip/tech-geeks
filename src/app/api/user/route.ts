import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/libs/db";
import { User } from "@/models/user.model";
import { Entrepreneur } from "@/models/entrepreneur.model";

// ------------------ Utility: Parse cookies ------------------
function parseCookies(req: NextRequest): Record<string, string> {
  const cookieHeader = req.headers.get("cookie") || "";
  return Object.fromEntries(
    cookieHeader
      .split(";")
      .map((c) => c.trim().split("="))
      .map(([k, v]) => [k, decodeURIComponent(v)])
  );
}

// ------------------ Utility: Verify JWT ------------------
function verifyToken(token: string): { userId: string; role: string } {
  return jwt.verify(token, process.env.JWT_SECRET!) as { userId: string; role: string };
}

// ------------------ GET: Fetch current user ------------------
export async function GET(req: NextRequest) {
  await dbConnect();

  const cookies = parseCookies(req);
  const token = cookies["token"];

  if (!token) {
    return NextResponse.json({ error: "Authentication token not found" }, { status: 401 });
  }

  try {
    const { userId, role } = verifyToken(token);

    // Determine which model to query
    const Model = role === "entrepreneur" || role === "admin" ? Entrepreneur : User;
    const user = await Model.findById(userId).lean();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Remove sensitive data
    delete (user as { password?: string }).password;

    return NextResponse.json(user, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Invalid token" },
      { status: 401 }
    );
  }
}

// ------------------ POST: Update user data ------------------
export async function POST(req: NextRequest) {
  await dbConnect();

  const cookies = parseCookies(req);
  const token = cookies["token"];

  if (!token) {
    return NextResponse.json({ error: "Authentication token not found" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { userId, role } = verifyToken(token);

    // Choose correct model based on role
    const Model = role === "entrepreneur" || role === "admin" ? Entrepreneur : User;

    // Define allowed fields based on model
    const updateData: Record<string, string | number | boolean | undefined> = {};

    // Common fields
    if (body.email) updateData.email = body.email;
    if (body.name) updateData.name = body.name;
    if (body.location) updateData.location = body.location;
    if (body.profilePicture) updateData.profilePicture = body.profilePicture;

    // Entrepreneur-specific
    if (role === "entrepreneur" || role === "admin") {
      if (body.businessType) updateData.businessType = body.businessType;
      if (body.companyName) updateData.companyName = body.companyName;
      if (body.companyDescription) updateData.companyDescription = body.companyDescription;
      if (body.website) updateData.website = body.website;
      if (body.industry) updateData.industry = body.industry;
      if (typeof body.profileComplete === "number")
        updateData.profileComplete = body.profileComplete;
    }

    const updatedUser = await Model.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).lean();

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    delete (updatedUser as { password?: string }).password;

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Something went wrong" },
      { status: 400 }
    );
  }
}
