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

export default function GoalModal({ onClose, goal }: { onClose: () => void; goal?: any }) {
  const { state, updateState, user } = useHP();
  const [title, setTitle] = useState(goal?.title || "");
  const [due, setDue] = useState(goal?.due || "");
  const [scope, setScope] = useState(goal?.scope || "personal");
  const [parentId, setParentId] = useState(goal?.parent_id || "");
  const [progress, setProgress] = useState(goal?.progress || 0);

  const parentOptions = state?.goals.filter((g: any) => {
    if (scope === 'personal') return g.scope === 'team' || g.scope === 'company';
    if (scope === 'team') return g.scope === 'company';
    return false;
  }) || [];

  const save = async () => {
    if (!title || !due) return;
    
    if (goal) {
      // Update existing
      try {
        await fetch("/api/goals/update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            goalId: goal.id,
            progress,
            parentId,
            metric: `${progress}% complete`
          })
        });
      } catch (e) {
        console.error(e);
      }
    } else {
      // Create new
      updateState((s: any) => ({
        ...s,
        goals: [
          ...s.goals,
          {
            id: Date.now(),
            title,
            progress: 0,
            alignment: 100,
            owner: user?.name || "You",
            due,
            tone: scope === 'personal' ? "sage" : scope === 'team' ? "blue" : "yellow",
            metric: "0% complete",
            scope,
            parent_id: parentId || null
          }
        ]
      }));
    }
    onClose();
  };

  const scopes = [
    { key: 'personal', label: 'Personal' },
    { key: 'team', label: 'Tim' },
    { key: 'company', label: 'Company' },
  ];

  return (
    <Modal onClose={onClose} title="Tambah OKR Baru">
      <div style={{ marginTop: 4 }}>
        <div style={{ ...HP_TEXT.small, color: HP_TOKENS.inkMute, fontWeight: 700 }}>NAMA OKR</div>
        <input 
          type="text" 
          value={title} 
          onChange={e => setTitle(e.target.value)}
          placeholder="Misal: Tingkatkan User Retention 20%"
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
          placeholder="Misal: Q2 2026"
          style={{
            width: '100%', marginTop: 10, padding: 14, borderRadius: 14,
            border: `1.5px solid ${HP_TOKENS.line}`, fontFamily: HP_FONT, fontSize: 14,
            color: HP_TOKENS.ink, outline: 'none', background: HP_TOKENS.card, boxSizing: 'border-box',
          }}
        />

        {goal && (
          <>
            <div style={{ ...HP_TEXT.small, color: HP_TOKENS.inkMute, fontWeight: 700, marginTop: 20 }}>PROGRESS: {progress}%</div>
            <input 
              type="range" 
              min="0" max="100" 
              value={progress} 
              onChange={e => setProgress(Number(e.target.value))}
              style={{ width: '100%', marginTop: 10 }}
            />
          </>
        )}

        <div style={{ ...HP_TEXT.small, color: HP_TOKENS.inkMute, fontWeight: 700, marginTop: 20 }}>SCOPE</div>
        <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
          {scopes.map(s => (
            <button
              key={s.key}
              onClick={() => { setScope(s.key); setParentId(""); }}
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

        {parentOptions.length > 0 && (
          <>
            <div style={{ ...HP_TEXT.small, color: HP_TOKENS.inkMute, fontWeight: 700, marginTop: 20 }}>ALIGN TO (PARENT OKR)</div>
            <select
              value={parentId}
              onChange={e => setParentId(e.target.value)}
              style={{
                width: '100%', marginTop: 10, padding: 14, borderRadius: 14,
                border: `1.5px solid ${HP_TOKENS.line}`, fontFamily: HP_FONT, fontSize: 14,
                color: HP_TOKENS.ink, outline: 'none', background: HP_TOKENS.card, boxSizing: 'border-box',
              }}
            >
              <option value="">-- Tanpa Parent --</option>
              {parentOptions.map((p: any) => (
                <option key={p.id} value={p.id}>{p.title} ({p.scope})</option>
              ))}
            </select>
          </>
        )}

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
          Simpan OKR 🎯
        </button>
      </div>
    </Modal>
  );
}

