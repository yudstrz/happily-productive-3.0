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
  type?: 'reflection' | 'gratitude';
}

export default function JournalModal({ onClose, type = 'reflection' }: JournalModalProps) {
  const { state, updateState } = useHP();
  const [text, setText] = useState('');

  const save = () => {
    if (!text) return;
    const newEntry = {
      id: Date.now(),
      type,
      text,
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })
    };

    updateState((s: any) => ({
      ...s,
      wellbeing: {
        ...s.wellbeing,
        journals: [newEntry, ...(s.wellbeing.journals || [])]
      },
      points: (s.points || 0) + 10,
      user: {
        ...s.user,
        points: (s.user?.points || 0) + 10
      }
    }));

    alert(`Bagus! Jurnal ${type === 'reflection' ? 'refleksi' : 'rasa syukur'} kamu tersimpan. Kamu dapat +10 poin! 🌱`);
    onClose();
  };

  const title = type === 'reflection' ? 'Reflection journal' : 'Gratitude log';
  const prompt = type === 'reflection' ? (state?.wellbeing?.dailyPrompt || "Apa satu hal kecil yang bikin kamu bangga hari ini?") : "Tulis 3 hal yang kamu syukuri hari ini...";

  return (
    <Modal onClose={onClose} title={title}>
      <div style={{ padding: 14, background: type === 'reflection' ? HP_TOKENS.sageWash : HP_TOKENS.coralWash, borderRadius: 14, marginBottom: 16 }}>
        <div style={{ ...HP_TEXT.small, color: type === 'reflection' ? HP_TOKENS.sage : HP_TOKENS.coral, fontWeight: 800 }}>
          {type === 'reflection' ? 'PROMPT HARI INI' : 'LOG RASA SYUKUR'}
        </div>
        <div style={{ ...HP_TEXT.h, fontSize: 15, marginTop: 6 }}>
          "{prompt}"
        </div>
      </div>
      <textarea
        autoFocus 
        value={text} 
        onChange={e => setText(e.target.value)} 
        rows={10}
        placeholder="Tulis apa saja — ini fully private, end-to-end encrypted."
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
        onClick={save} 
        disabled={!text}
        style={{ ...primaryBtn, width: '100%', marginTop: 18, opacity: !text ? 0.5 : 1 }}
        className="hp-tap"
      >
        Simpan Jurnal ✨
      </button>
    </Modal>
  );
}

