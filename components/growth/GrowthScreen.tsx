"use client";

import React from "react";
import { useHP } from "@/lib/HPContext";
import { HP_TOKENS, HP_FONT, HP_TEXT } from "@/lib/constants";
import { HP_SKILLS } from "@/lib/mockData";
import HPGlyph from "@/components/ui/HPGlyph";
import HPCard from "@/components/ui/HPCard";
import HPBar from "@/components/ui/HPBar";
import HPAvatar from "@/components/ui/HPAvatar";
import ScreenHeader from "@/components/ui/ScreenHeader";
import SectionHeader from "@/components/home/SectionHeader";
import ReadinessRing from "@/components/growth/ReadinessRing";
import LearningCard from "@/components/growth/LearningCard";

interface GrowthScreenProps {
  openModal: (name: string) => void;
}

const primaryBtn: React.CSSProperties = {
  padding: '9px 16px', borderRadius: 99, border: 'none', background: HP_TOKENS.sage,
  color: '#fff', fontFamily: HP_FONT, fontWeight: 800, fontSize: 13, cursor: 'pointer',
  boxShadow: `0 4px 12px rgba(74,124,89,0.3)`,
};

export default function GrowthScreen({ openModal }: GrowthScreenProps) {
  const { state } = useHP();

  if (!state) return null;

  return (
    <div style={{ padding: '0 16px 120px', fontFamily: HP_FONT }}>
      <ScreenHeader title="Growth" subtitle="Pengembangan & karir kamu"/>

      <HPCard padding={16}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ ...HP_TEXT.small, color: HP_TOKENS.inkMute }}>Future role readiness</div>
            <div style={{ ...HP_TEXT.title, fontSize: 22, marginTop: 4 }}>Senior Designer</div>
          </div>
          <ReadinessRing value={72}/>
        </div>
        <div style={{ 
          ...HP_TEXT.body, 
          fontSize: 13, 
          marginTop: 10, 
          padding: 12, 
          background: HP_TOKENS.sageWash, 
          borderRadius: 12 
        }}>
          <span style={{ fontWeight: 700, color: HP_TOKENS.sage }}>Fokus berikutnya:</span> Leadership & Storytelling — dua skill yang paling berdampak ke role target kamu.
        </div>
      </HPCard>

      <SectionHeader 
        icon="tree" 
        label="Skill progression" 
        action="Lihat detail"
        onAction={() => openModal('skill_details')}
      />
      <HPCard padding={14}>
        {HP_SKILLS.map((s, i) => (
          <div key={s.name} style={{ padding: '10px 0', borderTop: i === 0 ? 'none' : `1px solid ${HP_TOKENS.lineSoft}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <div style={{ ...HP_TEXT.h, fontSize: 13 }}>{s.name}</div>
              <div style={{ ...HP_TEXT.small, color: HP_TOKENS.inkMute }}>{s.current}/{s.target}</div>
            </div>
            <div style={{ position: 'relative' }}>
              <HPBar value={s.current} tone="sage"/>
              <div style={{ 
                position: 'absolute', 
                top: -3, 
                left: `${s.target}%`, 
                width: 2, 
                height: 12, 
                background: HP_TOKENS.yellow, 
                borderRadius: 1 
              }}/>
            </div>
          </div>
        ))}
      </HPCard>

      <SectionHeader 
        icon="book" 
        label="Learning untuk kamu" 
        action="Semua"
        onAction={() => openModal('all_learning')}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <LearningCard title="Influence without Authority" meta="8 menit · Microlearning" tag="Leadership" tone="coral"/>
        <LearningCard title="Design System Governance" meta="45 menit · Video" tag="Design Systems" tone="blue"/>
        <LearningCard title="Storytelling for Designers" meta="22 menit · Article" tag="Storytelling" tone="yellow"/>
      </div>

      <SectionHeader 
        icon="chat" 
        label="1-on-1 Coaching" 
        action="Jadwalkan"
        onAction={() => openModal('schedule_coaching')}
      />
      <HPCard padding={14}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <HPAvatar name="Dewi Lestari" size={44} color={HP_TOKENS.blue}/>
          <div style={{ flex: 1 }}>
            <div style={{ ...HP_TEXT.h, fontSize: 15 }}>Dewi Lestari</div>
            <div style={{ ...HP_TEXT.small, color: HP_TOKENS.inkMute, marginTop: 2 }}>Manager kamu · Rabu, 14:00</div>
          </div>
          <button style={{ ...primaryBtn, background: HP_TOKENS.blue }} className="hp-tap">Buka</button>
        </div>
        <div style={{ 
          marginTop: 12, 
          padding: 12, 
          background: HP_TOKENS.sageWash, 
          borderRadius: 12, 
          display: 'flex', 
          gap: 10, 
          alignItems: 'flex-start' 
        }}>
          <HPGlyph name="sparkle" size={16} color={HP_TOKENS.sage}/>
          <div>
            <div style={{ ...HP_TEXT.h, fontSize: 13, color: HP_TOKENS.sage }}>Saran topik dari AI</div>
            <div style={{ ...HP_TEXT.body, fontSize: 13, marginTop: 4 }}>
              "Kamu lapor hambatan di Goal DS Migration 2 minggu berturut — mungkin bahas ini dulu?"
            </div>
          </div>
        </div>
      </HPCard>
    </div>
  );
}

