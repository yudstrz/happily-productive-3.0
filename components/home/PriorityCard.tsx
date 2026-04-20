"use client";

import React from "react";
import { HP_TOKENS, HP_FONT, HP_TEXT } from "@/lib/constants";
import HPGlyph from "@/components/ui/HPGlyph";

interface PriorityCardProps {
  p: any;
  onToggle: () => void;
}

export default function PriorityCard({ p, onToggle }: PriorityCardProps) {
  const toneMap: Record<string, any> = {
    sage: { bg: HP_TOKENS.sageSoft, fg: HP_TOKENS.sage, wash: HP_TOKENS.sageWash },
    blue: { bg: HP_TOKENS.blueSoft, fg: HP_TOKENS.blue, wash: HP_TOKENS.blueWash },
    lavender: { bg: HP_TOKENS.lavenderSoft, fg: '#6B5F8E', wash: HP_TOKENS.lavenderSoft },
  };
  
  const t = toneMap[p.tone] || toneMap.sage;
  const energyMap: Record<string, string> = { low: '🌱', mid: '🌿', high: '🔥' };
  const eIcon = energyMap[p.energy as keyof typeof energyMap] || '🌱';
  
  return (
    <div style={{
      display: 'flex', 
      alignItems: 'flex-start', 
      gap: 12, 
      padding: 14,
      background: p.done ? t.wash : HP_TOKENS.card,
      border: `1.5px solid ${p.done ? t.bg : HP_TOKENS.line}`,
      borderRadius: 18, 
      transition: 'all 300ms',
    }}>
      <button 
        onClick={onToggle} 
        className="hp-tap" 
        style={{
          width: 28, 
          height: 28, 
          borderRadius: 14, 
          border: `2px solid ${p.done ? t.fg : HP_TOKENS.inkFade}`,
          background: p.done ? t.fg : 'transparent', 
          cursor: 'pointer', 
          flexShrink: 0, 
          marginTop: 1,
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          padding: 0,
          animation: p.done ? 'hpPop 400ms' : 'none',
        }}
      >
        {p.done && <HPGlyph name="check" size={16} color="#fff" stroke={3}/>}
      </button>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          ...HP_TEXT.h, 
          fontSize: 15,
          textDecoration: p.done ? 'line-through' : 'none',
          color: p.done ? HP_TOKENS.inkMute : HP_TOKENS.ink,
        }}>
          {p.title}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
          <span style={{
            fontFamily: HP_FONT, 
            fontWeight: 800, 
            fontSize: 11, 
            padding: '3px 9px',
            background: t.bg, 
            color: t.fg, 
            borderRadius: 99,
          }}>
            🎯 {p.goal}
          </span>
          <span style={{ ...HP_TEXT.small, color: HP_TOKENS.inkMute, fontWeight: 800 }}>
            {eIcon} {p.est}
          </span>
        </div>
      </div>
    </div>
  );
}
