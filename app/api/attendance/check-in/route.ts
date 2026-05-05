import { NextResponse } from "next/server";
import { db } from "@/lib/turso";

const OFFICE_LOCATION = {
  lat: -6.2000, // Placeholder: Jakarta coordinate
  lng: 106.8166
};
const MAX_DISTANCE_METERS = 100000; // Testing: Allow 100km radius

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3; // metres
  const φ1 = lat1 * Math.PI/180;
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lon2-lon1) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c;
}

export async function POST(request: Request) {
  try {
    const { userId, token, lat, lng, mood } = await request.json();

    if (!userId || !token) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    // 1. Verify Token
    const tokenCheck = await db.execute({
      sql: "SELECT expires_at FROM attendance_tokens WHERE token = ?",
      args: [token]
    });

    if (tokenCheck.rows.length === 0) {
      return NextResponse.json({ error: "QR Code tidak valid atau sudah kadaluarsa" }, { status: 400 });
    }

    const expiresAt = new Date(tokenCheck.rows[0].expires_at as string);
    if (expiresAt < new Date()) {
      return NextResponse.json({ error: "QR Code sudah kadaluarsa" }, { status: 400 });
    }

    // 2. Verify Location (Geofencing)
    if (lat && lng) {
      const distance = calculateDistance(lat, lng, OFFICE_LOCATION.lat, OFFICE_LOCATION.lng);
      if (distance > MAX_DISTANCE_METERS) {
        return NextResponse.json({ error: "Anda berada di luar area kantor" }, { status: 403 });
      }
    }

    // 3. Record Attendance
    const id = "att_" + Math.random().toString(36).substring(2, 9);
    await db.execute({
      sql: "INSERT INTO attendance (id, user_id, location_lat, location_lng, mood) VALUES (?, ?, ?, ?, ?)",
      args: [id, userId, lat || null, lng || null, mood || null]
    });

    // 4. Delete Token (Single Use)
    await db.execute({
      sql: "DELETE FROM attendance_tokens WHERE token = ?",
      args: [token]
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Check-in Error:", error);
    return NextResponse.json({ error: "Gagal check-in" }, { status: 500 });
  }
}
