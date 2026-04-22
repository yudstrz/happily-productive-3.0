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

  // Top employees by engagement
  const topEmployees = [...HR_ALL_EMPLOYEES]
    .sort((a, b) => b.engagement - a.engagement)
    .slice(0, 5);

  const totalAppreciations = HR_FEED.reduce((sum, f) => sum + f.likes, 0);

  return (
    <div style={{ padding: '0 16px 120px', fontFamily: HP_FONT }}>
      <ScreenHeader title="Recognition" subtitle="Apresiasi & budaya penghargaan organisasi" />

      {/* Org-wide stats */}
      <HPCard style={{ background: `linear-gradient(135deg, ${HP_TOKENS.lavenderSoft}, ${HP_TOKENS.yellowWash})`, border: 'none' }} padding={16}>
        <div style={{ display: 'flex', gap: 16 }}>
          <StatBlock label="Total Apresiasi" value="342" icon="heart" tone="coral" />
          <StatBlock label="Partisipasi" value="78%" icon="sparkle" tone="sage" />
          <StatBlock label="Nilai Teraktif" value="Collab" icon="trophy" tone="yellow" />
        </div>
      </HPCard>

      {/* CTA */}
      <button onClick={() => openModal('appreciate')} style={{
        marginTop: 12, width: '100%', padding: '14px 16px', borderRadius: 20,
        background: HP_TOKENS.blue, color: '#fff', border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        fontFamily: HP_FONT, fontWeight: 800, fontSize: 15,
        boxShadow: `0 4px 14px ${HP_TOKENS.blueSoft}`,
      }} className="hp-tap">
        <HPGlyph name="heart" size={18} color="#fff" /> Beri Apresiasi
      </button>

      {/* Top performers */}
      <SectionHeader icon="trophy" label="Top Performers Bulan Ini" />
      <HPCard padding={14}>
        {topEmployees.map((e, i) => (
          <div key={e.id} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '10px 0', borderTop: i === 0 ? 'none' : `1px solid ${HP_TOKENS.lineSoft}`,
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: 10,
              background: i === 0 ? HP_TOKENS.yellow : i === 1 ? HP_TOKENS.blueLight : i === 2 ? HP_TOKENS.sageLight : HP_TOKENS.lineSoft,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: HP_FONT, fontWeight: 900, fontSize: 13,
              color: i < 3 ? '#fff' : HP_TOKENS.inkMute,
            }}>
              {i + 1}
            </div>
            <HPAvatar name={e.name} size={36} />
            <div style={{ flex: 1 }}>
              <div style={{ ...HP_TEXT.h, fontSize: 13 }}>{e.name}</div>
              <div style={{ ...HP_TEXT.tiny, color: HP_TOKENS.inkMute }}>{e.dept}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: HP_FONT, fontWeight: 900, fontSize: 15, color: HP_TOKENS.lavender }}>
                {e.engagement}
              </div>
              <div style={{ ...HP_TEXT.tiny, color: HP_TOKENS.inkMute }}>Engagement</div>
            </div>
          </div>
        ))}
      </HPCard>

      {/* Org feed */}
      <SectionHeader icon="people" label="Feed Apresiasi Org" action="Filter" onAction={() => {}} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {HR_FEED.map(f => <AppreciationCard key={f.id} f={f} />)}
      </div>

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
                  {r.points} Poin · Stock: <span style={{ color: r.stock < 5 ? HP_TOKENS.coral : HP_TOKENS.sage, fontWeight: 900 }}>{r.stock}</span>
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
