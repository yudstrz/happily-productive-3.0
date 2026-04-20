"use client";

import React, { useState, useEffect } from "react";
import { 
  HP_TOKENS, 
  HP_FONT, 
  HP_TEXT 
} from "@/lib/constants";
import HPGlyph from "@/components/ui/HPGlyph";

interface PauseModalProps {
  onClose: () => void;
}

const iconBtnStyle: React.CSSProperties = {
  position: 'relative', width: 40, height: 40, borderRadius: 20, border: 'none',
  background: HP_TOKENS.card, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
};

export default function PauseModal({ onClose }: PauseModalProps) {
  const [phase, setPhase] = useState('inhale');
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    const seq = ['inhale', 'hold', 'exhale'];
    let i = 0;
    const id = setInterval(() => {
      i = (i + 1) % 3;
      setPhase(seq[i]);
      if (i === 0) setCycle(c => c + 1);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  const labels: Record<string, string> = { inhale: 'Tarik napas', hold: 'Tahan', exhale: 'Lepaskan' };
  const label = labels[phase as keyof typeof labels] || 'Bernapas';
  const scale = phase === 'inhale' ? 1.2 : phase === 'hold' ? 1.2 : 0.8;

  return (
    <div style={{
      position: 'absolute', 
      inset: 0, 
      zIndex: 100,
      background: `linear-gradient(180deg, ${HP_TOKENS.blueSoft} 0%, ${HP_TOKENS.sageSoft} 100%)`,
      display: 'flex', 
      flexDirection: 'column', 
      fontFamily: HP_FONT, 
      animation: 'hpFadeIn 400ms',
    }}>
      <div style={{ padding: '60px 20px 20px', display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={onClose} style={iconBtnStyle} className="hp-tap">
          <HPGlyph name="close" size={18} color={HP_TOKENS.inkSoft}/>
        </button>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
        <div style={{ ...HP_TEXT.small, color: HP_TOKENS.sage, fontWeight: 800 }}>BOX BREATHING · SIKLUS {cycle + 1}</div>
        <div style={{
          width: 200, 
          height: 200, 
          borderRadius: 100, 
          marginTop: 40,
          background: 'radial-gradient(circle, #fff 0%, rgba(255,255,255,0.4) 100%)',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          transform: `scale(${scale})`, 
          transition: 'transform 4s ease-in-out',
          boxShadow: '0 0 60px rgba(74,124,89,0.2)',
        }}>
          <div style={{ ...HP_TEXT.title, fontSize: 22, color: HP_TOKENS.sage }}>{label}</div>
        </div>
        <div style={{ ...HP_TEXT.body, fontSize: 14, marginTop: 40, maxWidth: 240 }}>
          Ikuti ritme lingkaran. Ambil waktu 1–3 menit untuk reset.
        </div>
      </div>
    </div>
  );
}
