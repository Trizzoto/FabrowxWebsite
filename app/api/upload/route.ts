import { NextResponse } from 'next/server';
import * as cloudinary from 'cloudinary';

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: 'dz8iqfdvf',
  api_key: '533469477878659',
  api_secret: 'BUbjVnSyBZJ0RD_xiKV5Fsn3KZc'
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const section = formData.get('section') as string || 'hero';
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Convert File to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary with folder structure
    const result = await new Promise((resolve, reject) => {
      cloudinary.v2.uploader.upload_stream(
        {
          resource_type: 'auto',
          folder: `elite-fabworx/${section}`,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
} 