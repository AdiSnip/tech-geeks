// src/app/api/User/route.ts
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { User } from "@/models/user.model";
import { redirect } from "next/dist/server/api-utils";

export async function GET(req: Request) {
  // Read cookie
  const cookieHeader = req.headers.get("cookie") || "";
  const cookies = Object.fromEntries(
    cookieHeader
      .split(";")
      .map(c => c.trim().split("="))
      .map(([k, v]) => [k, decodeURIComponent(v)])
  );

  const token = cookies["token"];
  if (!token) {
    return NextResponse.json({ error: "No token found" }, { status: 500 });
  }

  try {
    const {userId} = jwt.verify(token, process.env.JWT_SECRET!) as {userId: string};
    const user = await User.findById(userId);
    if(!user){
      return NextResponse.json({error: 'User not found'}, {status: 404});
    }
    return NextResponse.json(user);
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Invalid token" },
      { status: 401 }
    );
  }
}

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password, role, name, location, profilePicture, businessType, profileComplete } = body;
  const cookieHeader = req.headers.get("cookie") || "";
  const cookies = Object.fromEntries(
    cookieHeader
      .split(";")
      .map(c => c.trim().split("="))
      .map(([k, v]) => [k, decodeURIComponent(v)])
  );

  const token = cookies["token"];
  if (!token) {
    return NextResponse.json({ error: "No token found" }, { status: 401 });
  }
  try {
    const {userId} = jwt.verify(token, process.env.JWT_SECRET!) as {userId: string};
    const UpdatedUser = await User.findByIdAndUpdate(userId, {
      email,
      password,
      role,
      name,
      location,
      profilePicture,
      businessType,
      profileComplete,
    }).select("+password");
    if(!UpdatedUser){
      return NextResponse.json({error: 'User not found'}, {status: 404});
    }
    return NextResponse.json(UpdatedUser);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid token" },
      { status: 401 }
    );
  }
}
