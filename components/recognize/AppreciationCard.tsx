"use client";

import React from "react";
import { HP_TOKENS, HP_FONT, HP_TEXT } from "@/lib/constants";
import HPGlyph from "@/components/ui/HPGlyph";
import HPCard from "@/components/ui/HPCard";
import HPChip from "@/components/ui/HPChip";
import HPAvatar from "@/components/ui/HPAvatar";

interface AppreciationCardProps {
  f: any;
}

const feedBtn: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 6,
  background: 'none', border: 'none', padding: 0,
  fontFamily: HP_FONT, fontWeight: 700, fontSize: 13, color: HP_TOKENS.inkSoft, cursor: 'pointer',
};

export default function AppreciationCard({ f }: AppreciationCardProps) {
  const { updateState } = useHP();
  const valueTone: Record<string, any> = { 
    Collaboration: 'sage', 
    Innovation: 'blue', 
    Respect: 'lavender', 
    Ownership: 'yellow', 
    Growth: 'coral' 
  };

  const handleLike = () => {
    updateState((s: any) => ({
      ...s,
      feed: s.feed.map((item: any) => 
        item.id === f.id ? { ...item, likes: (item.likes || 0) + 1 } : item
      )
    }));
  };

  const handleComment = () => {
    const msg = prompt("Tulis komentar kamu:");
    if (msg) {
      alert("Komentar berhasil ditambahkan!");
    }
  };

  const handleReAppreciate = () => {
    const newItem = {
      ...f,
      id: Date.now(),
      from: "Sari Wijaya", // current user
      time: "Baru saja",
      msg: `[Re-appreciate] ${f.msg}`,
      likes: 0
    };
    updateState((s: any) => ({
      ...s,
      feed: [newItem, ...s.feed]
    }));
    alert("Berhasil membagikan ulang apresiasi!");
  };
  
  return (
    <HPCard padding={14}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <HPAvatar name={f.from} size={36}/>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ ...HP_TEXT.body, fontSize: 13, fontWeight: 600, color: HP_TOKENS.inkSoft }}>
            <span style={{ color: HP_TOKENS.ink, fontWeight: 800 }}>{f.from}</span> untuk <span style={{ color: HP_TOKENS.ink, fontWeight: 800 }}>{f.to}</span>
          </div>
          <div style={{ ...HP_TEXT.small, color: HP_TOKENS.inkMute, marginTop: 2 }}>{f.time}</div>
        </div>
        <HPChip tone={valueTone[f.value] || 'neutral'}>{f.value}</HPChip>
      </div>
      <div style={{ ...HP_TEXT.body, fontSize: 14, color: HP_TOKENS.ink, marginTop: 12, lineHeight: 1.5 }}>
        {f.msg}
      </div>
      <div style={{ 
        marginTop: 12, 
        display: 'flex', 
        gap: 14, 
        alignItems: 'center', 
        paddingTop: 10, 
        borderTop: `1px solid ${HP_TOKENS.lineSoft}` 
      }}>
        <button onClick={handleLike} style={feedBtn} className="hp-tap">
          <HPGlyph name="heart" size={16} color={f.likes > 0 ? HP_TOKENS.coral : HP_TOKENS.inkSoft}/> {f.likes}
        </button>
        <button onClick={handleComment} style={feedBtn} className="hp-tap">
          <HPGlyph name="chat" size={16} color={HP_TOKENS.inkSoft}/> Komentar
        </button>
        <button onClick={handleReAppreciate} style={feedBtn} className="hp-tap">
          <HPGlyph name="sparkle" size={16} color={HP_TOKENS.inkSoft}/> Re-appreciate
        </button>
      </div>
    </HPCard>
  );
}

