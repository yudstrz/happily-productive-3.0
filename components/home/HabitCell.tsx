"use client";

import React from "react";
import { HP_TOKENS, HP_TEXT } from "@/lib/constants";
import HPGlyph from "@/components/ui/HPGlyph";

interface HabitCellProps {
  h: any;
  onToggle?: () => void;
}

export default function HabitCell({ h, onToggle }: HabitCellProps) {
  // We assume h.history is an array of 7 booleans, 
  // where the last index is 'Today'.
  const history = h.history || [false, false, false, false, false, false, h.done];
  const lastIndex = history.length - 1;

  return (
    <div 
      style={{
        padding: 14, 
        borderRadius: 22,
        background: HP_TOKENS.card,
        border: `1.5px solid ${HP_TOKENS.line}`,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 24 }}>{h.emoji}</span>
          <div>
            <div style={{ ...HP_TEXT.h, fontSize: 13 }}>{h.name}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
              <span style={{ fontSize: 10 }}>🔥</span>
              <span style={{ ...HP_TEXT.small, color: HP_TOKENS.sage, fontWeight: 900, fontSize: 11 }}>
                {h.streak} streak
              </span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 5 }}>
        {history.map((done: boolean, i: number) => {
          const isToday = i === lastIndex;
          return (
            <div 
              key={i}
              onClick={isToday ? onToggle : undefined}
              className={isToday ? "hp-tap" : ""}
              style={{
                flex: 1,
                aspectRatio: '1',
                borderRadius: 6,
                background: done ? HP_TOKENS.sage : (isToday ? HP_TOKENS.sageWash : HP_TOKENS.lineSoft),
                border: isToday ? `1.5px solid ${HP_TOKENS.sage}` : 'none',
                cursor: isToday ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: '0.2s',
              }}
            >
              {isToday && done && <HPGlyph name="check" size={10} color="#fff" stroke={4}/>}
              {!isToday && done && <div style={{ width: 4, height: 4, borderRadius: 2, background: '#fff' }}/>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
