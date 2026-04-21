"use client";

import React, { useState } from "react";
import { useHP } from "@/lib/HPContext";
import { HP_TOKENS, HP_FONT, HP_TEXT } from "@/lib/constants";
import Modal from "@/components/ui/Modal";
import DiceBearAvatar, { DiceBearConfig, DEFAULT_DICEBEAR_CONFIG } from "@/components/ui/DiceBearAvatar";

// ── Skin tones (hex without #) ──────────────────────────────────────────────
const SKIN_TONES = [
  { label: 'Fair',      hex: 'f2d3b1' },
  { label: 'Light',     hex: 'ecad80' },
  { label: 'Medium',    hex: 'd08b5b' },
  { label: 'Tan',       hex: 'ae5d29' },
  { label: 'Brown',     hex: '694d3d' },
  { label: 'Dark',      hex: '3c2415' },
];

// ── Hair styles ──────────────────────────────────────────────────────────────
const HAIR_STYLES = [
  { label: 'Short 1',  val: 'short01' },
  { label: 'Short 2',  val: 'short02' },
  { label: 'Short 3',  val: 'short08' },
  { label: 'Short 4',  val: 'short12' },
  { label: 'Long 1',   val: 'long01' },
  { label: 'Long 2',   val: 'long05' },
  { label: 'Long 3',   val: 'long12' },
  { label: 'Long 4',   val: 'long21' },
  { label: 'Bun',      val: 'long25' },
  { label: 'Curly',    val: 'long20' },
];

// ── Hair colors ──────────────────────────────────────────────────────────────
const HAIR_COLORS = [
  { label: 'Black',    hex: '0e0e0e' },
  { label: 'Brown',    hex: '4a312c' },
  { label: 'Chestnut', hex: '8c4e3d' },
  { label: 'Auburn',   hex: 'a55728' },
  { label: 'Blonde',   hex: 'cb9e46' },
  { label: 'Platinum', hex: 'd4c8b8' },
  { label: 'White',    hex: 'ecdcbf' },
  { label: 'Red',      hex: 'b54620' },
  { label: 'Blue',     hex: '5b7ab7' },
  { label: 'Purple',   hex: '7c4fa0' },
];

// ── Eye variants ─────────────────────────────────────────────────────────────
const EYE_VARIANTS = [
  'variant01','variant04','variant07','variant11',
  'variant14','variant16','variant20','variant26',
];

// ── Eyebrow variants ─────────────────────────────────────────────────────────
const EYEBROW_VARIANTS = ['variant01','variant02','variant05','variant08','variant11','variant14'];

// ── Background colors ────────────────────────────────────────────────────────
const BG_COLORS = [
  { label: 'Sky',      hex: 'b6e3f4' },
  { label: 'Peach',    hex: 'ffd5dc' },
  { label: 'Mint',     hex: 'c0e9c5' },
  { label: 'Lavender', hex: 'c4b5f4' },
  { label: 'Yellow',   hex: 'fff1b8' },
  { label: 'Sand',     hex: 'f5d6b0' },
  { label: 'White',    hex: 'ffffff' },
  { label: 'Dark',     hex: '2c2a5e' },
];

// ── Features ─────────────────────────────────────────────────────────────────
const FEATURES = [
  { label: 'Tidak ada', val: '' },
  { label: 'Freckles',  val: 'freckles' },
  { label: 'Blush',     val: 'blush' },
  { label: 'Birthmark', val: 'birthmark' },
  { label: 'Mustache',  val: 'mustache' },
];

interface AvatarEditorModalProps {
  onClose: () => void;
}

export default function AvatarEditorModal({ onClose }: AvatarEditorModalProps) {
  const { user, updateUser } = useHP();
  
  const existing = user?.avatarConfig;
  const [config, setConfig] = useState<DiceBearConfig>(
    existing && 'seed' in existing
      ? (existing as DiceBearConfig)
      : { ...DEFAULT_DICEBEAR_CONFIG, seed: user?.name || 'user' }
  );

  const set = (patch: Partial<DiceBearConfig>) => setConfig(c => ({ ...c, ...patch }));

  const saveAvatar = () => {
    updateUser({ avatarConfig: config });
    onClose();
  };

  const label = (text: string) => (
    <div style={{ ...HP_TEXT.tiny, color: HP_TOKENS.inkMute, marginBottom: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8 }}>
      {text}
    </div>
  );

  const ColorDot = ({ hex, selected, onClick, size = 32, radius = 16 }: any) => (
    <button
      onClick={onClick}
      style={{
        width: size, height: size, borderRadius: radius,
        background: `#${hex}`,
        border: selected ? `3px solid ${HP_TOKENS.sage}` : `2px solid ${HP_TOKENS.line}`,
        cursor: 'pointer', flexShrink: 0,
        boxShadow: selected ? `0 0 0 2px white, 0 0 0 4px ${HP_TOKENS.sage}` : 'none',
        transition: '0.15s',
      }}
    />
  );

  const ChipButton = ({ label, selected, onClick }: any) => (
    <button
      onClick={onClick}
      style={{
        padding: '7px 13px', borderRadius: 10,
        background: selected ? HP_TOKENS.sage : HP_TOKENS.lineSoft,
        color: selected ? '#fff' : HP_TOKENS.ink,
        border: 'none', fontFamily: HP_FONT, fontWeight: 700, fontSize: 11,
        cursor: 'pointer', transition: '0.15s', whiteSpace: 'nowrap',
      }}
    >
      {label}
    </button>
  );

  const EyeChip = ({ val, selected, onClick }: any) => (
    <button
      onClick={onClick}
      style={{
        width: 40, height: 32, borderRadius: 8,
        background: selected ? HP_TOKENS.sage : HP_TOKENS.lineSoft,
        color: selected ? '#fff' : HP_TOKENS.ink,
        border: 'none', fontFamily: HP_FONT, fontWeight: 700, fontSize: 9,
        cursor: 'pointer', transition: '0.15s',
      }}
    >
      {val.replace('variant', '')}
    </button>
  );

  return (
    <Modal onClose={onClose} title="Customize Your Avatar 🎨">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginTop: 10 }}>
        
        {/* ── Preview ───────────────────────────────────── */}
        <div style={{ 
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          padding: '20px 0 24px',
          background: `#${config.backgroundColor}40`,
          borderRadius: 20,
          border: `1.5px solid ${HP_TOKENS.line}`,
          position: 'relative', overflow: 'hidden', marginBottom: 24,
        }}>
          <div style={{
            position: 'absolute', width: 160, height: 160, borderRadius: 80,
            background: `#${config.backgroundColor}80`,
            filter: 'blur(30px)',
          }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <DiceBearAvatar config={config} size={160} mood={null} />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* ── Skin ─────────────────────────────────────── */}
          <div>
            {label('Warna Kulit')}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {SKIN_TONES.map(t => (
                <ColorDot key={t.hex} hex={t.hex} selected={config.skinColor === `#${t.hex}`} onClick={() => set({ skinColor: `#${t.hex}` })} />
              ))}
            </div>
          </div>

          {/* ── Hair Style ───────────────────────────────── */}
          <div>
            {label('Gaya Rambut')}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {HAIR_STYLES.map(h => (
                <ChipButton key={h.val} label={h.label} selected={config.hair === h.val} onClick={() => set({ hair: h.val })} />
              ))}
            </div>
          </div>

          {/* ── Hair Color ───────────────────────────────── */}
          <div>
            {label('Warna Rambut')}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {HAIR_COLORS.map(c => (
                <ColorDot key={c.hex} hex={c.hex} selected={config.hairColor === `#${c.hex}`} onClick={() => set({ hairColor: `#${c.hex}` })} />
              ))}
            </div>
          </div>

          {/* ── Eyes ─────────────────────────────────────── */}
          <div>
            {label('Bentuk Mata')}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {EYE_VARIANTS.map(v => (
                <EyeChip key={v} val={v} selected={config.eyes === v} onClick={() => set({ eyes: v })} />
              ))}
            </div>
          </div>

          {/* ── Eyebrows ─────────────────────────────────── */}
          <div>
            {label('Alis')}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {EYEBROW_VARIANTS.map(v => (
                <EyeChip key={v} val={v} selected={config.eyebrows === v} onClick={() => set({ eyebrows: v })} />
              ))}
            </div>
          </div>

          {/* ── Features ─────────────────────────────────── */}
          <div>
            {label('Fitur Wajah')}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {FEATURES.map(f => (
                <ChipButton key={f.val} label={f.label} selected={(config.features || '') === f.val} onClick={() => set({ features: f.val })} />
              ))}
            </div>
          </div>

          {/* ── Background ───────────────────────────────── */}
          <div>
            {label('Background')}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {BG_COLORS.map(b => (
                <ColorDot key={b.hex} hex={b.hex} radius={10} selected={config.backgroundColor === b.hex} onClick={() => set({ backgroundColor: b.hex })} />
              ))}
            </div>
          </div>

        </div>

        <button 
          onClick={saveAvatar}
          style={{
            width: '100%', padding: '16px', borderRadius: 99, marginTop: 28,
            background: `linear-gradient(135deg, ${HP_TOKENS.sage}, #3A6347)`,
            color: '#fff', border: 'none',
            fontFamily: HP_FONT, fontWeight: 800, fontSize: 15, cursor: 'pointer',
            boxShadow: `0 8px 24px rgba(74,124,89,0.35)`,
          }}
          className="hp-tap"
        >
          Simpan Karakter 🌱
        </button>
      </div>
    </Modal>
  );
}
