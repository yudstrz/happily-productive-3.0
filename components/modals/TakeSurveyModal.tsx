"use client";

import React from "react";
import Modal from "@/components/ui/Modal";
import { HP_TOKENS, HP_FONT } from "@/lib/constants";

interface TakeSurveyModalProps {
  onClose: () => void;
  survey: {
    title: string;
    url: string;
  };
}

import { useHP } from "@/lib/HPContext";

export default function TakeSurveyModal({ onClose, survey }: TakeSurveyModalProps) {
  const { awardXP } = useHP();

  const handleFinish = () => {
    awardXP('survey_complete', `Selesaikan survey: ${survey.title}`);
    onClose();
  };

  return (
    <Modal onClose={onClose} title={survey.title}>
      <div style={{ 
        width: '100%', 
        height: '60vh', 
        marginTop: 10, 
        borderRadius: 16, 
        overflow: 'hidden',
        background: '#f0f0f0',
        position: 'relative'
      }}>
        <iframe 
          src={survey.url} 
          width="100%" 
          height="100%" 
          frameBorder="0" 
          marginHeight={0} 
          marginWidth={0}
          title={survey.title}
        >
          Loading…
        </iframe>
      </div>
      <button
        onClick={handleFinish}
        style={{
          width: '100%', marginTop: 20, padding: '16px', borderRadius: 99,
          background: HP_TOKENS.blue, color: '#fff', border: 'none',
          fontFamily: HP_FONT, fontWeight: 800, fontSize: 15, cursor: 'pointer',
        }}
        className="hp-tap"
      >
        Saya sudah mengisi survey & Ambil 100 XP 🎁
      </button>
    </Modal>
  );
}
