"use client";

import React from "react";
import { HP_TOKENS, HP_TEXT } from "@/lib/constants";

interface InsightCardProps {
  ins: any;
  idx: number;
}

export default function InsightCard({ ins, idx }: InsightCardProps) {
  const tones: Record<string, any> = {
    sage: { 
      bg: `linear-gradient(135deg, ${HP_TOKENS.sageWash}, #fff)`, 
      border: HP_TOKENS.sageSoft, 
      fg: HP_TOKENS.sage, 
      emoji: '⚡', 
      chipBg: HP_TOKENS.sageSoft 
    },
    blue: { 
      bg: `linear-gradient(135deg, ${HP_TOKENS.blueWash}, #fff)`, 
      border: HP_TOKENS.blueSoft, 
      fg: HP_TOKENS.blue, 
      emoji: '🌙', 
      chipBg: HP_TOKENS.blueSoft 
    },
    yellow: { 
      bg: `linear-gradient(135deg, ${HP_TOKENS.yellowWash}, #fff)`, 
      border: HP_TOKENS.yellowSoft, 
      fg: '#8A6814', 
      emoji: '🎉', 
      chipBg: HP_TOKENS.yellowSoft 
    },
  };
  
  const t = tones[ins.tone] || tones.sage;
  
  return (
    <div 
      className="hp-tap" 
      style={{
        padding: 14, 
        borderRadius: 20, 
        background: t.bg, 
        border: `1.5px solid ${t.border}`,
        display: 'flex', 
        gap: 12, 
        alignItems: 'flex-start', 
        cursor: 'pointer',
      }}
    >
      <div style={{ 
        width: 40, 
        height: 40, 
        borderRadius: 14, 
        background: t.chipBg, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        fontSize: 20, 
        flexShrink: 0 
      }}>
        {t.emoji}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ ...HP_TEXT.h, fontSize: 14, color: t.fg }}>{ins.title}</div>
        <div style={{ ...HP_TEXT.body, fontSize: 13, marginTop: 4 }}>{ins.body}</div>
      </div>
    </div>
  );
}
