"use client";

import React, { useState } from "react";
import { useHP } from "@/lib/HPContext";
import { HP_TOKENS, HP_FONT, HP_TEXT } from "@/lib/constants";
import Modal from "@/components/ui/Modal";
import HumanAvatar from "@/components/ui/HumanAvatar";

const SKIN_TONES = ['#FFDBAC', '#F1C27D', '#E0AC69', '#8D5524', '#C68642'];
const HAIR_COLORS = ['#090806', '#2C1608', '#4E3115', '#B89778', '#A5A2A0', '#D6C4C2'];
const HAIR_STYLES = ['short', 'spiky', 'long', 'bob', 'buzz'];
const CLOTHING_COLORS = [HP_TOKENS.sage, HP_TOKENS.blue, HP_TOKENS.coral, HP_TOKENS.lavender, HP_TOKENS.ink, HP_TOKENS.yellow];

interface AvatarEditorModalProps {
  onClose: () => void;
}

export default function AvatarEditorModal({ onClose }: AvatarEditorModalProps) {
  const { user, updateUser, state } = useHP();
  
  // Local state for preview
  const [config, setConfig] = useState(user?.avatarConfig || {
    skin: SKIN_TONES[1],
    hairStyle: 'short',
    hairColor: HAIR_COLORS[0],
    clothing: 'shirt',
    clothingColor: HP_TOKENS.blue,
    expression: 'calm'
  });

  const saveAvatar = () => {
    updateUser({ avatarConfig: config });
    onClose();
  };

  return (
    <Modal onClose={onClose} title="Customize Your Avatar 🎨">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginTop: 10 }}>
        
        {/* Preview Area */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          padding: 30, 
          background: `linear-gradient(135deg, ${HP_TOKENS.paper}, ${HP_TOKENS.lineSoft})`,
          borderRadius: 24,
          border: `1.5px solid ${HP_TOKENS.line}`,
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Decorative aura */}
          <div style={{ 
            position: 'absolute', 
            width: 120, height: 120, borderRadius: 60, 
            background: `${config.clothingColor}15`, 
            filter: 'blur(20px)',
            animation: 'hpPulse 4s infinite'
          }} />
          
          <HumanAvatar config={{ ...config, expression: state?.mood || 'calm' }} size={160} />
        </div>

        {/* Editor Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          {/* Skin Tones */}
          <div>
            <div style={{ ...HP_TEXT.tiny, marginBottom: 10 }}>Warna Kulit</div>
            <div style={{ display: 'flex', gap: 10 }}>
              {SKIN_TONES.map(color => (
                <button 
                  key={color}
                  onClick={() => setConfig({ ...config, skin: color })}
                  style={{ 
                    width: 32, height: 32, borderRadius: 16, background: color, border: config.skin === color ? `3px solid ${HP_TOKENS.sage}` : 'none', cursor: 'pointer'
                  }}
                />
              ))}
            </div>
          </div>

          {/* Hair Style */}
          <div>
            <div style={{ ...HP_TEXT.tiny, marginBottom: 10 }}>Gaya Rambut</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {HAIR_STYLES.map(style => (
                <button 
                  key={style}
                  onClick={() => setConfig({ ...config, hairStyle: style })}
                  style={{ 
                    padding: '8px 14px', borderRadius: 12, 
                    background: config.hairStyle === style ? HP_TOKENS.ink : '#fff',
                    color: config.hairStyle === style ? '#fff' : HP_TOKENS.inkSoft,
                    border: config.hairStyle === style ? 'none' : `1.5px solid ${HP_TOKENS.line}`,
                    fontFamily: HP_FONT, fontWeight: 700, fontSize: 11, cursor: 'pointer',
                    textTransform: 'capitalize'
                  }}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          {/* Hair Color */}
          <div>
            <div style={{ ...HP_TEXT.tiny, marginBottom: 10 }}>Warna Rambut</div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {HAIR_COLORS.map(color => (
                <button 
                  key={color}
                  onClick={() => setConfig({ ...config, hairColor: color })}
                  style={{ 
                    width: 32, height: 32, borderRadius: 16, background: color, border: config.hairColor === color ? `2px solid ${HP_TOKENS.yellow}` : 'none', cursor: 'pointer'
                  }}
                />
              ))}
            </div>
          </div>

          {/* Clothing Color */}
          <div>
            <div style={{ ...HP_TEXT.tiny, marginBottom: 10 }}>Warna Pakaian</div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {CLOTHING_COLORS.map(color => (
                <button 
                  key={color}
                  onClick={() => setConfig({ ...config, clothingColor: color })}
                  style={{ 
                    width: 32, height: 32, borderRadius: 8, background: color, border: config.clothingColor === color ? `3px solid #000` : 'none', cursor: 'pointer'
                  }}
                />
              ))}
            </div>
          </div>

        </div>

        <button 
          onClick={saveAvatar}
          style={{
            width: '100%', padding: '16px', borderRadius: 99,
            background: HP_TOKENS.sage, color: '#fff', border: 'none',
            fontFamily: HP_FONT, fontWeight: 800, fontSize: 15, cursor: 'pointer',
            boxShadow: `0 8px 24px ${HP_TOKENS.sageSoft}`,
            marginTop: 10
          }}
          className="hp-tap"
        >
          Simpan Karakter 🌱
        </button>
      </div>
    </Modal>
  );
}
