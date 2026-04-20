"use client";

import React from "react";

interface MascotProps {
  mood?: 'joy' | 'calm' | 'neutral' | 'tired' | 'stress';
  size?: number;
  float?: boolean;
}

export default function Mascot({ 
  mood = 'calm', 
  size = 120, 
  float = true 
}: MascotProps) {
  const bodyColor = { 
    joy: '#F5C842', 
    calm: '#8FB39B', 
    neutral: '#A89BC9', 
    tired: '#8FB1D1', 
    stress: '#E88B7D' 
  }[mood] || '#8FB39B';
  
  const eyeY = mood === 'tired' ? 44 : mood === 'stress' ? 40 : 42;
  
  const mouthPath = {
    joy: 'M36 60 Q50 72 64 60',
    calm: 'M38 60 Q50 66 62 60',
    neutral: 'M38 62 L62 62',
    tired: 'M38 64 Q50 58 62 64',
    stress: 'M38 66 Q50 58 62 66',
  }[mood] || 'M38 60 Q50 66 62 60';
  
  return (
    <div style={{
      width: size, 
      height: size, 
      position: 'relative',
      animation: float ? 'hpFloat 4s ease-in-out infinite' : 'none',
    }}>
      <svg viewBox="0 0 100 100" width={size} height={size} style={{ filter: 'drop-shadow(0 8px 16px rgba(74,124,89,0.25))' }}>
        {/* glow */}
        <circle cx="50" cy="52" r="38" fill={bodyColor} opacity="0.18"/>
        {/* body (blob) */}
        <circle cx="50" cy="50" r="32" fill={bodyColor}/>
        {/* highlight */}
        <ellipse cx="40" cy="36" rx="10" ry="6" fill="#fff" opacity="0.35"/>
        {/* little leaf ears (sage theme) */}
        <ellipse cx="28" cy="28" rx="5" ry="8" fill="#4A7C59" transform="rotate(-30 28 28)"/>
        <ellipse cx="72" cy="28" rx="5" ry="8" fill="#4A7C59" transform="rotate(30 72 28)"/>
        {/* eyes */}
        <circle cx="40" cy={eyeY} r="3" fill="#2C2A28"/>
        <circle cx="60" cy={eyeY} r="3" fill="#2C2A28"/>
        <circle cx="41" cy={eyeY - 1} r="1" fill="#fff"/>
        <circle cx="61" cy={eyeY - 1} r="1" fill="#fff"/>
        {/* cheek blush */}
        <circle cx="34" cy="54" r="4" fill="#E88B7D" opacity="0.4"/>
        <circle cx="66" cy="54" r="4" fill="#E88B7D" opacity="0.4"/>
        {/* mouth */}
        <path d={mouthPath} fill="none" stroke="#2C2A28" strokeWidth="2.5" strokeLinecap="round"/>
      </svg>
    </div>
  );
}
