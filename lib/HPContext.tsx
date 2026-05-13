"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

interface HPState {
  mood: string | null;
  energy: string | null;
  tag: string | null;
  intention: string;
  priorities: any[];
  feed: any[];
  goals: any[];
  habits: any[];
  weeklyPriorities: any[];
  surveys: any[]; // NEW: For HR Surveys
  skills: any[];
  learning: any[];
  coaching: any;
  wellbeing: any;
  points: number;
  coins: number;
  notifications: number;
  rewards: any[];
  rewardHistory: any[];
  logbook: any[];
  lastActivityDate: string | null;
  penaltyActive: boolean;
  penaltyThresholdDays: number;
  workSchedule: {
    start: string;
    end: string;
    breakStart: string;
    breakEnd: string;
  };
  todayAttendance?: {
    checkIn?: string;
    checkOut?: string;
  };
  personalWellbeingGoal?: string;
  wellbeingRoutine?: Array<{ id: string; title: string; done: boolean }>;
  contacts: Array<{ id: string; name: string; role: string; email: string; phone: string; isPrivate?: boolean }>;
  hrData?: any;
  managerData?: any;
}

export type UserRole = 'hr' | 'manager' | 'employee';

interface HPUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  streak: number;
  points: number;
  coins: number;
  level: number;
  rank: string;
  userRole?: UserRole | null;
  avatarImage?: string;
}

interface HPContextType {
  state: HPState | null;
  user: HPUser | null;
  updateState: (update: Partial<HPState> | ((prev: HPState) => HPState)) => void;
  updateUser: (update: Partial<HPUser> | ((prev: HPUser) => HPUser)) => void;
  setUserRole: (role: UserRole) => void;
  login: (userData: any) => void;
  logout: () => void;
  loading: boolean;
  refresh: () => Promise<void>;
  refreshSurveys: () => Promise<void>;
  resetData: () => Promise<void>;
  syncSkillProgress: (source: string, amount: number) => void;
  awardXP: (actionType: string, description?: string) => Promise<void>;
}

const HPContext = createContext<HPContextType | undefined>(undefined);

export function HPProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<HPState | null>(null);
  const [user, setUser] = useState<HPUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async (userId: string) => {
    try {
      const res = await fetch(`/api/storage?userId=${userId}`);
      const data = await res.json();
      if (data.state) setState(data.state);
      else {
        // Initialize default state if new user
        setState({
          mood: null, energy: null, tag: null, intention: "",
          priorities: [], feed: [], goals: [], habits: [], weeklyPriorities: [],
          surveys: [], skills: [], learning: [], coaching: { coachName: "Dewi Lestari", role: "Sr. Coach", time: "Jumat, 10:00", meetLink: "https://meet.google.com/abc-defg-hij" }, wellbeing: { dims: [], programs: [] },

          points: data.user?.points || 0, coins: data.user?.coins || 0, notifications: 0, rewards: [], rewardHistory: [],
          logbook: [], lastActivityDate: new Date().toISOString(),
          penaltyActive: false, penaltyThresholdDays: 3,
          workSchedule: { start: "08:00", end: "17:00", breakStart: "12:00", breakEnd: "13:00" },
          contacts: [
            { id: '1', name: 'HR Helpdesk', role: 'Support & Admin', email: 'hr@company.com', phone: '021-1234567' },
            { id: '2', name: 'IT Support', role: 'Technical Issues', email: 'it@company.com', phone: '0812-3456-7890' },
            { id: '3', name: 'Security Office', role: 'Safety & Emergency', email: 'security@company.com', phone: '021-9876543' }
          ]
        });

      }
      if (data.user) {
        setUser(data.user);
      }
    } catch (error) {
      console.error("Failed to fetch state:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const savedUserId = localStorage.getItem("hp_user_id");
    if (savedUserId) {
      fetchData(savedUserId);
    } else {
      setLoading(false);
    }
  }, [fetchData]);

  const login = (userData: any) => {
    setUser(userData);
    localStorage.setItem("hp_user_id", userData.id);
    fetchData(userData.id);
  };

  const logout = () => {
    setUser(null);
    setState(null);
    localStorage.removeItem("hp_user_id");
  };

  const fetchDashboards = useCallback(async (userId: string, role: string) => {
    try {
      if (role === 'hr') {
        const res = await fetch('/api/hr/dashboard');
        const data = await res.json();
        setState(prev => prev ? { ...prev, hrData: data } : null);
      }
      if (role === 'manager') {
        const res = await fetch(`/api/manager/dashboard?userId=${userId}`);
        const data = await res.json();
        setState(prev => prev ? { ...prev, managerData: data } : null);
      }
    } catch (e) {
      console.error("Dashboard fetch error:", e);
    }
  }, []);

  useEffect(() => {
    if (user) {
      const activeRole = user.userRole || user.role;
      if (activeRole === 'hr' || activeRole === 'manager') {
        fetchDashboards(user.id, activeRole);
      }
    }
  }, [user, fetchDashboards]);

  // Auto-refresh surveys for ALL roles when user logs in
  useEffect(() => {
    if (user?.id && !loading) {
      fetch('/api/hr/surveys')
        .then(r => r.json())
        .then(data => {
          if (data.surveys) {
            setState(prev => prev ? { ...prev, surveys: data.surveys } : null);
          }
        })
        .catch(() => {});
    }
  }, [user?.id, loading]);

  useEffect(() => {
    if (!loading && user && state) {
      fetch("/api/storage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ state, user, userId: user.id }),
      });
    }
  }, [state, user, loading]);

  const updateState = (update: Partial<HPState> | ((prev: HPState) => HPState)) => {
    setState((prev) => {
      if (!prev) return null;
      if (typeof update === "function") return update(prev);
      return { ...prev, ...update };
    });
  };

  const calculateLevel = (points: number) => {
    if (points < 1000) return Math.floor(points / 100) + 1; // Lv 1-10 (100 pts/ea)
    if (points < 4000) return 10 + Math.floor((points - 1000) / 300) + 1; // Lv 11-20 (300 pts/ea)
    return 20 + Math.floor((points - 4000) / 1000) + 1; // Lv 21+ (1000 pts/ea)
  };

  const calculateRank = (level: number) => {
    if (level <= 10) return 'E';
    if (level <= 20) return 'D';
    if (level <= 35) return 'C';
    if (level <= 50) return 'B';
    if (level <= 70) return 'A';
    return 'S';
  };

  const updateUser = (update: Partial<HPUser> | ((prev: HPUser) => HPUser)) => {
    setUser((prev) => {
      if (!prev) return null;
      let next = typeof update === "function" ? update(prev) : { ...prev, ...update };
      
      // Auto-calculate Level and Rank if points changed
      if (next.points !== prev.points) {
        const newLevel = calculateLevel(next.points);
        const newRank = calculateRank(newLevel);
        next = { ...next, level: newLevel, rank: newRank };
      }
      
      return next;
    });
  };

  const setUserRole = (role: UserRole) => {
    setUser((prev) => {
      if (!prev) return null;
      return { ...prev, userRole: role };
    });
  };

  const syncSkillProgress = (source: string, amount: number) => {
    setState((prev) => {
      if (!prev) return null;
      
      // AI Mapping logic (Heuristic) - analyzing the source text to find the best skill match
      let targetSkill = "";
      const s = source.toLowerCase();
      
      if (s.includes("design system") || s.includes("component") || s.includes("token")) targetSkill = "Design Systems";
      else if (s.includes("user") || s.includes("research") || s.includes("insight") || s.includes("interview")) targetSkill = "User Research";
      else if (s.includes("interaction") || s.includes("prototype") || s.includes("flow") || s.includes("wireframe") || s.includes("hi-fi")) targetSkill = "Interaction Design";
      else if (s.includes("lead") || s.includes("mentor") || s.includes("manager") || s.includes("strategic")) targetSkill = "Leadership";
      else if (s.includes("story") || s.includes("present") || s.includes("pitch") || s.includes("narrative")) targetSkill = "Storytelling";
      else if (s.trim().length > 0) {
        // Find if a skill with same name exists, otherwise use first word as potential skill
        const words = s.split(' ');
        targetSkill = words[0].charAt(0).toUpperCase() + words[0].slice(1);
      } else {
        targetSkill = "General";
      }
      
      const newSkills = [...(prev.skills || [])];
      const skillIndex = newSkills.findIndex(sk => sk.name.toLowerCase() === targetSkill.toLowerCase());
      
      if (skillIndex > -1) {
        newSkills[skillIndex] = { 
          ...newSkills[skillIndex], 
          current: Math.min(100, newSkills[skillIndex].current + amount) 
        };
      } else {
        // Dynamic addition of new skill discovered by AI analysis
        newSkills.push({ name: targetSkill, current: amount, target: 100 });
      }
      
      return { ...prev, skills: newSkills };
    });
  };

  const resetData = async () => {
    setLoading(true);
    // In a real app we'd have a reset endpoint, 
    // here we just clear the state and it will re-fetch if we refresh or we can hardcode reset.
    // For this prototype, we'll just reload the page to get the initial JSON state again.
    window.location.reload();
  };

  // Refresh ONLY surveys without resetting other state fields
  const refreshSurveys = useCallback(async () => {
    try {
      const res = await fetch('/api/hr/surveys');
      const data = await res.json();
      if (data.surveys) {
        setState(prev => prev ? { ...prev, surveys: data.surveys } : null);
      }
    } catch (e) {
      console.error("Failed to refresh surveys:", e);
    }
  }, []);

  const awardXP = async (actionType: string, description?: string) => {
    if (!user) return;
    try {
      const res = await fetch("/api/xp/award", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, actionType, description }),
      });
      const data = await res.json();
      if (data.success) {
        updateUser({ points: data.newTotal, coins: data.newCoins });
        updateState((s: any) => ({ ...s, points: data.newTotal, coins: data.newCoins }));
      }
    } catch (e) {
      console.error("Failed to award XP:", e);
    }
  };

  return (
    <HPContext.Provider value={{ 
      state, user, updateState, updateUser, setUserRole, login, logout, awardXP,
      loading, refresh: async () => { if (user?.id) await fetchData(user.id); },
      refreshSurveys, resetData, syncSkillProgress 
    }}>
      {children}
    </HPContext.Provider>
  );
}

export function useHP() {
  const context = useContext(HPContext);
  if (context === undefined) {
    throw new Error("useHP must be used within a HPProvider");
  }
  return context;
}
