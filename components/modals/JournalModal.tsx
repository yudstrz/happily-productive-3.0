"use client";

import React, { useState } from "react";
import { 
  HP_TOKENS, 
  HP_FONT, 
  HP_TEXT 
} from "@/lib/constants";
import Modal from "@/components/ui/Modal";

interface JournalModalProps {
  onClose: () => void;
}

const primaryBtn: React.CSSProperties = {
  padding: '14px', borderRadius: 99, border: 'none', background: HP_TOKENS.sage,
  color: '#fff', fontFamily: HP_FONT, fontWeight: 800, fontSize: 15, cursor: 'pointer',
  boxShadow: `0 4px 14px ${HP_TOKENS.sageSoft}`,
};

export default function JournalModal({ onClose }: JournalModalProps) {
  const [text, setText] = useState('');

  return (
    <Modal onClose={onClose} title="Reflection journal">
      <div style={{ padding: 14, background: HP_TOKENS.sageWash, borderRadius: 14, marginBottom: 16 }}>
        <div style={{ ...HP_TEXT.small, color: HP_TOKENS.sage, fontWeight: 800 }}>PROMPT DARI AI</div>
        <div style={{ ...HP_TEXT.h, fontSize: 15, marginTop: 6 }}>
          "Apa satu hal kecil yang bikin kamu bangga hari ini?"
        </div>
      </div>
      <textarea
        autoFocus 
        value={text} 
        onChange={e => setText(e.target.value)} 
        rows={10}
        placeholder="Tulis apa aja — ini fully private, end-to-end encrypted."
        style={{
          width: '100%', 
          padding: 14, 
          borderRadius: 14,
          border: `1.5px solid ${HP_TOKENS.line}`, 
          fontFamily: HP_FONT, 
          fontSize: 15,
          outline: 'none', 
          resize: 'none', 
          background: HP_TOKENS.card, 
          color: HP_TOKENS.ink,
          lineHeight: 1.5, 
          boxSizing: 'border-box',
        }}
      />
      <div style={{ 
        ...HP_TEXT.small, 
        color: HP_TOKENS.inkMute, 
        marginTop: 10, 
        display: 'flex', 
        gap: 6, 
        alignItems: 'center' 
      }}>
        🔒 E2E encrypted · tidak bisa diakses HR, manager, atau siapapun.
      </div>
      <button 
        onClick={onClose} 
        style={{ ...primaryBtn, width: '100%', marginTop: 18 }}
        className="hp-tap"
      >
        Simpan
      </button>
    </Modal>
  );
}
