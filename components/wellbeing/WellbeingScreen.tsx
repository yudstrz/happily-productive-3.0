"use client";

import React from "react";
import { useHP } from "@/lib/HPContext";
import { HP_TOKENS, HP_FONT, HP_TEXT } from "@/lib/constants";
import HPGlyph from "@/components/ui/HPGlyph";
import HPCard from "@/components/ui/HPCard";
import HPAvatar from "@/components/ui/HPAvatar";
import DiceBearAvatar from "@/components/ui/DiceBearAvatar";
import ScreenHeader from "@/components/ui/ScreenHeader";
import SectionHeader from "@/components/home/SectionHeader";
import ReadinessRing from "@/components/growth/ReadinessRing";
import DimensionCard from "@/components/wellbeing/DimensionCard";
import ProgramCard from "@/components/wellbeing/ProgramCard";
import { generateDailyPrompt } from "@/lib/aiService";

interface WellbeingScreenProps {
  openModal: (name: string, props?: any) => void;
}

const softBtn: React.CSSProperties = {
  padding: '14px 12px', borderRadius: 14, background: HP_TOKENS.lineSoft, border: 'none',
  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
  fontFamily: HP_FONT, fontWeight: 700, fontSize: 13, color: HP_TOKENS.ink, cursor: 'pointer',
};

export default function WellbeingScreen({ openModal }: WellbeingScreenProps) {
  const { state, user: ctxUser, updateState } = useHP();
  const [refreshing, setRefreshing] = React.useState(false);
  
  if (!state) return null;

  const { wellbeing } = state;
  const avg = Math.round((wellbeing.dims || []).reduce((a: number, b: any) => a + b.score, 0) / (wellbeing.dims?.length || 1));
  
  const refreshPrompt = async () => {
    setRefreshing(true);
    const prompt = await generateDailyPrompt(state.mood, state.goals);
    updateState((s: any) => ({
      ...s,
      wellbeing: { ...s.wellbeing, dailyPrompt: prompt }
    }));
    setRefreshing(false);
  };

  const user = ctxUser || { name: "User", avatarConfig: null };
  const config = user.avatarConfig && 'seed' in user.avatarConfig ? user.avatarConfig : null;

  return (
    <div style={{ padding: '0 16px 120px', fontFamily: HP_FONT }}>
      <ScreenHeader title="Wellbeing" subtitle="Keseimbangan & energi kamu hari ini"/>

      {/* Wellness Avatar Hero */}
      <div style={{ 
        display: 'flex', flexDirection: 'column', alignItems: 'center', 
        padding: '24px 0', marginBottom: 12,
        background: `radial-gradient(circle at center, ${HP_TOKENS.sageWash} 0%, transparent 70%)`
      }}>
        <div style={{ position: 'relative' }}>
          <div style={{ 
            width: 140, height: 140, borderRadius: 70, 
            background: '#fff', border: `2px solid ${HP_TOKENS.sageSoft}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 12px 32px rgba(74,124,89,0.1)'
          }}>
            {config ? (
              <DiceBearAvatar config={config as any} size={160} mood={state.mood ?? null} />
            ) : (
              <HPAvatar name={user.name} size={60} />
            )}
          </div>
          <div style={{
            position: 'absolute', bottom: 10, right: -10,
            padding: '6px 14px', borderRadius: 20, background: '#fff',
            border: `1.5px solid ${HP_TOKENS.line}`, fontSize: 13, fontWeight: 800,
            color: HP_TOKENS.sage, boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
          }}>
            Feeling {state.mood || 'Calm'}
          </div>
        </div>
      </div>

      <HPCard style={{ background: `linear-gradient(135deg, ${HP_TOKENS.sageWash}, ${HP_TOKENS.blueWash})`, border: 'none' }} padding={18}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ position: 'relative' }}>
            <ReadinessRing value={wellbeing.score || avg}/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ ...HP_TEXT.small, color: HP_TOKENS.inkMute }}>Wellbeing score</div>
            <div style={{ ...HP_TEXT.title, fontSize: 22, marginTop: 2 }}>Kamu sedang baik 🌱</div>
            <div style={{ ...HP_TEXT.small, color: HP_TOKENS.inkSoft, fontWeight: 600, marginTop: 4 }}>
              Naik 3 poin dari minggu lalu
            </div>
          </div>
        </div>
      </HPCard>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 12 }}>
        {wellbeing.dims.map((d: any) => <DimensionCard key={d.key} d={d}/>)}
      </div>

      <button 
        onClick={() => openModal('pause')} 
        style={{
          marginTop: 14, 
          width: '100%', 
          padding: '16px', 
          borderRadius: 20,
          background: HP_TOKENS.card, 
          border: `1px solid ${HP_TOKENS.line}`, 
          cursor: 'pointer',
          display: 'flex', 
          alignItems: 'center', 
          gap: 14, 
          fontFamily: HP_FONT, 
          textAlign: 'left',
        }}
        className="hp-tap"
      >
        <div style={{ 
          width: 48, 
          height: 48, 
          borderRadius: 16, 
          background: HP_TOKENS.sageSoft, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          <HPGlyph name="pause" size={22} color={HP_TOKENS.sage}/>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ ...HP_TEXT.h, fontSize: 15 }}>Pause button</div>
          <div style={{ ...HP_TEXT.small, color: HP_TOKENS.inkSoft, fontWeight: 600, marginTop: 2 }}>
            Reset mental 1–3 menit · guided breathing
          </div>
        </div>
        <HPGlyph name="arrow" size={18} color={HP_TOKENS.inkMute}/>
      </button>

      <SectionHeader 
        icon="calendar" 
        label="Program & tantangan" 
        action="Kelola"
        onAction={() => openModal('manage_programs')}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {(wellbeing.programs || []).map((p: any) => (
          <ProgramCard 
            key={p.id} 
            title={p.title} 
            progress={p.progress} 
            joined={p.joined} 
            tone={p.tone} 
            day={p.day}
          />
        ))}
      </div>

      <SectionHeader 
        icon="book" 
        label="Jurnal & refleksi"
        action="Riwayat"
        onAction={() => openModal('journal_history')}
      />
      <HPCard padding={14}>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={() => openModal('journal', { type: 'reflection' })} style={{ ...softBtn, flex: 1 }} className="hp-tap">
            <HPGlyph name="book" size={18} color={HP_TOKENS.sage}/>
            <div>Reflection journal</div>
          </button>
          <button onClick={() => openModal('journal', { type: 'gratitude' })} style={{ ...softBtn, flex: 1 }} className="hp-tap">
            <HPGlyph name="heart" size={18} color={HP_TOKENS.coral}/>
            <div>Gratitude log</div>
          </button>
        </div>
        <div style={{ marginTop: 12, padding: 12, background: HP_TOKENS.lineSoft, borderRadius: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ ...HP_TEXT.small, color: HP_TOKENS.sage, fontWeight: 700 }}>PROMPT HARI INI</div>
            <button 
              onClick={refreshPrompt} 
              className="hp-tap"
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', opacity: refreshing ? 0.5 : 1 }}
            >
              <HPGlyph name="refresh" size={12} color={HP_TOKENS.sage}/>
            </button>
          </div>
          <div style={{ ...HP_TEXT.h, fontSize: 15, marginTop: 4, fontStyle: refreshing ? 'italic' : 'normal', opacity: refreshing ? 0.6 : 1 }}>
            {refreshing ? "Mencari inspirasi..." : (wellbeing.dailyPrompt || "Tulis apa saja yang ada di pikiranmu.")}
          </div>
          <div style={{ ...HP_TEXT.small, color: HP_TOKENS.inkMute, marginTop: 6, fontStyle: 'italic' }}>
            🔒 Private — tidak bisa diakses siapapun, termasuk HR.
          </div>
        </div>
      </HPCard>
    </div>
  );
}

