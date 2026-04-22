"use client";

import React, { useState } from "react";
import { HP_TOKENS, HP_FONT, HP_TEXT } from "@/lib/constants";
import { HR_ALL_EMPLOYEES, HR_ORG_GOALS, HR_DEPT_PULSE } from "@/lib/mockData";
import HPGlyph from "@/components/ui/HPGlyph";
import HPCard from "@/components/ui/HPCard";
import HPBar from "@/components/ui/HPBar";
import HPAvatar from "@/components/ui/HPAvatar";
import ScreenHeader from "@/components/ui/ScreenHeader";
import SectionHeader from "@/components/home/SectionHeader";

interface Props { openModal: (name: string, props?: any) => void; }

const TONE_COLOR: Record<string, string> = {
  sage: HP_TOKENS.sage, blue: HP_TOKENS.blue,
  yellow: '#8A6814', coral: HP_TOKENS.coral, lavender: HP_TOKENS.lavender,
};
const TONE_SOFT: Record<string, string> = {
  sage: HP_TOKENS.sageSoft, blue: HP_TOKENS.blueSoft,
  yellow: HP_TOKENS.yellowSoft, coral: HP_TOKENS.coralSoft, lavender: HP_TOKENS.lavenderSoft,
};

export default function HRPeopleScreen({ openModal }: Props) {
  const [activeTab, setActiveTab] = useState<'goals' | 'people' | 'dept'>('goals');
  const [search, setSearch] = useState('');

  const filtered = HR_ALL_EMPLOYEES.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.dept.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: '0 16px 120px', fontFamily: HP_FONT }}>
      <ScreenHeader title="People" subtitle="Kelola karyawan & organisasi" />

      {/* Tab switcher */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {([
          { key: 'goals', label: 'Org Goals' },
          { key: 'people', label: 'Karyawan' },
          { key: 'dept',   label: 'Departemen' },
        ] as const).map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)} className="hp-tap" style={{
            flex: 1, padding: '10px 8px', borderRadius: 14,
            background: activeTab === t.key ? HP_TOKENS.lavender : HP_TOKENS.lineSoft,
            color: activeTab === t.key ? '#fff' : HP_TOKENS.inkSoft,
            border: 'none', fontFamily: HP_FONT, fontWeight: 800, fontSize: 12, cursor: 'pointer',
            transition: 'all 0.2s',
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Org Goals ── */}
      {activeTab === 'goals' && (
        <>
          <HPCard style={{ background: HP_TOKENS.lavenderSoft, border: 'none', marginBottom: 14 }} padding={16}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: HP_TOKENS.lavender, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <HPGlyph name="sparkle" size={18} color="#fff" />
              </div>
              <div>
                <div style={{ ...HP_TEXT.h, fontSize: 14, color: HP_TOKENS.lavender }}>4 Org-Wide Goals Aktif</div>
                <div style={{ ...HP_TEXT.small, color: HP_TOKENS.inkSoft, fontWeight: 600, marginTop: 2 }}>
                  Progress dipantau secara real-time
                </div>
              </div>
            </div>
          </HPCard>

          <SectionHeader icon="target" label="Tujuan Organisasi" count={String(HR_ORG_GOALS.length)} action="+ Baru" onAction={() => openModal('new_goal')} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {HR_ORG_GOALS.map(g => (
              <HPCard key={g.id} padding={16}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ ...HP_TEXT.h, fontSize: 14 }}>{g.title}</div>
                    <div style={{ ...HP_TEXT.tiny, color: HP_TOKENS.inkMute, marginTop: 3 }}>
                      {g.metric} · Due {g.due}
                    </div>
                  </div>
                  <div style={{
                    padding: '4px 10px', borderRadius: 10, fontSize: 11, fontWeight: 800, fontFamily: HP_FONT,
                    background: TONE_SOFT[g.tone] || HP_TOKENS.lineSoft,
                    color: TONE_COLOR[g.tone] || HP_TOKENS.inkSoft,
                  }}>
                    {g.progress}%
                  </div>
                </div>
                <HPBar value={g.progress} tone={g.tone as any} />
              </HPCard>
            ))}
          </div>
        </>
      )}

      {/* ── People ── */}
      {activeTab === 'people' && (
        <>
          {/* Search */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: HP_TOKENS.lineSoft, borderRadius: 14, padding: '10px 14px', marginBottom: 12,
          }}>
            <HPGlyph name="leaf" size={16} color={HP_TOKENS.inkMute} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari karyawan atau departemen..."
              style={{
                flex: 1, background: 'none', border: 'none', outline: 'none',
                fontFamily: HP_FONT, fontWeight: 600, fontSize: 14, color: HP_TOKENS.ink,
              }}
            />
          </div>

          {/* Stats summary */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 12 }}>
            {[
              { label: 'Total', value: HR_ALL_EMPLOYEES.length, color: HP_TOKENS.lavender },
              { label: 'At Risk', value: HR_ALL_EMPLOYEES.filter(e => e.risk === 'high').length, color: HP_TOKENS.coral },
              { label: 'Excellent', value: HR_ALL_EMPLOYEES.filter(e => e.engagement >= 85).length, color: HP_TOKENS.sage },
            ].map(s => (
              <div key={s.label} style={{
                background: HP_TOKENS.lineSoft, borderRadius: 12, padding: '10px',
                textAlign: 'center',
              }}>
                <div style={{ fontFamily: HP_FONT, fontWeight: 900, fontSize: 22, color: s.color }}>{s.value}</div>
                <div style={{ ...HP_TEXT.tiny, color: HP_TOKENS.inkMute }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {filtered.map(e => (
              <HPCard key={e.id} padding={12} style={{ border: e.risk === 'high' ? `1.5px solid ${HP_TOKENS.coral}40` : undefined }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <HPAvatar name={e.name} size={40} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ ...HP_TEXT.h, fontSize: 13 }}>{e.name}</div>
                      <div style={{ fontSize: 14 }}>{e.mood}</div>
                    </div>
                    <div style={{ ...HP_TEXT.tiny, color: HP_TOKENS.inkMute }}>{e.role} · {e.dept}</div>
                    <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                      <div style={{ ...HP_TEXT.tiny, color: HP_TOKENS.sage }}>WB {e.wellbeing}</div>
                      <div style={{ ...HP_TEXT.tiny, color: HP_TOKENS.blue }}>Eng {e.engagement}</div>
                    </div>
                  </div>
                  <div style={{
                    padding: '4px 10px', borderRadius: 10, fontSize: 10, fontWeight: 800, fontFamily: HP_FONT,
                    background: e.risk === 'low' ? HP_TOKENS.sageSoft : e.risk === 'medium' ? HP_TOKENS.yellowSoft : HP_TOKENS.coralSoft,
                    color: e.risk === 'low' ? HP_TOKENS.sage : e.risk === 'medium' ? '#8A6814' : HP_TOKENS.coral,
                  }}>
                    {e.riskLabel}
                  </div>
                </div>
              </HPCard>
            ))}
          </div>
        </>
      )}

      {/* ── Departemen ── */}
      {activeTab === 'dept' && (
        <>
          <SectionHeader icon="people" label="Health per Departemen" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {HR_DEPT_PULSE.map(d => (
              <HPCard key={d.dept} padding={16}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 12,
                    background: TONE_SOFT[d.tone] || HP_TOKENS.lineSoft,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <HPGlyph name="people" size={20} color={TONE_COLOR[d.tone] || HP_TOKENS.inkSoft} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ ...HP_TEXT.h, fontSize: 15 }}>{d.dept}</div>
                    <div style={{ ...HP_TEXT.tiny, color: HP_TOKENS.inkMute }}>
                      {d.headcount} karyawan{d.atRisk > 0 ? ` · ⚠️ ${d.atRisk} at-risk` : ' · ✅ All clear'}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    { label: 'Wellbeing', value: d.wellbeing, tone: d.tone },
                    { label: 'Engagement', value: d.engagement, tone: d.tone },
                  ].map(bar => (
                    <div key={bar.label}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ ...HP_TEXT.tiny, color: HP_TOKENS.inkMute }}>{bar.label}</span>
                        <span style={{ ...HP_TEXT.tiny, color: TONE_COLOR[d.tone], fontWeight: 800 }}>{bar.value}/100</span>
                      </div>
                      <HPBar value={bar.value} tone={d.tone as any} />
                    </div>
                  ))}
                </div>
              </HPCard>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
