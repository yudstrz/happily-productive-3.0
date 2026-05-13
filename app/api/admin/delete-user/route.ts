import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { eq, and } from 'drizzle-orm';
import { users } from '@/lib/schema';

export async function POST(req: Request) {
  try {
    const { requesterId, targetUserId } = await req.json();

    if (!requesterId || !targetUserId) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    // 1. Verify requester is an HR/Admin
    const [adminUser] = await db.select().from(users).where(eq(users.id, requesterId)).limit(1);
    
    if (!adminUser || adminUser.role !== 'hr') {
      return NextResponse.json({ error: 'Unauthorized. HR access required.' }, { status: 403 });
    }

    // 2. Delete the user
    // Note: In a production app, you might want to do a "soft delete" or handle related records.
    // Here we do a direct delete for simplicity of the management console.
    await db.delete(users).where(eq(users.id, targetUserId));

    return NextResponse.json({ success: true, message: 'User deleted successfully' });
  } catch (error: any) {
    console.error('Delete User Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
