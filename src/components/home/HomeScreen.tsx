"use client";

import React, { useState, useEffect } from "react";
import { 
  HP_TOKENS, 
  HP_FONT, 
  HP_TEXT 
} from "@/lib/constants";
import { 
  HP_MOODS, 
  HP_ENERGY, 
  HP_AI_INSIGHTS, 
  HP_HABITS, 
  HP_USER 
} from "@/lib/mockData";
import HPGlyph from "@/components/ui/HPGlyph";
import HPAvatar from "@/components/ui/HPAvatar";
import BlobBackground from "@/components/home/BlobBackground";
import Confetti from "@/components/home/Confetti";
import EmotionalHero from "@/components/home/EmotionalHero";
import IntentionCard from "@/components/home/IntentionCard";
import SectionHeader from "@/components/home/SectionHeader";
import PriorityCard from "@/components/home/PriorityCard";
import InsightCard from "@/components/home/InsightCard";
import HabitCell from "@/components/home/HabitCell";

interface HomeScreenProps {
  state: any;
  setState: React.Dispatch<React.SetStateAction<any>>;
  openModal: (name: string) => void;
}

const iconBtnStyle: React.CSSProperties = {
  position: 'relative', width: 40, height: 40, borderRadius: 20, border: `1px solid ${HP_TOKENS.line}`,
  background: HP_TOKENS.card, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
};

export default function HomeScreen({ state, setState, openModal }: HomeScreenProps) {
  const { mood, energy, priorities } = state;
  const [greeting, setGreeting] = useState('');
  const [confetti, setConfetti] = useState(false);

  useEffect(() => {
    const h = new Date().getHours();
    if (h < 11) setGreeting('Selamat pagi');
    else if (h < 15) setGreeting('Selamat siang');
    else if (h < 19) setGreeting('Selamat sore');
    else setGreeting('Selamat malam');
  }, []);

  const moodObj = HP_MOODS.find(m => m.key === mood);
  const energyObj = HP_ENERGY.find(e => e.key === energy);
  const done = priorities.filter((p: any) => p.done).length;
  const total = priorities.length;

  const togglePriority = (id: number) => {
    setState((s: any) => {
      const pIndex = s.priorities.findIndex((p: any) => p.id === id);
      const wasDone = s.priorities[pIndex].done;
      if (!wasDone) { 
        setConfetti(true); 
        setTimeout(() => setConfetti(false), 1200); 
      }
      const newPriorities = [...s.priorities];
      newPriorities[pIndex] = { ...newPriorities[pIndex], done: !wasDone };
      return { ...s, priorities: newPriorities };
    });
  };

  const energyHint = (e: string) => {
    if (e === 'low') return 'Energimu sedang rendah 🌱 Mulai dari task ringan dulu — handoff sinkron ikon cocok sekarang.';
    if (e === 'mid') return 'Energi sedang pas untuk kolaborasi 🌿 Review wireframe dulu, kirim handoff setelah lunch.';
    return 'Energi tinggi — cocok untuk deep work 🔥 Blok 90 menit tanpa gangguan?';
  };

  return (
    <div style={{ position: 'relative', minHeight: '100%', paddingBottom: 120, fontFamily: HP_FONT }}>
      <BlobBackground colors={[HP_TOKENS.yellowSoft, HP_TOKENS.sageSoft, HP_TOKENS.blueSoft]}/>
      <Confetti show={confetti}/>

      <div style={{ position: 'relative', zIndex: 1, padding: '0 16px' }} className="hp-stagger">
        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 4px 12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <HPAvatar name={HP_USER.name} size={40} color={HP_TOKENS.sage}/>
            <div>
              <div style={{ ...HP_TEXT.small, color: HP_TOKENS.inkMute, fontWeight: 700 }}>{greeting} 👋</div>
              <div style={{ ...HP_TEXT.h, fontSize: 16 }}>{HP_USER.name.split(' ')[0]}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div className="hp-tap" style={{
              display: 'flex', alignItems: 'center', gap: 5, padding: '7px 12px', borderRadius: 99,
              background: HP_TOKENS.yellowSoft, fontFamily: HP_FONT, fontWeight: 900, fontSize: 13, color: '#8A6814',
            }}>
              🔥 <span>{HP_USER.streak}</span>
            </div>
            <button onClick={() => openModal('notifications')} className="hp-tap" style={iconBtnStyle}>
              <HPGlyph name="bell" size={20} color={HP_TOKENS.inkSoft}/>
              <div style={{ position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: 4, background: HP_TOKENS.coral }}/>
            </button>
          </div>
        </div>

        {/* HERO — Emotional check-in with mascot */}
        <div style={{ marginTop: 8 }}>
          <EmotionalHero 
            state={state} 
            moodObj={moodObj} 
            energyObj={energyObj} 
            onOpenCheckIn={() => openModal('checkin')}
          />
        </div>

        {/* Intention */}
        <div style={{ marginTop: 12 }}>
          <IntentionCard state={state} setState={setState}/>
        </div>

        {/* LAYER 2 — Priorities */}
        <div style={{ marginTop: 8 }}>
          <SectionHeader icon="target" label="Prioritas hari ini" count={`${done}/${total}`} action="Kelola"/>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {priorities.map((p: any) => (
              <PriorityCard key={p.id} p={p} onToggle={() => togglePriority(p.id)}/>
            ))}
            <button onClick={() => openModal('focus')} className="hp-tap" style={{
              padding: '16px', borderRadius: 20, border: 'none',
              background: `linear-gradient(135deg, ${HP_TOKENS.sage}, #3A6347)`,
              color: '#fff', cursor: 'pointer', fontFamily: HP_FONT, fontWeight: 800, fontSize: 15,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              boxShadow: `0 8px 22px rgba(74,124,89,0.35)`, position: 'relative', overflow: 'hidden',
              marginTop: 4,
            }}>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)', transform: 'translateX(-100%)', animation: 'hpShine 3s ease-in-out infinite' }}/>
              <span style={{ fontSize: 20 }}>🔥</span> Mulai Focus Mode
            </button>
          </div>
        </div>

        {/* Energy-based suggestion */}
        {energy && (
          <div style={{
            marginTop: 12, padding: 14, borderRadius: 20,
            background: `linear-gradient(135deg, ${HP_TOKENS.blueWash}, ${HP_TOKENS.sageWash})`,
            border: `1.5px solid ${HP_TOKENS.blueSoft}`,
            display: 'flex', gap: 12, alignItems: 'flex-start', position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ fontSize: 32, animation: 'hpWiggle 3s ease-in-out infinite' }}>✨</div>
            <div style={{ flex: 1 }}>
              <div style={{ ...HP_TEXT.h, fontSize: 14, color: HP_TOKENS.blue }}>Saran dari Hap</div>
              <div style={{ ...HP_TEXT.body, fontSize: 13, marginTop: 3 }}>{energyHint(energy)}</div>
            </div>
          </div>
        )}

        {/* LAYER 3 — Insights */}
        <div style={{ marginTop: 8 }}>
          <SectionHeader icon="heart" label="Untuk kamu" action="Lihat semua"/>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {HP_AI_INSIGHTS.map((ins, i) => (
              <InsightCard key={i} ins={ins} idx={i}/>
            ))}
          </div>
        </div>

        {/* Habits */}
        <div style={{ marginTop: 8 }}>
          <SectionHeader icon="leaf" label="Kebiasaan kecil" action="Atur"/>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {HP_HABITS.map((h, i) => (
              <HabitCell key={i} h={h}/>
            ))}
          </div>
        </div>

        {/* Closing ritual */}
        <button onClick={() => openModal('reflect')} className="hp-tap" style={{
          marginTop: 24, width: '100%', padding: '16px', borderRadius: 22,
          background: `linear-gradient(135deg, #2C2A5E, #4A4080)`, color: '#fff',
          border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14,
          fontFamily: HP_FONT, textAlign: 'left', boxShadow: '0 8px 22px rgba(44,42,94,0.25)',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -20, right: 20, fontSize: 80, opacity: 0.15 }}>🌙</div>
          <div style={{ width: 44, height: 44, borderRadius: 14, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🌙</div>
          <div style={{ flex: 1, position: 'relative' }}>
            <div style={{ ...HP_TEXT.h, fontSize: 15, color: '#fff' }}>Tutup hari dengan refleksi</div>
            <div style={{ ...HP_TEXT.small, fontWeight: 700, color: 'rgba(255,255,255,0.75)', marginTop: 2 }}>
              3 pertanyaan · opsional · privat
            </div>
          </div>
          <HPGlyph name="arrow" size={18} color="#fff"/>
        </button>
      </div>
    </div>
  );
}
