"use client";

import React from "react";
import { HP_TOKENS, HP_FONT, HP_TEXT } from "@/lib/constants";
import HPGlyph from "@/components/ui/HPGlyph";
import HPChip from "@/components/ui/HPChip";
import Mascot from "@/components/home/Mascot";

interface EmotionalHeroProps {
  state: any;
  moodObj?: any;
  energyObj?: any;
  onOpenCheckIn: () => void;
}

export default function EmotionalHero({ 
  state, 
  moodObj, 
  energyObj, 
  onOpenCheckIn 
}: EmotionalHeroProps) {
  if (moodObj && energyObj) {
    return (
      <div 
        className="hp-tap" 
        onClick={onOpenCheckIn} 
        style={{
          position: 'relative', 
          borderRadius: 28, 
          padding: 18, 
          cursor: 'pointer',
          background: `linear-gradient(135deg, ${HP_TOKENS.blueSoft} 0%, ${HP_TOKENS.yellowSoft} 100%)`,
          overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ animation: 'hpBounceIn 500ms' }}>
            <Mascot mood={moodObj.key} size={90}/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ ...HP_TEXT.small, color: HP_TOKENS.inkSoft, fontWeight: 800, letterSpacing: 0.3, textTransform: 'uppercase' }}>Perasaanmu sekarang</div>
            <div style={{ ...HP_TEXT.title, fontSize: 22, marginTop: 4 }}>{moodObj.label} <span style={{ fontSize: 24 }}>{moodObj.emoji}</span></div>
            <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
              <HPChip tone="blue" size="sm">⚡ Energi {energyObj.label.toLowerCase()}</HPChip>
              {state.tag && <HPChip tone="yellow" size="sm">#{state.tag.toLowerCase()}</HPChip>}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="hp-tap" 
      onClick={onOpenCheckIn} 
      style={{
        position: 'relative', 
        borderRadius: 28, 
        padding: '22px 18px', 
        cursor: 'pointer',
          background: `linear-gradient(135deg, ${HP_TOKENS.blueSoft} 0%, ${HP_TOKENS.yellowSoft} 50%, ${HP_TOKENS.coralSoft} 100%)`,
        overflow: 'hidden', 
        border: 'none',
      }}
    >
      {/* floating sparkles */}
      <div style={{ position: 'absolute', top: 20, right: 30, fontSize: 16, animation: 'hpSparkle 2.5s ease-in-out infinite' }}>✨</div>
      <div style={{ position: 'absolute', bottom: 30, right: 80, fontSize: 12, animation: 'hpSparkle 2.5s 0.8s ease-in-out infinite' }}>✨</div>
      <div style={{ position: 'absolute', top: 60, right: 90, fontSize: 10, animation: 'hpSparkle 2.5s 1.4s ease-in-out infinite' }}>✨</div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 14, position: 'relative' }}>
        <Mascot mood="calm" size={96}/>
        <div style={{ flex: 1 }}>
          <div style={{ ...HP_TEXT.small, color: HP_TOKENS.blue, fontWeight: 900, letterSpacing: 0.3, textTransform: 'uppercase' }}>Hai, aku Flow</div>
          <div style={{ ...HP_TEXT.title, fontSize: 20, marginTop: 4, lineHeight: 1.2 }}>Gimana perasaanmu<br/>hari ini?</div>
          <div style={{
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: 6, 
            marginTop: 10,
            padding: '6px 12px', 
            borderRadius: 99, 
            background: '#fff',
            fontFamily: HP_FONT, 
            fontWeight: 800, 
            fontSize: 12, 
            color: HP_TOKENS.blue,
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          }}>
            Check-in 3 detik <HPGlyph name="arrow" size={14} color={HP_TOKENS.blue}/>
          </div>
        </div>
      </div>
    </div>
  );
}
