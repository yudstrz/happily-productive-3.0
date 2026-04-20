"use client";

import React from "react";
import { HP_TOKENS, HP_TEXT } from "@/lib/constants";
import HPCard from "@/components/ui/HPCard";
import HPChip from "@/components/ui/HPChip";
import HPBar from "@/components/ui/HPBar";

interface GoalCardProps {
  g: any;
}

export default function GoalCard({ g }: GoalCardProps) {
  const tones: Record<string, string> = { 
    sage: HP_TOKENS.sage, 
    blue: HP_TOKENS.blue, 
    lavender: '#6B5F8E' 
  };
  
  return (
    <HPCard padding={14}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{ flex: 1 }}>
          <div style={{ ...HP_TEXT.h, fontSize: 15 }}>{g.title}</div>
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
    </HPCard>
  );
}
