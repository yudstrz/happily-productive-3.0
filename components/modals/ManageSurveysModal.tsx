"use client";

import React, { useState } from "react";
import { useHP } from "@/lib/HPContext";
import { HP_TOKENS, HP_FONT, HP_TEXT } from "@/lib/constants";
import Modal from "@/components/ui/Modal";
import HPGlyph from "@/components/ui/HPGlyph";

interface ManageSurveysModalProps {
  onClose: () => void;
}

export default function ManageSurveysModal({ onClose }: ManageSurveysModalProps) {
  const { state, updateState } = useHP();
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  const addSurvey = () => {
    if (!title || !url) return;
    updateState((s: any) => ({
      ...s,
      surveys: [
        ...(s.surveys || []),
        { id: Date.now(), title, url, publishedAt: new Date().toISOString(), status: 'active' }
      ]
    }));
    setTitle("");
    setUrl("");
  };

  const deleteSurvey = (id: number) => {
    updateState((s: any) => ({
      ...s,
      surveys: s.surveys.filter((sr: any) => sr.id !== id)
    }));
  };

  if (!state || !state.surveys) return null;

  return (
    <Modal onClose={onClose} title="Kelola HR Surveys 📋">
      <div style={{ marginTop: 4 }}>
        <div style={{ ...HP_TEXT.tiny, color: HP_TOKENS.inkMute, fontWeight: 800, marginBottom: 12, letterSpacing: '0.05em' }}>SURVEY AKTIF</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
          {state.surveys.map((sr: any) => (
            <div 
              key={sr.id} 
              style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderRadius: 18,
                background: HP_TOKENS.card, border: `1.5px solid ${HP_TOKENS.line}`,
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ width: 40, height: 40, borderRadius: 12, background: HP_TOKENS.blueSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <HPGlyph name="book" size={20} color={HP_TOKENS.blue} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ ...HP_TEXT.h, fontSize: 14 }}>{sr.title}</div>
                <div style={{ ...HP_TEXT.tiny, color: HP_TOKENS.inkMute, marginTop: 2 }}>
                  Diterbitkan {new Date(sr.publishedAt).toLocaleDateString('id-ID')}
                </div>
              </div>
              <button 
                onClick={() => deleteSurvey(sr.id)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
                className="hp-tap"
              >
                <HPGlyph name="trash" size={16} color={HP_TOKENS.coral}/>
              </button>
            </div>
          ))}
          {state.surveys.length === 0 && (
            <div style={{ textAlign: 'center', padding: '30px 20px', background: HP_TOKENS.lineSoft, borderRadius: 18, border: `1.5px dashed ${HP_TOKENS.line}` }}>
              <div style={{ ...HP_TEXT.small, color: HP_TOKENS.inkMute }}>Belum ada survey yang diterbitkan.</div>
            </div>
          )}
        </div>

        <div style={{ ...HP_TEXT.tiny, color: HP_TOKENS.inkMute, fontWeight: 800, marginBottom: 12, letterSpacing: '0.05em' }}>TERBITKAN SURVEY BARU</div>
        <div style={{ 
          display: 'flex', flexDirection: 'column', gap: 12, padding: '16px', 
          borderRadius: 22, background: HP_TOKENS.lavenderSoft, border: `1.5px solid ${HP_TOKENS.lavender}20`
        }}>
          <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Judul Survey (e.g. Employee Engagement Q2)"
            style={{
              padding: '14px 16px', borderRadius: 14, border: `1.5px solid ${HP_TOKENS.line}`,
              fontFamily: HP_FONT, fontSize: 14, background: '#fff', outline: 'none'
            }}
          />
          <input 
            type="text" 
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Link Google Form (Embed URL)"
            style={{
              padding: '14px 16px', borderRadius: 14, border: `1.5px solid ${HP_TOKENS.line}`,
              fontFamily: HP_FONT, fontSize: 14, background: '#fff', outline: 'none'
            }}
          />
          <div style={{ ...HP_TEXT.tiny, color: HP_TOKENS.inkMute, padding: '0 4px', fontSize: 10 }}>
            Tips: Gunakan link yang sudah di-shorten atau link Google Form langsung.
          </div>
          <button 
            onClick={addSurvey}
            disabled={!title || !url}
            style={{
              padding: '14px', borderRadius: 14, border: 'none',
              background: HP_TOKENS.lavender, color: '#fff',
              fontFamily: HP_FONT, fontWeight: 800, fontSize: 15, cursor: 'pointer',
              opacity: (!title || !url) ? 0.5 : 1, transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
            }}
            className="hp-tap"
          >
             <HPGlyph name="plus" size={16} color="#fff"/> Terbitkan Survey
          </button>
        </div>
      </div>
    </Modal>
  );
}
