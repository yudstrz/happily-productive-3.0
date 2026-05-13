"use client";

import React from "react";
import { HP_TOKENS } from "@/lib/constants";
import HPGlyph from "@/components/ui/HPGlyph";

interface BeeMascotProps {
  mood?: 'happy' | 'neutral' | 'sad' | 'sleepy' | 'surprised';
  size?: number;
  showSpeech?: string;
}

export default function BeeMascot({ mood = 'happy', size = 80, showSpeech }: BeeMascotProps) {
  const getEmoji = () => {
    switch (mood) {
      case 'happy': return '😊';
      case 'sad': return '😟';
      case 'sleepy': return '😴';
      case 'surprised': return '😲';
      default: return '😐';
    }
  };

  const getToneColor = () => {
    switch (mood) {
      case 'happy': return HP_TOKENS.yellow;
      case 'sad': return HP_TOKENS.blue;
      case 'sleepy': return HP_TOKENS.blueSoft;
      default: return HP_TOKENS.yellow;
    }
  };

  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {showSpeech && (
        <div style={{
          marginBottom: 12,
          padding: '10px 16px',
          borderRadius: '16px 16px 16px 4px',
          background: '#fff',
          border: `1.5px solid ${HP_TOKENS.line}`,
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          maxWidth: 200,
          position: 'relative',
          animation: 'hpFadeIn 0.3s ease-out'
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: HP_TOKENS.ink }}>{showSpeech}</div>
          <div style={{
            position: 'absolute',
            bottom: -8,
            left: 8,
            width: 0,
            height: 0,
            borderLeft: '8px solid transparent',
            borderRight: '8px solid transparent',
            borderTop: `8px solid ${HP_TOKENS.line}`
          }} />
        </div>
      )}
      
      <div style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        background: getToneColor(),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        boxShadow: `0 8px 24px ${getToneColor()}40`,
        transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
      }}>
        <div style={{ fontSize: size * 0.6 }}>{getEmoji()}</div>
        
        {/* Antennae */}
        <div style={{ position: 'absolute', top: -size*0.1, left: size*0.25, width: 2, height: size*0.2, background: HP_TOKENS.ink, borderRadius: 1 }} />
        <div style={{ position: 'absolute', top: -size*0.1, right: size*0.25, width: 2, height: size*0.2, background: HP_TOKENS.ink, borderRadius: 1 }} />
        <div style={{ position: 'absolute', top: -size*0.15, left: size*0.2, width: 4, height: 4, borderRadius: 2, background: HP_TOKENS.ink }} />
        <div style={{ position: 'absolute', top: -size*0.15, right: size*0.2, width: 4, height: 4, borderRadius: 2, background: HP_TOKENS.ink }} />

        {/* Wings */}
        <div style={{ 
          position: 'absolute', left: -size*0.3, top: size*0.1, width: size*0.4, height: size*0.4, 
          borderRadius: '50% 50% 0 50%', background: 'rgba(255,255,255,0.6)', border: '1px solid #fff', zIndex: -1,
          animation: 'hpBeeWingLeft 0.2s infinite alternate'
        }} />
        <div style={{ 
          position: 'absolute', right: -size*0.3, top: size*0.1, width: size*0.4, height: size*0.4, 
          borderRadius: '50% 50% 50% 0', background: 'rgba(255,255,255,0.6)', border: '1px solid #fff', zIndex: -1,
          animation: 'hpBeeWingRight 0.2s infinite alternate'
        }} />
      </div>

      <style jsx global>{`
        @keyframes hpBeeWingLeft {
          from { transform: rotate(0deg); }
          to { transform: rotate(-10deg); }
        }
        @keyframes hpBeeWingRight {
          from { transform: rotate(0deg); }
          to { transform: rotate(10deg); }
        }
      `}</style>
    </div>
  );
}
