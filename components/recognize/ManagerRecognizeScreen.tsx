"use client";

import React, { useState } from "react";
import { useHP } from "@/lib/HPContext";
import { HP_TOKENS, HP_FONT, HP_TEXT } from "@/lib/constants";
import { MANAGER_TEAM_FEED, MANAGER_TEAM_MEMBERS, HP_VALUES, HP_REWARDS } from "@/lib/mockData";
import HPGlyph from "@/components/ui/HPGlyph";
import HPCard from "@/components/ui/HPCard";
import HPAvatar from "@/components/ui/HPAvatar";
import ScreenHeader from "@/components/ui/ScreenHeader";
import SectionHeader from "@/components/home/SectionHeader";
import AppreciationCard from "@/components/recognize/AppreciationCard";
import RewardCard from "@/components/recognize/RewardCard";
import StatBlock from "@/components/recognize/StatBlock";

interface Props { openModal: (name: string, props?: any) => void; }

export default function ManagerRecognizeScreen({ openModal }: Props) {
  const { state } = useHP();
  if (!state) return null;

  const feed = MANAGER_TEAM_FEED;

  return (
    <div style={{ padding: '0 16px 120px', fontFamily: HP_FONT }}>
      <ScreenHeader title="Recognition" subtitle="Apresiasi tim & pantau penghargaan" />

      {/* Stats */}
      <HPCard style={{ background: `linear-gradient(135deg, ${HP_TOKENS.yellowWash}, ${HP_TOKENS.blueWash})`, border: 'none' }} padding={16}>
        <div style={{ display: 'flex', gap: 20 }}>
          <StatBlock label="Poin kamu" value={state.points.toLocaleString()} icon="trophy" tone="yellow" />
          <StatBlock label="Diberi ke tim" value="18" icon="heart" tone="sage" />
          <StatBlock label="Tim diterima" value="47" icon="sparkle" tone="sage" />
        </div>
      </HPCard>

      {/* CTA - Give appreciation */}
      <button onClick={() => openModal('appreciate')} style={{
        marginTop: 12, width: '100%', padding: '14px 16px', borderRadius: 20,
        background: HP_TOKENS.blue, color: '#fff', border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        fontFamily: HP_FONT, fontWeight: 800, fontSize: 15,
        boxShadow: `0 4px 14px ${HP_TOKENS.blueSoft}`,
      }} className="hp-tap">
        <HPGlyph name="heart" size={18} color="#fff" /> Beri Apresiasi ke Tim
      </button>

      {/* Team Leaderboard */}
      <SectionHeader icon="trophy" label="Tim Terbaik Bulan Ini" />
      <HPCard padding={14}>
        {MANAGER_TEAM_MEMBERS.slice(0, 4).map((m, i) => (
          <div key={m.id} style={{
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
            <HPAvatar name={m.name} size={36} />
            <div style={{ flex: 1 }}>
              <div style={{ ...HP_TEXT.h, fontSize: 13 }}>{m.name}</div>
              <div style={{ ...HP_TEXT.tiny, color: HP_TOKENS.inkMute }}>{m.role}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 14 }}>🔥</span>
              <span style={{ ...HP_TEXT.h, fontSize: 14, color: HP_TOKENS.sage }}>{m.streak}</span>
            </div>
          </div>
        ))}
      </HPCard>

      {/* Team feed */}
      <SectionHeader icon="people" label="Feed Apresiasi Tim" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {feed.map(f => <AppreciationCard key={f.id} f={f} />)}
      </div>

      {/* Rewards */}
      <SectionHeader icon="trophy" label="Reward Tersedia" action="Semua" onAction={() => openModal('all_rewards')} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <RewardCard title="Extra cuti 1 hari" points={500} tone="sage" />
        <RewardCard title="Voucher lunch 100k" points={250} tone="yellow" />
        <RewardCard title="Workshop intensif" points={800} tone="blue" />
        <RewardCard title="Donasi sosial" points={100} tone="coral" />
      </div>
    </div>
  );
}
