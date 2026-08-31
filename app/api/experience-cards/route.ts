import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { NextRequest, NextResponse } from 'next/server';

const DATA_FILE = join(process.cwd(), 'public', 'data', 'experience-cards.json');

const DEFAULT_DATA = [
  {
    id: '1',
    title: 'SLOW MORNINGS',
    description: 'Private balcony, soft light, nowhere to rush.',
    image: '/assets/america1.png'
  },
  {
    id: '2',
    title: 'TASTE WITH MAKERS',
    description: 'Intimate tastings, never crowded tours.',
    image: '/assets/asia1.png'
  },
  {
    id: '3',
    title: 'TIME TO YOURSELF',
    description: 'Quiet corners and unhurried hours.',
    image: '/assets/europa1.png'
  },
  {
    id: '4',
    title: 'PRIVATE & PERSONAL',
    description: 'One dedicated host, your exact pace.',
    image: '/assets/room-all.png'
  }
];

// GET - Load Experience Cards
export async function GET() {
  try {
    if (existsSync(DATA_FILE)) {
      const data = readFileSync(DATA_FILE, 'utf-8');
      return NextResponse.json(JSON.parse(data));
    }
    return NextResponse.json(DEFAULT_DATA);
  } catch (error) {
    console.error('Error loading experience cards:', error);
    return NextResponse.json(DEFAULT_DATA);
  }
}

// POST - Save Experience Cards
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Ensure directory exists
    const dir = join(process.cwd(), 'public', 'data');
    if (!existsSync(dir)) {
      const fs = require('fs');
      fs.mkdirSync(dir, { recursive: true });
    }

    // Write to file
    writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

    return NextResponse.json({
      success: true,
      message: 'Experience cards saved successfully'
    });
  } catch (error) {
    console.error('Error saving experience cards:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save experience cards' },
      { status: 500 }
    );
  }
}
