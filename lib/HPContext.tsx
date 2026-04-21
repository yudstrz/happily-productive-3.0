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
  skills: any[];
  learning: any[];
  coaching: any;
  wellbeing: any;
  points: number;
  notifications: number;
  rewards: any[];
  rewardHistory: any[];
  logbook: any[];
}

interface HPUser {
  name: string;
  role: string;
  streak: number;
  points: number;
  level: number;
  rank: string;
}

interface HPContextType {
  state: HPState | null;
  user: HPUser | null;
  updateState: (update: Partial<HPState> | ((prev: HPState) => HPState)) => void;
  updateUser: (update: Partial<HPUser> | ((prev: HPUser) => HPUser)) => void;
  loading: boolean;
  refresh: () => Promise<void>;
  resetData: () => Promise<void>;
}

const HPContext = createContext<HPContextType | undefined>(undefined);

export function HPProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<HPState | null>(null);
  const [user, setUser] = useState<HPUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/storage");
      const data = await res.json();
      if (data.state) setState(data.state);
      if (data.user) setUser(data.user);
    } catch (error) {
      console.error("Failed to fetch state:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Sync to API whenever state or user changes
  useEffect(() => {
    if (!loading && (state || user)) {
      fetch("/api/storage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ state, user }),
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

  const resetData = async () => {
    setLoading(true);
    // In a real app we'd have a reset endpoint, 
    // here we just clear the state and it will re-fetch if we refresh or we can hardcode reset.
    // For this prototype, we'll just reload the page to get the initial JSON state again.
    window.location.reload();
  };

  return (
    <HPContext.Provider value={{ state, user, updateState, updateUser, loading, refresh: fetchData, resetData }}>
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
