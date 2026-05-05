"use client";

import React, { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import HPCard from "@/components/ui/HPCard";
import { HP_TOKENS, HP_FONT, HP_TEXT } from "@/lib/constants";
import HPGlyph from "@/components/ui/HPGlyph";
import HPAvatar from "@/components/ui/HPAvatar";

interface HRAttendanceViewProps {
  currentUser: any;
}

export default function HRAttendanceView({ currentUser }: HRAttendanceViewProps) {
  const [qrToken, setQrToken] = useState("");
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/attendance/logs?userId=${currentUser?.id}`);
      const data = await res.json();
      if (data.logs) setLogs(data.logs);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const generateQR = async () => {
    try {
      const res = await fetch("/api/attendance/token");
      const data = await res.json();
      if (data.token) {
        setQrToken(data.token);
        setExpiresAt(new Date(data.expiresAt));
      }
    } catch (e) {
      console.error("Gagal generate QR");
    }
  };

  useEffect(() => {
    if (!expiresAt) return;
    
    const checkExpiry = setInterval(() => {
      if (new Date() >= expiresAt) {
        generateQR();
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(checkExpiry);
  }, [expiresAt]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      
      {/* QR Generator */}
      <HPCard padding={20} style={{ textAlign: 'center', border: `1.5px solid ${HP_TOKENS.blue}40` }}>
        <div style={{ ...HP_TEXT.h, fontSize: 16, marginBottom: 8, color: HP_TOKENS.blue }}>QR Absensi Dinamis</div>
        <div style={{ ...HP_TEXT.small, color: HP_TOKENS.inkMute, marginBottom: 20 }}>
          Berlaku 5 menit. QR akan diperbarui otomatis saat kedaluwarsa.
        </div>

        {qrToken ? (
          <div style={{ 
            background: '#fff', padding: 20, borderRadius: 20, display: 'inline-block',
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)', marginBottom: 20
          }}>
            <QRCodeSVG value={qrToken} size={200} />
            <div style={{ ...HP_TEXT.tiny, color: HP_TOKENS.coral, marginTop: 12, fontWeight: 800 }}>
              Kedaluwarsa pada: {expiresAt?.toLocaleTimeString()}
            </div>
          </div>
        ) : (
          <div style={{ padding: '40px 0' }}>
            <HPGlyph name="target" size={48} color={HP_TOKENS.line} />
          </div>
        )}

        <button onClick={generateQR} style={{
          width: '100%', padding: '16px', borderRadius: 99,
          background: HP_TOKENS.blue, color: '#fff', border: 'none',
          fontFamily: HP_FONT, fontWeight: 800, fontSize: 15, cursor: 'pointer',
        }} className="hp-tap">
          {qrToken ? "Generate QR Baru" : "Tampilkan QR Absen"}
        </button>
      </HPCard>

      {/* Logs Table/List */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ ...HP_TEXT.h, fontSize: 15 }}>Log Absensi Terbaru</div>
          <button onClick={fetchLogs} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
            <HPGlyph name="refresh" size={14} color={HP_TOKENS.blue} />
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 20, color: HP_TOKENS.inkMute }}>Loading logs...</div>
        ) : logs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, border: `1.5px dashed ${HP_TOKENS.line}`, borderRadius: 20, color: HP_TOKENS.inkMute }}>
            Belum ada data absensi
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {logs.map((log: any) => (
              <HPCard key={log.id} padding={12}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <HPAvatar name={log.user_name} size={40} />
                  <div style={{ flex: 1 }}>
                    <div style={{ ...HP_TEXT.h, fontSize: 14 }}>{log.user_name}</div>
                    <div style={{ ...HP_TEXT.tiny, color: HP_TOKENS.inkMute, marginTop: 2 }}>
                      {new Date(log.check_in_at).toLocaleString('id-ID')}
                    </div>
                  </div>
                  <div style={{
                    padding: '4px 10px', borderRadius: 10, fontSize: 10, fontWeight: 800, fontFamily: HP_FONT,
                    background: HP_TOKENS.sageSoft, color: HP_TOKENS.sage
                  }}>
                    {log.status.toUpperCase()}
                  </div>
                </div>
              </HPCard>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
