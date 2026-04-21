"use client";

import React from "react";
import { HP_TOKENS, HP_TEXT } from "@/lib/constants";
import { useHP } from "@/lib/HPContext";
import HPCard from "@/components/ui/HPCard";
import HPChip from "@/components/ui/HPChip";
import HPBar from "@/components/ui/HPBar";

interface GoalCardProps {
  g: any;
}

export default function GoalCard({ g }: GoalCardProps) {
  const { updateState } = useHP();
  const tones: Record<string, string> = { 
    sage: HP_TOKENS.sage, 
    blue: HP_TOKENS.blue, 
    lavender: '#6B5F8E',
    yellow: HP_TOKENS.yellow
  };

  const deleteGoal = () => {
    if (confirm(`Hapus goal "${g.title}"?`)) {
      updateState((s: any) => ({
        ...s,
        goals: s.goals.filter((item: any) => item.id !== g.id)
      }));
    }
  };
  
  return (
    <HPCard padding={14}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ ...HP_TEXT.h, fontSize: 15 }}>{g.title}</div>
            <button 
              onClick={deleteGoal}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, display: 'flex' }}
            >
              <div style={{ width: 14, height: 14, borderRadius: 7, background: HP_TOKENS.lineSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 10, color: HP_TOKENS.inkFade, fontWeight: 900 }}>×</span>
              </div>
            </button>
          </div>
          <div style={{ ...HP_TEXT.small, color: HP_TOKENS.inkMute, marginTop: 4 }}>
            {g.metric} · Due {g.due}
          </div>
        </div>
        <HPChip tone={g.tone} size="sm">{g.alignment}% align</HPChip>
      </div>
      <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ flex: 1 }}>
          <HPBar value={g.progress} tone={g.tone}/>
        </div>
        <div style={{ 
          ...HP_TEXT.h, 
          fontSize: 14, 
          color: tones[g.tone] || HP_TOKENS.sage, 
          minWidth: 36, 
          textAlign: 'right' 
        }}>
          {g.progress}%
        </div>
      </div>

      {g.subGoals && g.subGoals.length > 0 && (
        <div style={{ 
          marginTop: 14, 
          paddingTop: 12, 
          borderTop: `1px solid ${HP_TOKENS.lineSoft}`,
          display: 'flex',
          flexDirection: 'column',
          gap: 6
        }}>
          {g.subGoals.map((sg: any) => (
            <div key={sg.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ 
                width: 12, height: 12, borderRadius: 3, 
                background: sg.done ? tones[g.tone] : 'transparent',
                border: `1.5px solid ${sg.done ? tones[g.tone] : HP_TOKENS.line}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {sg.done && <span style={{ color: '#fff', fontSize: 8 }}>✓</span>}
              </div>
              <div style={{ 
                ...HP_TEXT.small, 
                fontSize: 11, 
                color: sg.done ? HP_TOKENS.inkFade : HP_TOKENS.ink,
                textDecoration: sg.done ? 'line-through' : 'none'
              }}>
                {sg.title}
              </div>
            </div>
          ))}
        </div>
      )}
    </HPCard>
  );
}

