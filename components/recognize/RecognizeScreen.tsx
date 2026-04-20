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

interface RecognizeScreenProps {
  openModal: (name: string) => void;
}

export default function RecognizeScreen({ openModal }: RecognizeScreenProps) {
  const { state } = useHP();

  if (!state) return null;

  return (
    <div style={{ padding: '0 16px 120px', fontFamily: HP_FONT }}>
      <ScreenHeader title="Recognize" subtitle="Apresiasi yang kamu beri & terima"/>

      <HPCard style={{ background: `linear-gradient(135deg, ${HP_TOKENS.yellowWash}, ${HP_TOKENS.sageWash})`, border: 'none' }} padding={16}>
        <div style={{ display: 'flex', gap: 20 }}>
          <StatBlock label="Poin kamu" value={state.points.toLocaleString()} icon="trophy" tone="yellow"/>
          <StatBlock label="Diberi" value="24" icon="heart" tone="coral"/>
          <StatBlock label="Diterima" value="31" icon="sparkle" tone="sage"/>
        </div>
      </HPCard>

      <button 
        onClick={() => openModal('appreciate')} 
        style={{
          marginTop: 12, 
          width: '100%', 
          padding: '14px 16px', 
          borderRadius: 20,
          background: HP_TOKENS.sage, 
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
          boxShadow: `0 4px 14px ${HP_TOKENS.sageSoft}`,
        }}
        className="hp-tap"
      >
        <HPGlyph name="heart" size={18} color="#fff"/> Beri apresiasi
      </button>

      <SectionHeader 
        icon="people" 
        label="Feed tim" 
        action="Filter"
        onAction={() => openModal('filter_feed')}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {state.feed.map((f: any) => <AppreciationCard key={f.id} f={f}/>)}
      </div>

      <SectionHeader 
        icon="trophy" 
        label="Tukar poin" 
        action="Semua"
        onAction={() => openModal('all_rewards')}
      />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <RewardCard title="Extra cuti 1 hari" points={500} tone="sage"/>
        <RewardCard title="Voucher lunch 100k" points={250} tone="yellow"/>
        <RewardCard title="Workshop UX intensif" points={800} tone="blue"/>
        <RewardCard title="Donasi program sosial" points={100} tone="coral"/>
      </div>
    </div>
  );
}

