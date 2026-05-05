import { NextResponse } from "next/server";
import { db } from "@/lib/turso";
import { v4 as uuidv4 } from "uuid";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  try {
    let sql = "SELECT * FROM director_questions ORDER BY created_at DESC";
    let args: any[] = [];
    
    if (userId) {
      sql = "SELECT * FROM director_questions WHERE user_id = ? ORDER BY created_at DESC";
      args = [userId];
    }

    const res = await db.execute({ sql, args });
    return NextResponse.json({ questions: res.rows });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch questions" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId, question } = await req.json();
    
    if (!userId || !question) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const id = uuidv4();
    await db.execute({
      sql: "INSERT INTO director_questions (id, user_id, question) VALUES (?, ?, ?)",
      args: [id, userId, question]
    });

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to submit question" }, { status: 500 });
  }
}
