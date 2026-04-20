"use client";

import React, { useState } from "react";
import { 
  HP_TOKENS, 
  HP_FONT, 
  HP_TEXT 
} from "@/lib/constants";
import Modal from "@/components/ui/Modal";

interface ReflectModalProps {
  onClose: () => void;
}

export default function ReflectModal({ onClose }: ReflectModalProps) {
  const [a1, setA1] = useState('');
  const [a2, setA2] = useState('');
  const [a3, setA3] = useState('');

  return (
    <Modal onClose={onClose} title="Tutup hari 🌙">
      <div style={{ ...HP_TEXT.body, fontSize: 14, marginBottom: 18 }}>
        3 pertanyaan singkat. Opsional. Fully private.
      </div>
      {[
        { q: 'Apa yang paling berharga dari hari ini?', v: a1, s: setA1 },
        { q: 'Apa yang sulit, dan apa yang kamu pelajari?', v: a2, s: setA2 },
        { q: 'Apa satu hal yang kamu syukuri?', v: a3, s: setA3 },
      ].map((it, i) => (
        <div key={i} style={{ marginBottom: 16 }}>
          <div style={{ ...HP_TEXT.h, fontSize: 14 }}>{it.q}</div>
          <textarea
            value={it.v} 
            onChange={e => it.s(e.target.value)} 
            rows={2}
            placeholder="(opsional)"
            style={{
              width: '100%', 
              marginTop: 8, 
              padding: 12, 
              borderRadius: 12,
              border: `1.5px solid ${HP_TOKENS.line}`, 
              fontFamily: HP_FONT, 
              fontSize: 14,
              outline: 'none', 
              resize: 'none', 
              background: HP_TOKENS.card, 
              color: HP_TOKENS.ink, 
              boxSizing: 'border-box',
            }}
          />
        </div>
      ))}
      <button 
        onClick={onClose} 
        style={{
          width: '100%', 
          marginTop: 12, 
          padding: 16, 
          borderRadius: 99,
          background: HP_TOKENS.sage, 
          color: '#fff', 
          border: 'none',
          fontFamily: HP_FONT, 
          fontWeight: 800, 
          fontSize: 15, 
          cursor: 'pointer',
        }}
        className="hp-tap"
      >
        Selamat istirahat 🌱
      </button>
    </Modal>
  );
}
