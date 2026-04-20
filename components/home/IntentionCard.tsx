"use client";

import React from "react";
import { HP_TOKENS, HP_FONT, HP_TEXT } from "@/lib/constants";
import HPCard from "@/components/ui/HPCard";

interface IntentionCardProps {
  state: any;
  setState: React.Dispatch<React.SetStateAction<any>>;
}

const primaryBtn: React.CSSProperties = {
  padding: '9px 16px', borderRadius: 99, border: 'none', background: HP_TOKENS.sage,
  color: '#fff', fontFamily: HP_FONT, fontWeight: 800, fontSize: 13, cursor: 'pointer',
  boxShadow: `0 4px 12px rgba(74,124,89,0.3)`,
};

const ghostBtn: React.CSSProperties = {
  padding: '9px 14px', borderRadius: 99, border: `1.5px solid ${HP_TOKENS.line}`, background: '#FFFFFF',
  color: HP_TOKENS.inkSoft, fontFamily: HP_FONT, fontWeight: 800, fontSize: 13, cursor: 'pointer',
};

export default function IntentionCard({ state, setState }: IntentionCardProps) {
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(state.intention || '');

  const save = () => { 
    setState((s: any) => ({ ...s, intention: draft })); 
    setEditing(false); 
  };

  if (!state.intention && !editing) {
    return (
      <button 
        onClick={() => setEditing(true)} 
        className="hp-tap" 
        style={{
          width: '100%', 
          padding: '14px 16px', 
          borderRadius: 18,
          background: HP_TOKENS.card, 
          border: `2px dashed ${HP_TOKENS.sageLight}`,
          display: 'flex', 
          alignItems: 'center', 
          gap: 12, 
          cursor: 'pointer', 
          fontFamily: HP_FONT, 
          textAlign: 'left',
        }}
      >
        <div style={{ fontSize: 24 }}>🧭</div>
        <div style={{ flex: 1 }}>
          <div style={{ ...HP_TEXT.small, color: HP_TOKENS.sage, fontWeight: 800 }}>SET INTENTION</div>
          <div style={{ ...HP_TEXT.body, fontSize: 14, fontWeight: 700, marginTop: 2, color: HP_TOKENS.inkSoft }}>
            Hari ini saya fokus pada...
          </div>
        </div>
      </button>
    );
  }

  if (editing) {
    return (
      <HPCard padding={14}>
        <div style={{ ...HP_TEXT.small, color: HP_TOKENS.sage, marginBottom: 8, fontWeight: 800 }}>🧭 Hari ini saya fokus pada...</div>
        <input 
          autoFocus 
          value={draft} 
          onChange={e => setDraft(e.target.value)} 
          placeholder="Satu kalimat aja"
          style={{
            width: '100%', 
            padding: '12px 14px', 
            borderRadius: 14,
            border: `2px solid ${HP_TOKENS.sageSoft}`, 
            fontFamily: HP_FONT, 
            fontSize: 15, 
            fontWeight: 700,
            color: HP_TOKENS.ink, 
            outline: 'none', 
            background: HP_TOKENS.sageWash, 
            boxSizing: 'border-box',
          }}
        />
        <div style={{ display: 'flex', gap: 8, marginTop: 10, justifyContent: 'flex-end' }}>
          <button onClick={() => setEditing(false)} style={ghostBtn}>Batal</button>
          <button onClick={save} style={primaryBtn}>Simpan ✨</button>
        </div>
      </HPCard>
    );
  }

  return (
    <HPCard 
      padding={14} 
      onClick={() => { setDraft(state.intention); setEditing(true); }} 
      style={{ cursor: 'pointer', background: `linear-gradient(135deg, #fff, ${HP_TOKENS.sageWash})` }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ fontSize: 26 }}>🧭</div>
        <div style={{ flex: 1 }}>
          <div style={{ ...HP_TEXT.small, color: HP_TOKENS.inkMute, fontWeight: 800 }}>INTENTION HARI INI</div>
          <div style={{ ...HP_TEXT.h, fontSize: 15, marginTop: 3 }}>{state.intention}</div>
        </div>
      </div>
    </HPCard>
  );
}
