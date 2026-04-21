"use client";

import React from "react";
import { useHP } from "@/lib/HPContext";
import { HP_TOKENS, HP_FONT, HP_TEXT } from "@/lib/constants";
import { HP_MOODS } from "@/lib/mockData";
import Modal from "@/components/ui/Modal";
import HPGlyph from "@/components/ui/HPGlyph";

interface LogbookModalProps {
  onClose: () => void;
}

export default function LogbookModal({ onClose }: LogbookModalProps) {
  const { state } = useHP();
  const logbook = state?.logbook || [];

  return (
    <Modal onClose={onClose} title="Logbook Team 📋">
      <div style={{ ...HP_TEXT.body, fontSize: 13, marginBottom: 20, color: HP_TOKENS.inkSoft }}>
        Laporan harian yang dibagikan ke tim dan manager.
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {logbook.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: HP_TOKENS.inkMute }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
            <div style={{ ...HP_TEXT.h, fontSize: 16 }}>Logbook kosong.</div>
            <div style={{ ...HP_TEXT.body, fontSize: 14, marginTop: 4 }}>Selesaikan "Tutup Hari" untuk mengisi logbook.</div>
          </div>
        ) : (
          logbook.map((entry: any) => {
            if (entry.type === 'habit_completion') {
              return (
                <div key={entry.id} style={{
                  padding: 16, borderRadius: 20, background: HP_TOKENS.sageWash,
                  border: `1.5px solid ${HP_TOKENS.sageSoft}`, display: 'flex', alignItems: 'center', gap: 14
                }}>
                  <div style={{ fontSize: 28 }}>{entry.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ ...HP_TEXT.h, fontSize: 13 }}>{entry.habitName} Selesai!</div>
                    <div style={{ ...HP_TEXT.small, fontSize: 11, color: HP_TOKENS.inkMute }}>
                      {entry.day}, {entry.date} · {entry.time}
                    </div>
                  </div>
                  <div style={{ 
                    padding: '6px 12px', borderRadius: 12, background: HP_TOKENS.sage, 
                    color: '#fff', fontSize: 12, fontWeight: 900, boxShadow: `0 4px 10px ${HP_TOKENS.sageSoft}`
                  }}>
                    +{entry.points} Poin
                  </div>
                </div>
              );
            }

            const moodObj = HP_MOODS.find(m => m.key === entry.mood);
            return (
              <div key={entry.id} style={{
                padding: 18, borderRadius: 24, background: HP_TOKENS.card,
                border: `1.5px solid ${HP_TOKENS.line}`, position: 'relative'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ fontSize: 24 }}>{moodObj?.emoji || '😶'}</div>
                    <div>
                      <div style={{ ...HP_TEXT.h, fontSize: 13 }}>{entry.day}, {entry.date}</div>
                      <div style={{ ...HP_TEXT.small, fontSize: 11, color: HP_TOKENS.inkMute }}>Mood: {moodObj?.label || 'Unknown'} · {entry.time || '--:--'}</div>
                    </div>
                  </div>
                  <div style={{ 
                    padding: '6px 12px', borderRadius: 99, background: HP_TOKENS.sageWash, 
                    color: HP_TOKENS.sage, fontSize: 11, fontWeight: 900 
                  }}>
                    {entry.taskCount} Task Selesai
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div>
                    <div style={{ ...HP_TEXT.small, fontWeight: 800, color: HP_TOKENS.coral, textTransform: 'uppercase', fontSize: 10, letterSpacing: '0.05em' }}>Hambatan</div>
                    <div style={{ ...HP_TEXT.body, fontSize: 13, marginTop: 2, color: entry.blockers ? HP_TOKENS.ink : HP_TOKENS.inkFade }}>
                      {entry.blockers || "Tidak ada hambatan."}
                    </div>
                  </div>
                  <div>
                    <div style={{ ...HP_TEXT.small, fontWeight: 800, color: HP_TOKENS.sage, textTransform: 'uppercase', fontSize: 10, letterSpacing: '0.05em' }}>Catatan</div>
                    <div style={{ ...HP_TEXT.body, fontSize: 13, marginTop: 2, color: entry.notes ? HP_TOKENS.ink : HP_TOKENS.inkFade }}>
                      {entry.notes || "Tidak ada catatan."}
                    </div>
                  </div>
                </div>
                <div style={{ position: 'absolute', top: 12, right: 12, opacity: 0.1 }}>
                  <HPGlyph name="book" size={40} color={HP_TOKENS.ink}/>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Modal>
  );
}
