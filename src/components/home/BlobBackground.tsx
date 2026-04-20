"use client";

import React from "react";

interface BlobBackgroundProps {
  colors: string[];
}

export default function BlobBackground({ colors }: BlobBackgroundProps) {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      <div style={{
        position: 'absolute', 
        top: -40, 
        right: -30, 
        width: 180, 
        height: 180,
        background: colors[0], 
        filter: 'blur(40px)', 
        opacity: 0.55,
        animation: 'hpBlob 8s ease-in-out infinite, hpFloatSlow 6s ease-in-out infinite',
      }}/>
      <div style={{
        position: 'absolute', 
        top: 80, 
        left: -40, 
        width: 160, 
        height: 160,
        background: colors[1], 
        filter: 'blur(50px)', 
        opacity: 0.5,
        animation: 'hpBlob 10s ease-in-out infinite reverse, hpFloatSlow 7s 1s ease-in-out infinite',
      }}/>
      <div style={{
        position: 'absolute', 
        top: 180, 
        right: 40, 
        width: 120, 
        height: 120,
        background: colors[2], 
        filter: 'blur(40px)', 
        opacity: 0.4,
        animation: 'hpBlob 12s ease-in-out infinite, hpFloatSlow 9s 0.5s ease-in-out infinite',
      }}/>
    </div>
  );
}
