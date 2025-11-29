import dbConnect from "@/libs/db";
import { User } from "@/models/user.model";
import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Schema aligned with frontend
const UserSignupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['user', 'entrepreneur']),
  businessType: z.string().optional(),
  companyName: z.string().optional(),
  companyDescription: z.string().optional(),
  website: z.string().optional(),
  industry: z.string().optional(),
  location: z.object({
    address: z.string().min(2),
    city: z.string().min(2),
    state: z.string().min(2),
    zipCode: z.string().min(2),
    country: z.string().min(2),
  }),
});

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();

    const validatedData = UserSignupSchema.parse(body);

    const existingUser = await User.findOne({ email: validatedData.email });
    if (existingUser) {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 });
    }

// Create user (no manual hashing)
    const newUser = new User({
      ...validatedData,
      role: "user",
    });
    await newUser.save();


    const token = jwt.sign({ userId: newUser._id, role: newUser.role }, process.env.JWT_SECRET!, { expiresIn: '10d' });

    const response = NextResponse.json(
      { message: 'Signup successful', user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role } },
      { status: 201 }
    );

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 10 * 24 * 60 * 60,
      path: '/',
      sameSite: 'lax',
    });

    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues.map(e => e.message).join(", ") }, { status: 400 });
    }
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
