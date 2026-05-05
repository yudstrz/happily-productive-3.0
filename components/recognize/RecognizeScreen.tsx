"use client";

import React from "react";
import { useHP } from "@/lib/HPContext";
import { HP_TOKENS, HP_FONT, HP_TEXT } from "@/lib/constants";
import HPGlyph from "@/components/ui/HPGlyph";
import HPCard from "@/components/ui/HPCard";
import ScreenHeader from "@/components/ui/ScreenHeader";
import SectionHeader from "@/components/home/SectionHeader";
import StatBlock from "@/components/recognize/StatBlock";
import AppreciationCard from "@/components/recognize/AppreciationCard";
import RewardCard from "@/components/recognize/RewardCard";
import { ORG_REWARDS_CATALOG } from "@/lib/mockData";

interface RecognizeScreenProps {
  openModal: (name: string, props?: any) => void;
}

import { useState } from "react";
import LeaderboardScreen from "@/components/growth/LeaderboardScreen";

export default function RecognizeScreen({ openModal }: RecognizeScreenProps) {
  const { state } = useHP();
  const [activeTab, setActiveTab] = useState<'feed' | 'leaderboard'>('feed');
  const [filter, setFilter] = useState('All');

  if (!state) return null;

  const filters = ['All', 'Collaboration', 'Innovation', 'Respect', 'Ownership', 'Growth'];
  const nextFilter = () => {
    const idx = filters.indexOf(filter);
    setFilter(filters[(idx + 1) % filters.length]);
  };

  const filteredFeed = filter === 'All' 
    ? state.feed 
    : state.feed.filter((f: any) => f.value === filter);

  return (
    <div style={{ padding: '0 16px 120px', fontFamily: HP_FONT }}>
      <ScreenHeader title="Recognize" subtitle="Apresiasi & kompetisi tim kamu"/>

      {/* Tab switcher */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
        {([
          { key: 'feed',        label: 'Apresiasi Feed', icon: 'heart' },
          { key: 'leaderboard', label: 'Leaderboard',   icon: 'medal' },
        ] as const).map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)} className="hp-tap" style={{
            flex: 1, padding: '12px 6px', borderRadius: 16,
            background: activeTab === t.key ? HP_TOKENS.blue : HP_TOKENS.lineSoft,
            color: activeTab === t.key ? '#fff' : HP_TOKENS.inkSoft,
            border: 'none', fontFamily: HP_FONT, fontWeight: 800, fontSize: 12, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            transition: 'all 0.2s',
          }}>
            <HPGlyph name={t.icon} size={14} color={activeTab === t.key ? '#fff' : HP_TOKENS.inkMute} />
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'leaderboard' ? (
        <LeaderboardScreen />
      ) : (
        <>
          <HPCard style={{ background: `linear-gradient(135deg, ${HP_TOKENS.yellowWash}, ${HP_TOKENS.sageWash})`, border: 'none' }} padding={16}>
            <div style={{ display: 'flex', gap: 20 }}>
              <StatBlock label="Poin kamu" value={state.points.toLocaleString()} icon="trophy" tone="yellow"/>
              <StatBlock label="Diberi" value="24" icon="heart" tone="coral"/>
              <StatBlock label="Diterima" value="31" icon="sparkle" tone="blue"/>
            </div>
          </HPCard>

          <button 
            onClick={() => openModal('appreciate')} 
            style={{
              marginTop: 12, 
              width: '100%', 
              padding: '14px 16px', 
              borderRadius: 20,
              background: HP_TOKENS.blue, 
              color: '#fff', 
              border: 'none', 
              cursor: 'pointer',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: 8,
              fontFamily: HP_FONT, 
              fontWeight: 800, 
              fontSize: 15,
              boxShadow: `0 4px 14px ${HP_TOKENS.blueSoft}`,
            }}
            className="hp-tap"
          >
            <HPGlyph name="heart" size={18} color="#fff"/> Beri apresiasi
          </button>

          <SectionHeader 
            icon="people" 
            label="Feed tim" 
            action={filter === 'All' ? 'Filter' : `Filter: ${filter}`}
            onAction={nextFilter}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filteredFeed.map((f: any) => <AppreciationCard key={f.id} f={f}/>)}
            {filteredFeed.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: HP_TOKENS.inkMute }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>🔍</div>
                <div style={{ ...HP_TEXT.h, fontSize: 14 }}>Belum ada apresiasi untuk kategori ini.</div>
              </div>
            )}
          </div>

          <SectionHeader 
            icon="trophy" 
            label="Tukar poin" 
            action="Semua"
            onAction={() => openModal('all_rewards')}
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {ORG_REWARDS_CATALOG.slice(0, 4).map(r => (
              <RewardCard key={r.id} title={r.title} points={r.points} tone={r.tone as any} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

