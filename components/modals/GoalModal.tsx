"use client";

import React, { useState } from "react";
import { useHP } from "@/lib/HPContext";
import { 
  HP_TOKENS, 
  HP_FONT, 
  HP_TEXT 
} from "@/lib/constants";
import Modal from "@/components/ui/Modal";

interface GoalModalProps {
  onClose: () => void;
}

export default function GoalModal({ onClose }: GoalModalProps) {
  const { updateState } = useHP();
  const [title, setTitle] = useState("");
  const [due, setDue] = useState("");
  const [scope, setScope] = useState("personal");

  const save = () => {
    if (!title || !due) return;
    
    updateState((s: any) => ({
      ...s,
      goals: [
        ...s.goals,
        {
          id: Date.now(),
          title,
          progress: 0,
          alignment: 80,
          owner: scope === 'personal' ? "Sari" : scope === 'team' ? "Team" : "Management",
          due,
          tone: scope === 'personal' ? "sage" : scope === 'team' ? "blue" : "yellow",
          metric: "0 / 1 milestones",
          scope,
        }
      ]
    }));
    onClose();
  };

  const scopes = [
    { key: 'personal', label: 'Saya' },
    { key: 'team', label: 'Tim' },
    { key: 'company', label: 'Perusahaan' },
  ];

  return (
    <Modal onClose={onClose} title="Tambah Goal Baru">
      <div style={{ marginTop: 4 }}>
        <div style={{ ...HP_TEXT.small, color: HP_TOKENS.inkMute, fontWeight: 700 }}>NAMA GOAL / OKR</div>
        <input 
          type="text" 
          value={title} 
          onChange={e => setTitle(e.target.value)}
          placeholder="Misal: Launch Apps Redesign"
          style={{
            width: '100%', marginTop: 10, padding: 14, borderRadius: 14,
            border: `1.5px solid ${HP_TOKENS.line}`, fontFamily: HP_FONT, fontSize: 14,
            color: HP_TOKENS.ink, outline: 'none', background: HP_TOKENS.card, boxSizing: 'border-box',
          }}
        />

        <div style={{ ...HP_TEXT.small, color: HP_TOKENS.inkMute, fontWeight: 700, marginTop: 20 }}>TENGGAT WAKTU</div>
        <input 
          type="text" 
          value={due} 
          onChange={e => setDue(e.target.value)}
          placeholder="Misal: 30 Apr"
          style={{
            width: '100%', marginTop: 10, padding: 14, borderRadius: 14,
            border: `1.5px solid ${HP_TOKENS.line}`, fontFamily: HP_FONT, fontSize: 14,
            color: HP_TOKENS.ink, outline: 'none', background: HP_TOKENS.card, boxSizing: 'border-box',
          }}
        />

        <div style={{ ...HP_TEXT.small, color: HP_TOKENS.inkMute, fontWeight: 700, marginTop: 20 }}>SCOPE / ROLE</div>
        <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
          {scopes.map(s => (
            <button
              key={s.key}
              onClick={() => setScope(s.key)}
              style={{
                flex: 1, padding: '12px 8px', borderRadius: 12, border: 'none',
                background: scope === s.key ? HP_TOKENS.ink : HP_TOKENS.lineSoft,
                color: scope === s.key ? '#fff' : HP_TOKENS.ink,
                fontFamily: HP_FONT, fontWeight: 800, fontSize: 13, cursor: 'pointer',
              }}
            >
              {s.label}
            </button>
          ))}
        </div>

        <button 
          onClick={save} 
          disabled={!title || !due}
          style={{
            width: '100%', marginTop: 32, padding: '16px', borderRadius: 99,
            background: HP_TOKENS.sage, color: '#fff', border: 'none',
            fontFamily: HP_FONT, fontWeight: 800, fontSize: 15, cursor: 'pointer',
            opacity: (!title || !due) ? 0.4 : 1,
            boxShadow: `0 8px 24px ${HP_TOKENS.sageSoft}`,
          }}
          className="hp-tap"
        >
          Simpan Goal 🌱
        </button>
      </div>
    </Modal>
  );
}

