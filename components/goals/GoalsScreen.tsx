"use client";

import React, { useState } from "react";
import { useHP } from "@/lib/HPContext";
import { HP_TOKENS, HP_FONT, HP_TEXT } from "@/lib/constants";
import HPGlyph from "@/components/ui/HPGlyph";
import HPCard from "@/components/ui/HPCard";
import ScreenHeader from "@/components/ui/ScreenHeader";
import TabBar from "@/components/ui/TabBar";
import SectionHeader from "@/components/home/SectionHeader";
import GoalCard from "@/components/goals/GoalCard";

interface GoalsScreenProps {
  openModal: (name: string) => void;
}

export default function GoalsScreen({ openModal }: GoalsScreenProps) {
  const { state } = useHP();
  const [tab, setTab] = useState('personal');
  
  if (!state) return null;

  return (
    <div style={{ padding: '0 16px 120px', fontFamily: HP_FONT }}>
      <ScreenHeader title="Goals" subtitle="OKR kamu & selarasnya dengan tim"/>
      
      <TabBar options={[
        { key: 'personal', label: 'Saya' },
        { key: 'team', label: 'Tim' },
        { key: 'company', label: 'Perusahaan' },
      ]} value={tab} onChange={setTab}/>

      <HPCard style={{ marginTop: 14, background: HP_TOKENS.sageWash, border: 'none' }} padding={16}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ 
            width: 36, 
            height: 36, 
            borderRadius: 10, 
            background: HP_TOKENS.sage, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}>
            <HPGlyph name="sparkle" size={18} color="#fff"/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ ...HP_TEXT.h, fontSize: 14, color: HP_TOKENS.sage }}>Alignment Score · 88%</div>
            <div style={{ ...HP_TEXT.small, color: HP_TOKENS.inkSoft, fontWeight: 600, marginTop: 2 }}>
              Goal kamu selaras dengan prioritas tim Q2 🌱
            </div>
          </div>
        </div>
      </HPCard>

      <SectionHeader 
        icon="target" 
        label="OKR aktif" 
        count={String(state.goals.length)} 
        action="+ Baru"
        onAction={() => openModal('new_goal')}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {state.goals.map((g: any) => <GoalCard key={g.id} g={g}/>)}
      </div>

      <SectionHeader 
        icon="calendar" 
        label="Weekly priorities" 
        action="Edit"
        onAction={() => openModal('edit_weekly')}
      />
      <HPCard padding={14}>
        <div style={{ ...HP_TEXT.small, color: HP_TOKENS.inkMute, marginBottom: 10 }}>
          Senin, 21 Apr · Set 3–5 prioritas minggu ini
        </div>
        {[
          'Finalize onboarding wireframe v3',
          'Review design system handoff',
          'Mentoring session dengan Rizky',
          'Research interview × 3',
        ].map((t, i) => (
          <div 
            key={i} 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 10, 
              padding: '8px 0', 
              borderTop: i === 0 ? 'none' : `1px solid ${HP_TOKENS.lineSoft}` 
            }}
          >
            <div style={{ width: 20, height: 20, borderRadius: 10, border: `1.5px solid ${HP_TOKENS.inkFade}` }}/>
            <div style={{ ...HP_TEXT.body, fontSize: 14, color: HP_TOKENS.ink, fontWeight: 600 }}>{t}</div>
          </div>
        ))}
      </HPCard>
    </div>
  );
}

