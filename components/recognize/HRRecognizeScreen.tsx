"use client";

import React, { useState } from "react";
import { useHP } from "@/lib/HPContext";
import { HP_TOKENS, HP_FONT, HP_TEXT } from "@/lib/constants";
import { HR_FEED, HR_ALL_EMPLOYEES, HP_REWARDS, ORG_REWARDS_CATALOG } from "@/lib/mockData";
import HPGlyph from "@/components/ui/HPGlyph";
import HPCard from "@/components/ui/HPCard";
import HPAvatar from "@/components/ui/HPAvatar";
import ScreenHeader from "@/components/ui/ScreenHeader";
import SectionHeader from "@/components/home/SectionHeader";
import AppreciationCard from "@/components/recognize/AppreciationCard";
import RewardCard from "@/components/recognize/RewardCard";
import StatBlock from "@/components/recognize/StatBlock";

interface Props { openModal: (name: string, props?: any) => void; }

export default function HRRecognizeScreen({ openModal }: Props) {
  const { state } = useHP();
  if (!state) return null;

  return (
    <div style={{ padding: '0 16px 120px', fontFamily: HP_FONT }}>
      <ScreenHeader title="Rewards" subtitle="Kelola inventory reward organisasi" />

      {/* Reward management */}
      <SectionHeader icon="trophy" label="Kelola Inventory Reward" action="+ Add Reward" onAction={() => openModal('all_rewards')} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {ORG_REWARDS_CATALOG.map(r => (
          <HPCard key={r.id} padding={12}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: HP_TOKENS[r.tone as keyof typeof HP_TOKENS] + '15' || HP_TOKENS.lineSoft,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24
              }}>
                {r.title.includes('Cuti') ? '🏖️' : r.title.includes('Lunch') ? '🍱' : r.title.includes('Workshop') ? '🎨' : '🎁'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ ...HP_TEXT.h, fontSize: 13 }}>{r.title}</div>
                <div style={{ ...HP_TEXT.tiny, color: HP_TOKENS.inkMute, marginTop: 2 }}>
                  {Math.floor(r.points / 4)} Koin · Stock: <span style={{ color: r.stock < 5 ? HP_TOKENS.coral : HP_TOKENS.sage, fontWeight: 900 }}>{r.stock}</span>
                </div>
              </div>
              <button 
                onClick={() => openModal('all_rewards', { edit: r.id })}
                className="hp-tap"
                style={{
                  padding: '6px 12px', borderRadius: 10, border: `1px solid ${HP_TOKENS.line}`,
                  background: '#fff', color: HP_TOKENS.inkSoft,
                  fontFamily: HP_FONT, fontWeight: 800, fontSize: 11, cursor: 'pointer',
                }}
              >
                Edit
              </button>
            </div>
          </HPCard>
        ))}
      </div>
    </div>
  );
}
