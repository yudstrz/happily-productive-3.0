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
  const bgColors = { 
    sage: HP_TOKENS.sageWash, 
    yellow: HP_TOKENS.yellowWash, 
    blue: HP_TOKENS.blueWash, 
    coral: '#FCEEEB' 
  };
  
  return (
    <div style={{ 
      padding: 14, 
      borderRadius: 16, 
      background: bgColors[tone], 
      border: `1px solid ${HP_TOKENS.line}` 
    }}>
      <HPPlaceholder label="reward image" h={70} tone={tone}/>
      <div style={{ ...HP_TEXT.h, fontSize: 13, marginTop: 10 }}>{title}</div>
      <div style={{ ...HP_TEXT.small, color: HP_TOKENS.inkMute, marginTop: 4 }}>{points} poin</div>
    </div>
  );
}
