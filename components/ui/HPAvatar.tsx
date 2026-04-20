"use client";

import React from "react";
import { HP_TOKENS, HP_FONT } from "@/lib/constants";

interface HPAvatarProps {
  name: string;
  size?: number;
  color?: string;
}

export default function HPAvatar({ 
  name, 
  size = 36, 
  color 
}: HPAvatarProps) {
  const initials = name.split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase();
  const palette = [HP_TOKENS.sage, HP_TOKENS.blue, HP_TOKENS.coral, HP_TOKENS.lavender, '#B5884A'];
  const bg = color || palette[name.charCodeAt(0) % palette.length];
  
  return (
    <div style={{
      width: size, 
      height: size, 
      borderRadius: size / 2,
      background: bg, 
      color: '#fff',
      display: 'inline-flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      fontFamily: HP_FONT, 
      fontWeight: 800, 
      fontSize: size * 0.38,
      flexShrink: 0, 
      letterSpacing: 0.2,
    }}>
      {initials}
    </div>
  );
}
