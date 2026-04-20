"use client";

import React from "react";
import { HP_TOKENS, HP_TEXT } from "@/lib/constants";
import HPPlaceholder from "@/components/ui/HPPlaceholder";

interface RewardCardProps {
  title: string;
  points: number;
  tone: 'sage' | 'yellow' | 'blue' | 'coral';
}

export default function RewardCard({ title, points, tone }: RewardCardProps) {
  const { state, updateState } = useHP();
  const bgColors = { 
    sage: HP_TOKENS.sageWash, 
    yellow: HP_TOKENS.yellowWash, 
    blue: HP_TOKENS.blueWash, 
    coral: '#FCEEEB' 
  };

  const handleRedeem = () => {
    if (!state) return;
    if (state.points < points) {
      alert(`Poin tidak cukup! Kamu butuh ${points} poin, tapi baru punya ${state.points} poin. 🌱`);
      return;
    }

    if (confirm(`Tukar ${points} poin dengan "${title}"?`)) {
      updateState((s: any) => ({
        ...s,
        points: s.points - points,
        user: {
          ...s.user,
          points: s.user.points - points
        }
      }));
      alert(`Berhasil! "${title}" telah ditambahkan ke reward kamu. 🎉`);
    }
  };
  
  return (
    <button 
      onClick={handleRedeem}
      style={{ 
        padding: 14, 
        borderRadius: 16, 
        background: bgColors[tone], 
        border: `1px solid ${HP_TOKENS.line}`,
        textAlign: 'left',
        cursor: 'pointer',
        width: '100%',
        fontFamily: HP_FONT,
      }}
      className="hp-tap"
    >
      <HPPlaceholder label="reward image" h={70} tone={tone}/>
      <div style={{ ...HP_TEXT.h, fontSize: 13, marginTop: 10 }}>{title}</div>
      <div style={{ ...HP_TEXT.small, color: HP_TOKENS.inkMute, marginTop: 4 }}>{points} poin</div>
    </button>
  );
}

