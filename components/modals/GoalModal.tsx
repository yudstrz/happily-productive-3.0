"use client";

import React, { useState } from "react";
import { useHP } from "@/lib/HPContext";
import { 
  HP_TOKENS, 
  HP_FONT, 
  HP_TEXT 
} from "@/lib/constants";
import Modal from "@/components/ui/Modal";
import HPAvatar from "@/components/ui/HPAvatar";
import HPGlyph from "@/components/ui/HPGlyph";


interface GoalModalProps {
  onClose: () => void;
}

export default function GoalModal({ onClose, goal }: { onClose: () => void; goal?: any }) {
  const { state, updateState, user } = useHP();
  const [title, setTitle] = useState(goal?.title || "");
  const [due, setDue] = useState(goal?.due || "");
  const [scope, setScope] = useState(goal?.scope || "personal");
  const [parentId, setParentId] = useState(goal?.parent_id || "");
  const [progress, setProgress] = useState(goal?.progress || 0);
  const [subGoals, setSubGoals] = useState<any[]>(goal?.subGoals || []);
  const [selectedOwnerIds, setSelectedOwnerIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefining, setIsRefining] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const allEmployees = state?.hrData?.members || state?.managerData?.members || [];
  const filteredEmployees = allEmployees.filter((e: any) => 
    e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleOwner = (id: string) => {
    setSelectedOwnerIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const refineWithAI = async () => {
    if (!title || isRefining) return;
    setIsRefining(true);
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Refine this OKR title to be more professional, clear, and measurable: "${title}". Just give me the refined title string, no quotes or intro.`,
          systemPrompt: "You are a professional OKR coach. Your goal is to make OKRs clear and measurable."
        })
      });
      const data = await res.json();
      if (data.text) setTitle(data.text.replace(/"/g, '').trim());
    } catch (e) {
      console.error(e);
    } finally {
      setIsRefining(false);
    }
  };

  const generateTasksWithAI = async () => {
    if (!title || isGenerating) return;
    setIsGenerating(true);
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Generate 3-4 specific milestones or sub-tasks for the OKR: "${title}". Format as a JSON array of objects like this: [{"id": 101, "title": "...", "done": false}].`,
          systemPrompt: "You are an OKR specialist. Output ONLY valid JSON array."
        })
      });
      const data = await res.json();
      if (data.text) {
        const jsonMatch = data.text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const tasks = JSON.parse(jsonMatch[0]);
          setSubGoals(tasks);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };


  const parentOptions = state?.goals.filter((g: any) => {
    if (scope === 'personal') return g.scope === 'team' || g.scope === 'company';
    if (scope === 'team') return g.scope === 'company';
    return false;
  }) || [];

  const save = async () => {
    if (!title || !due) return;
    
    if (goal) {
      // Update existing
      try {
        await fetch("/api/goals/update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            goalId: goal.id,
            progress,
            parentId,
            metric: `${progress}% complete`
          })
        });
      } catch (e) {
        console.error(e);
      }
    } else {
      // Create new
      const creators = scope === 'employee' ? selectedOwnerIds : [null];
      
      const newEntries = creators.map((ownerId, idx) => {
        const emp = allEmployees.find((e: any) => String(e.id) === String(ownerId));
        return {
          id: Date.now() + idx,
          title,
          progress: 0,
          alignment: 100,
          owner: emp?.name || user?.name || "You",
          due,
          tone: scope === 'personal' ? "sage" : scope === 'team' ? "blue" : scope === 'employee' ? "lavender" : "yellow",
          metric: "0% complete",
          scope: scope === 'employee' ? 'personal' : scope, // Employees see it as personal
          parent_id: parentId || null,
          subGoals: subGoals.length > 0 ? subGoals : undefined
        };
      });

      updateState((s: any) => ({
        ...s,
        goals: [
          ...s.goals,
          ...newEntries
        ]
      }));
    }

    onClose();
  };

  const scopes = [
    { key: 'personal', label: 'Personal' },
    (user?.role === 'manager' || user?.role === 'hr' || user?.role === 'admin') && { key: 'employee', label: 'Employee' },
    (user?.role === 'manager' || user?.role === 'hr' || user?.role === 'admin') && { key: 'team', label: 'Tim' },
    (user?.role === 'hr' || user?.role === 'admin') && { key: 'company', label: 'Company' },
  ].filter(Boolean) as any[];


  return (
    <Modal onClose={onClose} title="Tambah OKR Baru">
      <div style={{ marginTop: 4 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <div style={{ ...HP_TEXT.small, color: HP_TOKENS.inkMute, fontWeight: 700 }}>NAMA OKR</div>
            <input 
              type="text" 
              value={title} 
              onChange={e => setTitle(e.target.value)}
              placeholder="Misal: Tingkatkan User Retention 20%"
              style={{
                width: '100%', marginTop: 8, padding: 14, borderRadius: 14,
                border: `1.5px solid ${HP_TOKENS.line}`, fontFamily: HP_FONT, fontSize: 14,
                color: HP_TOKENS.ink, outline: 'none', background: HP_TOKENS.card, boxSizing: 'border-box',
              }}
            />
          </div>
          <button 
            onClick={refineWithAI}
            disabled={!title || isRefining}
            className="hp-tap"
            style={{
              marginTop: 22, width: 48, height: 48, borderRadius: 14, background: HP_TOKENS.sageSoft,
              border: `1.5px solid ${HP_TOKENS.sage}30`, display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', opacity: !title || isRefining ? 0.5 : 1
            }}
          >
            {isRefining ? (
              <div className="hp-spin" style={{ width: 18, height: 18, border: `2px solid ${HP_TOKENS.sage}`, borderTopColor: 'transparent', borderRadius: '50%' }} />
            ) : (
              <HPGlyph name="sparkle" size={20} color={HP_TOKENS.sage} />
            )}
          </button>
        </div>


        <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
          <div style={{ flex: 1 }}>
            <div style={{ ...HP_TEXT.small, color: HP_TOKENS.inkMute, fontWeight: 700 }}>TENGGAT WAKTU</div>
            <input 
              type="text" 
              value={due} 
              onChange={e => setDue(e.target.value)}
              placeholder="Misal: Q2 2026"
              style={{
                width: '100%', marginTop: 8, padding: 14, borderRadius: 14,
                border: `1.5px solid ${HP_TOKENS.line}`, fontFamily: HP_FONT, fontSize: 14,
                color: HP_TOKENS.ink, outline: 'none', background: HP_TOKENS.card, boxSizing: 'border-box',
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ ...HP_TEXT.small, color: HP_TOKENS.inkMute, fontWeight: 700 }}>TASKS/MILESTONES</div>
            <button 
              onClick={generateTasksWithAI}
              disabled={!title || isGenerating}
              className="hp-tap"
              style={{
                width: '100%', marginTop: 8, padding: '13px', borderRadius: 14, 
                background: HP_TOKENS.blueSoft, border: `1.5px solid ${HP_TOKENS.blue}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                fontFamily: HP_FONT, fontWeight: 800, fontSize: 13, color: HP_TOKENS.blue,
                cursor: 'pointer', opacity: !title || isGenerating ? 0.5 : 1
              }}
            >
              {isGenerating ? "Generating..." : <><HPGlyph name="target" size={16} color={HP_TOKENS.blue} /> Auto AI</>}
            </button>
          </div>
        </div>

        {subGoals.length > 0 && (
          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6, background: HP_TOKENS.lineSoft, padding: 10, borderRadius: 14 }}>
            {subGoals.map((sg, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 14, height: 14, borderRadius: 4, border: `1.5px solid ${HP_TOKENS.line}`, background: '#fff' }} />
                <div style={{ ...HP_TEXT.small, fontSize: 12, color: HP_TOKENS.inkSoft }}>{sg.title}</div>
              </div>
            ))}
          </div>
        )}


        {goal && (
          <>
            <div style={{ ...HP_TEXT.small, color: HP_TOKENS.inkMute, fontWeight: 700, marginTop: 20 }}>PROGRESS: {progress}%</div>
            <input 
              type="range" 
              min="0" max="100" 
              value={progress} 
              onChange={e => setProgress(Number(e.target.value))}
              style={{ width: '100%', marginTop: 10 }}
            />
          </>
        )}

        <div style={{ ...HP_TEXT.small, color: HP_TOKENS.inkMute, fontWeight: 700, marginTop: 20 }}>SCOPE</div>
        <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
          {scopes.map(s => (
            <button
              key={s.key}
              onClick={() => { setScope(s.key); setParentId(""); }}
              style={{
                flex: 1, padding: '12px 8px', borderRadius: 12, border: 'none',
                background: scope === s.key ? HP_TOKENS.ink : HP_TOKENS.lineSoft,
                color: scope === s.key ? '#fff' : HP_TOKENS.ink,
                fontFamily: HP_FONT, fontWeight: 800, fontSize: 13, cursor: 'pointer',
              }}
            >
              {s.label}
            </button>
          ))}
        </div>

        {scope === 'employee' && (
          <div style={{ marginTop: 16 }}>
            <div style={{ ...HP_TEXT.small, color: HP_TOKENS.inkMute, fontWeight: 700, marginBottom: 8 }}>PILIH KARYAWAN ({selectedOwnerIds.length})</div>
            <div style={{ 
              display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', 
              background: HP_TOKENS.card, borderRadius: 14, border: `1.5px solid ${HP_TOKENS.line}`,
              marginBottom: 10
            }}>
              <HPGlyph name="sparkle" size={16} color={HP_TOKENS.inkMute} />
              <input 
                placeholder="Cari nama atau posisi..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ flex: 1, border: 'none', background: 'none', outline: 'none', fontFamily: HP_FONT, fontSize: 13 }}
              />
            </div>
            <div style={{ 
              display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 10, 
              maskImage: 'linear-gradient(to right, black 85%, transparent 100%)'
            }}>
              {filteredEmployees.map((e: any) => {
                const active = selectedOwnerIds.includes(e.id);
                return (
                  <div 
                    key={e.id} 
                    onClick={() => toggleOwner(e.id)}
                    className="hp-tap"
                    style={{ 
                      flexShrink: 0, width: 80, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                      opacity: active ? 1 : 0.6, transition: '0.2s'
                    }}
                  >
                    <div style={{ position: 'relative' }}>
                      <HPAvatar name={e.name} size={48} color={active ? HP_TOKENS.sage : undefined} />
                      {active && (
                        <div style={{ 
                          position: 'absolute', top: -2, right: -2, width: 18, height: 18, borderRadius: 9,
                          background: HP_TOKENS.sage, display: 'flex', alignItems: 'center', justifyContent: 'center',
                          border: '2px solid #fff'
                        }}>
                          <span style={{ color: '#fff', fontSize: 10, fontWeight: 900 }}>✓</span>
                        </div>
                      )}
                    </div>
                    <div style={{ ...HP_TEXT.tiny, textAlign: 'center', width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 800 }}>
                      {e.name.split(' ')[0]}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}


        {parentOptions.length > 0 && (
          <>
            <div style={{ ...HP_TEXT.small, color: HP_TOKENS.inkMute, fontWeight: 700, marginTop: 20 }}>ALIGN TO (PARENT OKR)</div>
            <select
              value={parentId}
              onChange={e => setParentId(e.target.value)}
              style={{
                width: '100%', marginTop: 10, padding: 14, borderRadius: 14,
                border: `1.5px solid ${HP_TOKENS.line}`, fontFamily: HP_FONT, fontSize: 14,
                color: HP_TOKENS.ink, outline: 'none', background: HP_TOKENS.card, boxSizing: 'border-box',
              }}
            >
              <option value="">-- Tanpa Parent --</option>
              {parentOptions.map((p: any) => (
                <option key={p.id} value={p.id}>{p.title} ({p.scope})</option>
              ))}
            </select>
          </>
        )}

        <button 
          onClick={save} 
          disabled={!title || !due || (scope === 'employee' && selectedOwnerIds.length === 0)}
          style={{
            width: '100%', marginTop: 32, padding: '16px', borderRadius: 99,
            background: HP_TOKENS.sage, color: '#fff', border: 'none',
            fontFamily: HP_FONT, fontWeight: 800, fontSize: 15, cursor: 'pointer',
            opacity: (!title || !due || (scope === 'employee' && selectedOwnerIds.length === 0)) ? 0.4 : 1,
            boxShadow: `0 8px 24px ${HP_TOKENS.sageSoft}`,
          }}
          className="hp-tap"
        >
          {scope === 'employee' ? `Simpan OKR untuk ${selectedOwnerIds.length} Orang 🎯` : 'Simpan OKR 🎯'}
        </button>

      </div>
    </Modal>
  );
}

