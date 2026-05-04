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
  tab: string;
  openModal: (name: string, props?: any) => void;
}

const iconBtnStyle: React.CSSProperties = {
  position: 'relative', width: 40, height: 40, borderRadius: 20, border: `1px solid ${HP_TOKENS.line}`,
  background: HP_TOKENS.card, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
};

export default function HomeScreen({ openModal }: any) {
  const { state, updateState, updateUser, user, syncSkillProgress } = useHP();
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
      const pointsToAward = s.priorities[pIndex].points || 50;
      
      if (!wasDone) { 
        setConfetti(true); 
        setTimeout(() => setConfetti(false), 1200); 
        updateUser((u: any) => ({ ...u, points: u.points + pointsToAward }));
      } else {
        updateUser((u: any) => ({ ...u, points: Math.max(0, u.points - pointsToAward) }));
      }
      const newPriorities = [...s.priorities];
      newPriorities[pIndex] = { ...newPriorities[pIndex], done: !wasDone };
      
      const update: any = { priorities: newPriorities };
      if (!wasDone) {
        const now = new Date();
        update.lastActivityDate = now.toISOString();
        update.penaltyActive = false; // Completing a quest clears penalty banner for the current view
        syncSkillProgress(newPriorities[pIndex].title + " " + newPriorities[pIndex].goal, 2);

        // Create logbook entry for quest
        const newLog = {
          id: Date.now(),
          type: 'quest_completion',
          title: newPriorities[pIndex].title,
          points: pointsToAward,
          date: now.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
          day: now.toLocaleDateString('id-ID', { weekday: 'long' }),
          time: now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        };
        update.logbook = [newLog, ...(s.logbook || [])];
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
          glyph: habit.glyph,
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
      <BlobBackground colors={[HP_TOKENS.yellowWash, '#fff', HP_TOKENS.paper]}/>
      <Confetti show={confetti}/>

      <div style={{ position: 'relative', zIndex: 1, padding: '0 16px' }} className="hp-stagger">
        {/* Top Card - Profile & Level */}
        <div style={{ 
          background: HP_TOKENS.card,
          borderRadius: 24,
          padding: '24px',
          marginTop: 16,
          border: `1px solid ${HP_TOKENS.line}`,
          boxShadow: '0 8px 24px rgba(0,0,0,0.02)',
          position: 'relative',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ position: 'relative' }}>
                <HPAvatar 
                  name={user.name} 
                  size={56} 
                  rank={user.rank}
                  levelProgress={levelProgress} 
                />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ ...HP_TEXT.h, fontSize: 20 }}>{user.name.split(' ')[0]}</div>
                  <div style={{ 
                    background: HP_TOKENS.yellow, color: HP_TOKENS.ink, fontSize: 10, fontWeight: 900, 
                    padding: '2px 8px', borderRadius: 6, letterSpacing: 0.5 
                  }}>
                    LV. {user.level}
                  </div>
                </div>
                <div style={{ ...HP_TEXT.small, color: HP_TOKENS.inkMute, fontWeight: 700, fontSize: 12, marginTop: 2 }}>
                  {user.rank} Rank Specialist
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div className="hp-tap" style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 12,
                background: HP_TOKENS.yellowSoft, fontFamily: HP_FONT, fontWeight: 900, fontSize: 14, color: HP_TOKENS.ink,
                border: `1px solid ${HP_TOKENS.yellow}`,
              }}>
                <HPGlyph name="zap" size={14} color={HP_TOKENS.ink} />
                <span>{user.streak}</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 20, marginBottom: 16 }}>
            <div style={{ flex: 1 }}>
              <div style={{ ...HP_TEXT.tiny, color: HP_TOKENS.inkMute, marginBottom: 4 }}>Level Progress</div>
              <div style={{ width: '100%', height: 6, background: HP_TOKENS.lineSoft, borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ 
                  width: `${levelProgress * 100}%`, height: '100%', 
                  background: HP_TOKENS.yellow, 
                  transition: '1s cubic-bezier(0.2, 0.8, 0.2, 1)',
                }} />
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ ...HP_TEXT.tiny, color: HP_TOKENS.inkMute, marginBottom: 4 }}>Total Points</div>
              <div style={{ ...HP_TEXT.h, fontSize: 24 }}>{user.points.toLocaleString()}</div>
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
        <div style={{ marginTop: 24 }}>
          <SectionHeader 
            icon="target" 
            label="Daily Quests" 
            count={`${done}/${total}`} 
            action="Manage"
            onAction={() => openModal('manage_priorities')}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {priorities.map((p: any) => (
              <PriorityCard key={p.id} p={p} onToggle={() => togglePriority(p.id)}/>
            ))}
            <button onClick={() => openModal('focus')} className="hp-tap" style={{
              padding: '16px', borderRadius: 16, border: 'none',
              background: HP_TOKENS.ink,
              color: HP_TOKENS.yellow, cursor: 'pointer', fontFamily: HP_FONT, fontWeight: 800, fontSize: 15,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
              marginTop: 4,
            }}>
              <HPGlyph name="sparkle" size={20} color={HP_TOKENS.yellow}/>
              <span>Start Focus Session</span>
            </button>
          </div>
        </div>

        {/* Energy-based suggestion */}
        {energy && (
          <div style={{
            marginTop: 16, padding: 16, borderRadius: 16,
            background: HP_TOKENS.paper,
            border: `1px solid ${HP_TOKENS.line}`,
            display: 'flex', gap: 16, alignItems: 'center',
          }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: HP_TOKENS.blueSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <HPGlyph name="activity" size={20} color={HP_TOKENS.blue} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ ...HP_TEXT.h, fontSize: 14, color: HP_TOKENS.blue }}>System Insight</div>
              <div style={{ ...HP_TEXT.body, fontSize: 13, marginTop: 2 }}>{energyHint(energy)}</div>
            </div>
          </div>
        )}

        {/* Habits */}
        <div style={{ marginTop: 24 }}>
          <SectionHeader 
            icon="leaf" 
            label="Daily Training" 
            action="Settings"
            onAction={() => openModal('manage_habits')}
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {state.habits.map((h: any, i: number) => (
              <HabitCell key={i} h={h} onToggle={() => toggleHabit(h.name)}/>
            ))}
          </div>
        </div>

        {/* Professional Growth */}
        <div style={{ marginTop: 24 }}>
          <SectionHeader icon="heart" label="AI Coach Insights" action="Explore" onAction={() => openModal('coach')}/>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {HP_AI_INSIGHTS.map((ins, i) => (
              <InsightCard key={i} ins={ins} idx={i}/>
            ))}
          </div>
        </div>

        {/* Closing actions */}
        <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button onClick={() => openModal('reflect')} className="hp-tap" style={{
            width: '100%', padding: '18px', borderRadius: 16,
            background: HP_TOKENS.yellow, color: HP_TOKENS.ink,
            border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
            fontFamily: HP_FONT, fontWeight: 800, fontSize: 15,
          }}>
            <HPGlyph name="moon" size={20} color={HP_TOKENS.ink} />
            <span>Evening Reflection</span>
          </button>

          <button onClick={() => openModal('logbook')} className="hp-tap" style={{
            width: '100%', padding: '16px', borderRadius: 16,
            background: 'transparent', color: HP_TOKENS.inkMute,
            border: `1.5px solid ${HP_TOKENS.line}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            fontFamily: HP_FONT, fontWeight: 700, fontSize: 14,
          }}>
            <HPGlyph name="book" size={18} color={HP_TOKENS.inkMute}/>
            <span>View Activity Logbook</span>
          </button>
        </div>
      </div>
    </div>
  );
}

