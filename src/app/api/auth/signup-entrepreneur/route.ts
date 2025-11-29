import dbConnect from "@/libs/db";
import { Entrepreneur } from "@/models/entrepreneur.model";
import { NextResponse } from "next/server";
import { z } from "zod";
import jwt from "jsonwebtoken";

// ---------------- Zod Schema ----------------
const EntrepreneurSignupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  businessType: z.string().min(2, "Business type is required"),
  companyName: z.string().min(2, "Company name is required"),
  industry: z.string().min(2, "Industry is required"),
  companyDescription: z.string().optional(),
  website: z.string().optional(),
  location: z.object({
    address: z.string().min(2),
    city: z.string().min(2),
    state: z.string().min(2),
    zipCode: z.string().min(2),
    country: z.string().min(2),
  }),
});

// ---------------- POST Handler ----------------
export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();

    // Validate request
    const validatedData = EntrepreneurSignupSchema.parse(body);

    // Check for duplicate email
    const existingUser = await Entrepreneur.findOne({ email: validatedData.email });
    if (existingUser) {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 });
    }

// Create user (no manual hashing)
    const newUser = new Entrepreneur({
      ...validatedData,
      role: "entrepreneur",
    });
    await newUser.save();


    // Generate JWT
    const token = jwt.sign({ userId: newUser._id, role: newUser.role }, process.env.JWT_SECRET!, { expiresIn: "10d" });

    const response = NextResponse.json(
      { message: "Entrepreneur account created successfully", user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role } },
      { status: 201 }
    );

    // Set cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 10 * 24 * 60 * 60,
      path: "/",
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues.map(e => e.message).join(", ") }, { status: 400 });
    }

    console.error("Entrepreneur signup error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
