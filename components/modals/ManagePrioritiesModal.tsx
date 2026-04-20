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

interface ManagePrioritiesModalProps {
  onClose: () => void;
}

export default function ManagePrioritiesModal({ onClose }: ManagePrioritiesModalProps) {
  const { state, updateState } = useHP();
  const [newTitle, setNewTitle] = useState("");
  const [energy, setEnergy] = useState("mid");

  const addPriority = () => {
    if (!newTitle) return;
    const newP = {
      id: Date.now(),
      title: newTitle,
      goal: state.goals?.[0]?.title || "General",
      energy: energy,
      est: "30m",
      done: false,
      tone: energy === 'high' ? 'yellow' : energy === 'mid' ? 'sage' : 'blue',
    };
    updateState((s: any) => ({
      ...s,
      priorities: [...s.priorities, newP]
    }));
    setNewTitle("");
  };

  const deletePriority = (id: number) => {
    updateState((s: any) => ({
      ...s,
      priorities: s.priorities.filter((p: any) => p.id !== id)
    }));
  };

  if (!state) return null;

  return (
    <Modal onClose={onClose} title="Kelola Prioritas">
      <div style={{ marginTop: 4 }}>
        <div style={{ ...HP_TEXT.small, color: HP_TOKENS.inkMute, fontWeight: 700, marginBottom: 12 }}>DAFTAR PRIORITAS</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
          {state.priorities.map((p: any) => (
            <div 
              key={p.id} 
              style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: 12, borderRadius: 16,
                background: HP_TOKENS.card, border: `1.5px solid ${HP_TOKENS.line}`,
              }}
            >
              <div style={{ 
                width: 24, height: 24, borderRadius: 12, 
                background: p.done ? HP_TOKENS.sage : 'transparent',
                border: `1.5px solid ${p.done ? HP_TOKENS.sage : HP_TOKENS.line}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {p.done && <HPGlyph name="check" size={12} color="#fff"/>}
              </div>
              <div style={{ flex: 1, ...HP_TEXT.body, fontSize: 14, fontWeight: 600, color: p.done ? HP_TOKENS.inkFade : HP_TOKENS.ink }}>
                {p.title}
              </div>
              <button 
                onClick={() => deletePriority(p.id)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
              >
                <HPGlyph name="close" size={16} color={HP_TOKENS.coral}/>
              </button>
            </div>
          ))}
        </div>

        <div style={{ ...HP_TEXT.small, color: HP_TOKENS.inkMute, fontWeight: 700, marginBottom: 12 }}>TAMBAH BARU</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 16, borderRadius: 20, background: HP_TOKENS.sageWash }}>
          <input 
            type="text" 
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Apa yang ingin kamu selesaikan?"
            style={{
              padding: 14, borderRadius: 12, border: `1.5px solid ${HP_TOKENS.line}`,
              fontFamily: HP_FONT, fontSize: 14, background: '#fff', outline: 'none'
            }}
          />
          <div style={{ display: 'flex', gap: 8 }}>
            {['low', 'mid', 'high'].map(e => (
              <button
                key={e}
                onClick={() => setEnergy(e)}
                style={{
                  flex: 1, padding: '10px', borderRadius: 10, border: 'none',
                  background: energy === e ? HP_TOKENS.ink : '#fff',
                  color: energy === e ? '#fff' : HP_TOKENS.ink,
                  fontFamily: HP_FONT, fontWeight: 700, fontSize: 13, cursor: 'pointer',
                  transition: '0.2s'
                }}
              >
                {e.toUpperCase()}
              </button>
            ))}
          </div>
          <button 
            onClick={addPriority}
            disabled={!newTitle}
            style={{
              marginTop: 4, padding: 14, borderRadius: 12, border: 'none',
              background: HP_TOKENS.sage, color: '#fff',
              fontFamily: HP_FONT, fontWeight: 800, fontSize: 15, cursor: 'pointer',
              opacity: !newTitle ? 0.5 : 1
            }}
          >
            Tambah Ke Prioritas
          </button>
        </div>
      </div>
    </Modal>
  );
}
