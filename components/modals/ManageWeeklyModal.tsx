"use client";

import React, { useState } from "react";
import { useHP } from "@/lib/HPContext";
import { 
  HP_TOKENS, 
  HP_FONT, 
  HP_TEXT 
} from "@/lib/constants";
import HPGlyph from "@/components/ui/HPGlyph";
import Modal from "@/components/ui/Modal";

interface ManageWeeklyModalProps {
  onClose: () => void;
}

export default function ManageWeeklyModal({ onClose }: ManageWeeklyModalProps) {
  const { state, updateState } = useHP();
  const [newText, setNewText] = useState("");

  const addWeekly = () => {
    if (!newText) return;
    updateState((s: any) => ({
      ...s,
      weeklyPriorities: [
        ...(s.weeklyPriorities || []),
        { id: Date.now(), text: newText, done: false }
      ]
    }));
    setNewText("");
  };

  const deleteWeekly = (id: number) => {
    updateState((s: any) => ({
      ...s,
      weeklyPriorities: s.weeklyPriorities.filter((w: any) => w.id !== id)
    }));
  };

  const toggleWeekly = (id: number) => {
    updateState((s: any) => ({
      ...s,
      weeklyPriorities: s.weeklyPriorities.map((w: any) => 
        w.id === id ? { ...w, done: !w.done } : w
      )
    }));
  };

  if (!state || !state.weeklyPriorities) return null;

  return (
    <Modal onClose={onClose} title="Weekly Priorities">
      <div style={{ marginTop: 4 }}>
        <div style={{ ...HP_TEXT.small, color: HP_TOKENS.inkMute, fontWeight: 700, marginBottom: 12 }}>DAFTAR MINGGU INI</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
          {state.weeklyPriorities.map((w: any) => (
            <div 
              key={w.id} 
              style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: 12, borderRadius: 16,
                background: HP_TOKENS.card, border: `1.5px solid ${HP_TOKENS.line}`,
              }}
            >
              <button 
                onClick={() => toggleWeekly(w.id)}
                style={{ 
                  width: 24, height: 24, borderRadius: 12, 
                  background: w.done ? HP_TOKENS.ink : 'transparent',
                  border: `1.5px solid ${w.done ? HP_TOKENS.ink : HP_TOKENS.line}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: 0, cursor: 'pointer'
                }}
              >
                {w.done && <HPGlyph name="check" size={12} color="#fff"/>}
              </button>
              <div style={{ flex: 1, ...HP_TEXT.body, fontSize: 14, fontWeight: 600, color: w.done ? HP_TOKENS.inkFade : HP_TOKENS.ink }}>
                {w.text}
              </div>
              <button 
                onClick={() => deleteWeekly(w.id)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
              >
                <HPGlyph name="close" size={16} color={HP_TOKENS.coral}/>
              </button>
            </div>
          ))}
        </div>

        <div style={{ ...HP_TEXT.small, color: HP_TOKENS.inkMute, fontWeight: 700, marginBottom: 12 }}>TAMBAH PRIORITAS MINGGUAN</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 16, borderRadius: 20, background: HP_TOKENS.blueWash }}>
          <input 
            type="text" 
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="Apa target utama minggu ini?"
            style={{
              padding: 14, borderRadius: 12, border: `1.5px solid ${HP_TOKENS.line}`,
              fontFamily: HP_FONT, fontSize: 14, background: '#fff', outline: 'none'
            }}
          />
          <button 
            onClick={addWeekly}
            disabled={!newText}
            style={{
              marginTop: 4, padding: 14, borderRadius: 12, border: 'none',
              background: HP_TOKENS.blue, color: '#fff',
              fontFamily: HP_FONT, fontWeight: 800, fontSize: 15, cursor: 'pointer',
              opacity: !newText ? 0.5 : 1
            }}
          >
            Tambah Ke Rencana Mingguan
          </button>
        </div>
      </div>
    </Modal>
  );
}
