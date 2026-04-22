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
  openModal: (name: string, props?: any) => void;
}

export default function GoalsScreen({ openModal }: GoalsScreenProps) {
  const { state, updateState } = useHP();
  const [tab, setTab] = useState('personal');
  
  if (!state) return null;

  // Filter goals by scope
  const filteredGoals = state.goals.filter((g: any) => g.scope === tab);

  const toggleWeekly = (id: number) => {
    updateState((s: any) => ({
      ...s,
      weeklyPriorities: s.weeklyPriorities.map((w: any) => 
        w.id === id ? { ...w, done: !w.done } : w
      )
    }));
  };

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
        count={String(filteredGoals.length)} 
        action="+ Baru"
        onAction={() => openModal('new_goal')}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filteredGoals.map((g: any) => <GoalCard key={g.id} g={g}/>)}
        {filteredGoals.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: HP_TOKENS.inkMute }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🌱</div>
            <div style={{ ...HP_TEXT.h, fontSize: 14 }}>Belum ada OKR di bagian ini.</div>
          </div>
        )}
      </div>

      <SectionHeader 
        icon="calendar" 
        label="Weekly priorities" 
        action="Edit"
        onAction={() => openModal('manage_weekly')}
      />
      <HPCard padding={14}>
        <div style={{ ...HP_TEXT.small, color: HP_TOKENS.inkMute, marginBottom: 10, fontWeight: 700 }}>
          Set 3–5 prioritas minggu ini
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {(state.weeklyPriorities || []).map((w: any, i: number) => (
            <div 
              key={w.id} 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 12, 
                padding: '10px 0', 
                borderTop: i === 0 ? 'none' : `1px solid ${HP_TOKENS.lineSoft}` 
              }}
            >
              <button 
                onClick={() => toggleWeekly(w.id)}
                style={{ 
                  width: 22, height: 22, borderRadius: 11, 
                  background: w.done ? HP_TOKENS.ink : 'transparent',
                  border: `1.5px solid ${w.done ? HP_TOKENS.ink : HP_TOKENS.line}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: 0, cursor: 'pointer'
                }}
              >
                {w.done && <HPGlyph name="check" size={10} color="#fff"/>}
              </button>
              <div style={{ 
                ...HP_TEXT.body, 
                fontSize: 14, 
                color: w.done ? HP_TOKENS.inkFade : HP_TOKENS.ink, 
                fontWeight: 600,
                textDecoration: w.done ? 'line-through' : 'none'
              }}>
                {w.text}
              </div>
            </div>
          ))}
          {(!state.weeklyPriorities || state.weeklyPriorities.length === 0) && (
            <div style={{ ...HP_TEXT.small, color: HP_TOKENS.inkMute, padding: '10px 0' }}>
              Belum ada prioritas mingguan. Klik Edit untuk mengatur.
            </div>
          )}
        </div>
      </HPCard>
    </div>
  );
}


