"use client";

import React from "react";
import { HP_TOKENS, HP_FONT, HP_TEXT } from "@/lib/constants";
import HPGlyph from "@/components/ui/HPGlyph";

interface SectionHeaderProps {
  icon: string;
  label: string;
  count?: string;
  action?: string;
  onAction?: () => void;
}

export default function SectionHeader({ 
  icon, 
  label, 
  count, 
  action,
  onAction 
}: SectionHeaderProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '22px 4px 10px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ 
          width: 28, 
          height: 28, 
          borderRadius: 9, 
          background: HP_TOKENS.sageSoft, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          <HPGlyph name={icon} size={16} color={HP_TOKENS.sage}/>
        </div>
        <div style={{ ...HP_TEXT.h, fontSize: 16 }}>{label}</div>
        {count && <span style={{ ...HP_TEXT.small, color: HP_TOKENS.inkMute, fontWeight: 800 }}>· {count}</span>}
      </div>
      {action && (
        <button 
          onClick={onAction}
          className="hp-tap" 
          style={{ 
            background: 'none', 
            border: 'none', 
            fontFamily: HP_FONT, 
            fontWeight: 800, 
            fontSize: 13, 
            color: HP_TOKENS.sage, 
            cursor: 'pointer' 
          }}
        >
          {action} →
        </button>
      )}
    </div>
  );
}
