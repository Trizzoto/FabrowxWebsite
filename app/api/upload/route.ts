import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Route segment config
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const section = formData.get('section') as string || 'general';

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a temporary file path
    const tempFilePath = `/tmp/${file.name}`;
    require('fs').writeFileSync(tempFilePath, buffer);

    // Upload to Cloudinary
    try {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload(
          tempFilePath,
          {
            folder: `elite-fabworx/${section}`,
            resource_type: 'auto',
          },
          (error, result) => {
            // Clean up temp file
            try {
              require('fs').unlinkSync(tempFilePath);
            } catch (e) {
              console.error('Error cleaning up temp file:', e);
            }

            if (error) {
              console.error('Cloudinary upload error:', error);
              reject(error);
            } else {
              resolve(result);
            }
          }
        );
      });

      return NextResponse.json(result);
    } catch (error) {
      console.error('Upload to Cloudinary failed:', error);
      return NextResponse.json(
        { error: 'Failed to upload to Cloudinary' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to process upload' },
      { status: 500 }
    );
  }
} 