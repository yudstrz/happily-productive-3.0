"use client";

import React from "react";
import { useHP } from "@/lib/HPContext";
import { 
  HP_TOKENS, 
  HP_FONT, 
  HP_TEXT 
} from "@/lib/constants";
import Modal from "@/components/ui/Modal";
import HPGlyph from "@/components/ui/HPGlyph";
import HPAvatar from "@/components/ui/HPAvatar";

interface CoachingSessionModalProps {
  onClose: () => void;
}

export default function CoachingSessionModal({ onClose }: CoachingSessionModalProps) {
  const { state } = useHP();
  
  if (!state || !state.coaching) return null;
  const { coaching } = state;

  return (
    <Modal onClose={onClose} title="Detail Sesi 1-on-1">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        
        {/* Manager Header */}
        <div style={{ 
          display: 'flex', alignItems: 'center', gap: 16, 
          padding: 18, borderRadius: 22, 
          background: `linear-gradient(135deg, ${HP_TOKENS.blueWash}, #f0f7ff)`,
          border: `1.5px solid ${HP_TOKENS.blueSoft}`
        }}>
          <HPAvatar name={coaching.coachName} size={64} color={HP_TOKENS.blue}/>
          <div style={{ flex: 1 }}>
            <div style={{ ...HP_TEXT.h, fontSize: 18 }}>{coaching.coachName}</div>
            <div style={{ ...HP_TEXT.body, color: HP_TOKENS.inkSoft, marginTop: 4 }}>{coaching.role}</div>
            <div style={{ 
              display: 'inline-flex', alignItems: 'center', gap: 6, 
              marginTop: 8, padding: '4px 10px', borderRadius: 8,
              background: '#fff', border: `1px solid ${HP_TOKENS.lineSoft}`,
              fontSize: 12, fontWeight: 700, color: HP_TOKENS.blue
            }}>
              <HPGlyph name="refresh" size={12} color={HP_TOKENS.blue}/> {coaching.time}
            </div>
          </div>
        </div>

        {/* AI Suggested Topics */}
        <div style={{ 
          padding: 16, borderRadius: 20, 
          background: HP_TOKENS.sageWash, 
          border: `1.5px dashed ${HP_TOKENS.sageSoft}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <HPGlyph name="sparkle" size={18} color={HP_TOKENS.sage}/>
            <div style={{ ...HP_TEXT.h, fontSize: 14, color: HP_TOKENS.sage }}>TOPIK DISARANKAN AI</div>
          </div>
          <div style={{ ...HP_TEXT.body, fontSize: 14, lineHeight: 1.5, color: HP_TOKENS.ink }}>
            {coaching.aiTopic || "Pilih goal untuk mendapakan saran topik."}
          </div>
        </div>

        {/* Agenda Section */}
        <div>
          <div style={{ ...HP_TEXT.tiny, color: HP_TOKENS.inkMute, fontWeight: 800, marginBottom: 10, letterSpacing: '0.05em' }}>AGENDA PERSIAPAN</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              "Review progres Goal Q2: DS Migration",
              "Diskusikan hambatan teknis di sprint terakhir",
              "Update rencana pengembangan skill Storytelling",
              "Feedback performa bulan lalu"
            ].map((item, i) => (
              <div key={i} style={{ 
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 14px', borderRadius: 14,
                background: HP_TOKENS.card, border: `1.5px solid ${HP_TOKENS.lineSoft}`
              }}>
                <div style={{ width: 8, height: 8, borderRadius: 4, background: HP_TOKENS.blueSoft }}/>
                <div style={{ ...HP_TEXT.body, fontSize: 14 }}>{item}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <button 
          onClick={onClose}
          style={{
            marginTop: 10, padding: 16, borderRadius: 16, border: 'none',
            background: HP_TOKENS.ink, color: '#fff',
            fontFamily: HP_FONT, fontWeight: 800, fontSize: 15, cursor: 'pointer'
          }}
          className="hp-tap"
        >
          Siap berangkat! 🚀
        </button>

      </div>
    </Modal>
  );
}
