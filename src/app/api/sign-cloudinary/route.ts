import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

interface RequestBody {
  paramsToSign: Record<string, string>;
}

export async function POST(req: Request) {
  try {
    const body: RequestBody = await req.json();

    const signature = cloudinary.utils.api_sign_request(
      body.paramsToSign,
      process.env.CLOUDINARY_API_SECRET as string
    );

    return NextResponse.json({ signature }, { status: 200 });
  } catch (error) {
    console.error('Error generating signature:', error);
    return NextResponse.json(
      { error: 'Failed to generate signature' },
      { status: 500 }
    );
  }
}
