"use client";

import React, { useState } from "react";
import { useHP } from "@/lib/HPContext";
import { 
  HP_TOKENS, 
  HP_FONT, 
  HP_TEXT 
} from "@/lib/constants";
import Modal from "@/components/ui/Modal";
import HPGlyph from "@/components/ui/HPGlyph";
import HPBar from "@/components/ui/HPBar";
import HPCard from "@/components/ui/HPCard";

interface WorkCheckInModalProps {
  onClose: () => void;
}

export default function WorkCheckInModal({ onClose }: WorkCheckInModalProps) {
  const { state, updateState } = useHP();
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!state) return null;

  const priorities = state.priorities || [];
  const doneCount = priorities.filter((p: any) => p.done).length;
  const totalCount = priorities.length;
  const progress = totalCount > 0 ? (doneCount / totalCount) * 100 : 0;

  const askAI = async () => {
    setIsLoading(true);
    try {
      const taskList = priorities.map((p: any) => `- ${p.title} (${p.done ? 'Selesai' : 'Belum'})`).join('\n');
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Ini daftar target kerja saya hari ini:\n${taskList}\n\nBantu saya:
1. Berikan feedback singkat (fun & supportive) tentang progress saya.
2. Kasih 1 saran spesifik supaya saya tetap fokus (deep work).
3. Jika saya merasa "belum kerja beneran", ingatkan saya apa yang sudah saya capai.
Jawab dengan tone yang asik dan menyemangati.`,
          systemPrompt: "You are Flow, a fun and supportive productivity coach."
        })
      });
      const data = await res.json();
      if (data.text) setAiResponse(data.text);
    } catch (e) {
      console.error(e);
      setAiResponse("Koneksiku agak terputus, tapi kamu tetap hebat! Terus lanjut ya! 🌿");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTask = (id: number) => {
    updateState((s: any) => ({
      ...s,
      priorities: s.priorities.map((p: any) => p.id === id ? { ...p, done: !p.done } : p)
    }));
  };

  return (
    <Modal onClose={onClose} title="Cek Target Kerja 🚀">
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div style={{ ...HP_TEXT.h, fontSize: 16 }}>Progress Realisasi</div>
          <div style={{ ...HP_TEXT.h, fontSize: 18, color: HP_TOKENS.sage }}>{Math.round(progress)}%</div>
        </div>
        <HPBar value={progress} tone="sage" height={10} />
        <div style={{ ...HP_TEXT.tiny, color: HP_TOKENS.inkMute, marginTop: 8, textAlign: 'center' }}>
          {doneCount} dari {totalCount} target sudah terealisasi
        </div>
      </div>

      <div style={{ ...HP_TEXT.small, color: HP_TOKENS.inkMute, fontWeight: 700, marginBottom: 12 }}>DAFTAR TARGET HARI INI</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
        {priorities.map((p: any) => (
          <HPCard key={p.id} padding={12} style={{ 
            background: p.done ? HP_TOKENS.sageWash : '#fff',
            border: `1.5px solid ${p.done ? HP_TOKENS.sage : HP_TOKENS.lineSoft}`,
            opacity: p.done ? 0.8 : 1
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button 
                onClick={() => toggleTask(p.id)}
                style={{
                  width: 20, height: 20, borderRadius: 6,
                  background: p.done ? HP_TOKENS.sage : 'transparent',
                  border: `2px solid ${p.done ? HP_TOKENS.sage : HP_TOKENS.line}`,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
              >
                {p.done && <HPGlyph name="check" size={12} color="#fff" />}
              </button>
              <div style={{ 
                ...HP_TEXT.body, fontSize: 14, fontWeight: 600, 
                textDecoration: p.done ? 'line-through' : 'none',
                color: p.done ? HP_TOKENS.inkFade : HP_TOKENS.ink
              }}>
                {p.title}
              </div>
            </div>
          </HPCard>
        ))}
        {totalCount === 0 && (
          <div style={{ textAlign: 'center', padding: '20px', color: HP_TOKENS.inkMute }}>
            Belum ada target untuk hari ini.
          </div>
        )}
      </div>

      {!aiResponse ? (
        <button 
          onClick={askAI}
          disabled={isLoading}
          className="hp-tap"
          style={{
            width: '100%', padding: '16px', borderRadius: 20,
            background: HP_TOKENS.blue, color: '#fff', border: 'none',
            fontFamily: HP_FONT, fontWeight: 800, fontSize: 15, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            boxShadow: `0 8px 24px ${HP_TOKENS.blueSoft}`,
          }}
        >
          {isLoading ? (
            "Meminta saran Flow..."
          ) : (
            <>
              <HPGlyph name="sparkle" size={18} color="#fff" />
              Bantu Aku Fokus (AI)
            </>
          )}
        </button>
      ) : (
        <HPCard padding={16} style={{ background: HP_TOKENS.blueWash, border: 'none', position: 'relative' }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: HP_TOKENS.blue, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <HPGlyph name="sparkle" size={16} color="#fff" />
            </div>
            <div style={{ ...HP_TEXT.body, fontSize: 13, lineHeight: 1.5, color: HP_TOKENS.ink }}>
              {aiResponse}
            </div>
          </div>
          <button 
            onClick={() => setAiResponse(null)}
            style={{ 
              marginTop: 12, width: '100%', padding: '8px', borderRadius: 10, 
              border: `1px solid ${HP_TOKENS.blue}`, background: 'transparent',
              color: HP_TOKENS.blue, fontFamily: HP_FONT, fontWeight: 800, fontSize: 12,
              cursor: 'pointer'
            }}
          >
            Tanya lagi
          </button>
        </HPCard>
      )}
      
      <button 
        onClick={onClose}
        style={{
          width: '100%', marginTop: 12, padding: '14px', borderRadius: 99,
          background: 'transparent', color: HP_TOKENS.inkMute, border: 'none',
          fontFamily: HP_FONT, fontWeight: 700, fontSize: 14, cursor: 'pointer',
        }}
      >
        Lanjut kerja dulu
      </button>
    </Modal>
  );
}
