import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { QuotaManager } from '../utils/quotaManager';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user from localStorage on app start
    loadCurrentUser();
  }, []);

  const loadCurrentUser = () => {
    try {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        
        // Check and reset quota if needed
        const updatedUser = QuotaManager.resetUserQuotaIfNeeded(userData);
        
        if (updatedUser !== userData) {
          // Update localStorage if quota was reset
          localStorage.setItem('currentUser', JSON.stringify(updatedUser));
          
          // Also update in users array
          const users = JSON.parse(localStorage.getItem('users') || '[]');
          const userIndex = users.findIndex((u: User) => u.id === updatedUser.id);
          if (userIndex !== -1) {
            users[userIndex] = updatedUser;
            localStorage.setItem('users', JSON.stringify(users));
          }
        }
        
        setUser(updatedUser);
      }
    } catch (error) {
      console.error('Error loading current user:', error);
      localStorage.removeItem('currentUser');
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      // Check if user already exists
      const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
      const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (existingUser) {
        throw new Error('Email already registered');
      }

      // Create new user
      const newUser: User = {
        id: `user-${Date.now()}`,
        email: email.toLowerCase(),
        name: name.trim(),
        role: 'basic',
        request_quota: 3,
        used_quota: 0,
        created_at: new Date().toISOString(),
        quota_reset_date: new Date().toISOString(),
        next_quota_reset: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString(),
        claimedPrompts: [],
        favoritePrompts: [],
        // Computed properties
        requestQuota: 3,
        usedQuota: 0,
        createdAt: new Date().toISOString(),
        quotaResetDate: new Date().toISOString(),
        nextQuotaReset: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString()
      };

      // Add to users array
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      // Set as current user
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      setUser(newUser);
      
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Find user in localStorage
      const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
      const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (!foundUser) {
        throw new Error('Invalid email or password');
      }

      // For demo purposes, we'll accept specific passwords
      const validPasswords = ['demo123', 'admin123', 'password'];
      if (!validPasswords.includes(password)) {
        throw new Error('Invalid email or password');
      }

      // Check and reset quota if needed
      const updatedUser = QuotaManager.resetUserQuotaIfNeeded(foundUser);
      
      if (updatedUser !== foundUser) {
        // Update in users array
        const userIndex = users.findIndex(u => u.id === foundUser.id);
        if (userIndex !== -1) {
          users[userIndex] = updatedUser;
          localStorage.setItem('users', JSON.stringify(users));
        }
      }

      // Set as current user
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      localStorage.removeItem('currentUser');
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = (updates: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...updates };
    
    // Update current user
    setUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    // Update in users array
    try {
      const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex(u => u.id === user.id);
      if (userIndex !== -1) {
        users[userIndex] = updatedUser;
        localStorage.setItem('users', JSON.stringify(users));
      }
    } catch (error) {
      console.error('Error updating user in storage:', error);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signUp,
      signIn,
      signOut,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};