"use client";

import React, { useState } from "react";
import { 
  HP_TOKENS, 
  HP_FONT, 
  HP_TEXT 
} from "@/lib/constants";
import { HP_MOODS } from "@/lib/mockData";
import { useHP } from "@/lib/HPContext";
import Modal from "@/components/ui/Modal";

interface ReflectModalProps {
  onClose: () => void;
}

export default function ReflectModal({ onClose }: ReflectModalProps) {
  const { state, updateState, updateUser } = useHP();
  const [mood, setMood] = useState('calm');
  const [blockers, setBlockers] = useState('');
  const [notes, setNotes] = useState('');

  const handleFinish = () => {
    // Award 100 points
    updateUser((u: any) => ({ ...u, points: u.points + 100 }));
    
    // Create logbook entry
    const now = new Date();
    const newEntry = {
      id: Date.now(),
      type: 'daily_reflection',
      date: now.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      day: now.toLocaleDateString('id-ID', { weekday: 'long' }),
      time: now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      mood: mood,
      blockers: blockers,
      notes: notes,
      taskCount: state?.priorities.filter((p: any) => p.done).length || 0,
    };
    
    updateState((s: any) => ({
      ...s,
      logbook: [newEntry, ...(s.logbook || [])]
    }));
    
    onClose();
  };

  return (
    <Modal onClose={onClose} title="Tutup Hari 🌙">
      <div style={{ ...HP_TEXT.body, fontSize: 13, marginBottom: 20, color: HP_TOKENS.inkSoft }}>
        Refleksi singkat membantu menjernihkan pikiran sebelum istirahat.
      </div>
      
      <div style={{ marginBottom: 20 }}>
        <div style={{ ...HP_TEXT.h, fontSize: 14, marginBottom: 12 }}>Bagaimana perasaanmu saat ini?</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
          {HP_MOODS.map(m => (
            <button
              key={m.key}
              onClick={() => setMood(m.key)}
              style={{
                flex: 1, padding: '12px 4px', borderRadius: 12,
                background: mood === m.key ? HP_TOKENS.sageWash : 'transparent',
                border: `1.5px solid ${mood === m.key ? HP_TOKENS.sage : 'transparent'}`,
                cursor: 'pointer', transition: '0.2s', textAlign: 'center'
              }}
            >
              <div style={{ fontSize: 24, marginBottom: 4 }}>{m.emoji}</div>
              <div style={{ ...HP_TEXT.small, fontSize: 10, fontWeight: 700, opacity: mood === m.key ? 1 : 0.6 }}>{m.label}</div>
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ ...HP_TEXT.h, fontSize: 14 }}>Ada hambatan hari ini?</div>
        <textarea
          value={blockers} 
          onChange={e => setBlockers(e.target.value)} 
          rows={2}
          placeholder="Tulis hambatanmu (jika ada)..."
          style={inputStyle}
        />
      </div>

      <div style={{ marginBottom: 24 }}>
        <div style={{ ...HP_TEXT.h, fontSize: 14 }}>Catatan untuk hari ini</div>
        <textarea
          value={notes} 
          onChange={e => setNotes(e.target.value)} 
          rows={2}
          placeholder="Momen berharga, pembelajaran, atau syukur..."
          style={inputStyle}
        />
      </div>

      <button 
        onClick={handleFinish} 
        style={{
          width: '100%', padding: 16, borderRadius: 99,
          background: HP_TOKENS.sage, color: '#fff', border: 'none',
          fontFamily: HP_FONT, fontWeight: 800, fontSize: 15, cursor: 'pointer',
          boxShadow: `0 8px 20px ${HP_TOKENS.sageSoft}`,
        }}
        className="hp-tap"
      >
        Simpan & Tutup Hari (+100 Point) 🌱
      </button>
    </Modal>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%', marginTop: 8, padding: 12, borderRadius: 12,
  border: `1.5px solid ${HP_TOKENS.line}`, fontFamily: HP_FONT, fontSize: 14,
  outline: 'none', resize: 'none', background: HP_TOKENS.card, color: HP_TOKENS.ink,
  boxSizing: 'border-box',
};
