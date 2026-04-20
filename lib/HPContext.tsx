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
}

interface HPUser {
  name: string;
  role: string;
  streak: number;
  points: number;
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

  const updateUser = (update: Partial<HPUser> | ((prev: HPUser) => HPUser)) => {
    setUser((prev) => {
      if (!prev) return null;
      if (typeof update === "function") return update(prev);
      return { ...prev, ...update };
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
