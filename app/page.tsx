"use client";

import React, { useState } from "react";
import { HPProvider, useHP, UserRole } from "@/lib/HPContext";
import { HP_TOKENS, HP_FONT } from "@/lib/constants";

// Auth
import AuthScreen from "@/components/auth/AuthScreen";

// UI
import HPGlyph from "@/components/ui/HPGlyph";
import TabNav from "@/components/layout/TabNav";

// ── Employee Screens ──
import HomeScreen from "@/components/home/HomeScreen";
import GoalsScreen from "@/components/goals/GoalsScreen";
import RecognizeScreen from "@/components/recognize/RecognizeScreen";
import GrowthScreen from "@/components/growth/GrowthScreen";
import WellbeingScreen from "@/components/wellbeing/WellbeingScreen";

// ── Manager Screens ──
import ManagerHomeScreen from "@/components/home/ManagerHomeScreen";
import ManagerGoalsScreen from "@/components/goals/ManagerGoalsScreen";
import ManagerRecognizeScreen from "@/components/recognize/ManagerRecognizeScreen";
import ManagerGrowthScreen from "@/components/growth/ManagerGrowthScreen";
import ManagerWellbeingScreen from "@/components/wellbeing/ManagerWellbeingScreen";

// ── HR Screens ──
import HRHomeScreen from "@/components/home/HRHomeScreen";
import HRPeopleScreen from "@/components/goals/HRPeopleScreen";
import HRRecognizeScreen from "@/components/recognize/HRRecognizeScreen";
import HRAnalyticsScreen from "@/components/growth/HRAnalyticsScreen";
import HRWellbeingScreen from "@/components/wellbeing/HRWellbeingScreen";

// ── Admin Screens ──
import AdminConsoleScreen from "@/components/admin/AdminConsoleScreen";


// Modals
import CheckInModal from "@/components/modals/CheckInModal";
import FocusModal from "@/components/modals/FocusModal";
import AppreciateModal from "@/components/modals/AppreciateModal";
import PauseModal from "@/components/modals/PauseModal";
import ReflectModal from "@/components/modals/ReflectModal";
import CoachModal from "@/components/modals/CoachModal";
import NotificationsModal from "@/components/modals/NotificationsModal";

import GoalModal from "@/components/modals/GoalModal";
import ManagePrioritiesModal from "@/components/modals/ManagePrioritiesModal";
import ManageHabitsModal from "@/components/modals/ManageHabitsModal";
import ManageWeeklyModal from "@/components/modals/ManageWeeklyModal";
import ManageLearningModal from "@/components/modals/ManageLearningModal";
import ScheduleCoachingModal from "@/components/modals/ScheduleCoachingModal";
import GROWCoachingModal from "@/components/modals/GROWCoachingModal";
import LearningDetailModal from "@/components/modals/LearningDetailModal";
import ManageProgramsModal from "@/components/modals/ManageProgramsModal";
import AllRewardsModal from "@/components/modals/AllRewardsModal";

import LogbookModal from "@/components/modals/LogbookModal";
import SystemGuideModal from "@/components/modals/SystemGuideModal";
import SkillAssessmentModal from "@/components/modals/SkillAssessmentModal";
import ProfileEditorModal from "@/components/modals/ProfileEditorModal";
import ManageSurveysModal from "@/components/modals/ManageSurveysModal";
import TakeSurveyModal from "@/components/modals/TakeSurveyModal";
import AttendanceScannerModal from "@/components/modals/AttendanceScannerModal";


// ─── Role pill badge colors ──────────────────────────────────────────────────
const ROLE_META: Record<UserRole, { label: string; color: string; bg: string; glyph: string }> = {
  admin:    { label: 'Admin',    color: HP_TOKENS.coral, bg: HP_TOKENS.coral + '15', glyph: 'sparkle' },
  employee: { label: 'Employee', color: HP_TOKENS.yellow, bg: HP_TOKENS.yellowSoft, glyph: 'target' },
  manager:  { label: 'Manager',  color: HP_TOKENS.blue, bg: HP_TOKENS.blueSoft,  glyph: 'people' },
  hr:       { label: 'HR',       color: '#7B6BB5',       bg: '#EDE8F5',           glyph: 'medal' },
};

function AppContent() {
  const { state, loading, user, login, setUserRole } = useHP();
  const [tab, setTab] = useState('home');
  const [modal, setModal] = useState<{ name: string; props?: any } | null>(null);

  const openModal  = (name: string, props?: any) => setModal({ name, props });
  const closeModal = () => setModal(null);

  // ── Loading splash ─────────────────────────────────────────────────────────
  if (loading) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: HP_TOKENS.paper }}>
      <div className="hp-bounce" style={{ width: 40, height: 40, background: HP_TOKENS.yellow, borderRadius: 12 }} />
    </div>
  );

  // ── Auth Check ─────────────────────────────────────────────────────────────
  if (!user) {
    return <AuthScreen onLogin={login} />;
  }

  // ── Determine Role ─────────────────────────────────────────────────────────
  const currentRole = (user?.role || 'employee') as UserRole;

  // ── Render screen by role + tab ─────────────────────────────────────────────
  const pad = { paddingTop: 58 };

  const renderScreen = () => {
    // Admin
    if (currentRole === 'admin') {
      return <div style={pad}><AdminConsoleScreen openModal={openModal} /></div>;
    }
    // Employee
    if (currentRole === 'employee') {
      if (tab === 'home')      return <div style={pad}><HomeScreen tab={tab} openModal={openModal} /></div>;
      if (tab === 'goals')     return <div style={pad}><GoalsScreen openModal={openModal} /></div>;
      if (tab === 'recognize') return <div style={pad}><RecognizeScreen openModal={openModal} /></div>;
      if (tab === 'growth')    return <div style={pad}><GrowthScreen openModal={openModal} /></div>;
      if (tab === 'wellbeing') return <div style={pad}><WellbeingScreen openModal={openModal} /></div>;
    }
    // Manager
    if (currentRole === 'manager') {
      if (tab === 'home')      return <div style={pad}><ManagerHomeScreen openModal={openModal} /></div>;
      if (tab === 'goals')     return <div style={pad}><ManagerGoalsScreen openModal={openModal} /></div>;
      if (tab === 'recognize') return <div style={pad}><ManagerRecognizeScreen openModal={openModal} /></div>;
      if (tab === 'growth')    return <div style={pad}><ManagerGrowthScreen openModal={openModal} /></div>;
      if (tab === 'wellbeing') return <div style={pad}><ManagerWellbeingScreen openModal={openModal} /></div>;
    }
    // HR
    if (currentRole === 'hr') {
      if (tab === 'home')      return <div style={pad}><HRHomeScreen openModal={openModal} /></div>;
      if (tab === 'goals')     return <div style={pad}><HRPeopleScreen openModal={openModal} /></div>;
      if (tab === 'recognize') return <div style={pad}><HRRecognizeScreen openModal={openModal} /></div>;
      if (tab === 'growth')    return <div style={pad}><HRAnalyticsScreen openModal={openModal} /></div>;
      if (tab === 'wellbeing') return <div style={pad}><HRWellbeingScreen openModal={openModal} /></div>;
    }
    return null;
  };

  const meta = ROLE_META[currentRole];

  return (
    <div style={{ position: 'relative', height: '100%', background: HP_TOKENS.paper, overflow: 'hidden' }}>
      {/* Role pill — top right */}
      <div style={{
        position: 'absolute', top: 10, right: 14, zIndex: 40,
        display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '6px 12px', borderRadius: 99,
            background: meta.bg,
            border: `1.5px solid ${meta.color}30`,
            fontFamily: HP_FONT, fontWeight: 800, fontSize: 11,
            color: meta.color,
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}
        >
          <HPGlyph name={meta.glyph} size={11} color={meta.color} />
          <span>{meta.label}</span>
        </div>
      </div>

      {/* Main content */}
      <div style={{ position: 'absolute', inset: 0, overflowY: 'auto' }}>
        {renderScreen()}
      </div>

      {/* Floating AI Coach button */}
      {currentRole !== 'admin' && (
        <button
          onClick={() => openModal('coach')}
          style={{
            position: 'absolute', right: 18, bottom: 106, zIndex: 30,
            width: 56, height: 56, borderRadius: 28, border: 'none',
            background: currentRole === 'manager' ? HP_TOKENS.blue :
                       currentRole === 'hr' ? '#7B6BB5' :
                       HP_TOKENS.yellow,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: `0 8px 24px ${
              currentRole === 'manager' ? 'rgba(59,111,160,0.2)' :
              currentRole === 'hr' ? 'rgba(123,107,181,0.2)' :
              'rgba(253,185,19,0.2)'
            }`,
          }}
          className="hp-tap"
        >
          <HPGlyph name="sparkle" size={26} color={currentRole === 'employee' ? HP_TOKENS.ink : "#fff"} />
        </button>
      )}

      {currentRole !== 'admin' && <TabNav tab={tab} setTab={setTab} userRole={currentRole} />}

      {/* Modal Renderer */}
      {modal?.name === 'checkin'          && <CheckInModal onClose={closeModal} />}
      {modal?.name === 'focus'            && <FocusModal onClose={closeModal} />}
      {modal?.name === 'appreciate'       && <AppreciateModal onClose={closeModal} />}
      {modal?.name === 'pause'            && <PauseModal onClose={closeModal} />}
      {modal?.name === 'reflect'          && <ReflectModal onClose={closeModal} />}
      {modal?.name === 'coach'            && <CoachModal onClose={closeModal} />}
      {modal?.name === 'notifications'    && <NotificationsModal onClose={closeModal} />}

      {modal?.name === 'new_goal'         && <GoalModal onClose={closeModal} {...modal.props} />}
      {modal?.name === 'manage_priorities'&& <ManagePrioritiesModal onClose={closeModal} />}
      {modal?.name === 'manage_habits'    && <ManageHabitsModal onClose={closeModal} />}
      {modal?.name === 'manage_weekly'    && <ManageWeeklyModal onClose={closeModal} />}
      {modal?.name === 'manage_learning'  && <ManageLearningModal onClose={closeModal} />}
      {modal?.name === 'schedule_coaching'&& <ScheduleCoachingModal onClose={closeModal} />}
      {modal?.name === 'learning_detail'  && <LearningDetailModal onClose={closeModal} />}
      {modal?.name === 'manage_programs'  && <ManageProgramsModal onClose={closeModal} />}
      {modal?.name === 'all_rewards'      && <AllRewardsModal onClose={closeModal} />}
      {modal?.name === 'grow_coaching'    && <GROWCoachingModal onClose={closeModal} roleContext={modal.props?.role} topic={modal.props?.topic} />}
      {modal?.name === 'logbook'          && <LogbookModal onClose={closeModal} />}
      {modal?.name === 'system_guide'     && <SystemGuideModal onClose={closeModal} />}
      {modal?.name === 'profile_editor'   && <ProfileEditorModal onClose={closeModal} />}
      {modal?.name === 'manage_surveys'   && <ManageSurveysModal onClose={closeModal} />}
      {modal?.name === 'take_survey'     && <TakeSurveyModal onClose={closeModal} {...modal.props} />}
      {modal?.name === 'skill_assessment' && <SkillAssessmentModal onClose={closeModal} skillName={modal.props?.skill} />}
      {modal?.name === 'attendance_scanner' && <AttendanceScannerModal onClose={closeModal} />}

    </div>
  );
}

export default function Home() {
  return (
    <HPProvider>
      <AppContent />
    </HPProvider>
  );
}
