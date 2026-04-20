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
import { generateCoachingTopic } from "@/lib/aiService";

interface GrowthScreenProps {
  openModal: (name: string) => void;
}

const primaryBtn: React.CSSProperties = {
  padding: '9px 16px', borderRadius: 99, border: 'none', background: HP_TOKENS.sage,
  color: '#fff', fontFamily: HP_FONT, fontWeight: 800, fontSize: 13, cursor: 'pointer',
  boxShadow: `0 4px 12px rgba(74,124,89,0.3)`,
};

export default function GrowthScreen({ openModal }: GrowthScreenProps) {
  const { state, updateState } = useHP();
  const [refreshing, setRefreshing] = React.useState(false);

  if (!state) return null;

  const refreshTopic = async () => {
    setRefreshing(true);
    const topic = await generateCoachingTopic(state.goals, state.skills);
    updateState((s: any) => ({
      ...s,
      coaching: { ...s.coaching, aiTopic: topic }
    }));
    setRefreshing(false);
  };

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
        action="Kelola"
        onAction={() => openModal('manage_skills')}
      />
      <HPCard padding={14}>
        {(state.skills || []).map((s: any, i: number) => (
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
        action="Edit"
        onAction={() => openModal('manage_learning')}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {(state.learning || []).map((l: any) => (
          <LearningCard 
            key={l.id} 
            title={l.title} 
            meta={l.meta} 
            tag={l.tag} 
            tone={l.tone} 
            onClick={() => openModal('learning_detail')}
          />
        ))}
      </div>

      <SectionHeader 
        icon="chat" 
        label="1-on-1 Coaching" 
        action="Atur"
        onAction={() => openModal('schedule_coaching')}
      />
      <HPCard padding={14}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <HPAvatar name={state.coaching?.coachName || "Dewi Lestari"} size={44} color={HP_TOKENS.blue}/>
          <div style={{ flex: 1 }}>
            <div style={{ ...HP_TEXT.h, fontSize: 15 }}>{state.coaching?.coachName}</div>
            <div style={{ ...HP_TEXT.small, color: HP_TOKENS.inkMute, marginTop: 2 }}>{state.coaching?.role} · {state.coaching?.time}</div>
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
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ ...HP_TEXT.h, fontSize: 13, color: HP_TOKENS.sage }}>Saran topik dari AI</div>
              <button 
                onClick={refreshTopic} 
                className="hp-tap"
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex' }}
              >
                <HPGlyph name="refresh" size={12} color={HP_TOKENS.sage} style={{ opacity: refreshing ? 0.5 : 1 }}/>
              </button>
            </div>
            <div style={{ ...HP_TEXT.body, fontSize: 13, marginTop: 4, fontStyle: refreshing ? 'italic' : 'normal', opacity: refreshing ? 0.6 : 1 }}>
              {refreshing ? "Menganalisis goal kamu..." : (state.coaching?.aiTopic || "Pilih goal untuk mendapakan saran topik.")}
            </div>
          </div>
        </div>
      </HPCard>
    </div>
  );
}


