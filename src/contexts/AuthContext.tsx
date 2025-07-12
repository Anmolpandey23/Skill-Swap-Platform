import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '../types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updatedUser: Partial<User>) => void;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Backend API configuration
const API_BASE_URL = 'http://localhost:3001/api/auth';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing session on app load
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          const user = transformSupabaseUser(data.user);
          setAuthState({ user, isAuthenticated: true });
        } else {
          // Token is invalid, clear it
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      } finally {
        setLoading(false);
      }
    }
  };

  const transformSupabaseUser = (supabaseUser: any): User => {
    return {
      id: supabaseUser.id,
      name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'User',
      email: supabaseUser.email,
      location: supabaseUser.user_metadata?.location || '',
      profilePhoto: supabaseUser.user_metadata?.profilePhoto || '',
      skillsOffered: supabaseUser.user_metadata?.skillsOffered || [],
      skillsWanted: supabaseUser.user_metadata?.skillsWanted || [],
      availability: supabaseUser.user_metadata?.availability || [],
      isPublic: supabaseUser.user_metadata?.isPublic !== false,
      role: supabaseUser.user_metadata?.role || 'user',
      rating: supabaseUser.user_metadata?.rating || 0,
      reviewCount: supabaseUser.user_metadata?.reviewCount || 0,
      joinedAt: supabaseUser.user_metadata?.joinedAt || new Date().toISOString().split('T')[0],
      isActive: true,
    };
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const user = transformSupabaseUser(data.user);
        setAuthState({ user, isAuthenticated: true });
        
        // Store tokens
        if (data.session?.access_token) {
          localStorage.setItem('accessToken', data.session.access_token);
        }
        if (data.session?.refresh_token) {
          localStorage.setItem('refreshToken', data.session.refresh_token);
        }
        
        return true;
      } else {
        setError(data.error || 'Login failed');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          user_metadata: {
            name,
            joinedAt: new Date().toISOString().split('T')[0],
            role: 'user',
            isPublic: true,
          },
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const user = transformSupabaseUser(data.user);
        setAuthState({ user, isAuthenticated: true });
        
        // Store tokens if session is available
        if (data.session?.access_token) {
          localStorage.setItem('accessToken', data.session.access_token);
        }
        if (data.session?.refresh_token) {
          localStorage.setItem('refreshToken', data.session.refresh_token);
        }
        
        return true;
      } else {
        setError(data.error || 'Registration failed');
        return false;
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('Network error. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        await fetch(`${API_BASE_URL}/signout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setAuthState({ user: null, isAuthenticated: false });
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setError(null);
    }
  };

  const updateUser = async (updatedUser: Partial<User>) => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('No authentication token found');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_metadata: updatedUser,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const user = transformSupabaseUser(data.user);
        setAuthState({ ...authState, user });
      } else {
        setError(data.error || 'Profile update failed');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        register,
        logout,
        updateUser,
        loading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};