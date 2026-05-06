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

    // Fetch Goals with Sub-goals
    const goalsRes = await db.execute({
      sql: "SELECT * FROM goals WHERE owner_id = ?",
      args: [userId]
    });
    const goals = await Promise.all(goalsRes.rows.map(async (r) => {
      const subGoalsRes = await db.execute({
        sql: "SELECT * FROM sub_goals WHERE goal_id = ?",
        args: [String(r.id)]
      });
      return {
        id: r.id, 
        title: r.title, 
        progress: r.progress, 
        alignment: r.alignment, 
        due: r.due_date, 
        tone: r.tone, 
        metric: r.metric, 
        scope: r.scope,
        subGoals: subGoalsRes.rows.map(sr => ({ id: sr.id, title: sr.title, done: !!sr.is_done }))
      };
    }));

    const surveysRes = await db.execute("SELECT * FROM surveys WHERE status = 'active'");
    const surveys = surveysRes.rows.map(r => ({
      id: r.id, title: r.title, url: r.url, publishedAt: r.published_at, status: r.status
    }));

    // Fetch Latest Mood Checkin
    const moodRes = await db.execute({
      sql: "SELECT mood_key, energy_key, tag FROM mood_checkins WHERE user_id = ? ORDER BY created_at DESC LIMIT 1",
      args: [userId]
    });
    const latestMood = moodRes.rows[0];

    // Fetch Kudos for Feed (Correlated)
    const kudosRes = await db.execute({
      sql: `SELECT k.*, s.name as sender_name, r.name as receiver_name 
            FROM kudos k 
            JOIN users s ON k.sender_id = s.id 
            JOIN users r ON k.receiver_id = r.id 
            ORDER BY k.created_at DESC LIMIT 10`,
    });
    const feed = kudosRes.rows.map(r => ({
      id: r.id, from: r.sender_name, to: r.receiver_name, value: r.value_tag, msg: r.message, likes: r.likes_count, time: 'Baru saja'
    }));

    // Fetch Skills
    const skillsRes = await db.execute({
      sql: "SELECT * FROM user_skills WHERE user_id = ?",
      args: [userId]
    });
    const skills = skillsRes.rows.map(r => ({
      name: r.name, current: r.current_level, target: r.target_level
    }));

    // Fetch Today's Attendance
    const todayAttRes = await db.execute({
      sql: "SELECT created_at FROM attendance WHERE user_id = ? AND date(created_at, 'localtime') = date('now', 'localtime') ORDER BY created_at ASC LIMIT 1",
      args: [userId]
    });
    const checkIn = todayAttRes.rows[0]?.created_at as string;

    const todayReflectRes = await db.execute({
      sql: "SELECT created_at FROM logbook_entries WHERE user_id = ? AND type = 'daily_reflection' AND date(created_at, 'localtime') = date('now', 'localtime') ORDER BY created_at DESC LIMIT 1",
      args: [userId]
    });
    const checkOut = todayReflectRes.rows[0]?.created_at as string;

    const state = {
      mood: latestMood?.mood_key || 'calm',
      energy: latestMood?.energy_key || 'mid',
      tag: latestMood?.tag || null,
      priorities,
      weeklyPriorities,
      habits,
      goals,
      surveys,
      feed,
      skills,
      learning: [],
      wellbeing: { dims: [], programs: [], dailyPrompt: "" },
      points: user.points,
      notifications: 0,
      logbook: [],
      lastActivityDate: userRow.last_activity_at,
      penaltyActive: false,
      workSchedule: { start: "08:00", end: "17:00", breakStart: "12:00", breakEnd: "13:00" },
      todayAttendance: {
        checkIn: checkIn ? new Date(checkIn).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : undefined,
        checkOut: checkOut ? new Date(checkOut).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : undefined,
      },
      personalWellbeingGoal: (userRow.personal_wellbeing_goal as string) || "",
      wellbeingRoutine: userRow.wellbeing_routine ? JSON.parse(userRow.wellbeing_routine as string) : []
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
      sql: `UPDATE users SET name = ?, streak = ?, points = ?, level = ?, rank = ?, avatar_image = ?, user_role_context = ?, last_activity_at = ?, personal_wellbeing_goal = ?, wellbeing_routine = ? WHERE id = ?`,
      args: [
        user.name, user.streak, user.points, user.level, user.rank, 
        user.avatarImage || null, 
        user.userRole || user.role, state.lastActivityDate,
        state.personalWellbeingGoal || "",
        JSON.stringify(state.wellbeingRoutine || []),
        userId
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

    // Sync Surveys (Global) - Only if provided in state
    if (state.surveys) {
      // For simplicity, we clear and re-insert active surveys
      // In a real production app, you might want more granular control
      await db.execute("DELETE FROM surveys");
      for (const s of state.surveys) {
        await db.execute({
          sql: "INSERT INTO surveys (title, url, published_at, status) VALUES (?, ?, ?, ?)",
          args: [s.title, s.url, s.publishedAt || new Date().toISOString(), s.status || 'active']
        });
      }
    }

    return NextResponse.json({ success: true, message: 'Updated Turso successfully' });
  } catch (error) {
    console.error("Turso Save Error:", error);
    return NextResponse.json({ error: 'Failed to save data to Turso' }, { status: 500 });
  }
}
