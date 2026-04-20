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
        <div style={{ ...HP_TEXT.tiny, color: HP_TOKENS.inkMute, fontWeight: 800, marginBottom: 12, letterSpacing: '0.05em' }}>PROGRES SKILL SAAT INI</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
          {state.skills.map((s: any) => (
            <div 
              key={s.name} 
              style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderRadius: 18,
                background: HP_TOKENS.card, border: `1.5px solid ${HP_TOKENS.line}`,
              }}
            >
              <div style={{ width: 36, height: 36, borderRadius: 12, background: HP_TOKENS.sageSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <HPGlyph name="star" size={18} color={HP_TOKENS.sage}/>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ ...HP_TEXT.h, fontSize: 14 }}>{s.name}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                  <div style={{ flex: 1, height: 6, borderRadius: 3, background: HP_TOKENS.lineSoft, overflow: 'hidden' }}>
                    <div style={{ width: `${s.current}%`, height: '100%', background: HP_TOKENS.sage, transition: 'width 0.3s ease' }}/>
                  </div>
                  <span style={{ ...HP_TEXT.small, color: HP_TOKENS.inkMute, fontWeight: 700, fontSize: 11 }}>{s.current}%</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                <button 
                  onClick={() => updateProgress(s.name, -5)} 
                  style={{ width: 32, height: 32, borderRadius: 10, border: 'none', background: HP_TOKENS.lineSoft, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  className="hp-tap"
                >
                  <HPGlyph name="pause" size={12} color={HP_TOKENS.inkMute}/> {/* Using pause as a minus-like substitute or I could add a minus icon */}
                </button>
                <button 
                  onClick={() => updateProgress(s.name, 5)} 
                  style={{ width: 32, height: 32, borderRadius: 10, border: 'none', background: HP_TOKENS.lineSoft, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  className="hp-tap"
                >
                  <HPGlyph name="plus" size={12} color={HP_TOKENS.inkMute}/>
                </button>
                <button 
                  onClick={() => deleteSkill(s.name)} 
                  style={{ width: 32, height: 32, borderRadius: 10, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  className="hp-tap"
                >
                  <HPGlyph name="trash" size={16} color={HP_TOKENS.coral}/>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div style={{ ...HP_TEXT.tiny, color: HP_TOKENS.inkMute, fontWeight: 800, marginBottom: 12, letterSpacing: '0.05em' }}>TAMBAH SKILL BARU</div>
        <div style={{ 
          display: 'flex', gap: 10, padding: 16, borderRadius: 20, 
          background: HP_TOKENS.sageWash, border: `1.5px dashed ${HP_TOKENS.sageSoft}` 
        }}>
          <input 
            type="text" 
            value={newSkill} 
            onChange={e => setNewSkill(e.target.value)}
            placeholder="Misal: Animation, Public Speaking"
            style={{
              flex: 1, padding: '12px 14px', borderRadius: 12, border: `1.5px solid ${HP_TOKENS.line}`,
              fontFamily: HP_FONT, fontSize: 14, outline: 'none', background: '#fff'
            }}
          />
          <button 
            onClick={addSkill}
            disabled={!newSkill}
            style={{
              padding: '0 20px', borderRadius: 12, border: 'none',
              background: HP_TOKENS.sage, color: '#fff', fontFamily: HP_FONT, fontWeight: 800, cursor: 'pointer',
              opacity: !newSkill ? 0.5 : 1, transition: 'all 0.2s'
            }}
          >
            Tambah
          </button>
        </div>
      </div>
    </Modal>
  );
}
