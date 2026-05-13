import { NextResponse } from "next/server";
import { db } from "@/lib/turso";

export async function POST(request: Request) {
  try {
    const { requesterId, targetUserId } = await request.json();

    if (!requesterId || !targetUserId) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    // Verify if requester is admin
    const requesterCheck = await db.execute({
      sql: "SELECT role FROM users WHERE id = ?",
      args: [requesterId]
    });

    const role = requesterCheck.rows[0]?.role;
    if (role !== 'admin' && role !== 'hr') {
      return NextResponse.json({ error: "Unauthorized. Only admins or HR can delete users." }, { status: 403 });
    }

    // Prevent deleting self
    if (requesterId === targetUserId) {
      return NextResponse.json({ error: "Cannot delete your own account." }, { status: 400 });
    }

    // Delete related data first (simplified for prototype)
    // In a real app, we'd handle foreign keys more carefully or use ON DELETE CASCADE
    await db.execute({ sql: "DELETE FROM mood_checkins WHERE user_id = ?", args: [targetUserId] });
    await db.execute({ sql: "DELETE FROM goals WHERE owner_id = ?", args: [targetUserId] });
    await db.execute({ sql: "DELETE FROM daily_priorities WHERE user_id = ?", args: [targetUserId] });
    await db.execute({ sql: "DELETE FROM weekly_priorities WHERE user_id = ?", args: [targetUserId] });
    await db.execute({ sql: "DELETE FROM habits WHERE user_id = ?", args: [targetUserId] });
    await db.execute({ sql: "DELETE FROM user_skills WHERE user_id = ?", args: [targetUserId] });
    await db.execute({ sql: "DELETE FROM xp_transactions WHERE user_id = ?", args: [targetUserId] });
    
    // Finally delete the user
    await db.execute({
      sql: "DELETE FROM users WHERE id = ?",
      args: [targetUserId]
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete User Error:", error);
    return NextResponse.json({ error: "Gagal menghapus user" }, { status: 500 });
  }
}
