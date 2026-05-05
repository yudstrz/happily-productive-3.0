"use client";

import React, { useState, useEffect } from "react";
import { useHP } from "@/lib/HPContext";
import { HP_TOKENS, HP_FONT, HP_TEXT } from "@/lib/constants";
import HPGlyph from "@/components/ui/HPGlyph";
import HPCard from "@/components/ui/HPCard";

export default function DirectorQAModal({ close }: { close: () => void }) {
  const { user } = useHP();
  const [questions, setQuestions] = useState<any[]>([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchQuestions = async () => {
    try {
      const res = await fetch("/api/questions");
      const data = await res.json();
      if (data.questions) setQuestions(data.questions);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleSubmit = async () => {
    if (!newQuestion) return;
    try {
      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user?.id, question: newQuestion })
      });
      if (res.ok) {
        setNewQuestion("");
        fetchQuestions();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{ padding: '0 16px 40px', fontFamily: HP_FONT }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ width: 64, height: 64, borderRadius: 20, background: HP_TOKENS.blueWash, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <HPGlyph name="people" size={32} color={HP_TOKENS.blue} />
        </div>
        <div style={{ ...HP_TEXT.h, fontSize: 20 }}>Tanya Direktur</div>
        <div style={{ ...HP_TEXT.body, color: HP_TOKENS.inkMute, marginTop: 4 }}>
          Sampaikan pertanyaan atau aspirasimu langsung ke pimpinan.
        </div>
      </div>

      <HPCard padding={16} style={{ marginBottom: 20 }}>
        <textarea 
          placeholder="Tulis pertanyaanmu di sini..."
          value={newQuestion}
          onChange={e => setNewQuestion(e.target.value)}
          style={{
            width: '100%', height: 100, padding: 12, borderRadius: 12, border: `1.5px solid ${HP_TOKENS.line}`,
            fontFamily: HP_FONT, fontSize: 14, outline: 'none', background: '#fff', resize: 'none', boxSizing: 'border-box'
          }}
        />
        <button 
          onClick={handleSubmit}
          className="hp-tap"
          style={{
            width: '100%', padding: '14px', borderRadius: 12, background: HP_TOKENS.blue, color: '#fff',
            border: 'none', fontFamily: HP_FONT, fontWeight: 800, fontSize: 14, marginTop: 12, cursor: 'pointer'
          }}
        >
          Kirim Pertanyaan
        </button>
      </HPCard>

      <div style={{ ...HP_TEXT.h, fontSize: 16, marginBottom: 16 }}>Pertanyaan Terbaru</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 20, color: HP_TOKENS.inkMute }}>Loading...</div>
        ) : questions.map(q => (
          <HPCard key={q.id} padding={16}>
            <div style={{ ...HP_TEXT.body, fontWeight: 700, fontSize: 14 }}>"{q.question}"</div>
            <div style={{ ...HP_TEXT.tiny, color: HP_TOKENS.inkMute, marginTop: 8 }}>
              {new Date(q.created_at).toLocaleDateString('id-ID')} · {q.status === 'answered' ? '✅ Dijawab' : '⏳ Menunggu'}
            </div>
            {q.answer && (
              <div style={{ 
                marginTop: 12, padding: 12, borderRadius: 12, background: HP_TOKENS.blueWash,
                borderLeft: `3px solid ${HP_TOKENS.blue}`
              }}>
                <div style={{ ...HP_TEXT.tiny, color: HP_TOKENS.blue, fontWeight: 800, marginBottom: 4 }}>JAWABAN DIREKTUR</div>
                <div style={{ ...HP_TEXT.body, fontSize: 13 }}>{q.answer}</div>
              </div>
            )}
          </HPCard>
        ))}
      </div>
    </div>
  );
}
