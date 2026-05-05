"use client";

import React, { useMemo } from "react";
import { createAvatar } from "@dicebear/core";
import { adventurer } from "@dicebear/collection";

export interface DiceBearConfig {
  seed: string;
  skinColor: string;
  hair: string;
  hairColor: string;
  eyes: string;
  eyebrows: string;
  mouth: string;
  backgroundColor: string;
  // features
  features?: string;
  glasses?: string;
}

interface DiceBearAvatarProps {
  config: DiceBearConfig;
  size?: number;
  mood?: string | null;
}

// Map mood ke mouth & eyes yang sesuai
function getMoodOverride(mood: string | null): { mouth: string; eyes: string } {
  switch (mood) {
    case "joy":
      return { mouth: "variant04", eyes: "variant01" };
    case "calm":
      return { mouth: "variant08", eyes: "variant14" };
    case "tired":
      return { mouth: "variant20", eyes: "variant03" };
    case "stress":
      return { mouth: "variant19", eyes: "variant25" };
    case "neutral":
    default:
      return { mouth: "variant11", eyes: "variant16" };
  }
}

export default function DiceBearAvatar({ config, size = 100, mood }: DiceBearAvatarProps) {
  const svgString = useMemo(() => {
    const moodOverride = getMoodOverride(mood ?? null);

    // Parse stored hex (without #) with safe fallbacks
    const skinHex = (config.skinColor || "#f2d3b1").replace("#", "");
    const hairHex = (config.hairColor || "#0e0e0e").replace("#", "");
    const bgHex = (config.backgroundColor || "b6e3f4").replace("#", "");

    const avatar = createAvatar(adventurer, {
      seed: config.seed || "user",
      skinColor: [skinHex] as any,
      hairColor: [hairHex] as any,
      hair: [config.hair || "short01"] as any,
      eyes: [moodOverride.eyes] as any,
      eyebrows: [config.eyebrows || "variant01"] as any,
      mouth: [moodOverride.mouth] as any,
      backgroundColor: [bgHex] as any,
      ...(config.features ? { features: [config.features] as any, featuresProbability: 100 } : { featuresProbability: 0 }),
      ...(config.glasses ? { glasses: [config.glasses] as any, glassesProbability: 100 } : { glassesProbability: 0 }),
    });

    return avatar.toString();
  }, [config, mood]);

  const dataUri = `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;

  return (
    <img
      src={dataUri}
      width={size}
      height={size}
      alt="avatar"
      style={{ display: "block", borderRadius: "50%" }}
    />
  );
}

// Default config untuk user baru
export const DEFAULT_DICEBEAR_CONFIG: DiceBearConfig = {
  seed: "user",
  skinColor: "#f2d3b1",
  hair: "short01",
  hairColor: "#0e0e0e",
  eyes: "variant14",
  eyebrows: "variant01",
  mouth: "variant11",
  backgroundColor: "b6e3f4",
  features: "",
  glasses: "",
};
