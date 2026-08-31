import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const cardId = formData.get('cardId') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Create filename with card ID
    const ext = file.name.split('.').pop() || 'png';
    const filename = `experience-card-${cardId}.${ext}`;

    // Ensure uploads directory exists
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'experience-cards');
    if (!existsSync(uploadsDir)) {
      mkdirSync(uploadsDir, { recursive: true });
    }

    // Write file
    const filepath = join(uploadsDir, filename);
    const bytes = await file.arrayBuffer();
    writeFileSync(filepath, Buffer.from(bytes));

    // Return the public path
    const imagePath = `/uploads/experience-cards/${filename}`;

    return NextResponse.json({
      success: true,
      imagePath,
      message: 'Image uploaded successfully'
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}
