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

interface ManageSkillsModalProps {
  onClose: () => void;
}

export default function ManageSkillsModal({ onClose }: ManageSkillsModalProps) {
  const { state, updateState } = useHP();
  const [newSkill, setNewSkill] = useState("");

  const addSkill = () => {
    if (!newSkill) return;
    updateState((s: any) => ({
      ...s,
      skills: [...(s.skills || []), { name: newSkill, current: 0, target: 100 }]
    }));
    setNewSkill("");
  };

  const deleteSkill = (name: string) => {
    updateState((s: any) => ({
      ...s,
      skills: s.skills.filter((sk: any) => sk.name !== name)
    }));
  };

  const updateProgress = (name: string, delta: number) => {
    updateState((s: any) => ({
      ...s,
      skills: s.skills.map((sk: any) => 
        sk.name === name ? { ...sk, current: Math.min(100, Math.max(0, sk.current + delta)) } : sk
      )
    }));
  };

  if (!state || !state.skills) return null;

  return (
    <Modal onClose={onClose} title="Manage Skills">
      <div style={{ marginTop: 4 }}>
        <div style={{ ...HP_TEXT.small, color: HP_TOKENS.inkMute, fontWeight: 700, marginBottom: 12 }}>SKILL PROGRESSION</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
          {state.skills.map((s: any) => (
            <div 
              key={s.name} 
              style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: 14, borderRadius: 16,
                background: HP_TOKENS.card, border: `1.5px solid ${HP_TOKENS.line}`,
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ ...HP_TEXT.h, fontSize: 14 }}>{s.name}</div>
                <div style={{ ...HP_TEXT.small, color: HP_TOKENS.inkMute, marginTop: 2 }}>Progres: {s.current}%</div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => updateProgress(s.name, -5)} style={{ width: 28, height: 28, borderRadius: 14, border: 'none', background: HP_TOKENS.lineSoft, cursor: 'pointer' }}>-</button>
                <button onClick={() => updateProgress(s.name, 5)} style={{ width: 28, height: 28, borderRadius: 14, border: 'none', background: HP_TOKENS.lineSoft, cursor: 'pointer' }}>+</button>
                <button onClick={() => deleteSkill(s.name)} style={{ width: 28, height: 28, borderRadius: 14, border: 'none', background: 'none', cursor: 'pointer' }}>
                  <HPGlyph name="close" size={14} color={HP_TOKENS.coral}/>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div style={{ ...HP_TEXT.small, color: HP_TOKENS.inkMute, fontWeight: 700, marginBottom: 12 }}>TAMBAH SKILL BARU</div>
        <div style={{ display: 'flex', gap: 10 }}>
          <input 
            type="text" 
            value={newSkill} 
            onChange={e => setNewSkill(e.target.value)}
            placeholder="Misal: Animation"
            style={{
              flex: 1, padding: 12, borderRadius: 12, border: `1.5px solid ${HP_TOKENS.line}`,
              fontFamily: HP_FONT, fontSize: 13, outline: 'none',
            }}
          />
          <button 
            onClick={addSkill}
            style={{
              padding: '0 20px', borderRadius: 12, border: 'none',
              background: HP_TOKENS.sage, color: '#fff', fontFamily: HP_FONT, fontWeight: 800, cursor: 'pointer'
            }}
          >
            Add
          </button>
        </div>
      </div>
    </Modal>
  );
}
