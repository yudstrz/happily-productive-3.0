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

interface JournalHistoryModalProps {
  onClose: () => void;
}

export default function JournalHistoryModal({ onClose }: JournalHistoryModalProps) {
  const { state } = useHP();
  
  const journals = state?.wellbeing?.journals || [];

  return (
    <Modal onClose={onClose} title="Riwayat Jurnal">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {journals.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: HP_TOKENS.inkMute }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📓</div>
            <div style={{ ...HP_TEXT.h, fontSize: 16 }}>Belum ada riwayat jurnal.</div>
            <div style={{ ...HP_TEXT.body, fontSize: 14, marginTop: 4 }}>Mulai menulis refleksi harianmu untuk melihatnya di sini.</div>
          </div>
        ) : (
          journals.map((j: any) => (
            <div key={j.id} style={{ 
              padding: 16, borderRadius: 18, 
              background: HP_TOKENS.card, border: `1.5px solid ${HP_TOKENS.lineSoft}`,
              position: 'relative'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <span style={{ 
                  padding: '4px 10px', borderRadius: 8, fontSize: 11, fontWeight: 800,
                  background: j.type === 'reflection' ? HP_TOKENS.sageWash : HP_TOKENS.coralSoft,
                  color: j.type === 'reflection' ? HP_TOKENS.sage : HP_TOKENS.coral,
                  letterSpacing: '0.02em', textTransform: 'uppercase'
                }}>
                  {j.type === 'reflection' ? 'Refleksi' : 'Gratitude'}
                </span>
                <span style={{ ...HP_TEXT.small, color: HP_TOKENS.inkMute, fontSize: 11 }}>{j.date}</span>
              </div>
              <div style={{ ...HP_TEXT.body, fontSize: 14, lineHeight: 1.6, color: HP_TOKENS.ink }}>
                {j.text}
              </div>
            </div>
          ))
        )}
      </div>
    </Modal>
  );
}
