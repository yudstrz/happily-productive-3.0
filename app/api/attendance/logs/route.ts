import { NextResponse } from "next/server";
import { db } from "@/lib/turso";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "UserId required" }, { status: 400 });
    }

    // Check role
    const userCheck = await db.execute({
      sql: "SELECT role FROM users WHERE id = ?",
      args: [userId]
    });
    const role = userCheck.rows[0]?.role;

    let query = "";
    let args: any[] = [];

    if (role === 'admin' || role === 'hr') {
      // HR/Admin sees everyone
      query = `
        SELECT a.*, u.name as user_name, u.email as user_email 
        FROM attendance a 
        JOIN users u ON a.user_id = u.id 
        ORDER BY a.check_in_at DESC
      `;
    } else if (role === 'manager') {
      // Manager sees subordinates
      query = `
        SELECT a.*, u.name as user_name, u.email as user_email 
        FROM attendance a 
        JOIN users u ON a.user_id = u.id 
        WHERE u.manager_id = ? 
        ORDER BY a.check_in_at DESC
      `;
      args = [userId];
    } else {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const res = await db.execute({ sql: query, args });
    return NextResponse.json({ logs: res.rows });
  } catch (error) {
    console.error("Attendance Logs Error:", error);
    return NextResponse.json({ error: "Failed to fetch logs" }, { status: 500 });
  }
}
