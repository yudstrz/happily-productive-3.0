"use client";

import React, { useState, useEffect } from "react";
import { useHP } from "@/lib/HPContext";
import { HP_TOKENS, HP_FONT, HP_TEXT } from "@/lib/constants";
import { HP_REWARDS } from "@/lib/mockData";
import Modal from "@/components/ui/Modal";
import HPGlyph from "@/components/ui/HPGlyph";

interface AllRewardsModalProps {
  onClose: () => void;
}

const CATEGORIES = ["Semua", "Wellbeing", "Lifestyle", "Growth", "Impact"];

const toneConfig: Record<string, { bg: string; soft: string; text: string }> = {
  sage:     { bg: HP_TOKENS.sage,   soft: HP_TOKENS.sageWash,   text: '#2D5A3D' },
  yellow:   { bg: HP_TOKENS.yellow, soft: HP_TOKENS.yellowWash,  text: '#7A5F10' },
  blue:     { bg: HP_TOKENS.blue,   soft: HP_TOKENS.blueWash,    text: '#234A72' },
  coral:    { bg: HP_TOKENS.coral,  soft: '#FEF0ED',             text: '#8B3A2F' },
  lavender: { bg: HP_TOKENS.lavender, soft: HP_TOKENS.lavenderSoft, text: '#4A3A6E' },
};

export default function AllRewardsModal({ onClose }: AllRewardsModalProps) {
  const { state, updateState } = useHP();
  const [view, setView] = useState<"available" | "history">("available");
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [showConfetti, setShowConfetti] = useState(false);

  const rewards = HP_REWARDS;
  const history = state?.rewardHistory || [];
  const userPoints = state?.points ?? 0;

  const filtered = activeCategory === "Semua"
    ? rewards
    : rewards.filter(r => r.category === activeCategory);

  const handleRedeem = (reward: typeof rewards[0]) => {
    if (!state) return;
    if (state.points < reward.points) {
      alert(`Poin tidak cukup! Kamu butuh ${reward.points} poin, tapi baru punya ${state.points} poin. 🌱`);
      return;
    }
    if (confirm(`Tukar ${reward.points} poin dengan "${reward.title}"?`)) {
      updateState((s: any) => ({
        ...s,
        points: s.points - reward.points,
        user: { ...s.user, points: (s.user?.points || 0) - reward.points },
        rewardHistory: [
          ...history,
          { id: Date.now(), title: reward.title, points: reward.points, date: new Date().toLocaleDateString('id-ID'), emoji: reward.emoji }
        ]
      }));
      
      // Trigger confetti
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      alert(`Berhasil! "${reward.title}" telah ditambahkan ke riwayat reward kamu. 🎉`);
    }
  };

  return (
    <Modal title="Semua Reward" onClose={onClose}>
      <div style={{ position: 'relative' }}>
        {/* Confetti Overlay */}
        {showConfetti && (
          <div style={{
            position: 'absolute', top: -100, left: 0, right: 0, height: 400,
            pointerEvents: 'none', zIndex: 999, overflow: 'hidden',
            display: 'flex', justifyContent: 'center'
          }}>
            {[...Array(20)].map((_, i) => (
              <div key={i} className="confetti-piece" style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                background: [HP_TOKENS.sage, HP_TOKENS.yellow, HP_TOKENS.coral, HP_TOKENS.blue][i % 4]
              }}/>
            ))}
          </div>
        )}

        {/* View Toggle */}
        <div style={{
          display: 'flex', background: HP_TOKENS.lineSoft,
          padding: 4, borderRadius: 12, marginBottom: 20
        }}>
          {(["available", "history"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              style={{
                flex: 1, padding: '8px 0', border: 'none', borderRadius: 9,
                background: view === v ? '#fff' : 'transparent',
                boxShadow: view === v ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
                fontFamily: HP_FONT, fontWeight: 700, fontSize: 13,
                color: view === v ? HP_TOKENS.ink : HP_TOKENS.inkMute,
                cursor: 'pointer', transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
              }}
            >
              <HPGlyph name={v === 'available' ? 'trophy' : 'history'} size={14} color={view === v ? HP_TOKENS.sage : HP_TOKENS.inkMute}/>
              {v === 'available' ? 'Tersedia' : 'Riwayat'}
            </button>
          ))}
        </div>

        {view === "available" ? (
          <>
            {/* Points badge */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              padding: '12px 20px', borderRadius: 20,
              background: `linear-gradient(135deg, ${HP_TOKENS.yellowWash}, ${HP_TOKENS.sageWash})`,
              border: `1.5px solid ${HP_TOKENS.yellowSoft}`,
              marginBottom: 16,
            }}>
              <span style={{ fontSize: 24 }}>🏆</span>
              <div>
                <div style={{ ...HP_TEXT.tiny, color: HP_TOKENS.inkMute }}>POIN KAMU</div>
                <div style={{ ...HP_TEXT.h, fontSize: 22, color: HP_TOKENS.ink }}>{userPoints.toLocaleString()} poin</div>
              </div>
            </div>

            {/* Category filter */}
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4, marginBottom: 16 }}>
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    padding: '7px 16px', borderRadius: 99, border: 'none',
                    background: activeCategory === cat ? HP_TOKENS.sage : HP_TOKENS.lineSoft,
                    color: activeCategory === cat ? '#fff' : HP_TOKENS.inkSoft,
                    fontFamily: HP_FONT, fontWeight: 700, fontSize: 13,
                    cursor: 'pointer', whiteSpace: 'nowrap',
                    transition: 'all 0.2s',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Rewards grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {filtered.map(reward => {
                const cfg = toneConfig[reward.tone] ?? toneConfig.sage;
                const canAfford = userPoints >= reward.points;

                return (
                  <div
                    key={reward.id}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 14,
                      padding: '14px 16px', borderRadius: 18,
                      background: cfg.soft,
                      border: `1.5px solid ${HP_TOKENS.line}`,
                    }}
                  >
                    <div style={{
                      width: 56, height: 56, borderRadius: 16,
                      background: `${cfg.bg}22`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 28, flexShrink: 0,
                    }}>
                      {reward.emoji}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ ...HP_TEXT.h, fontSize: 14, color: cfg.text }}>{reward.title}</div>
                      <div style={{ ...HP_TEXT.small, color: HP_TOKENS.inkMute, marginTop: 2, fontSize: 12 }}>{reward.desc}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
                        <span style={{
                          padding: '3px 10px', borderRadius: 99, fontSize: 11, fontWeight: 800,
                          background: cfg.bg, color: '#fff', fontFamily: HP_FONT,
                        }}>
                          {reward.points} poin
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRedeem(reward)}
                      disabled={!canAfford}
                      style={{
                        padding: '8px 14px', borderRadius: 12, border: 'none',
                        background: canAfford ? cfg.bg : HP_TOKENS.lineSoft,
                        color: canAfford ? '#fff' : HP_TOKENS.inkFade,
                        fontFamily: HP_FONT, fontWeight: 800, fontSize: 13,
                        cursor: !canAfford ? 'default' : 'pointer',
                        transition: 'all 0.2s',
                      }}
                    >
                      Tukar
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {history.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: HP_TOKENS.inkMute }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🏜️</div>
                <div style={{ ...HP_TEXT.h, fontSize: 15 }}>Belum ada reward yang ditukar.</div>
                <div style={{ ...HP_TEXT.body, fontSize: 13, marginTop: 4 }}>Ayo kumpulkan poin dengan memberi apresiasi!</div>
              </div>
            ) : (
              [...history].reverse().map((h: any, idx) => (
                <div key={idx} style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '12px 16px', borderRadius: 18,
                  background: HP_TOKENS.card, border: `1.5px solid ${HP_TOKENS.lineSoft}`,
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: HP_TOKENS.lineSoft,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 22, flexShrink: 0,
                  }}>
                    {h.emoji || '🎁'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ ...HP_TEXT.h, fontSize: 14 }}>{h.title}</div>
                    <div style={{ ...HP_TEXT.small, color: HP_TOKENS.inkMute, fontSize: 11 }}>Ditukar pada {h.date}</div>
                  </div>
                  <div style={{ ...HP_TEXT.small, fontWeight: 800, color: HP_TOKENS.sage }}>
                    -{h.points}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        .confetti-piece {
          position: absolute;
          width: 8px;
          height: 16px;
          top: -20px;
          opacity: 0;
          animation: drop 3s infinite ease-out;
        }
        @keyframes drop {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(400px) rotate(360deg); opacity: 0; }
        }
      `}</style>
    </Modal>
  );
}
