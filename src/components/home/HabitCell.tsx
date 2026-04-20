"use client";

import React from "react";
import { HP_TOKENS, HP_TEXT } from "@/lib/constants";
import HPGlyph from "@/components/ui/HPGlyph";

interface HabitCellProps {
  h: any;
  onToggle?: () => void;
}

export default function HabitCell({ h, onToggle }: HabitCellProps) {
  return (
    <div 
      className="hp-tap" 
      onClick={onToggle}
      style={{
        padding: 14, 
        borderRadius: 18,
        background: h.done ? `linear-gradient(135deg, ${HP_TOKENS.sageSoft}, ${HP_TOKENS.sageWash})` : HP_TOKENS.card,
        border: `1.5px solid ${h.done ? HP_TOKENS.sage : HP_TOKENS.line}`,
        cursor: 'pointer',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 26, animation: h.done ? 'hpPop 400ms' : 'none' }}>{h.emoji}</span>
        {h.done && (
          <div style={{ 
            width: 22, 
            height: 22, 
            borderRadius: 11, 
            background: HP_TOKENS.sage, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}>
            <HPGlyph name="check" size={12} color="#fff" stroke={3}/>
          </div>
        )}
      </div>
      <div style={{ ...HP_TEXT.h, fontSize: 13, marginTop: 10 }}>{h.name}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
        <span style={{ fontSize: 12 }}>🔥</span>
        <span style={{ ...HP_TEXT.small, color: h.done ? HP_TOKENS.sage : HP_TOKENS.inkMute, fontWeight: 900 }}>
          {h.streak} hari
        </span>
      </div>
    </div>
  );
}
