"use client";

import React, { useState } from "react";
import { useHP } from "@/lib/HPContext";
import { HP_TOKENS, HP_FONT, HP_TEXT } from "@/lib/constants";
import {
  MANAGER_TEAM_GOALS,
  MANAGER_TEAM_MEMBERS,
  MANAGER_ONE_ON_ONES,
} from "@/lib/mockData";
import HPGlyph from "@/components/ui/HPGlyph";
import HPCard from "@/components/ui/HPCard";
import HPBar from "@/components/ui/HPBar";
import HPAvatar from "@/components/ui/HPAvatar";
import ScreenHeader from "@/components/ui/ScreenHeader";
import SectionHeader from "@/components/home/SectionHeader";

import HRAttendanceView from "@/components/goals/HRAttendanceView";

interface Props { openModal: (name: string, props?: any) => void; }

const TONE: Record<string, string> = { sage: HP_TOKENS.sage, blue: HP_TOKENS.blue, lavender: HP_TOKENS.lavender, yellow: HP_TOKENS.yellow, coral: HP_TOKENS.coral };
const TONE_SOFT: Record<string, string> = { sage: HP_TOKENS.sageSoft, blue: HP_TOKENS.blueSoft, lavender: HP_TOKENS.lavenderSoft, yellow: HP_TOKENS.yellowSoft, coral: HP_TOKENS.coralSoft };

export default function ManagerGoalsScreen({ openModal }: Props) {
  const { user } = useHP();
  const [activeTab, setActiveTab] = useState<'okr' | 'members' | 'attendance' | 'schedule'>('okr');

  return (
    <div style={{ padding: '0 16px 120px', fontFamily: HP_FONT }}>
      <ScreenHeader title="Tim & OKR" subtitle="Pantau goal tim dan performa anggota" />

      {/* Tab switcher */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {([
          { key: 'okr', label: 'OKR Tim' },
          { key: 'members', label: 'Anggota' },
          { key: 'attendance', label: 'Absensi' },
          { key: 'schedule', label: '1-on-1' },
        ] as const).map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)} className="hp-tap" style={{
            flex: 1, padding: '10px 4px', borderRadius: 14,
            background: activeTab === t.key ? HP_TOKENS.blue : HP_TOKENS.lineSoft,
            color: activeTab === t.key ? '#fff' : HP_TOKENS.inkSoft,
            border: 'none', fontFamily: HP_FONT, fontWeight: 800, fontSize: 11, cursor: 'pointer',
            transition: 'all 0.2s',
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── OKR Tim ── */}
      {activeTab === 'okr' && (
        <>
          {/* Alignment summary */}
          <HPCard style={{ background: HP_TOKENS.blueWash, border: 'none', marginBottom: 14 }} padding={16}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: HP_TOKENS.blue, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <HPGlyph name="sparkle" size={18} color="#fff" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ ...HP_TEXT.h, fontSize: 14, color: HP_TOKENS.blue }}>Team Alignment · 87%</div>
                <div style={{ ...HP_TEXT.small, color: HP_TOKENS.inkSoft, fontWeight: 600, marginTop: 2 }}>
                  Goal tim sudah selaras dengan strategi Q2 🌱
                </div>
              </div>
            </div>
          </HPCard>

          <SectionHeader icon="target" label="OKR Aktif Tim" count={String(MANAGER_TEAM_GOALS.length)} action="+ Baru" onAction={() => openModal('new_goal')} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {MANAGER_TEAM_GOALS.map(g => (
              <HPCard key={g.id} padding={16}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ ...HP_TEXT.h, fontSize: 15 }}>{g.title}</div>
                    <div style={{ ...HP_TEXT.tiny, color: HP_TOKENS.inkMute, marginTop: 3 }}>
                      {g.members} anggota · Due {g.due}
                    </div>
                  </div>
                  <div style={{
                    padding: '4px 10px', borderRadius: 10, fontSize: 11, fontWeight: 800,
                    background: g.onTrack ? HP_TOKENS.sageSoft : HP_TOKENS.coralSoft,
                    color: g.onTrack ? HP_TOKENS.sage : HP_TOKENS.coral,
                  }}>
                    {g.onTrack ? 'On Track' : 'Off Track'}
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ ...HP_TEXT.tiny, color: HP_TOKENS.inkMute }}>Progress</span>
                  <span style={{ ...HP_TEXT.tiny, color: TONE[g.tone], fontWeight: 800 }}>{g.progress}%</span>
                </div>
                <HPBar value={g.progress} tone={g.tone as any} />
              </HPCard>
            ))}
          </div>
        </>
      )}

      {/* ── Members ── */}
      {activeTab === 'members' && (
        <>
          <SectionHeader icon="people" label="Anggota Tim" count={String(MANAGER_TEAM_MEMBERS.length)} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {MANAGER_TEAM_MEMBERS.map(m => (
              <HPCard key={m.id} padding={14}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <HPAvatar name={m.name} size={44} />
                  <div style={{ flex: 1 }}>
                    <div style={{ ...HP_TEXT.h, fontSize: 14 }}>{m.name}</div>
                    <div style={{ ...HP_TEXT.tiny, color: HP_TOKENS.inkMute, marginTop: 2 }}>{m.role}</div>
                    <div style={{ display: 'flex', gap: 8, marginTop: 6, alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <HPGlyph name={m.glyph || 'check'} size={14} color={HP_TOKENS.ink} />
                      </div>
                      <div style={{ flex: 1, height: 4, background: HP_TOKENS.lineSoft, borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{ width: `${m.wellbeing}%`, height: '100%', background: HP_TOKENS.sage, borderRadius: 2 }} />
                      </div>
                      <div style={{ ...HP_TEXT.tiny, color: HP_TOKENS.inkMute }}>WB {m.wellbeing}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{
                      fontSize: 11, fontWeight: 800, padding: '4px 10px', borderRadius: 10, fontFamily: HP_FONT,
                      background: m.statusTone === 'sage' ? HP_TOKENS.sageSoft : m.statusTone === 'yellow' ? HP_TOKENS.yellowSoft : HP_TOKENS.coralSoft,
                      color: m.statusTone === 'sage' ? HP_TOKENS.sage : m.statusTone === 'yellow' ? '#8A6814' : HP_TOKENS.coral,
                      marginBottom: 4,
                    }}>
                      {m.status}
                    </div>
                    <div style={{ ...HP_TEXT.tiny, color: HP_TOKENS.inkMute }}>
                      Task {m.tasks.done}/{m.tasks.total}
                    </div>
                  </div>
                </div>
              </HPCard>
            ))}
          </div>
        </>
      )}

      {/* ── Attendance ── */}
      {activeTab === 'attendance' && (
        <HRAttendanceView currentUser={user} />
      )}

      {/* ── 1-on-1 Schedule ── */}
      {activeTab === 'schedule' && (
        <>
          <SectionHeader icon="calendar" label="Jadwal 1-on-1" action="+ Tambah" onAction={() => openModal('schedule_coaching')} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {MANAGER_ONE_ON_ONES.map(s => (
              <HPCard key={s.id} padding={14} style={{ border: s.urgent ? `1.5px solid ${HP_TOKENS.coral}` : undefined }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <HPAvatar name={s.with} size={42} color={s.urgent ? HP_TOKENS.coral : HP_TOKENS.blue} />
                  <div style={{ flex: 1 }}>
                    {s.urgent && <div style={{ ...HP_TEXT.tiny, color: HP_TOKENS.coral, marginBottom: 2 }}>PRIORITASKAN ⚠️</div>}
                    <div style={{ ...HP_TEXT.h, fontSize: 14 }}>{s.with}</div>
                    <div style={{ ...HP_TEXT.small, color: HP_TOKENS.inkMute, marginTop: 2 }}>{s.date} · {s.time}</div>
                    <div style={{ ...HP_TEXT.tiny, color: HP_TOKENS.blue, marginTop: 3 }}>{s.topic}</div>
                  </div>
                  <button className="hp-tap" style={{
                    padding: '8px 14px', borderRadius: 12, border: 'none',
                    background: s.urgent ? HP_TOKENS.coral : HP_TOKENS.blue,
                    color: '#fff', fontFamily: HP_FONT, fontWeight: 800, fontSize: 12, cursor: 'pointer',
                  }}>Mulai</button>
                </div>
              </HPCard>
            ))}
          </div>

          {/* Coaching tip */}
          <HPCard style={{ marginTop: 14, background: HP_TOKENS.blueWash, border: 'none' }} padding={14}>
            <div style={{ display: 'flex', gap: 10 }}>
              <HPGlyph name="sparkle" size={18} color={HP_TOKENS.blue} />
              <div>
                <div style={{ ...HP_TEXT.h, fontSize: 13, color: HP_TOKENS.blue }}>Tip dari AI Coach</div>
                <div style={{ ...HP_TEXT.body, fontSize: 13, marginTop: 4 }}>
                  Dian perlu check-in lebih sering — wellbeing-nya turun 3 minggu berturut. Mulai dengan pertanyaan terbuka, bukan evaluasi kinerja.
                </div>
              </div>
            </div>
          </HPCard>
        </>
      )}
    </div>
  );
}
