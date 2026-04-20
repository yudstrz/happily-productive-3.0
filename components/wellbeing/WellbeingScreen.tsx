"use client";

import React from "react";
import { useHP } from "@/lib/HPContext";
import { HP_TOKENS, HP_FONT, HP_TEXT } from "@/lib/constants";
import HPGlyph from "@/components/ui/HPGlyph";
import HPCard from "@/components/ui/HPCard";
import ScreenHeader from "@/components/ui/ScreenHeader";
import SectionHeader from "@/components/home/SectionHeader";
import ReadinessRing from "@/components/growth/ReadinessRing";
import DimensionCard from "@/components/wellbeing/DimensionCard";
import ProgramCard from "@/components/wellbeing/ProgramCard";

interface WellbeingScreenProps {
  openModal: (name: string) => void;
}

const softBtn: React.CSSProperties = {
  padding: '14px 12px', borderRadius: 14, background: HP_TOKENS.lineSoft, border: 'none',
  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
  fontFamily: HP_FONT, fontWeight: 700, fontSize: 13, color: HP_TOKENS.ink, cursor: 'pointer',
};

export default function WellbeingScreen({ openModal }: WellbeingScreenProps) {
  const { state } = useHP();
  
  if (!state) return null;

  const { wellbeing } = state;
  const avg = Math.round(wellbeing.dims.reduce((a: number, b: any) => a + b.score, 0) / wellbeing.dims.length);
  
  return (
    <div style={{ padding: '0 16px 120px', fontFamily: HP_FONT }}>
      <ScreenHeader title="Wellbeing" subtitle="Holistik: mental, fisik, finansial, sosial"/>

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

      <SectionHeader icon="calendar" label="Program & tantangan"/>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <ProgramCard title="21 Hari Meditasi" progress={57} joined={142} tone="lavender" day="Hari 12 dari 21"/>
        <ProgramCard title="Step Challenge" progress={74} joined={89} tone="yellow" day="7,420 langkah hari ini"/>
        <ProgramCard title="Gratitude Week" progress={40} joined={210} tone="coral" day="Hari 2 dari 7"/>
      </div>

      <SectionHeader 
        icon="book" 
        label="Jurnal & refleksi"
        action="Riwayat"
        onAction={() => openModal('journal_history')}
      />
      <HPCard padding={14}>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={() => openModal('journal')} style={{ ...softBtn, flex: 1 }} className="hp-tap">
            <HPGlyph name="book" size={18} color={HP_TOKENS.sage}/>
            <div>Reflection journal</div>
          </button>
          <button onClick={() => openModal('gratitude')} style={{ ...softBtn, flex: 1 }} className="hp-tap">
            <HPGlyph name="heart" size={18} color={HP_TOKENS.coral}/>
            <div>Gratitude log</div>
          </button>
        </div>
        <div style={{ marginTop: 12, padding: 12, background: HP_TOKENS.lineSoft, borderRadius: 12 }}>
          <div style={{ ...HP_TEXT.small, color: HP_TOKENS.sage, fontWeight: 700 }}>PROMPT HARI INI</div>
          <div style={{ ...HP_TEXT.h, fontSize: 15, marginTop: 4 }}>
            "Apa satu hal kecil yang bikin kamu bangga hari ini?"
          </div>
          <div style={{ ...HP_TEXT.small, color: HP_TOKENS.inkMute, marginTop: 6, fontStyle: 'italic' }}>
            🔒 Private — tidak bisa diakses siapapun, termasuk HR.
          </div>
        </div>
      </HPCard>
    </div>
  );
}

