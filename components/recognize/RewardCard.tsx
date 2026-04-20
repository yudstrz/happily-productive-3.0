"use client";

import React from "react";
import { useHP } from "@/lib/HPContext";
import { HP_TOKENS, HP_FONT, HP_TEXT } from "@/lib/constants";

interface RewardCardProps {
  title: string;
  points: number;
  tone: "sage" | "yellow" | "blue" | "coral" | "lavender";
  emoji?: string;
  onRedeem?: () => void;
}

const TONE_CONFIG: Record<string, any> = {
  sage:   { bg: HP_TOKENS.sageWash,   accent: HP_TOKENS.sage,   text: '#2D5A3D', glow: 'rgba(74,124,89,0.12)' },
  yellow: { bg: HP_TOKENS.yellowWash, accent: HP_TOKENS.yellow, text: '#7A5F10', glow: 'rgba(245,200,66,0.15)' },
  blue:   { bg: HP_TOKENS.blueWash,   accent: HP_TOKENS.blue,   text: '#234A72', glow: 'rgba(59,111,160,0.12)' },
  coral:  { bg: '#FEF0ED',            accent: HP_TOKENS.coral,  text: '#8B3A2F', glow: 'rgba(232,139,125,0.15)' },
  lavender: { bg: HP_TOKENS.lavenderSoft, accent: HP_TOKENS.lavender, text: '#4A3A6E', glow: 'rgba(123,104,238,0.12)' },
};

const EMOJI_MAP: Record<string, string> = {
  'Extra cuti 1 hari':     '🏖️',
  'Voucher lunch 100k':    '🍱',
  'Workshop UX intensif':  '🎨',
  'Donasi program sosial': '🌱',
  'Tiket bioskop 2x':      '🎬',
  'Pulsa / e-wallet 50k':  '📱',
  'Voucher belanja 200k':  '🛍️',
  'Kelas online premium':  '💻',
  'Sesi wellness 1:1':     '🧘',
};

export default function RewardCard({ title, points, tone, emoji, onRedeem }: RewardCardProps) {
  const { state, updateState } = useHP();
  const cfg = TONE_CONFIG[tone] || TONE_CONFIG.sage;
  const icon = emoji ?? EMOJI_MAP[title] ?? '🎁';

  const handleRedeem = () => {
    if (onRedeem) {
      onRedeem();
      return;
    }

    if (!state) return;
    if (state.points < points) {
      alert(`Poin tidak cukup! Kamu butuh ${points} poin, tapi baru punya ${state.points} poin. 🌱`);
      return;
    }

    if (confirm(`Tukar ${points} poin dengan "${title}"?`)) {
      updateState((s: any) => ({
        ...s,
        points: s.points - points,
        user: { ...s.user, points: (s.user?.points || 0) - points },
        rewardHistory: [
          ...(s.rewardHistory || []),
          { id: Date.now(), title, points, date: new Date().toLocaleDateString('id-ID'), emoji: icon }
        ]
      }));
      alert(`Berhasil! "${title}" telah ditambahkan ke reward kamu. 🎉`);
    }
  };

  return (
    <button
      onClick={handleRedeem}
      style={{
        padding: 0,
        borderRadius: 18,
        background: cfg.bg,
        border: `1.5px solid ${HP_TOKENS.line}`,
        textAlign: 'left',
        cursor: 'pointer',
        width: '100%',
        fontFamily: HP_FONT,
        overflow: 'hidden',
        transition: 'transform 0.2s, box-shadow 0.2s',
      }}
      className="hp-tap"
    >
      {/* Image area — emoji illustration */}
      <div style={{
        height: 80,
        background: `radial-gradient(ellipse at 60% 40%, ${cfg.glow} 0%, transparent 70%), ${cfg.bg}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 38,
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative circle */}
        <div style={{
          position: 'absolute',
          width: 70, height: 70,
          borderRadius: '50%',
          background: `${cfg.accent}18`,
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
        }}/>
        <span style={{ position: 'relative', zIndex: 1 }}>{icon}</span>
      </div>

      {/* Info area */}
      <div style={{ padding: '10px 12px 12px' }}>
        <div style={{ ...HP_TEXT.h, fontSize: 13, color: cfg.text, lineHeight: 1.3, height: 34, overflow: 'hidden' }}>{title}</div>
        <div style={{
          marginTop: 6,
          display: 'inline-flex', alignItems: 'center', gap: 4,
          padding: '3px 10px', borderRadius: 99,
          background: cfg.accent, color: '#fff',
          fontFamily: HP_FONT, fontWeight: 800, fontSize: 11,
        }}>
          🏆 {points} poin
        </div>
      </div>
    </button>
  );
}
