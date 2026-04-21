"use client";

import React from "react";
import { HP_TOKENS } from "@/lib/constants";

interface RankFrameProps {
  rank: string;
  children: React.ReactNode;
  size: number;
}

export default function RankFrame({ rank, children, size }: RankFrameProps) {
  const getRankStyle = (r: string) => {
    switch (r) {
      case 'S':
        return {
          border: '3px solid transparent',
          background: `linear-gradient(white, white) padding-box, linear-gradient(135deg, #60EFFF, #0061FF, #7000FF) border-box`,
          boxShadow: '0 0 15px rgba(0, 97, 255, 0.4)',
          borderRadius: 16,
        };
      case 'A':
        return {
          border: '3px solid #FFD700',
          boxShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
          borderRadius: 14,
        };
      case 'B':
      case 'C':
        return {
          border: '3px solid #B0BEC5',
          boxShadow: '0 0 5px rgba(0, 0, 0, 0.05)',
          borderRadius: 12,
        };
      default:
        return {
          border: '3px solid #D7CCC8',
          borderRadius: 12,
        };
    }
  };

  const style = getRankStyle(rank);

  return (
    <div style={{
      ...style,
      display: 'inline-flex',
      padding: 4,
      position: 'relative',
      overflow: 'visible',
    }}>
      {children}
      
      {/* Small Badge */}
      <div style={{
        position: 'absolute',
        bottom: -6,
        right: -6,
        background: rank === 'S' ? 'linear-gradient(135deg, #0061FF, #7000FF)' : (rank === 'A' ? '#FFD700' : '#8D6E63'),
        color: '#fff',
        width: 24,
        height: 24,
        borderRadius: 6,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 12,
        fontWeight: 900,
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        border: '2px solid #fff',
        zIndex: 10,
      }}>
        {rank}
      </div>
    </div>
  );
}
