"use client";

import React, { useState, useRef } from "react";
import { useHP } from "@/lib/HPContext";
import { HP_TOKENS, HP_FONT, HP_TEXT } from "@/lib/constants";
import Modal from "@/components/ui/Modal";
import HPAvatar from "@/components/ui/HPAvatar";
import HumanFullBody from "@/components/ui/HumanFullBody";

const SKIN_TONES = ['#FFDBAC', '#F1C27D', '#E0AC69', '#8D5524', '#C68642'];
const HAIR_COLORS = ['#090806', '#2C1608', '#4E3115', '#B89778', '#A5A2A0', '#D6C4C2'];
const HAIR_STYLES = ['short', 'spiky', 'long', 'bob'];
const CLOTHING_COLORS = [HP_TOKENS.sage, HP_TOKENS.blue, HP_TOKENS.coral, HP_TOKENS.lavender, HP_TOKENS.ink, HP_TOKENS.yellow];

interface AvatarEditorModalProps {
  onClose: () => void;
}

export default function AvatarEditorModal({ onClose }: AvatarEditorModalProps) {
  const { user, updateUser, state } = useHP();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Local state for full-body config
  const [config, setConfig] = useState<any>(user?.avatarConfig || {
    skinColor: SKIN_TONES[1],
    hairStyle: 'short',
    hairColor: HAIR_COLORS[0],
    clothingColor: HP_TOKENS.blue,
  });

  const [photo, setPhoto] = useState<string | undefined>(user?.profilePhoto);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveAll = () => {
    updateUser({ 
      avatarConfig: config,
      profilePhoto: photo 
    });
    onClose();
  };

  return (
    <Modal onClose={onClose} title="User Profile & Persona 🎨">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32, marginTop: 10 }}>
        
        {/* Profile Photo Section */}
        <section>
          <div style={{ ...HP_TEXT.h, fontSize: 16, marginBottom: 16 }}>Profile Photo</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <HPAvatar name={user?.name || "User"} size={80} rank={user?.rank} />
            <div style={{ flex: 1 }}>
               <button 
                onClick={() => fileInputRef.current?.click()}
                style={{
                  padding: '10px 16px', 
                  borderRadius: 12, 
                  background: HP_TOKENS.lineSoft,
                  border: 'none', 
                  fontFamily: HP_FONT, 
                  fontWeight: 700, 
                  cursor: 'pointer'
                }}
              >
                Upload New Photo
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                accept="image/*" 
                style={{ display: 'none' }} 
              />
              <div style={{ ...HP_TEXT.tiny, color: HP_TOKENS.inkMute, marginTop: 8 }}>
                Recomended: Square JPG/PNG. Max 2MB.
              </div>
            </div>
          </div>
        </section>

        <hr style={{ border: 'none', borderTop: `1px solid ${HP_TOKENS.lineSoft}` }} />

        {/* Full-Body Persona Section */}
        <section>
          <div style={{ ...HP_TEXT.h, fontSize: 16, marginBottom: 16 }}>Full-Body Persona</div>
          
          <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
            <div style={{ 
              background: HP_TOKENS.lineSoft, 
              borderRadius: 24, 
              padding: 20, 
              display: 'flex', 
              justifyContent: 'center',
              width: 140
            }}>
              <HumanFullBody 
                {...config} 
                size={120} 
                mood={state?.mood} 
              />
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Skin */}
              <div>
                <div style={{ ...HP_TEXT.tiny, marginBottom: 6 }}>Skin Tone</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {SKIN_TONES.map(color => (
                    <button 
                      key={color}
                      onClick={() => setConfig({ ...config, skinColor: color })}
                      style={{ 
                        width: 24, height: 24, borderRadius: 12, background: color, border: config.skinColor === color ? `2px solid ${HP_TOKENS.sage}` : 'none', cursor: 'pointer'
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Hair Style */}
              <div>
                <div style={{ ...HP_TEXT.tiny, marginBottom: 6 }}>Hair Style</div>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {HAIR_STYLES.map(style => (
                    <button 
                      key={style}
                      onClick={() => setConfig({ ...config, hairStyle: style })}
                      style={{ 
                        padding: '4px 10px', borderRadius: 8, 
                        background: config.hairStyle === style ? HP_TOKENS.ink : '#fff',
                        color: config.hairStyle === style ? '#fff' : HP_TOKENS.inkSoft,
                        border: `1px solid ${HP_TOKENS.line}`,
                        fontFamily: HP_FONT, fontWeight: 700, fontSize: 10, cursor: 'pointer',
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
                <div style={{ ...HP_TEXT.tiny, marginBottom: 6 }}>Hair Color</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {HAIR_COLORS.map(color => (
                    <button 
                      key={color}
                      onClick={() => setConfig({ ...config, hairColor: color })}
                      style={{ 
                        width: 20, height: 20, borderRadius: 10, background: color, border: config.hairColor === color ? `2px solid ${HP_TOKENS.sage}` : '1px solid rgba(0,0,0,0.1)', cursor: 'pointer'
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Clothing */}
              <div>
                <div style={{ ...HP_TEXT.tiny, marginBottom: 6 }}>Clothing Color</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {CLOTHING_COLORS.map(color => (
                    <button 
                      key={color}
                      onClick={() => setConfig({ ...config, clothingColor: color })}
                      style={{ 
                        width: 24, height: 24, borderRadius: 6, background: color, border: config.clothingColor === color ? `2px solid #000` : 'none', cursor: 'pointer'
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <button 
          onClick={saveAll}
          style={{
            width: '100%', padding: '16px', borderRadius: 99,
            background: HP_TOKENS.sage, color: '#fff', border: 'none',
            fontFamily: HP_FONT, fontWeight: 800, fontSize: 15, cursor: 'pointer',
            boxShadow: `0 8px 24px ${HP_TOKENS.sageSoft}`,
          }}
          className="hp-tap"
        >
          Save Profile 🌱
        </button>
      </div>
    </Modal>
  );
}
