import { NextResponse } from 'next/server';
import { db } from '@/lib/turso';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) return NextResponse.json({ error: 'UserId missing' }, { status: 400 });

    // 1. Fetch User
    const userRes = await db.execute({
      sql: "SELECT * FROM users WHERE id = ?",
      args: [userId]
    });
    const userRow = userRes.rows[0];
    if (!userRow) return NextResponse.json({ state: null, user: null });

    const user = {
      id: userRow.id,
      name: userRow.name,
      role: userRow.role,
      streak: userRow.streak,
      points: userRow.points,
      level: userRow.level,
      rank: userRow.rank,
      avatarImage: userRow.avatar_image,
      avatarConfig: JSON.parse(userRow.avatar_config_json as string || '{}'),
      userRole: userRow.user_role_context || userRow.role
    };

    // 2. Fetch State components
    const prioritiesRes = await db.execute({
      sql: "SELECT * FROM daily_priorities WHERE user_id = ?",
      args: [userId]
    });
    const priorities = prioritiesRes.rows.map(r => ({
      id: r.id, title: r.title, goal: r.goal_title, energy: r.energy_level, est: r.est_time, done: !!r.is_done, tone: r.tone
    }));

    const weeklyRes = await db.execute({
      sql: "SELECT * FROM weekly_priorities WHERE user_id = ?",
      args: [userId]
    });
    const weeklyPriorities = weeklyRes.rows.map(r => ({
      id: r.id, text: r.text, done: !!r.is_done
    }));

    const habitsRes = await db.execute({
      sql: "SELECT * FROM habits WHERE user_id = ?",
      args: [userId]
    });
    const habits = habitsRes.rows.map(r => ({
      name: r.name, streak: r.streak, target: r.target_days, done: !!r.is_done_today, glyph: r.glyph
    }));

    const goalsRes = await db.execute({
      sql: "SELECT * FROM goals WHERE owner_id = ?",
      args: [userId]
    });
    const goals = goalsRes.rows.map(r => ({
      id: r.id, title: r.title, progress: r.progress, alignment: r.alignment, due: r.due_date, tone: r.tone, metric: r.metric, scope: r.scope, parent_id: r.parent_id
    }));

    const surveysRes = await db.execute("SELECT * FROM surveys WHERE status = 'active'");
    const surveys = surveysRes.rows.map(r => ({
      id: r.id, title: r.title, url: r.url, publishedAt: r.published_at, status: r.status
    }));

    // Mock other state parts for now to maintain UI compatibility
    const state = {
      mood: 'calm',
      energy: 'mid',
      priorities,
      weeklyPriorities,
      habits,
      goals,
      surveys,
      feed: [],
      skills: [],
      learning: [],
      wellbeing: { dims: [], programs: [], dailyPrompt: "" },
      points: user.points,
      notifications: 0,
      logbook: [],
      lastActivityDate: userRow.last_activity_at,
      penaltyActive: false
    };

    return NextResponse.json({ state, user });
  } catch (error) {
    console.error("Turso Fetch Error:", error);
    return NextResponse.json({ error: 'Failed to read data from Turso' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { state, user, userId } = await request.json();
    if (!user || !userId || !state) return NextResponse.json({ error: 'User data, state or ID missing' });

    // Update User
    await db.execute({
      sql: `UPDATE users SET name = ?, streak = ?, points = ?, level = ?, rank = ?, avatar_image = ?, avatar_config_json = ?, user_role_context = ?, last_activity_at = ? WHERE id = ?`,
      args: [
        user.name, user.streak, user.points, user.level, user.rank, 
        user.avatarImage || null, JSON.stringify(user.avatarConfig || {}), 
        user.userRole || user.role, state.lastActivityDate, userId
      ]
    });

    // Sync Daily Priorities
    if (state.priorities) {
      await db.execute({ sql: "DELETE FROM daily_priorities WHERE user_id = ?", args: [userId] });
      for (const p of state.priorities) {
        await db.execute({
          sql: `INSERT INTO daily_priorities (user_id, title, goal_title, energy_level, est_time, is_done, tone) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          args: [userId, p.title, p.goal, p.energy, p.est, p.done ? 1 : 0, p.tone]
        });
      }
    }

    // Sync Weekly Priorities
    if (state.weeklyPriorities) {
      await db.execute({ sql: "DELETE FROM weekly_priorities WHERE user_id = ?", args: [userId] });
      for (const w of state.weeklyPriorities) {
        await db.execute({
          sql: `INSERT INTO weekly_priorities (user_id, text, is_done) VALUES (?, ?, ?)`,
          args: [userId, w.text, w.done ? 1 : 0]
        });
      }
    }

    // Sync Habits
    if (state.habits) {
      await db.execute({ sql: "DELETE FROM habits WHERE user_id = ?", args: [userId] });
      for (const h of state.habits) {
        await db.execute({
          sql: `INSERT INTO habits (user_id, name, streak, target_days, is_done_today, glyph) VALUES (?, ?, ?, ?, ?, ?)`,
          args: [userId, h.name, h.streak, h.target, h.done ? 1 : 0, h.glyph]
        });
      }
    }

    // Sync Goals
    if (state.goals) {
      for (const g of state.goals) {
        // We use INSERT OR REPLACE (UPSERT) logic
        await db.execute({
          sql: `INSERT INTO goals (id, owner_id, title, progress, alignment, due_date, tone, metric, scope, parent_id) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(id) DO UPDATE SET 
                title=excluded.title, progress=excluded.progress, alignment=excluded.alignment, 
                due_date=excluded.due_date, tone=excluded.tone, metric=excluded.metric, 
                scope=excluded.scope, parent_id=excluded.parent_id`,
          args: [String(g.id), userId, g.title, g.progress, g.alignment, g.due, g.tone, g.metric, g.scope, g.parent_id || null]
        });
      }
    }

    return NextResponse.json({ success: true, message: 'Updated Turso successfully' });
  } catch (error) {
    console.error("Turso Save Error:", error);
    return NextResponse.json({ error: 'Failed to save data to Turso' }, { status: 500 });
  }
}
