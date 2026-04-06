"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, getCurrentBusinessId } from '@/lib/supabase';
import LoadingSpinner from '@/components/LoadingSpinner';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [businessId, setBusinessId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check current session
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        const bId = await getCurrentBusinessId();
        setBusinessId(bId);
      }
      setLoading(false);
    };

    initAuth();

    // 2. Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        setUser(session.user);
        const bId = await getCurrentBusinessId();
        setBusinessId(bId);
      } else {
        setUser(null);
        setBusinessId(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <AuthContext.Provider value={{ user, businessId, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
