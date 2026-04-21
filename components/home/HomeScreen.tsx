"use client";

import React, { useState, useEffect } from "react";
import { useHP } from "@/lib/HPContext";
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
  openModal: (name: string) => void;
  tab: string;
}

const iconBtnStyle: React.CSSProperties = {
  position: 'relative', width: 40, height: 40, borderRadius: 20, border: `1px solid ${HP_TOKENS.line}`,
  background: HP_TOKENS.card, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
};

export default function HomeScreen({ openModal }: any) {
  const { state, updateState, updateUser, user } = useHP();
  const [greeting, setGreeting] = useState('');
  const [confetti, setConfetti] = useState(false);

  useEffect(() => {
    const h = new Date().getHours();
    if (h < 11) setGreeting('Selamat pagi');
    else if (h < 15) setGreeting('Selamat siang');
    else if (h < 19) setGreeting('Selamat sore');
    else setGreeting('Selamat malam');
  }, []);

  if (!state || !user) return null;

  const { mood, energy, priorities } = state;
  const calculateLevelProgress = (points: number) => {
    if (points < 1000) return (points % 100) / 100;
    if (points < 4000) return ((points - 1000) % 300) / 300;
    return ((points - 4000) % 1000) / 1000;
  };

  const levelProgress = calculateLevelProgress(user.points);

  const moodObj = HP_MOODS.find(m => m.key === mood);
  const energyObj = HP_ENERGY.find(e => e.key === energy);
  const done = priorities.filter((p: any) => p.done).length;
  const total = priorities.length;

  const togglePriority = (id: number) => {
    updateState((s: any) => {
      const pIndex = s.priorities.findIndex((p: any) => p.id === id);
      const wasDone = s.priorities[pIndex].done;
      if (!wasDone) { 
        setConfetti(true); 
        setTimeout(() => setConfetti(false), 1200); 
        // Award 50 points
        updateUser((u: any) => ({ ...u, points: u.points + 50 }));
      } else {
        // Deduct 50 points if toggled off
        updateUser((u: any) => ({ ...u, points: Math.max(0, u.points - 50) }));
      }
      const newPriorities = [...s.priorities];
      newPriorities[pIndex] = { ...newPriorities[pIndex], done: !wasDone };
      
      const update: any = { priorities: newPriorities };
      if (!wasDone) {
        update.lastActivityDate = new Date().toISOString();
        update.penaltyActive = false; // Completing a quest clears penalty banner for the current view
        syncSkillProgress(newPriorities[pIndex].title + " " + newPriorities[pIndex].goal, 2);
      }
      return { ...s, ...update };
    });
  };

  const toggleHabit = (name: string) => {
    updateState((s: any) => {
      const hIndex = s.habits.findIndex((h: any) => h.name === name);
      const habit = s.habits[hIndex];
      const wasDone = habit.done;
      
      const newHabits = [...s.habits];
      newHabits[hIndex] = { ...newHabits[hIndex], done: !wasDone };

      if (!wasDone) { 
        setConfetti(true); 
        setTimeout(() => setConfetti(false), 1200); 
        
        // Award 20 points
        updateUser((u: any) => ({ ...u, points: u.points + 20 }));

        // Create logbook entry
        const now = new Date();
        const newLog = {
          id: Date.now(),
          type: 'habit_completion',
          habitName: name,
          emoji: habit.emoji,
          points: 20,
          date: now.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
          day: now.toLocaleDateString('id-ID', { weekday: 'long' }),
          time: now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        };

        return { ...s, habits: newHabits, logbook: [newLog, ...(s.logbook || [])], lastActivityDate: now.toISOString(), penaltyActive: false };
      } else {
        updateUser((u: any) => ({ ...u, points: Math.max(0, u.points - 20) }));
        return { ...s, habits: newHabits };
      }
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
        {/* Top bar - Status Window Style */}
        {state.penaltyActive && (
          <div style={{
            background: `linear-gradient(135deg, ${HP_TOKENS.coral}, #B25A4D)`,
            borderRadius: 20, padding: '16px 20px', marginBottom: 16, marginTop: 8,
            color: '#fff', boxShadow: '0 8px 20px rgba(232,139,125,0.4)',
            display: 'flex', alignItems: 'center', gap: 15,
            animation: 'hpPulse 2s infinite'
          }}>
            <div style={{ fontSize: 32 }}>⚠️</div>
            <div>
              <div style={{ ...HP_TEXT.h, color: '#fff', fontSize: 15 }}>PENALTY QUEST RECEIVED</div>
              <div style={{ ...HP_TEXT.small, color: 'rgba(255,255,255,0.85)', fontSize: 12, marginTop: 2 }}>
                Kamu melewatkan Daily Quest kemarin. -50 Poin & Streak Reset.
              </div>
            </div>
          </div>
        )}

        <div style={{ 
          background: `linear-gradient(135deg, ${HP_TOKENS.paper}, #fff)`,
          borderRadius: 24,
          padding: '24px 20px',
          marginTop: 8,
          border: `1.5px solid ${HP_TOKENS.line}`,
          boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Background Decorative Lv */}
          <div style={{ 
            position: 'absolute', top: -20, right: -10, fontSize: 120, 
            fontWeight: 900, color: HP_TOKENS.lineSoft, zIndex: 0, opacity: 0.5 
          }}>
            {user.level}
          </div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <HPAvatar name={user.name} size={52} color={HP_TOKENS.sage} levelProgress={levelProgress} rank={user.rank}/>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ ...HP_TEXT.h, fontSize: 20 }}>{user.name.split(' ')[0]}</div>
                    <div style={{ 
                      background: HP_TOKENS.yellow, color: '#8A6814', fontSize: 10, fontWeight: 900, 
                      padding: '2px 8px', borderRadius: 6, letterSpacing: 0.5 
                    }}>
                      RANK {user.rank}
                    </div>
                  </div>
                  <div style={{ ...HP_TEXT.small, color: HP_TOKENS.inkMute, fontWeight: 700, fontSize: 12, marginTop: 2 }}>
                    Status: <span style={{ color: HP_TOKENS.sage }}>Ready for Quests</span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <button onClick={() => openModal('system_guide')} className="hp-tap" style={{
                  background: HP_TOKENS.lineSoft, border: 'none', borderRadius: 20, width: 32, height: 32,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                }}>
                  <HPGlyph name="sparkle" size={16} color={HP_TOKENS.sage}/>
                </button>
                <div className="hp-tap" style={{
                  display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 99,
                  background: HP_TOKENS.yellowSoft, fontFamily: HP_FONT, fontWeight: 900, fontSize: 14, color: '#8A6814',
                }}>
                  🔥 <span>{user.streak}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 20, marginBottom: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ ...HP_TEXT.tiny, color: HP_TOKENS.inkMute, marginBottom: 4 }}>Current Level</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                  <span style={{ ...HP_TEXT.small, color: HP_TOKENS.sage, fontWeight: 900, fontSize: 16 }}>Lv.</span>
                  <span style={{ ...HP_TEXT.display, fontSize: 48, lineHeight: 0.8 }}>{user.level}</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ ...HP_TEXT.tiny, color: HP_TOKENS.inkMute, marginBottom: 4 }}>Combat Power (Points)</div>
                <div style={{ ...HP_TEXT.h, fontSize: 24 }}>{user.points.toLocaleString()} <span style={{ fontSize: 12, color: HP_TOKENS.inkFade }}>PTS</span></div>
              </div>
            </div>
            
            <div style={{ marginTop: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ ...HP_TEXT.tiny, color: HP_TOKENS.inkMute }}>Level Progress</span>
                <span style={{ ...HP_TEXT.tiny, color: HP_TOKENS.sage, fontWeight: 800 }}>{Math.round(levelProgress * 100)}%</span>
              </div>
              <div style={{ width: '100%', height: 8, background: HP_TOKENS.lineSoft, borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ 
                  width: `${levelProgress * 100}%`, height: '100%', 
                  background: `linear-gradient(90deg, ${HP_TOKENS.sageLight}, ${HP_TOKENS.sage})`, 
                  transition: '1s cubic-bezier(0.2, 0.8, 0.2, 1)',
                  boxShadow: `0 0 10px ${HP_TOKENS.sageSoft}`
                }} />
              </div>
            </div>

            {/* Penalty Threshold Settings */}
            <div style={{ marginTop: 18, paddingTop: 16, borderTop: `1px solid ${HP_TOKENS.lineSoft}` }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ ...HP_TEXT.tiny, color: HP_TOKENS.inkMute }}>Penalty Quest aktif jika tidak ada aktivitas selama</div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {[1, 2, 3].map(d => (
                    <button
                      key={d}
                      onClick={() => updateState((s: any) => ({ ...s, penaltyThresholdDays: d }))}
                      style={{
                        width: 36, height: 30, borderRadius: 8,
                        background: (state.penaltyThresholdDays ?? 1) === d ? HP_TOKENS.sage : HP_TOKENS.lineSoft,
                        color: (state.penaltyThresholdDays ?? 1) === d ? '#fff' : HP_TOKENS.inkSoft,
                        fontFamily: HP_FONT, fontWeight: 800, fontSize: 12,
                        border: 'none', cursor: 'pointer', transition: '0.2s',
                      }}
                    >
                      {d}d
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* HERO — Emotional check-in */}
        <div style={{ marginTop: 16 }}>
          <EmotionalHero 
            state={state} 
            moodObj={moodObj} 
            energyObj={energyObj} 
            onOpenCheckIn={() => openModal('checkin')}
          />
        </div>

        {/* Intention */}
        <div style={{ marginTop: 12 }}>
          <IntentionCard state={state} setState={updateState}/>
        </div>

        {/* LAYER 2 — Priorities as Daily Quests */}
        <div style={{ marginTop: 16 }}>
          <SectionHeader 
            icon="target" 
            label="Daily Quests" 
            count={`${done}/${total}`} 
            action="Kelola"
            onAction={() => openModal('manage_priorities')}
          />
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
              <HPGlyph name="sparkle" size={20} color="#fff"/> Enter Focus Mode
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
            <div style={{ fontSize: 32, animation: 'hpWiggle 3s ease-in-out infinite' }}>📜</div>
            <div style={{ flex: 1 }}>
              <div style={{ ...HP_TEXT.h, fontSize: 14, color: HP_TOKENS.blue }}>System Advice</div>
              <div style={{ ...HP_TEXT.body, fontSize: 13, marginTop: 3 }}>{energyHint(energy)}</div>
            </div>
          </div>
        )}

        {/* LAYER 3 — Insights */}
        <div style={{ marginTop: 16 }}>
          <SectionHeader icon="heart" label="Professional Growth" action="Lihat semua" onAction={() => openModal('coach')}/>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {HP_AI_INSIGHTS.map((ins, i) => (
              <InsightCard key={i} ins={ins} idx={i}/>
            ))}
          </div>
        </div>

        {/* Habits as Training Quests */}
        <div style={{ marginTop: 16 }}>
          <SectionHeader 
            icon="leaf" 
            label="Training Quests" 
            action="Atur"
            onAction={() => openModal('manage_habits')}
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {state.habits.map((h: any, i: number) => (
              <HabitCell key={i} h={h} onToggle={() => toggleHabit(h.name)}/>
            ))}
          </div>
        </div>


        {/* Closing ritual */}
        <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button onClick={() => openModal('reflect')} className="hp-tap" style={{
            width: '100%', padding: '16px', borderRadius: 22,
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
                Laporan mood & task selesai
              </div>
            </div>
            <HPGlyph name="arrow" size={18} color="#fff"/>
          </button>

          <button onClick={() => openModal('logbook')} className="hp-tap" style={{
            width: '100%', padding: '14px', borderRadius: 20,
            background: HP_TOKENS.paper, color: HP_TOKENS.ink,
            border: `1.5px solid ${HP_TOKENS.line}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            fontFamily: HP_FONT, fontWeight: 700, fontSize: 14,
          }}>
            <HPGlyph name="book" size={18} color={HP_TOKENS.inkSoft}/> Lihat Riwayat Logbook
          </button>
        </div>
      </div>
    </div>
  );
}

