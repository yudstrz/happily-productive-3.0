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
import DiceBearAvatar from "@/components/ui/DiceBearAvatar";
import { generateCoachingTopic } from "@/lib/aiService";

interface GrowthScreenProps {
  openModal: (name: string, props?: any) => void;
}

const primaryBtn: React.CSSProperties = {
  padding: '9px 16px', borderRadius: 99, border: 'none', background: HP_TOKENS.blue,
  color: '#fff', fontFamily: HP_FONT, fontWeight: 800, fontSize: 13, cursor: 'pointer',
  boxShadow: `0 4px 12px ${HP_TOKENS.blueSoft}`,
};

export default function GrowthScreen({ openModal }: GrowthScreenProps) {
  const { state, user: ctxUser, updateState } = useHP();
  const [refreshing, setRefreshing] = React.useState(false);

  if (!state) return null;

  const user = ctxUser || { name: "User", level: 1, rank: "Novice", role: "Designer", points: 0, avatarConfig: undefined };
  const levelProgress = (user.points % 100) / 100;
  const config = user.avatarConfig && 'seed' in user.avatarConfig ? user.avatarConfig : null;

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

      {/* Hunter Profile Hero */}
      <HPCard padding={20} style={{ 
        background: `linear-gradient(135deg, ${HP_TOKENS.blueWash}, #fff)`,
        border: `2px solid ${HP_TOKENS.blueSoft}`,
        marginBottom: 24
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ 
            width: 100, height: 100, borderRadius: 50, 
            background: HP_TOKENS.sageWash, display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative', border: `1.5px solid ${HP_TOKENS.line}`
          }}>
            {config ? (
              <DiceBearAvatar config={config as any} size={120} mood={state.mood ?? null} />
            ) : (
              <HPAvatar name={user.name} size={60} levelProgress={levelProgress} rank={user.rank}/>
            )}
            <div style={{
              position: 'absolute', top: -5, right: -5, padding: '4px 10px', borderRadius: 12,
              background: HP_TOKENS.yellow, color: '#8A6814', fontWeight: 900, fontSize: 11,
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
            }}>
              LV.{user.level}
            </div>
          </div>
          <div>
            <div style={{ ...HP_TEXT.small, color: HP_TOKENS.blue, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1 }}>HUNTER STATUS</div>
            <div style={{ ...HP_TEXT.title, fontSize: 24, marginTop: 2 }}>{user.name}</div>
            <div style={{ ...HP_TEXT.small, marginTop: 4 }}>Rank {user.rank} · {user.role}</div>
          </div>
        </div>
      </HPCard>

      <SectionHeader 
        icon="sparkle" 
        label="Skill Progression (Bloom's Taxonomy)" 
      />
      <HPCard padding={14}>
        {(state.skills || []).map((s: any, i: number) => (
          <div key={s.name} style={{ padding: '12px 0', borderTop: i === 0 ? 'none' : `1px solid ${HP_TOKENS.lineSoft}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <div>
                <div style={{ ...HP_TEXT.h, fontSize: 14 }}>{s.name}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                  <div style={{
                    fontSize: 10, fontWeight: 900, padding: '2px 8px', borderRadius: 6,
                    background: HP_TOKENS.blue, color: '#fff'
                  }}>{s.bloomLevel}</div>
                  <div style={{ ...HP_TEXT.tiny, color: HP_TOKENS.blue, fontSize: 11 }}>{s.bloomLabel}</div>
                </div>
              </div>
              <button 
                onClick={() => openModal('skill_assessment', { skill: s.name })}
                className="hp-tap"
                style={{
                  padding: '6px 14px', borderRadius: 10, border: `1.5px solid ${HP_TOKENS.blueSoft}`,
                  background: HP_TOKENS.blueWash, color: HP_TOKENS.blue,
                  fontFamily: HP_FONT, fontWeight: 800, fontSize: 11, cursor: 'pointer'
                }}
              >
                Ukur Level
              </button>
            </div>
            <div style={{ position: 'relative' }}>
              <HPBar value={s.current} tone="blue"/>
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
          <button 
            onClick={() => openModal('grow_coaching', { role: 'employee', topic: state.coaching?.aiTopic })} 
            style={{ ...primaryBtn, background: HP_TOKENS.blue }} 
            className="hp-tap"
          >
            Buka
          </button>
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
          <HPGlyph name="sparkle" size={16} color={HP_TOKENS.blue}/>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ ...HP_TEXT.h, fontSize: 13, color: HP_TOKENS.blue }}>Saran topik dari AI</div>
              <button 
                onClick={refreshTopic} 
                className="hp-tap"
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', opacity: refreshing ? 0.5 : 1 }}
              >
                <HPGlyph name="refresh" size={12} color={HP_TOKENS.blue}/>
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


