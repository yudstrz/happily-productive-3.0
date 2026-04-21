"use client";

import React, { useState } from "react";
import { HP_TOKENS, HP_FONT, HP_TEXT } from "@/lib/constants";
import HPGlyph from "@/components/ui/HPGlyph";

interface PriorityCardProps {
  p: any;
  onToggle: () => void;
}

export default function PriorityCard({ p, onToggle }: PriorityCardProps) {
  const [showPoints, setShowPoints] = useState(false);

  const toneMap: Record<string, any> = {
    sage: { bg: HP_TOKENS.sageSoft, fg: HP_TOKENS.sage, wash: HP_TOKENS.sageWash },
    blue: { bg: HP_TOKENS.blueSoft, fg: HP_TOKENS.blue, wash: HP_TOKENS.blueWash },
    lavender: { bg: HP_TOKENS.lavenderSoft, fg: '#6B5F8E', wash: HP_TOKENS.lavenderSoft },
  };
  
  const t = toneMap[p.tone] || toneMap.sage;
  const energyMap: Record<string, string> = { low: '🌱', mid: '🌿', high: '🔥' };
  const eIcon = energyMap[p.energy as keyof typeof energyMap] || '🌱';

  const handleToggle = () => {
    if (!p.done) {
      // Completing — show +50 animation
      setShowPoints(true);
      setTimeout(() => setShowPoints(false), 1200);
    }
    onToggle();
  };
  
  return (
    <div style={{
      position: 'relative',
      display: 'flex', 
      alignItems: 'flex-start', 
      gap: 12, 
      padding: 14,
      background: p.done ? t.wash : HP_TOKENS.card,
      border: `1.5px solid ${p.done ? t.bg : HP_TOKENS.line}`,
      borderRadius: 18, 
      transition: 'all 300ms',
    }}>
      {/* Floating +50 Poin animation */}
      {showPoints && (
        <div style={{
          position: 'absolute', top: 6, right: 14,
          background: HP_TOKENS.sage, color: '#fff',
          fontSize: 12, fontWeight: 900, fontFamily: HP_FONT,
          padding: '3px 10px', borderRadius: 99,
          animation: 'hpFloatUp 1.2s ease-out forwards',
          pointerEvents: 'none', zIndex: 10,
          boxShadow: `0 4px 12px ${HP_TOKENS.sageSoft}`,
        }}>
          +50 Poin ⚡
        </div>
      )}

      <button 
        onClick={handleToggle} 
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
          {p.done && (
            <span style={{
              fontFamily: HP_FONT, fontWeight: 800, fontSize: 11,
              padding: '3px 9px', background: HP_TOKENS.yellowWash,
              color: '#8A6814', borderRadius: 99,
            }}>
              +50 Poin ✓
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
