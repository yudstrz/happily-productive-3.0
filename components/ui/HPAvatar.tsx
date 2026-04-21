"use client";

import React from "react";
import { HP_TOKENS, HP_FONT } from "@/lib/constants";
import { useHP } from "@/lib/HPContext";
import RankFrame from "@/components/ui/RankFrame";

interface HPAvatarProps {
  name: string;
  size?: number;
  color?: string;
  levelProgress?: number; // 0 to 1
  rank?: string;
  src?: string; // Prop specifically for the photo URL
}

/**
 * Updated HPAvatar: Square frame + Rank Skin.
 */
export default function HPAvatar({ 
  name, 
  size = 48, 
  color,
  levelProgress = 0,
  rank: propRank,
  src: propSrc
}: HPAvatarProps) {
  const { user } = useHP();
  
  // Use passed props, or fallback to current user if it's "YOU"
  const rank = propRank || (name === user?.name ? user?.rank : 'E') || 'E';
  const profilePhoto = propSrc || (name === user?.name ? user?.profilePhoto : undefined);
  
  const initials = name.split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase();
  const palette = [HP_TOKENS.sage, HP_TOKENS.blue, HP_TOKENS.coral, HP_TOKENS.lavender, '#B5884A'];
  const bg = color || palette[name.charCodeAt(0) % palette.length];

  return (
    <RankFrame rank={rank} size={size}>
      <div style={{
        width: size,
        height: size,
        background: profilePhoto ? 'none' : bg,
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: HP_FONT,
        fontWeight: 800,
        fontSize: size * 0.38,
        borderRadius: 8,
        overflow: 'hidden',
        position: 'relative',
      }}>
        {profilePhoto ? (
          <img 
            src={profilePhoto} 
            alt={name} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
        ) : (
          initials
        )}

        {/* Level Progress Overlay (Subtle) */}
        {levelProgress > 0 && (
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: 4,
            background: 'rgba(0,0,0,0.1)',
          }}>
            <div style={{
              width: `${levelProgress * 100}%`,
              height: '100%',
              background: HP_TOKENS.yellow,
              transition: '0.5s ease',
            }} />
          </div>
        )}
      </div>
    </RankFrame>
  );
}
