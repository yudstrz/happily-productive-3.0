import { NextResponse } from "next/server";
import { db } from "@/lib/turso";

export async function GET() {
  const userId = "user_admin";
  const report: any[] = [];

  const runTest = async (name: string, sql: string, args: any[] = []) => {
    try {
      await db.execute({ sql, args });
      report.push({ name, status: "OK" });
    } catch (e: any) {
      report.push({ name, status: "ERROR", message: e.message });
    }
  };

  await runTest("Users Table", "SELECT * FROM users LIMIT 1");
  await runTest("Daily Priorities", "SELECT * FROM daily_priorities LIMIT 1");
  await runTest("Goals", "SELECT * FROM goals LIMIT 1");
  await runTest("Kudos Join", `SELECT k.*, s.name as sender_name, r.name as receiver_name 
             FROM kudos k 
             JOIN users s ON k.sender_id = s.id 
             JOIN users r ON k.receiver_id = r.id 
             LIMIT 1`);
  
  // Specific check for columns used in storage route
  await runTest("User Coins Column", "SELECT coins FROM users LIMIT 1");
  await runTest("Goal Status/KPI Columns", "SELECT status, is_kpi FROM goals LIMIT 1");
  await runTest("Priority GoalID Column", "SELECT goal_id FROM daily_priorities LIMIT 1");

  return NextResponse.json({ report });
}
