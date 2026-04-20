"use client";

import React from "react";

interface ShellProps {
  children: React.ReactNode;
}

export default function Shell({ children }: ShellProps) {
  return (
    <div className="hp-shell">
      {/* Decorative Surround (Desktop Only) */}
      <div className="hp-surround left">
        <h4><span className="dot" />Human-centered</h4>
        <p>Society 5.0 — nada empatik, bukan corporate pressure. Nunito rounded untuk terasa personal.</p>
        <h4><span className="dot" />3-layer dashboard</h4>
        <p>Emotional check-in → Focus & task (3–5 prioritas) → Reflection & reward. Bukan analytics berat.</p>
        <h4><span className="dot" />Energy-based productivity</h4>
        <p>Saran task menyesuaikan level energi, bukan sekadar deadline.</p>
      </div>

      <div className="hp-surround right">
        <h4><span className="dot" />Coba flow ini</h4>
        <p>1. Tap "Bagaimana perasaanmu" — check-in 3 langkah.<br />2. Set intention hari ini.<br />3. Tap floating AI coach kanan bawah.<br />4. Tab Recognize → "Beri apresiasi".<br />5. Tab Wellbeing → Pause button (breathing).</p>
        <h4><span className="dot" />Notifikasi empatik</h4>
        <p>Tap bell di kanan atas untuk melihat tone: "Hei, bagaimana perasaanmu hari ini?" bukan "Complete check-in".</p>
        <h4><span className="dot" />No leaderboard</h4>
        <p>Gamification mindful — streak & milestone personal, bukan ranking antar karyawan.</p>
      </div>

      {/* Main Content Container (Mobile-First Device Profile) */}
      <div style={{ 
        position: 'relative', 
        height: '100%', 
        width: '100%',
        background: 'var(--hp-paper)', 
        overflow: 'hidden',
        borderRadius: '40px',
        boxShadow: '0 40px 100px rgba(0,0,0,0.1)',
        border: '12px solid #2C2A28'
      }}>
        <div style={{ position: 'absolute', inset: 0, overflowY: 'auto' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
