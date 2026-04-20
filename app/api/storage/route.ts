import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// For Vercel: read-only access to included data.
// For Prototype persistence: in-memory global state (resets on cold start).
let inMemoryState: any = null;

export async function GET() {
  try {
    if (inMemoryState) {
      return NextResponse.json(inMemoryState);
    }
    const storagePath = path.join(process.cwd(), 'data/storage.json');
    const data = fs.readFileSync(storagePath, 'utf8');
    inMemoryState = JSON.parse(data);
    return NextResponse.json(inMemoryState);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newData = await request.json();
    // We cannot persistently write to project files on Vercel at runtime.
    // We update the in-memory state for the current session.
    inMemoryState = newData;
    return NextResponse.json({ success: true, message: 'Updated in-memory (Prototype mode)' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
  }
}
