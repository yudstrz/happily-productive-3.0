import React, { useState } from "react";
import { HP_TOKENS, HP_FONT, HP_TEXT } from "@/lib/constants";
import { UserRole } from "@/lib/HPContext";
import HPGlyph from "@/components/ui/HPGlyph";

interface RoleSelectScreenProps {
  onSelect: (role: UserRole) => void;
}

const ROLES: {
  key: UserRole;
  label: string;
  subtitle: string;
  desc: string;
  glyph: string;
  color: string;
  colorSoft: string;
  colorWash: string;
  features: string[];
}[] = [
  {
    key: "employee",
    label: "Employee",
    subtitle: "Karyawan",
    desc: "Kelola produktivitas harian, goals personal, dan wellbeing kamu",
    glyph: "target",
    color: HP_TOKENS.yellow,
    colorSoft: HP_TOKENS.yellowSoft,
    colorWash: HP_TOKENS.yellowWash,
    features: ["Daily quests & habits", "OKR personal", "Wellbeing tracking", "Recognition feed", "AI Coach pribadi"],
  },
  {
    key: "manager",
    label: "Manager",
    subtitle: "Manajer",
    desc: "Pantau tim, kelola OKR bersama, dan fasilitasi 1-on-1 yang bermakna",
    glyph: "people",
    color: HP_TOKENS.blue,
    colorSoft: HP_TOKENS.blueSoft,
    colorWash: HP_TOKENS.blueWash,
    features: ["Team overview & mood", "Approval tasks", "OKR tim & alignment", "1-on-1 schedule", "Team recognition"],
  },
  {
    key: "hr",
    label: "HR",
    subtitle: "Human Resources",
    desc: "Engagement organisasi, wellbeing, dan program L&D",
    glyph: "medal",
    color: '#7B6BB5',
    colorSoft: '#EDE8F5',
    colorWash: "#F0ECF8",
    features: ["People analytics", "Employee health map", "Org-wide OKR", "L&D programs", "Engagement pulse"],
  },
  {
    key: "admin",
    label: "Admin",
    subtitle: "System Administrator",
    desc: "Full system control, user management, and organization settings",
    glyph: "sparkle",
    color: HP_TOKENS.coral,
    colorSoft: HP_TOKENS.coralSoft,
    colorWash: HP_TOKENS.coralSoft + '20',
    features: ["Full User Management", "Role Override", "Global System Access", "DB Schema Management"],
  },
];

export default function RoleSelectScreen({ onSelect }: RoleSelectScreenProps) {
  const [selected, setSelected] = useState<UserRole | null>(null);
  const [entering, setEntering] = useState(false);

  const handleEnter = () => {
    if (!selected) return;
    setEntering(true);
    setTimeout(() => onSelect(selected), 400);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: HP_TOKENS.paper,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
        fontFamily: HP_FONT,
        opacity: entering ? 0 : 1,
        transition: "opacity 0.4s ease",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 440,
          textAlign: "center",
          marginBottom: 40,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 56,
            height: 56,
            borderRadius: 16,
            background: HP_TOKENS.yellow,
            marginBottom: 24,
          }}
        >
          <HPGlyph name="sparkle" size={28} color={HP_TOKENS.ink} />
        </div>

        <div style={{ ...HP_TEXT.display, fontSize: 32, marginBottom: 12 }}>
          Flow Productivity
        </div>
        <p style={{ ...HP_TEXT.body, color: HP_TOKENS.inkMute, fontSize: 16 }}>
          Pilih peran Anda untuk mulai mengelola produktivitas dengan cerdas.
        </p>
      </div>

      <div
        style={{
          width: "100%",
          maxWidth: 440,
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        {ROLES.map((r) => {
          const isSelected = selected === r.key;
          return (
            <button
              key={r.key}
              onClick={() => setSelected(r.key)}
              style={{
                width: "100%",
                padding: "20px",
                borderRadius: 16,
                border: `2px solid ${isSelected ? r.color : HP_TOKENS.line}`,
                background: isSelected ? r.colorWash : HP_TOKENS.card,
                cursor: "pointer",
                textAlign: "left",
                display: "flex",
                alignItems: "center",
                gap: 16,
                transition: "all 0.2s ease",
                boxShadow: isSelected ? `0 4px 12px ${r.color}15` : "none",
              }}
              className="hp-tap"
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: isSelected ? r.color : r.colorSoft,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  transition: "background 0.2s",
                }}
              >
                <HPGlyph name={r.glyph} size={24} color={isSelected ? "#fff" : r.color} />
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ ...HP_TEXT.h, fontSize: 16, color: HP_TOKENS.ink }}>
                  {r.label}
                </div>
                <div style={{ ...HP_TEXT.small, color: HP_TOKENS.inkMute, fontSize: 13 }}>
                  {r.desc}
                </div>
              </div>

              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  border: `2px solid ${isSelected ? r.color : HP_TOKENS.line}`,
                  background: isSelected ? r.color : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {isSelected && <HPGlyph name="check" size={12} color="#fff" stroke={3} />}
              </div>
            </button>
          );
        })}
      </div>

      <div style={{ width: "100%", maxWidth: 440, marginTop: 32 }}>
        <button
          onClick={handleEnter}
          disabled={!selected}
          style={{
            width: "100%",
            padding: "18px",
            borderRadius: 16,
            border: "none",
            background: selected ? HP_TOKENS.ink : HP_TOKENS.line,
            color: selected ? HP_TOKENS.yellow : HP_TOKENS.inkFade,
            fontFamily: HP_FONT,
            fontWeight: 800,
            fontSize: 16,
            cursor: selected ? "pointer" : "not-allowed",
            transition: "all 0.2s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
          }}
          className="hp-tap"
        >
          <span>Masuk Sekarang</span>
          <HPGlyph name="arrow" size={20} color={selected ? HP_TOKENS.yellow : HP_TOKENS.inkFade} />
        </button>
      </div>
    </div>
  );
}
