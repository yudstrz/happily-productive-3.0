"use client";

import React from "react";

interface ShellProps {
  children: React.ReactNode;
}

export default function Shell({ children }: ShellProps) {
  return (
    <div className="hp-shell">
      {/* Main Content Container - Now full width/height without device frame */}
      <div style={{ 
        position: 'relative', 
        height: '100%', 
        width: '100%',
        background: 'var(--hp-paper)', 
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, overflowY: 'auto' }}>
          {children}
        </div>
      </div>
    </div>
  );
}

