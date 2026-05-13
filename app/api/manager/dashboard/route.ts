import { NextResponse } from 'next/server';
import { db } from '@/lib/turso';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) return NextResponse.json({ error: 'ManagerId missing' }, { status: 400 });

    // 1. Fetch Team Members (Direct Reports)
    const membersRes = await db.execute({
      sql: `SELECT u.*, 
            (SELECT mood_key FROM mood_checkins WHERE user_id = u.id ORDER BY created_at DESC LIMIT 1) as mood,
            (SELECT COUNT(*) FROM daily_priorities WHERE user_id = u.id AND is_done = 1) as tasks_done,
            (SELECT COUNT(*) FROM daily_priorities WHERE user_id = u.id) as tasks_total
            FROM users u WHERE u.manager_id = ?`,
      args: [userId]
    });

    const members = membersRes.rows.map(m => ({
      id: m.id,
      name: m.name,
      role: m.job_title || 'Team Member',
      mood: m.mood || 'neutral',
      wellbeing: m.mood === 'joy' ? 90 : m.mood === 'stress' ? 30 : 70,
      tasks: { done: Number(m.tasks_done), total: Number(m.tasks_total) },
      streak: m.streak || 0,
      status: Number(m.tasks_done) === Number(m.tasks_total) && Number(m.tasks_total) > 0 ? 'Excellent' : 'On track',
      statusTone: m.mood === 'stress' ? 'coral' : 'sage'
    }));

    // 2. Fetch Team Goals
    const memberIds = members.map(m => String(m.id)).concat([userId]);
    const placeholders = memberIds.map(() => '?').join(',');
    
    const goalsRes = await db.execute({
      sql: `SELECT * FROM goals WHERE scope = 'team' AND owner_id IN (${placeholders})`,
      args: memberIds
    });

    const goals = goalsRes.rows.map(g => ({
      id: g.id,
      title: g.title,
      progress: g.progress,
      members: members.length + 1,
      due: g.due_date,
      tone: g.tone || 'blue',
      onTrack: Number(g.progress) > 40
    }));

    return NextResponse.json({ members, goals });
  } catch (error) {
    console.error("Manager Dashboard Error:", error);
    return NextResponse.json({ error: 'Failed to fetch manager data' }, { status: 500 });
  }
}
