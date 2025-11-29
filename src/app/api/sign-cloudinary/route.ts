import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

interface RequestBody {
  paramsToSign: Record<string, string>;
}

export async function POST(req: Request) {
  try {
    const body: RequestBody = await req.json();

    if (!process.env.CLOUDINARY_API_SECRET) {
      throw new Error('Server configuration incomplete.');
    }

    // Sign only allowed params: folder, timestamp (widget will add source=uw automatically)
    const signature = cloudinary.utils.api_sign_request(
      body.paramsToSign,
      process.env.CLOUDINARY_API_SECRET
    );

    return NextResponse.json({ signature }, { status: 200 });
  } catch (error) {
    console.error('Error generating signature:', error);
    return NextResponse.json({ error: 'Failed to generate signature' }, { status: 500 });
  }
}
