"use client";

import React from "react";
import { HP_TOKENS, HP_FONT } from "@/lib/constants";
import HPGlyph from "@/components/ui/HPGlyph";

interface TabNavProps {
  tab: string;
  setTab: (tab: string) => void;
}

export default function TabNav({ tab, setTab }: TabNavProps) {
  const tabs = [
    { key: 'home', label: 'Home', icon: 'home' },
    { key: 'goals', label: 'Goals', icon: 'target' },
    { key: 'recognize', label: 'Recognition', icon: 'heart' },
    { key: 'growth', label: 'Growth', icon: 'tree' },
    { key: 'wellbeing', label: 'Wellbeing', icon: 'leaf' },
  ];

  return (
    <div style={{
      position: 'absolute', 
      bottom: 0, 
      left: 0, 
      right: 0, 
      zIndex: 25,
      padding: '8px 12px 26px', 
      background: 'rgba(251,247,242,0.92)',
      backdropFilter: 'blur(20px)', 
      WebkitBackdropFilter: 'blur(20px)',
      borderTop: `1px solid ${HP_TOKENS.line}`,
      display: 'flex', 
      justifyContent: 'space-around',
    }}>
      {tabs.map(t => (
        <button 
          key={t.key} 
          onClick={() => setTab(t.key)} 
          style={{
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            gap: 3,
            background: 'none', 
            border: 'none', 
            cursor: 'pointer', 
            padding: '6px 4px',
            color: tab === t.key ? HP_TOKENS.sage : HP_TOKENS.inkMute,
            fontFamily: HP_FONT, 
            fontWeight: 800, 
            fontSize: 10,
            transition: 'all 180ms',
          }}
        >
          <HPGlyph 
            name={t.icon} 
            size={22} 
            color={tab === t.key ? HP_TOKENS.sage : HP_TOKENS.inkMute} 
            stroke={tab === t.key ? 2.2 : 1.8}
          />
          <div>{t.label}</div>
        </button>
      ))}
    </div>
  );
}
