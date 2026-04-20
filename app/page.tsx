"use client";

import React, { useState, useEffect } from "react";
import { HP_TOKENS } from "@/lib/constants";
import { 
  HP_PRIORITIES, 
  HP_FEED 
} from "@/lib/mockData";
import HPGlyph from "@/components/ui/HPGlyph";
import TabNav from "@/components/layout/TabNav";

// Screens
import HomeScreen from "@/components/home/HomeScreen";
import GoalsScreen from "@/components/goals/GoalsScreen";
import RecognizeScreen from "@/components/recognize/RecognizeScreen";
import GrowthScreen from "@/components/growth/GrowthScreen";
import WellbeingScreen from "@/components/wellbeing/WellbeingScreen";

// Modals
import CheckInModal from "@/components/modals/CheckInModal";
import FocusModal from "@/components/modals/FocusModal";
import AppreciateModal from "@/components/modals/AppreciateModal";
import PauseModal from "@/components/modals/PauseModal";
import ReflectModal from "@/components/modals/ReflectModal";
import CoachModal from "@/components/modals/CoachModal";
import NotificationsModal from "@/components/modals/NotificationsModal";
import JournalModal from "@/components/modals/JournalModal";

export default function Home() {
  const [tab, setTab] = useState('home');
  const [modal, setModal] = useState<string | null>(null);
  const [state, setState] = useState<any>(null);

  useEffect(() => {
    fetch('/api/storage')
      .then(res => res.json())
      .then(data => {
        if (data.state) {
          setState(data.state);
        } else {
          // Fallback if file not found or malformed
          setState({
            mood: null,
            energy: null,
            tag: null,
            intention: '',
            priorities: HP_PRIORITIES,
            feed: HP_FEED,
            points: 1340,
          });
        }
      });
  }, []);

  useEffect(() => {
    if (state) {
      fetch('/api/storage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state, user: { name: 'Sari Wijaya', streak: 12, points: state.points } })
      });
    }
  }, [state]);

  if (!state) return <div style={{ background: HP_TOKENS.paper, height: '100vh' }} />;

  const openModal = (name: string) => setModal(name);
  const closeModal = () => setModal(null);

  const reset = () => {
    setState({
      mood: null,
      energy: null,
      tag: null,
      intention: '',
      priorities: HP_PRIORITIES,
      feed: HP_FEED,
      points: 1340,
    });
  };

  const renderScreen = () => {
    const pad = { paddingTop: 58 };
    if (tab === 'home') return <div style={pad}><HomeScreen state={state} setState={setState} openModal={openModal}/></div>;
    if (tab === 'goals') return <div style={pad}><GoalsScreen state={state} openModal={openModal}/></div>;
    if (tab === 'recognize') return <div style={pad}><RecognizeScreen openModal={openModal}/></div>;
    if (tab === 'growth') return <div style={pad}><GrowthScreen openModal={openModal}/></div>;
    if (tab === 'wellbeing') return <div style={pad}><WellbeingScreen state={state} openModal={openModal}/></div>;
    return null;
  };

  return (
    <div style={{ position: 'relative', height: '100%', background: HP_TOKENS.paper, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, overflowY: 'auto' }}>
        {renderScreen()}
      </div>

      {/* Floating AI Coach Button */}
      <button 
        onClick={() => openModal('coach')} 
        style={{
          position: 'absolute', 
          right: 18, 
          bottom: 106, 
          zIndex: 30,
          width: 56, 
          height: 56, 
          borderRadius: 28, 
          border: 'none',
          background: `linear-gradient(135deg, ${HP_TOKENS.sage}, ${HP_TOKENS.blue})`,
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          cursor: 'pointer', 
          boxShadow: '0 8px 24px rgba(74,124,89,0.35)',
          animation: 'hpPulse 3.2s ease-in-out infinite',
        }}
        className="hp-tap"
      >
        <HPGlyph name="sparkle" size={26} color="#fff"/>
      </button>

      <TabNav tab={tab} setTab={setTab}/>

      {/* Modal Renderer */}
      {modal === 'checkin' && <CheckInModal state={state} setState={setState} onClose={closeModal}/>}
      {modal === 'focus' && <FocusModal onClose={closeModal}/>}
      {modal === 'appreciate' && <AppreciateModal setState={setState} onClose={closeModal}/>}
      {modal === 'pause' && <PauseModal onClose={closeModal}/>}
      {modal === 'reflect' && <ReflectModal onClose={closeModal}/>}
      {modal === 'coach' && <CoachModal onClose={closeModal}/>}
      {modal === 'notifications' && <NotificationsModal onClose={closeModal}/>}
      {modal === 'journal' && <JournalModal onClose={closeModal}/>}
      {modal === 'gratitude' && <JournalModal onClose={closeModal}/>} {/* Reusing journal for now as per prototype */}
    </div>
  );
}
