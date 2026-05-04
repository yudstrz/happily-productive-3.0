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
    sage: { bg: HP_TOKENS.yellowSoft, fg: HP_TOKENS.ink, wash: HP_TOKENS.yellowWash },
    blue: { bg: HP_TOKENS.blueSoft, fg: HP_TOKENS.blue, wash: HP_TOKENS.blueWash },
    lavender: { bg: HP_TOKENS.lavenderSoft, fg: '#6B5F8E', wash: HP_TOKENS.lavenderSoft },
  };
  
  const t = toneMap[p.tone] || toneMap.sage;
  const energyIcon = p.energy === 'high' ? 'zap' : p.energy === 'mid' ? 'activity' : 'sparkle';

  const handleToggle = () => {
    if (!p.done) {
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
      gap: 16, 
      padding: '16px',
      background: p.done ? HP_TOKENS.yellowSoft : HP_TOKENS.card,
      border: `1.5px solid ${p.done ? HP_TOKENS.yellow : HP_TOKENS.line}`,
      borderRadius: 16, 
      transition: 'all 0.2s ease',
    }}>
      {/* Floating +50 Poin */}
      {showPoints && (
        <div style={{
          position: 'absolute', top: 10, right: 16,
          background: HP_TOKENS.ink, color: HP_TOKENS.yellow,
          fontSize: 11, fontWeight: 800, fontFamily: HP_FONT,
          padding: '2px 8px', borderRadius: 8,
          animation: 'hpRise 1.2s ease-out forwards',
          pointerEvents: 'none', zIndex: 10,
        }}>
          +50
        </div>
      )}

      <button 
        onClick={handleToggle} 
        className="hp-tap" 
        style={{
          width: 24, 
          height: 24, 
          borderRadius: 6, 
          border: `2px solid ${p.done ? HP_TOKENS.yellow : HP_TOKENS.line}`,
          background: p.done ? HP_TOKENS.yellow : 'transparent', 
          cursor: 'pointer', 
          flexShrink: 0, 
          marginTop: 2,
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          padding: 0,
        }}
      >
        {p.done && <HPGlyph name="check" size={14} color={HP_TOKENS.ink} stroke={4}/>}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <HPGlyph name="target" size={12} color={HP_TOKENS.inkMute} />
            <span style={{ ...HP_TEXT.tiny, color: HP_TOKENS.inkMute, fontWeight: 700 }}>
              {p.goal}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <HPGlyph name={energyIcon} size={12} color={HP_TOKENS.inkMute} />
            <span style={{ ...HP_TEXT.tiny, color: HP_TOKENS.inkMute, fontWeight: 700 }}>
              {p.est}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
