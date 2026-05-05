import { NextResponse } from "next/server";
import { db } from "@/lib/turso";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const adminId = searchParams.get('adminId');

    if (!adminId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const adminCheck = await db.execute({
      sql: "SELECT role FROM users WHERE id = ?",
      args: [adminId]
    });

    const role = adminCheck.rows[0]?.role;
    if (role !== 'admin' && role !== 'hr') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const res = await db.execute("SELECT id, name, email, role, level, points, job_title, department, manager_id FROM users ORDER BY created_at DESC");
    
    return NextResponse.json({ users: res.rows });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
