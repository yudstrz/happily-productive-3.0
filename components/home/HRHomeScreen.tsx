"use client";

import React, { useState } from "react";
import { useHP } from "@/lib/HPContext";
import { HP_TOKENS, HP_FONT, HP_TEXT } from "@/lib/constants";
import { HP_MOODS } from "@/lib/mockData";
import HPGlyph from "@/components/ui/HPGlyph";
import HPCard from "@/components/ui/HPCard";
import HPAvatar from "@/components/ui/HPAvatar";
import SectionHeader from "@/components/home/SectionHeader";
import BlobBackground from "@/components/home/BlobBackground";
import AnnouncementFeed from "@/components/home/AnnouncementFeed";

interface Props { openModal: (name: string, props?: any) => void; }

const TONE_COLOR: Record<string, string> = {
  sage: HP_TOKENS.sage,
  blue: HP_TOKENS.blue,
  yellow: '#8A6814',
  coral: HP_TOKENS.coral,
  lavender: HP_TOKENS.lavender,
};
const TONE_SOFT: Record<string, string> = {
  sage: HP_TOKENS.sageSoft,
  blue: HP_TOKENS.blueSoft,
  yellow: HP_TOKENS.yellowSoft,
  coral: HP_TOKENS.coralSoft,
  lavender: HP_TOKENS.lavenderSoft,
};

interface AtRiskEmployee {
  id: string | number;
  name: string;
  role: string;
  dept: string;
  mood: string;
  wellbeing: number;
}

export default function HRHomeScreen({ openModal }: Props) {
  const { user, state } = useHP();
  
  if (!user || !state?.hrData) return (
    <div style={{ padding: 40, textAlign: 'center', opacity: 0.5 }}>Memuat data HR...</div>
  );

  const { metrics: m, atRiskEmployees, deptPulse } = state.hrData;

  return (
    <div style={{ position: 'relative', minHeight: '100%', paddingBottom: 120, fontFamily: HP_FONT }}>
      <BlobBackground colors={[HP_TOKENS.lavenderSoft, HP_TOKENS.yellowWash, HP_TOKENS.blueWash]} />

      <div style={{ position: 'relative', zIndex: 1, padding: '0 16px' }} className="hp-stagger">

        {/* Header Card */}
        <div style={{
          background: `linear-gradient(135deg, ${HP_TOKENS.paper}, #fff)`,
          borderRadius: 24, padding: '24px 20px', marginTop: 8,
          border: `1.5px solid ${HP_TOKENS.line}`, boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
          position: 'relative', overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: -20, right: -10, fontSize: 100, fontWeight: 900, color: HP_TOKENS.lineSoft, opacity: 0.4 }}>
            {user.level}
          </div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div 
                className="hp-tap"
                onClick={() => openModal('profile_editor')}
                style={{ display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer' }}
              >
                <HPAvatar name={user.name} size={52} rank={user.rank} />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ ...HP_TEXT.h, fontSize: 20 }}>{(user.name || "User").split(' ')[0]}</div>
                    <div style={{ background: HP_TOKENS.lavender, color: '#fff', fontSize: 10, fontWeight: 900, padding: '2px 8px', borderRadius: 6 }}>
                      HR
                    </div>
                  </div>
                  <div style={{ ...HP_TEXT.small, color: HP_TOKENS.inkMute, marginTop: 2 }}>
                    {user.role} · {m.totalEmployees} karyawan
                  </div>
                </div>
              </div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 99,
                background: HP_TOKENS.lavenderSoft, fontFamily: HP_FONT, fontWeight: 900, fontSize: 14, color: HP_TOKENS.lavender,
              }}>
                🔥 <span>{user.streak}</span>
              </div>
            </div>

            {/* Org Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                { label: 'Engagement', value: m.engagementScore, trend: m.engagementTrend, suffix: '/100', color: HP_TOKENS.blue, icon: '📊' },
                { label: 'Wellbeing', value: m.wellbeingAvg, trend: m.wellbeingTrend, suffix: '/100', color: HP_TOKENS.sage, icon: '🌱' },
                { label: 'At-Risk', value: m.atRisk, trend: m.atRiskTrend, suffix: ' org', color: HP_TOKENS.coral, icon: '⚠️' },
                { label: 'Turnover Rate', value: `${m.turnoverRate}%`, trend: m.turnoverTrend, suffix: '', color: HP_TOKENS.lavender, icon: '📉' },
              ].map(s => (
                <div key={s.label} style={{
                  background: HP_TOKENS.lineSoft, borderRadius: 16, padding: '12px 14px',
                  display: 'flex', alignItems: 'center', gap: 10,
                }}>
                  <div style={{ fontSize: 22 }}>{s.icon}</div>
                  <div>
                    <div style={{ fontFamily: HP_FONT, fontWeight: 900, fontSize: 20, color: s.color }}>
                      {s.value}<span style={{ fontSize: 10, color: HP_TOKENS.inkMute }}>{s.suffix}</span>
                    </div>
                    <div style={{ ...HP_TEXT.tiny, color: HP_TOKENS.inkMute }}>{s.label}</div>
                    <div style={{ fontSize: 10, fontWeight: 800, color: s.trend?.startsWith('+') ? HP_TOKENS.sage : HP_TOKENS.coral, marginTop: 1 }}>
                      {s.trend} vs minggu lalu
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* At-Risk Alert */}
        {atRiskEmployees.length > 0 && (
          <div style={{
            marginTop: 14,
            background: `linear-gradient(135deg, ${HP_TOKENS.coralSoft}, #FFF0EE)`,
            borderRadius: 20, padding: '16px 18px',
            border: `1.5px solid ${HP_TOKENS.coral}40`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <div style={{ fontSize: 22 }}>⚠️</div>
              <div>
                <div style={{ ...HP_TEXT.h, fontSize: 14, color: HP_TOKENS.coral }}>
                  {atRiskEmployees.length} Karyawan Perlu Perhatian
                </div>
                <div style={{ ...HP_TEXT.small, color: HP_TOKENS.inkSoft, fontSize: 12, marginTop: 1 }}>
                  Wellbeing atau engagement di bawah threshold
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {atRiskEmployees.map((e: AtRiskEmployee) => (
                <div key={e.id} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  background: '#fff', borderRadius: 12, padding: '10px 12px',
                }}>
                  <HPAvatar name={e.name} size={32} color={HP_TOKENS.coral} />
                  <div style={{ flex: 1 }}>
                    <div style={{ ...HP_TEXT.h, fontSize: 13 }}>{e.name}</div>
                    <div style={{ ...HP_TEXT.tiny, color: HP_TOKENS.inkMute }}>{e.role} · {e.dept}</div>
                  </div>
                  <div style={{ fontSize: 16 }}>{e.mood}</div>
                  <div style={{ ...HP_TEXT.tiny, color: HP_TOKENS.coral, fontWeight: 800 }}>
                    WB: {e.wellbeing}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginTop: 16 }}>
          <SectionHeader icon="sparkle" label="Pulse per Departemen" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {deptPulse.map(d => (
              <HPCard key={d.dept} padding={14}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 12,
                    background: TONE_SOFT[d.tone] || HP_TOKENS.lineSoft,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <HPGlyph name="people" size={20} color={TONE_COLOR[d.tone] || HP_TOKENS.inkSoft} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ ...HP_TEXT.h, fontSize: 13 }}>{d.dept}</div>
                    <div style={{ ...HP_TEXT.tiny, color: HP_TOKENS.inkMute, marginTop: 1 }}>
                      {d.headcount} orang{d.atRisk > 0 ? ` · ${d.atRisk} at-risk` : ''}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ ...HP_TEXT.tiny, color: HP_TOKENS.inkMute }}>WB / ENG</div>
                    <div style={{ fontFamily: HP_FONT, fontWeight: 900, fontSize: 15, color: TONE_COLOR[d.tone] }}>
                      {d.wellbeing} / {d.engagement}
                    </div>
                  </div>
                </div>
              </HPCard>
            ))}
          </div>
        </div>

        {/* L&D Quick view */}
        <div style={{ marginTop: 16 }}>
          <SectionHeader icon="book" label="Program L&D Aktif" count={String(state.hrData.programs?.length || 0)} action="Kelola" onAction={() => openModal('manage_programs')} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {(state.hrData.programs || []).slice(0, 2).map(p => (
              <HPCard key={p.id} padding={14}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 12,
                    background: TONE_SOFT[p.tone] || HP_TOKENS.lineSoft,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <HPGlyph name="book" size={20} color={TONE_COLOR[p.tone] || HP_TOKENS.inkSoft} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ ...HP_TEXT.h, fontSize: 13 }}>{p.title}</div>
                    <div style={{ ...HP_TEXT.tiny, color: HP_TOKENS.inkMute, marginTop: 2 }}>
                      {p.enrolled} terdaftar · {p.completed} selesai
                    </div>
                    <div style={{ marginTop: 6, height: 4, background: HP_TOKENS.lineSoft, borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{
                        width: `${(p.completed / p.enrolled) * 100}%`, height: '100%',
                        background: TONE_COLOR[p.tone] || HP_TOKENS.sage, borderRadius: 2,
                      }} />
                    </div>
                  </div>
                  <div style={{ ...HP_TEXT.tiny, color: TONE_COLOR[p.tone], fontWeight: 800 }}>
                    {Math.round((p.completed / p.enrolled) * 100)}%
                  </div>
                </div>
              </HPCard>
            ))}
          </div>
        </div>

        {/* Company News */}
        <div style={{ marginTop: 16 }}>
          <AnnouncementFeed />
        </div>

        {/* AI HR Coach */}
        <button onClick={() => openModal('coach')} className="hp-tap" style={{
          marginTop: 16, width: '100%', padding: '16px', borderRadius: 22,
          background: `linear-gradient(135deg, #7B6BB5, #5A4E9A)`, color: '#fff',
          border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14,
          fontFamily: HP_FONT, textAlign: 'left', boxShadow: '0 8px 22px rgba(123,107,181,0.3)',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -20, right: 20, fontSize: 80, opacity: 0.12 }}>🏢</div>
          <div style={{
            width: 44, height: 44, borderRadius: 14, background: 'rgba(255,255,255,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22
          }}>🏢</div>
          <div style={{ flex: 1, position: 'relative' }}>
            <div style={{ ...HP_TEXT.h, fontSize: 15, color: '#fff' }}>AI HR Consultant</div>
            <div style={{ ...HP_TEXT.small, fontWeight: 700, color: 'rgba(255,255,255,0.75)', marginTop: 2 }}>
              Analisis engagement, policy guidance, retensi
            </div>
          </div>
          <HPGlyph name="arrow" size={18} color="#fff" />
        </button>
      </div>
    </div>
  );
}
