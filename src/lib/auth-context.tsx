"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { UserProfile } from "./types";
import { supabase } from "./supabase";

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null, loading: true, login: async () => {}, register: async () => {},
  logout: async () => {}, refresh: async () => {}, error: null, clearError: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      if (error) throw error;
      return data as UserProfile;
    } catch (err) {
      console.error("Erro ao carregar perfil do Supabase:", err);
      return null;
    }
  }, []);

  const refresh = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const profile = await fetchProfile(session.user.id);
      setUser(profile);
    } else {
      setUser(null);
    }
  }, [fetchProfile]);

  useEffect(() => {
    let mounted = true;
    
    // Check active session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user && mounted) {
        fetchProfile(session.user.id).then((profile) => {
          if (mounted) {
            setUser(profile);
            setLoading(false);
          }
        });
      } else {
        if (mounted) {
          setLoading(false);
        }
      }
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const profile = await fetchProfile(session.user.id);
        if (mounted) {
          setUser(profile);
        }
      } else {
        if (mounted) {
          setUser(null);
        }
      }
      if (mounted) {
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) throw authError;
      if (data.user) {
        const profile = await fetchProfile(data.user.id);
        setUser(profile);
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erro ao fazer login.");
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      setError(null);
      setLoading(true);
      
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: name,
          }
        }
      });
      if (authError) throw authError;
      
      // Wait a moment for database trigger to create the profile row
      if (data.user) {
        let profile = null;
        // Retry a few times if database trigger is slightly delayed
        for (let i = 0; i < 5; i++) {
          profile = await fetchProfile(data.user.id);
          if (profile) break;
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
        setUser(profile);
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erro ao criar conta.");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      setUser(null);
    } catch (e: unknown) {
      console.error("Erro ao fazer logout:", e);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refresh, error, clearError }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
