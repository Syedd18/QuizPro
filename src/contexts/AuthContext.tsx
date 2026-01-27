import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface AppUser extends User {
  role?: 'user' | 'admin';
}

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  error: string | null;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  setUserRole: (role: 'user' | 'admin') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (session?.user) {
          const userData: AppUser = {
            ...session.user,
            role: 'user', // Default role
          };
          // Check localStorage for stored role
          const storedRole = localStorage.getItem('userRole') as 'user' | 'admin' | null;
          if (storedRole) {
            userData.role = storedRole;
          }
          setUser(userData);
          // Ensure user_profiles exists for the restored session
          try {
            const nameFromMeta = session.user.user_metadata?.name || session.user.user_metadata?.full_name;
            const name = nameFromMeta || session.user.email || 'Student';
            await supabase.from('user_profiles').upsert([
              { id: session.user.id, name, email: session.user.email, created_at: new Date().toISOString() },
            ], { onConflict: 'id' });
          } catch (e) {
            console.warn('Failed to ensure user_profiles on session restore:', e);
          }
        }
      } catch (err) {
        console.error('Auth check failed:', err);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const userData: AppUser = {
            ...session.user,
            role: 'user',
          };
          const storedRole = localStorage.getItem('userRole') as 'user' | 'admin' | null;
          if (storedRole) {
            userData.role = storedRole;
          }
          setUser(userData);
          // Ensure user_profiles exists whenever auth state changes to a signed-in user
          try {
            const nameFromMeta = session.user.user_metadata?.name || session.user.user_metadata?.full_name;
            const name = nameFromMeta || session.user.email || 'Student';
            await supabase.from('user_profiles').upsert([
              { id: session.user.id, name, email: session.user.email, created_at: new Date().toISOString() },
            ], { onConflict: 'id' });
          } catch (e) {
            console.warn('Failed to ensure user_profiles on auth change:', e);
          }
        } else {
          setUser(null);
          localStorage.removeItem('userRole');
        }
      }
    );

    return () => subscription?.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setError(null);
      // Sign up without email confirmation required
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
          emailRedirectTo: undefined, // No confirmation email redirect needed
        },
      });
      
      if (error) throw error;

      // Auto-sign in the user immediately after signup
      if (data.user) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (signInError) throw signInError;
      }
      // Ensure a user_profiles row exists for this user
      try {
        const { data: userData, error: userErr } = await supabase.auth.getUser();
        if (userErr) throw userErr;
        const authUser = userData?.user;
        if (authUser) {
          const nameFromMeta = authUser.user_metadata?.name || authUser.user_metadata?.full_name;
          const name = nameFromMeta || name || authUser.email || 'Student';
          await supabase.from('user_profiles').upsert([
            { id: authUser.id, name, email: authUser.email, created_at: new Date().toISOString() },
          ], { onConflict: 'id' });
        }
      } catch (e) {
        // non-fatal — auth succeeded, profile creation failed; profile may be created later
        console.warn('Failed to ensure user_profiles row:', e);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign up failed';
      setError(message);
      throw err;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        throw error;
      }
      // Ensure user_profiles exists for signed-in user
      try {
        const { data: userData, error: userErr } = await supabase.auth.getUser();
        if (userErr) throw userErr;
        const authUser = userData?.user;
        if (authUser) {
          const nameFromMeta = authUser.user_metadata?.name || authUser.user_metadata?.full_name;
          const name = nameFromMeta || authUser.email || 'Student';
          await supabase.from('user_profiles').upsert([
            { id: authUser.id, name, email: authUser.email, created_at: new Date().toISOString() },
          ], { onConflict: 'id' });
        }
      } catch (e) {
        console.warn('Failed to ensure user_profiles row on signIn:', e);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign in failed';
      setError(message);
      throw err;
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      localStorage.removeItem('userRole');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign out failed';
      setError(message);
      throw err;
    }
  };

  const setUserRole = (role: 'user' | 'admin') => {
    localStorage.setItem('userRole', role);
    if (user) {
      setUser({ ...user, role });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        signUp,
        signIn,
        signOut,
        setUserRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
