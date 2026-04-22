"use client";

import React, { useState } from "react";
import { HP_TOKENS, HP_FONT, HP_TEXT } from "@/lib/constants";
import { UserRole } from "@/lib/HPContext";

interface RoleSelectScreenProps {
  onSelect: (role: UserRole) => void;
}

const ROLES: {
  key: UserRole;
  label: string;
  subtitle: string;
  desc: string;
  emoji: string;
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
    emoji: "🎯",
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
    emoji: "👥",
    color: HP_TOKENS.blue,
    colorSoft: HP_TOKENS.blueSoft,
    colorWash: HP_TOKENS.blueWash,
    features: ["Team overview & mood", "Approval tasks", "OKR tim & alignment", "1-on-1 schedule", "Team recognition"],
  },
  {
    key: "hr",
    label: "HR",
    subtitle: "Human Resources",
    desc: "Kelola engagement organisasi, pantau wellbeing, dan jalankan program L&D",
    emoji: "🏢",
    color: HP_TOKENS.lavender,
    colorSoft: HP_TOKENS.lavenderSoft,
    colorWash: "#F0ECF8",
    features: ["People analytics", "Employee health map", "Org-wide OKR", "L&D programs", "Engagement pulse"],
  },
];

export default function RoleSelectScreen({ onSelect }: RoleSelectScreenProps) {
  const [selected, setSelected] = useState<UserRole | null>(null);
  const [entering, setEntering] = useState(false);

  const handleEnter = () => {
    if (!selected) return;
    setEntering(true);
    setTimeout(() => onSelect(selected), 600);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: `linear-gradient(160deg, ${HP_TOKENS.paper} 0%, #fff 60%, ${HP_TOKENS.sageWash} 100%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: "0 20px 40px",
        fontFamily: HP_FONT,
        overflowY: "auto",
        opacity: entering ? 0 : 1,
        transition: "opacity 0.5s ease",
      }}
    >
      {/* Hero header */}
      <div
        style={{
          width: "100%",
          maxWidth: 480,
          paddingTop: 60,
          paddingBottom: 8,
          textAlign: "center",
        }}
      >
        {/* Logo mark */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 64,
            height: 64,
            borderRadius: 20,
            background: `linear-gradient(135deg, ${HP_TOKENS.yellow}, ${HP_TOKENS.blue})`,
            boxShadow: "0 12px 32px rgba(255,215,0,0.3)",
            marginBottom: 20,
            animation: "hpPulse 3s ease-in-out infinite",
          }}
        >
          <span style={{ fontSize: 30 }}>🌊</span>
        </div>

        <div
          style={{
            ...HP_TEXT.display,
            fontSize: 32,
            background: `linear-gradient(135deg, ${HP_TOKENS.ink}, ${HP_TOKENS.blue})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            marginBottom: 8,
          }}
        >
          Flow Productivity
        </div>
        <div
          style={{
            ...HP_TEXT.body,
            color: HP_TOKENS.inkMute,
            fontSize: 14,
            maxWidth: 320,
            margin: "0 auto",
            lineHeight: 1.5,
          }}
        >
          Enter the state of <span style={{ color: HP_TOKENS.blue, fontWeight: 800 }}>Flow</span>. Choose your role to experience personalized productivity.
        </div>
      </div>

      {/* Role Cards */}
      <div
        style={{
          width: "100%",
          maxWidth: 480,
          display: "flex",
          flexDirection: "column",
          gap: 14,
          marginTop: 28,
        }}
      >
        {ROLES.map((r, idx) => {
          const isSelected = selected === r.key;
          return (
            <button
              key={r.key}
              onClick={() => setSelected(r.key)}
              style={{
                width: "100%",
                padding: isSelected ? "20px 20px 18px" : "18px 20px",
                borderRadius: 22,
                border: isSelected
                  ? `2px solid ${r.color}`
                  : `1.5px solid ${HP_TOKENS.line}`,
                background: isSelected
                  ? `linear-gradient(135deg, ${r.colorWash}, #fff)`
                  : HP_TOKENS.card,
                cursor: "pointer",
                textAlign: "left",
                display: "flex",
                alignItems: "flex-start",
                gap: 16,
                transition: "all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)",
                boxShadow: isSelected
                  ? `0 8px 28px ${r.color}22`
                  : "0 2px 8px rgba(0,0,0,0.04)",
                transform: isSelected ? "scale(1.01)" : "scale(1)",
                animation: `hpFadeUp 0.4s ease both`,
                animationDelay: `${idx * 0.1}s`,
                position: "relative",
                overflow: "hidden",
              }}
              className="hp-tap"
            >
              {/* Selected shimmer */}
              {isSelected && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: `linear-gradient(90deg, transparent, ${r.color}08, transparent)`,
                    animation: "hpShine 2s ease-in-out infinite",
                    pointerEvents: "none",
                  }}
                />
              )}

              {/* Icon */}
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 16,
                  background: isSelected
                    ? `linear-gradient(135deg, ${r.color}, ${r.color}CC)`
                    : r.colorSoft,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 24,
                  flexShrink: 0,
                  transition: "all 0.25s",
                  boxShadow: isSelected ? `0 6px 16px ${r.color}40` : "none",
                }}
              >
                {r.emoji}
              </div>

              {/* Text content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                  <div
                    style={{
                      ...HP_TEXT.h,
                      fontSize: 16,
                      color: isSelected ? r.color : HP_TOKENS.ink,
                      transition: "color 0.2s",
                    }}
                  >
                    {r.label}
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 800,
                      padding: "2px 8px",
                      borderRadius: 6,
                      background: isSelected ? `${r.color}18` : HP_TOKENS.lineSoft,
                      color: isSelected ? r.color : HP_TOKENS.inkMute,
                      letterSpacing: 0.3,
                      transition: "all 0.2s",
                    }}
                  >
                    {r.subtitle.toUpperCase()}
                  </div>
                </div>
                <div
                  style={{
                    ...HP_TEXT.small,
                    color: HP_TOKENS.inkSoft,
                    fontWeight: 500,
                    fontSize: 13,
                    lineHeight: 1.4,
                    marginBottom: isSelected ? 12 : 0,
                    transition: "margin 0.2s",
                  }}
                >
                  {r.desc}
                </div>

                {/* Feature tags — only when selected */}
                {isSelected && (
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 6,
                      animation: "hpFadeUp 0.3s ease both",
                    }}
                  >
                    {r.features.map((f) => (
                      <div
                        key={f}
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          padding: "4px 10px",
                          borderRadius: 99,
                          background: `${r.color}14`,
                          color: r.color,
                          fontFamily: HP_FONT,
                        }}
                      >
                        ✓ {f}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Radio indicator */}
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 11,
                  border: isSelected ? `none` : `2px solid ${HP_TOKENS.line}`,
                  background: isSelected
                    ? `linear-gradient(135deg, ${r.color}, ${r.color}CC)`
                    : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  marginTop: 4,
                  transition: "all 0.2s",
                  boxShadow: isSelected ? `0 3px 8px ${r.color}40` : "none",
                }}
              >
                {isSelected && (
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      background: "#fff",
                    }}
                  />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* CTA Button */}
      <div
        style={{
          width: "100%",
          maxWidth: 480,
          marginTop: 24,
        }}
      >
        <button
          onClick={handleEnter}
          disabled={!selected}
          style={{
            width: "100%",
            padding: "18px",
            borderRadius: 22,
            border: "none",
            background: selected
              ? `linear-gradient(135deg, ${
                  selected === "employee"
                    ? HP_TOKENS.yellow
                    : selected === "manager"
                    ? HP_TOKENS.blue
                    : HP_TOKENS.lavender
                }, ${
                  selected === "employee"
                    ? "#B8860B" // Darker Gold
                    : selected === "manager"
                    ? "#003399"
                    : "#5A4E9A"
                })`
              : HP_TOKENS.lineSoft,
            color: selected ? "#fff" : HP_TOKENS.inkFade,
            fontFamily: HP_FONT,
            fontWeight: 900,
            fontSize: 16,
            cursor: selected ? "pointer" : "not-allowed",
            transition: "all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)",
            boxShadow: selected
              ? `0 10px 28px ${
                  selected === "employee"
                    ? HP_TOKENS.sage
                    : selected === "manager"
                    ? HP_TOKENS.blue
                    : HP_TOKENS.lavender
                }44`
              : "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            transform: selected ? "translateY(-2px)" : "translateY(0)",
            position: "relative",
            overflow: "hidden",
          }}
          className="hp-tap"
        >
          {selected && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                animation: "hpShine 2s ease-in-out infinite",
              }}
            />
          )}
          <span style={{ fontSize: 20 }}>
            {selected === "employee" ? "🎯" : selected === "manager" ? "👥" : selected === "hr" ? "🏢" : ""}
          </span>
          {selected
            ? `Masuk sebagai ${ROLES.find((r) => r.key === selected)?.label}`
            : "Pilih peran untuk melanjutkan"}
        </button>

        <div
          style={{
            textAlign: "center",
            ...HP_TEXT.tiny,
            color: HP_TOKENS.inkFade,
            marginTop: 16,
          }}
        >
          Kamu bisa ganti peran kapan saja dari dalam aplikasi
        </div>
      </div>
    </div>
  );
}
