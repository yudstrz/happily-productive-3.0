"use client";

import React, { useState } from "react";
import { HP_TOKENS, HP_FONT, HP_TEXT } from "@/lib/constants";

interface HabitCellProps {
  h: any;
  onToggle?: () => void;
}

const DAY_LABELS = ['S', 'S', 'R', 'K', 'J', 'S', 'M'];

export default function HabitCell({ h, onToggle }: HabitCellProps) {
  const [showPoints, setShowPoints] = useState(false);
  const history: boolean[] = h.history || [false, false, false, false, false, false, h.done];
  const lastIndex = history.length - 1;
  const doneCount = history.filter(Boolean).length;
  const progress = doneCount / history.length;

  const handleToggle = () => {
    if (!h.done) {
      setShowPoints(true);
      setTimeout(() => setShowPoints(false), 1200);
    }
    onToggle?.();
  };

  return (
    <div style={{
      padding: '18px 16px',
      borderRadius: 24,
      background: h.done
        ? `linear-gradient(145deg, ${HP_TOKENS.sageWash}, #f0f7f2)`
        : HP_TOKENS.card,
      border: `1.5px solid ${h.done ? HP_TOKENS.sageSoft : HP_TOKENS.line}`,
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
      position: 'relative',
      overflow: 'hidden',
      transition: 'all 0.3s',
      boxShadow: h.done ? `0 4px 16px ${HP_TOKENS.sageSoft}` : '0 2px 8px rgba(0,0,0,0.03)',
    }}>

      {/* Floating +20 Poin */}
      {showPoints && (
        <div style={{
          position: 'absolute', top: 10, right: 14,
          background: HP_TOKENS.sage, color: '#fff',
          padding: '3px 10px', borderRadius: 99,
          fontSize: 12, fontWeight: 900, fontFamily: HP_FONT,
          animation: 'hpFloatUp 1.2s ease-out forwards',
          pointerEvents: 'none', zIndex: 10,
          boxShadow: `0 4px 12px ${HP_TOKENS.sageSoft}`,
        }}>
          +20 Poin ⚡
        </div>
      )}

      {/* Header: emoji + name + streak */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 14,
            background: h.done ? HP_TOKENS.sage : HP_TOKENS.lineSoft,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, transition: '0.3s',
            boxShadow: h.done ? `0 4px 10px ${HP_TOKENS.sageSoft}` : 'none',
          }}>
            {h.emoji}
          </div>
          <div>
            <div style={{ ...HP_TEXT.h, fontSize: 13, lineHeight: 1.3 }}>{h.name}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 3 }}>
              <span style={{ fontSize: 10 }}>🔥</span>
              <span style={{ ...HP_TEXT.small, color: HP_TOKENS.sage, fontWeight: 900, fontSize: 11 }}>
                {h.streak} streak
              </span>
            </div>
          </div>
        </div>

        {/* Done badge */}
        {h.done && (
          <div style={{
            background: HP_TOKENS.sage, color: '#fff',
            fontSize: 10, fontWeight: 900, fontFamily: HP_FONT,
            padding: '3px 8px', borderRadius: 99,
            animation: 'hpPop 0.4s ease-out',
          }}>
            ✓ Done
          </div>
        )}
      </div>

      {/* 7-day grid with labels */}
      <div>
        <div style={{ display: 'flex', gap: 5, marginBottom: 4 }}>
          {history.map((_: boolean, i: number) => (
            <div key={i} style={{
              flex: 1, textAlign: 'center',
              fontFamily: HP_FONT, fontWeight: 700, fontSize: 9,
              color: i === lastIndex ? HP_TOKENS.sage : HP_TOKENS.inkFade,
            }}>
              {DAY_LABELS[i]}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 5 }}>
          {history.map((done: boolean, i: number) => {
            const isToday = i === lastIndex;
            return (
              <div
                key={i}
                onClick={isToday ? handleToggle : undefined}
                className={isToday ? "hp-tap" : ""}
                style={{
                  flex: 1,
                  aspectRatio: '1',
                  borderRadius: 8,
                  background: done
                    ? HP_TOKENS.sage
                    : isToday
                      ? HP_TOKENS.sageWash
                      : HP_TOKENS.lineSoft,
                  border: isToday
                    ? `2px solid ${done ? HP_TOKENS.sage : HP_TOKENS.sage}`
                    : `1px solid ${done ? HP_TOKENS.sage : 'transparent'}`,
                  cursor: isToday ? 'pointer' : 'default',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s',
                  boxShadow: isToday && done ? `0 2px 6px ${HP_TOKENS.sageSoft}` : 'none',
                  animation: isToday && done ? 'hpPop 0.3s ease-out' : 'none',
                }}
              >
                {done && (
                  <div style={{
                    width: isToday ? 10 : 5,
                    height: isToday ? 10 : 5,
                    borderRadius: '50%',
                    background: '#fff',
                    opacity: isToday ? 1 : 0.8,
                  }}/>
                )}
                {isToday && !done && (
                  <div style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: HP_TOKENS.sage, opacity: 0.5,
                  }}/>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Progress bar */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
          <span style={{ fontFamily: HP_FONT, fontSize: 10, color: HP_TOKENS.inkMute, fontWeight: 700 }}>
            Progress minggu ini
          </span>
          <span style={{ fontFamily: HP_FONT, fontSize: 10, color: HP_TOKENS.sage, fontWeight: 900 }}>
            {doneCount}/{history.length}
          </span>
        </div>
        <div style={{ height: 4, background: HP_TOKENS.lineSoft, borderRadius: 99, overflow: 'hidden' }}>
          <div style={{
            width: `${progress * 100}%`, height: '100%',
            background: `linear-gradient(90deg, ${HP_TOKENS.sageLight || '#6BAF7D'}, ${HP_TOKENS.sage})`,
            borderRadius: 99,
            transition: '0.8s cubic-bezier(0.2,0.8,0.2,1)',
            boxShadow: `0 0 6px ${HP_TOKENS.sageSoft}`,
          }}/>
        </div>
      </div>
    </div>
  );
}
