"use client";

import React, { useState, useEffect, useRef } from "react";
import { useHP } from "@/lib/HPContext";
import { HP_TOKENS, HP_FONT, HP_TEXT } from "@/lib/constants";
import { 
  HP_AI_INSIGHTS, 
  HP_HABITS, 
} from "@/lib/mockData";
import HumanFullBody from "@/components/ui/HumanFullBody";
import HPAvatar from "@/components/ui/HPAvatar";
import HPGlyph from "@/components/ui/HPGlyph";
import BlobBackground from "@/components/home/BlobBackground";
import Confetti from "@/components/home/Confetti";
import SummaryRing from "@/components/home/SummaryRing";
import SectionHeader from "@/components/home/SectionHeader";
import HabitRow from "@/components/home/HabitRow";
import InsightCarousel from "@/components/home/InsightCarousel";

export default function HomeScreen() {
  const { state, user, openModal } = useHP() as any;
  const [greeting, setGreeting] = useState("Good morning");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  if (!state || !user) return null;

  const levelProgress = (user.points % 100) / 100;

  return (
    <div style={{ padding: "0 16px 120px", position: "relative" }}>
      <Confetti active={state.penaltyActive === false && user.streak > 0} />
      
      {/* ── HERO SECTION ────────────────────────────────────────────── */}
      <div style={{ 
        marginTop: 20, 
        marginBottom: 32, 
        position: 'relative'
      }}>
        <div style={{
          background: `linear-gradient(135deg, ${HP_TOKENS.sageSoft} 0%, rgba(255,255,255,1) 100%)`,
          borderRadius: 32,
          padding: '24px 24px 32px',
          border: `1.5px solid ${HP_TOKENS.line}`,
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(74,124,89,0.08)'
        }}>
          <BlobBackground color={HP_TOKENS.sage} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              
              {/* Profile Square with dynamic frame */}
              <div 
                onClick={() => openModal('avatar_editor')}
                style={{ transform: 'scale(1.1)', transformOrigin: 'left', cursor: 'pointer' }}
              >
                <HPAvatar 
                  name={user.name} 
                  size={60} 
                  levelProgress={levelProgress}
                  rank={user.rank}
                />
              </div>

              <div style={{ flex: 1, marginLeft: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                  <span style={{ 
                    fontFamily: HP_FONT, 
                    fontWeight: 900, 
                    fontSize: 24, 
                    color: HP_TOKENS.ink,
                    letterSpacing: -0.5
                  }}>
                    {user.name}
                  </span>
                  <div style={{ 
                    padding: '2px 8px', borderRadius: 6, background: HP_TOKENS.ink,
                    color: '#fff', fontSize: 10, fontWeight: 900
                  }}>
                    LV.{user.level}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                   <div style={{ 
                    color: HP_TOKENS.inkMute,
                    fontSize: 13,
                    fontWeight: 700,
                  }}>
                    {user.role}
                  </div>
                </div>
              </div>

              {/* Persona Character Full-Body */}
              <div style={{ 
                marginRight: -10, 
                marginTop: -20,
                filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.1))',
                cursor: 'pointer'
              }} onClick={() => openModal('avatar_editor')}>
                <HumanFullBody 
                  skinColor={user.avatarConfig?.skinColor || "#FFDBAC"}
                  clothingColor={user.avatarConfig?.clothingColor || HP_TOKENS.blue}
                  hairColor={user.avatarConfig?.hairColor || "#000"}
                  hairStyle={user.avatarConfig?.hairStyle || "short"}
                  size={140} 
                  mood={state.mood}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
              <SummaryRing 
                progress={levelProgress} 
                label="Level" 
                value={user.level.toString()}
                subValue={`${user.points % 100}/100 XP`}
              />
              <div style={{ flex: 1 }}>
                <div style={{ ...HP_TEXT.h, fontSize: 28, marginBottom: 4 }}>
                  {greeting}, <span style={{ color: HP_TOKENS.sage }}>{user.name.split(' ')[0]}</span>
                </div>
                <div style={{ ...HP_TEXT.p, color: HP_TOKENS.inkMute, opacity: 0.8 }}>
                   {state.mood === 'joy' ? "You're radiating positive energy! ⚡️" : "Ready to master your goals today?"}
                </div>
              </div>
              <div style={{ 
                width: 60, height: 60, borderRadius: 20, 
                background: '#fff', 
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 8px 20px rgba(0,0,0,0.05)',
                border: `1.5px solid ${HP_TOKENS.line}`
              }}>
                <HPGlyph name="fire" size={20} color={HP_TOKENS.coral} />
                <div style={{ fontWeight: 900, fontSize: 16, color: HP_TOKENS.ink }}>
                  {user.streak}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── DAILY SUMMARY ───────────────────────────────────────────── */}
      <div style={{ marginBottom: 32 }}>
        <SectionHeader title="Daily Overview" action="Reflect" onAction={() => openModal('daily_reflection')} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
          <div style={{ 
            background: '#fff', padding: 20, borderRadius: 24, border: `1.5px solid ${HP_TOKENS.line}`,
            display: 'flex', flexDirection: 'column', gap: 12
          }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: HP_TOKENS.sageSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <HPGlyph name="sparkle" size={16} color={HP_TOKENS.sage} />
                </div>
                <span style={{ ...HP_TEXT.tiny, fontWeight: 800 }}>Energy</span>
             </div>
             <div style={{ fontSize: 24, fontWeight: 900, color: HP_TOKENS.ink }}>
               {state.energy || "85%"}
             </div>
          </div>
          <div style={{ 
            background: '#fff', padding: 20, borderRadius: 24, border: `1.5px solid ${HP_TOKENS.line}`,
            display: 'flex', flexDirection: 'column', gap: 12
          }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: HP_TOKENS.coralSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <HPGlyph name="fire" size={16} color={HP_TOKENS.coral} />
                </div>
                <span style={{ ...HP_TEXT.tiny, fontWeight: 800 }}>Points</span>
             </div>
             <div style={{ fontSize: 24, fontWeight: 900, color: HP_TOKENS.ink }}>
               {user.points.toLocaleString()}
             </div>
          </div>
        </div>
      </div>

      {/* ── HABITS & FEED ───────────────────────────────────────────── */}
      <div style={{ marginBottom: 32 }}>
        <SectionHeader title="Daily Rituals" action="Manage" onAction={() => openModal('logbook')} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {HP_HABITS.slice(0, 3).map(habit => (
            <HabitRow key={habit.id} habit={habit} />
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 32 }}>
        <SectionHeader title="AI Insights" />
        <InsightCarousel insights={HP_AI_INSIGHTS} />
      </div>
    </div>
  );
}
