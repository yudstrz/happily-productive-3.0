"use client";

import React from "react";
import { HP_TOKENS } from "@/lib/constants";

interface HumanFullBodyProps {
  skinColor: string;
  clothingColor: string;
  hairColor: string;
  hairStyle: string;
  size?: number;
  mood?: string | null;
}

/**
 * A premium, clean vector character (Humaaans style).
 * Head to Toe (Kepala sampai Kaki).
 */
export default function HumanFullBody({
  skinColor,
  clothingColor,
  hairColor,
  hairStyle,
  size = 200,
  mood = "calm",
}: HumanFullBodyProps) {
  const s = size / 100; // base scale

  return (
    <svg
      width={size}
      height={size * 1.5}
      viewBox="0 0 100 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block" }}
    >
      {/* Legs & Shoes */}
      <g transform="translate(35, 110)">
        <rect width="10" height="30" fill={skinColor} rx="5" />
        <rect x="20" width="10" height="30" fill={skinColor} rx="5" />
        {/* Simple Shoes */}
        <rect y="25" width="14" height="6" fill="#333" rx="3" />
        <rect x="16" y="25" width="14" height="6" fill="#333" rx="3" />
      </g>

      {/* Torso / Clothing */}
      <g transform="translate(30, 60)">
        {/* Shirt/Body */}
        <rect width="40" height="55" fill={clothingColor} rx="12" />
        {/* Neck */}
        <rect x="15" y="-8" width="10" height="10" fill={skinColor} />
      </g>

      {/* Arms */}
      <g transform="translate(20, 65)">
        <rect width="10" height="40" fill={skinColor} rx="5" transform="rotate(5)" />
        <rect x="50" width="10" height="40" fill={skinColor} rx="5" transform="rotate(-5, 50, 0)" />
      </g>

      {/* Head */}
      <g transform="translate(35, 15)">
        <circle cx="15" cy="15" r="18" fill={skinColor} />
        
        {/* Hair Styles */}
        {hairStyle === "short" && (
          <path d="M0 15C0 5 7 0 15 0C23 0 30 5 30 15H0Z" fill={hairColor} />
        )}
        {hairStyle === "long" && (
          <path d="M-2 15C-2 5 7 0 15 0C23 0 32 5 32 15V35C32 38 28 40 15 40C2 40 -2 38 -2 35V15Z" fill={hairColor} />
        )}
        {hairStyle === "spiky" && (
          <path d="M0 15C0 5 7 0 15 0C23 0 30 5 30 15L25 10L15 15L5 10L0 15Z" fill={hairColor} />
        )}
        {hairStyle === "bob" && (
          <path d="M-4 15C-4 5 5 0 15 0C25 0 34 5 34 15V25H-4V15Z" fill={hairColor} />
        )}

        {/* Face Expressions */}
        <g transform="translate(8, 12)">
          {/* Eyes */}
          <circle cx="4" cy="2" r="1.5" fill="rgba(0,0,0,0.7)" />
          <circle cx="10" cy="2" r="1.5" fill="rgba(0,0,0,0.7)" />
          
          {/* Mouth */}
          {mood === "joy" ? (
             <path d="M4 8C5 10 9 10 10 8" stroke="black" strokeWidth="1" strokeLinecap="round" />
          ) : mood === "tired" ? (
             <line x1="5" y1="9" x2="9" y2="9" stroke="black" strokeWidth="1" />
          ) : (
             <path d="M5 9C6 9.5 8 9.5 9 9" stroke="black" strokeWidth="1" strokeLinecap="round" />
          )}
        </g>
      </g>
    </svg>
  );
}
