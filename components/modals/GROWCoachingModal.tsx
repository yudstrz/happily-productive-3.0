"use client";

import React, { useState, useEffect, useRef } from "react";
import { useHP } from "@/lib/HPContext";
import { HP_TOKENS, HP_FONT, HP_TEXT } from "@/lib/constants";
import Modal from "@/components/ui/Modal";
import HPGlyph from "@/components/ui/HPGlyph";
import HPAvatar from "@/components/ui/HPAvatar";

interface Props {
  onClose: () => void;
  roleContext?: string; // e.g. 'hr', 'manager', 'employee'
  topic?: string;
}

type Step = 'goal' | 'reality' | 'options' | 'will' | 'done';

export default function GROWCoachingModal({ onClose, roleContext = 'employee', topic }: Props) {
  const { state, updateState } = useHP();
  const [step, setStep] = useState<Step>('goal');
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  const [answers, setAnswers] = useState({
    goal: "",
    reality: "",
    options: "",
    will: ""
  });

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [step, isTyping]);

  if (!state) return null;

  const handleNext = () => {
    if (!inputText.trim()) return;

    // Save answer
    setAnswers(prev => ({ ...prev, [step]: inputText }));
    setInputText("");
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      if (step === 'goal') setStep('reality');
      else if (step === 'reality') setStep('options');
      else if (step === 'options') setStep('will');
      else if (step === 'will') {
        setStep('done');
        // Save to logbook
        saveToLogbook();
      }
    }, 1500);
  };

  const saveToLogbook = () => {
    const now = new Date();
    const newLog = {
      id: Date.now(),
      type: 'journal_entry',
      journalType: 'reflection',
      content: `GROW Coaching Session:\nGoal: ${answers.goal || inputText}\nWill: ${inputText}`,
      points: 25,
      date: now.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      day: now.toLocaleDateString('id-ID', { weekday: 'long' }),
      time: now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };

    updateState((s: any) => ({
      ...s,
      logbook: [newLog, ...(s.logbook || [])],
      points: (s.points || 0) + 25,
      user: { ...s.user, points: (s.user?.points || 0) + 25 }
    }));
  };

  const getAIPrompt = () => {
    switch (step) {
      case 'goal':
        return `Halo! Aku Flow AI. Mari kita mulai sesi coaching GROW ini. Apa Goal (tujuan spesifik) yang ingin kamu capai dari sesi hari ini? ${topic ? `(Topik saran: ${topic})` : ''}`;
      case 'reality':
        if (roleContext === 'hr') {
          return `Baik, tujuan yang bagus! Sekarang Reality. Berdasarkan data feedback dan metrik organisasi kita saat ini, apa hambatan terbesar yang menghalangi pencapaian tujuan tersebut?`;
        }
        return `Menarik. Sekarang Reality. Bagaimana kondisi nyatanya saat ini? Hambatan apa yang sedang kamu hadapi untuk mencapai Goal tersebut?`;
      case 'options':
        return `Aku paham kondisinya. Sekarang Options. Menurutmu, apa saja 2-3 opsi tindakan yang bisa dilakukan untuk mengatasi hambatan tersebut?`;
      case 'will':
        return `Ide yang bagus! Terakhir, Will (Komitmen). Dari opsi-opsi tadi, apa 1 langkah konkret (action item) pertama yang AKAN kamu lakukan minggu ini?`;
      case 'done':
        return `Sesi selesai! Komitmenmu sudah kucatat di Logbook (+25 Poin). Semangat mengeksekusi rencana tersebut! 🚀`;
    }
  };

  return (
    <Modal onClose={onClose} title="GROW Coaching Session">
      <div style={{ display: 'flex', flexDirection: 'column', height: '65vh' }}>
        
        {/* Progress Bar */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
          {['goal', 'reality', 'options', 'will'].map((s, i) => {
            const steps = ['goal', 'reality', 'options', 'will', 'done'];
            const currentIndex = steps.indexOf(step);
            const isActive = i <= currentIndex;
            return (
              <div key={s} style={{ 
                flex: 1, height: 6, borderRadius: 3,
                background: isActive ? HP_TOKENS.blue : HP_TOKENS.lineSoft,
                transition: 'background 0.3s ease'
              }}/>
            );
          })}
        </div>

        {/* Chat Area */}
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: 8, display: 'flex', flexDirection: 'column', gap: 16 }}>
          
          {/* AI Message */}
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 18, background: HP_TOKENS.blueWash,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <HPGlyph name="sparkle" size={18} color={HP_TOKENS.blue}/>
            </div>
            <div style={{ 
              background: HP_TOKENS.card, border: `1.5px solid ${HP_TOKENS.lineSoft}`, 
              padding: '12px 16px', borderRadius: '0 16px 16px 16px', 
              maxWidth: '85%', ...HP_TEXT.body, fontSize: 14, lineHeight: 1.5
            }}>
              {getAIPrompt()}
            </div>
          </div>

          {/* User History Answers */}
          {step !== 'goal' && answers.goal && (
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <div style={{ 
                background: HP_TOKENS.blue, 
                padding: '12px 16px', borderRadius: '16px 0 16px 16px', 
                maxWidth: '85%', ...HP_TEXT.body, color: '#fff', fontSize: 14, lineHeight: 1.5
              }}>
                {answers.goal}
              </div>
            </div>
          )}
          {['options', 'will', 'done'].includes(step) && answers.reality && (
            <>
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ width: 36 }}/>
                <div style={{ background: HP_TOKENS.card, border: `1.5px solid ${HP_TOKENS.lineSoft}`, padding: '12px 16px', borderRadius: '0 16px 16px 16px', maxWidth: '85%', ...HP_TEXT.body, fontSize: 14, lineHeight: 1.5 }}>
                  {getAIPrompt().replace(step, 'reality')} {/* Mock historical prompt */}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <div style={{ background: HP_TOKENS.blue, padding: '12px 16px', borderRadius: '16px 0 16px 16px', maxWidth: '85%', ...HP_TEXT.body, color: '#fff', fontSize: 14, lineHeight: 1.5 }}>
                  {answers.reality}
                </div>
              </div>
            </>
          )}

          {isTyping && (
            <div style={{ display: 'flex', gap: 12 }}>
               <div style={{
                width: 36, height: 36, borderRadius: 18, background: HP_TOKENS.blueWash,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <HPGlyph name="sparkle" size={18} color={HP_TOKENS.blue}/>
              </div>
              <div style={{ 
                background: HP_TOKENS.card, border: `1.5px solid ${HP_TOKENS.lineSoft}`, 
                padding: '12px 16px', borderRadius: '0 16px 16px 16px', 
                display: 'flex', gap: 4, alignItems: 'center'
              }}>
                <div style={{ width: 6, height: 6, borderRadius: 3, background: HP_TOKENS.inkMute, animation: 'hpPulse 1s infinite' }}/>
                <div style={{ width: 6, height: 6, borderRadius: 3, background: HP_TOKENS.inkMute, animation: 'hpPulse 1s infinite 0.2s' }}/>
                <div style={{ width: 6, height: 6, borderRadius: 3, background: HP_TOKENS.inkMute, animation: 'hpPulse 1s infinite 0.4s' }}/>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        {step !== 'done' ? (
          <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
            <textarea
              autoFocus
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Tulis balasanmu..."
              disabled={isTyping}
              style={{
                flex: 1, height: 60, padding: '12px 16px', borderRadius: 16,
                border: `1.5px solid ${HP_TOKENS.line}`, fontFamily: HP_FONT, fontSize: 14,
                resize: 'none', outline: 'none', background: '#fff'
              }}
            />
            <button 
              onClick={handleNext}
              disabled={!inputText.trim() || isTyping}
              className="hp-tap"
              style={{
                width: 60, height: 60, borderRadius: 16, border: 'none',
                background: inputText.trim() && !isTyping ? HP_TOKENS.blue : HP_TOKENS.lineSoft,
                color: '#fff', cursor: inputText.trim() && !isTyping ? 'pointer' : 'default',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              <HPGlyph name="sparkle" size={24} color="#fff"/>
            </button>
          </div>
        ) : (
          <button 
            onClick={onClose}
            className="hp-tap"
            style={{
              marginTop: 16, width: '100%', padding: 16, borderRadius: 16, border: 'none',
              background: HP_TOKENS.blueWash, color: HP_TOKENS.blue, 
              fontFamily: HP_FONT, fontWeight: 800, fontSize: 15, cursor: 'pointer'
            }}
          >
            Tutup
          </button>
        )}

      </div>
    </Modal>
  );
}
