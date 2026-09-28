import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE_PATH = path.join(process.cwd(), 'src/lib/about-data.json');

export async function GET() {
  try {
    if (!fs.existsSync(DATA_FILE_PATH)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }
    const rawData = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
    const data = JSON.parse(rawData);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(body, null, 2), 'utf-8');
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
