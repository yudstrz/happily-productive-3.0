"use client";

import React from "react";
import { HP_TOKENS, HP_TEXT } from "@/lib/constants";
import { useHP } from "@/lib/HPContext";
import HPCard from "@/components/ui/HPCard";
import HPChip from "@/components/ui/HPChip";
import HPBar from "@/components/ui/HPBar";
import HPGlyph from "@/components/ui/HPGlyph";

interface GoalCardProps {
  g: any;
}

export default function GoalCard({ g }: GoalCardProps) {
  const { state, updateState } = useHP();
  const tones: Record<string, string> = { 
    sage: HP_TOKENS.sage, 
    blue: HP_TOKENS.blue, 
    lavender: HP_TOKENS.lavender || '#6B5F8E',
    yellow: HP_TOKENS.yellow,
    coral: HP_TOKENS.coral,
  };

  const parentGoal = g.parent_id ? state?.goals.find((item: any) => String(item.id) === String(g.parent_id)) : null;

  // Link to actual priorities in state
  const linkedTasks = state?.priorities?.filter((p: any) => p.goal === g.title) || [];
  const hasTasks = linkedTasks.length > 0;
  
  // Calculate progress based on tasks if available
  const displayProgress = hasTasks 
    ? Math.round((linkedTasks.filter(p => p.done).length / linkedTasks.length) * 100)
    : g.progress;

  const deleteGoal = () => {
    if (confirm(`Hapus goal "${g.title}"?`)) {
      updateState((s: any) => ({
        ...s,
        goals: s.goals.filter((item: any) => item.id !== g.id)
      }));
    }
  };

  const toneColor = tones[g.tone] || HP_TOKENS.sage;
  
  return (
    <HPCard padding={16} style={{ 
      border: `1.5px solid ${HP_TOKENS.line}`,
      boxShadow: '0 4px 12px rgba(0,0,0,0.01)',
      transition: 'all 0.2s ease',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ 
              width: 24, height: 24, borderRadius: 8, 
              background: `${toneColor}15`, 
              display: 'flex', alignItems: 'center', justifyContent: 'center' 
            }}>
              <HPGlyph name="target" size={14} color={toneColor} />
            </div>
            <div style={{ ...HP_TEXT.h, fontSize: 16 }}>{g.title}</div>
            <button 
              onClick={(e) => { e.stopPropagation(); deleteGoal(); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex' }}
            >
              <div style={{ width: 14, height: 14, borderRadius: 7, background: HP_TOKENS.lineSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 10, color: HP_TOKENS.inkFade, fontWeight: 900 }}>×</span>
              </div>
            </button>
          </div>
          {parentGoal && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6, marginLeft: 32 }}>
              <HPGlyph name="link" size={10} color={HP_TOKENS.blue} />
              <div style={{ ...HP_TEXT.tiny, color: HP_TOKENS.blue, fontWeight: 800, fontSize: 10 }}>
                Aligned to: {parentGoal.title}
              </div>
            </div>
          )}
          <div style={{ ...HP_TEXT.small, color: HP_TOKENS.inkMute, marginTop: 6, marginLeft: 32, fontSize: 12 }}>
             {g.metric || 'Realisasi'} · <span style={{ fontWeight: 700 }}>Due:</span> {g.due}
          </div>
        </div>
        <HPChip tone={g.tone} size="sm">{g.alignment}% align</HPChip>
      </div>

      <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
             <span style={{ ...HP_TEXT.tiny, color: HP_TOKENS.inkMute, fontWeight: 800 }}>PROGRESS</span>
             <span style={{ ...HP_TEXT.h, fontSize: 13, color: toneColor }}>{displayProgress}%</span>
          </div>
          <HPBar value={displayProgress} tone={g.tone} height={8}/>
        </div>
      </div>

      {linkedTasks.length > 0 && (
        <div style={{ 
          marginTop: 16, 
          padding: '12px', 
          background: HP_TOKENS.paper,
          borderRadius: 12,
          display: 'flex',
          flexDirection: 'column',
          gap: 8
        }}>
          <div style={{ ...HP_TEXT.tiny, color: HP_TOKENS.inkMute, fontWeight: 900, fontSize: 9, letterSpacing: 1, marginBottom: 4 }}>
            LINKED QUESTS ({linkedTasks.filter(t => t.done).length}/{linkedTasks.length})
          </div>
          {linkedTasks.map((sg: any) => (
            <div key={sg.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ 
                width: 14, height: 14, borderRadius: 4, 
                background: sg.done ? toneColor : 'transparent',
                border: `1.5px solid ${sg.done ? toneColor : HP_TOKENS.line}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0
              }}>
                {sg.done && <HPGlyph name="check" size={8} color="#fff" stroke={4}/>}
              </div>
              <div style={{ 
                ...HP_TEXT.small, 
                fontSize: 12, 
                color: sg.done ? HP_TOKENS.inkFade : HP_TOKENS.ink,
                textDecoration: sg.done ? 'line-through' : 'none',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
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

