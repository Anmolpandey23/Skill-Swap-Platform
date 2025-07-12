import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '../types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updatedUser: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    location: 'San Francisco, CA',
    profilePhoto: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
    skillsOffered: ['JavaScript', 'React', 'Node.js'],
    skillsWanted: ['Python', 'Machine Learning', 'Data Analysis'],
    availability: ['Weekends', 'Evenings'],
    isPublic: true,
    role: 'user',
    rating: 4.8,
    reviewCount: 12,
    joinedAt: '2024-01-15',
    isActive: true,
  },
  {
    id: '2',
    name: 'Sarah Chen',
    email: 'sarah@example.com',
    location: 'New York, NY',
    profilePhoto: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
    skillsOffered: ['Photoshop', 'UI/UX Design', 'Figma'],
    skillsWanted: ['Photography', 'Video Editing'],
    availability: ['Weekdays', 'Evenings'],
    isPublic: true,
    role: 'user',
    rating: 4.9,
    reviewCount: 8,
    joinedAt: '2024-02-20',
    isActive: true,
  },
  {
    id: 'admin',
    name: 'Admin User',
    email: 'admin@skillswap.com',
    location: 'Remote',
    skillsOffered: [],
    skillsWanted: [],
    availability: [],
    isPublic: false,
    role: 'admin',
    rating: 0,
    reviewCount: 0,
    joinedAt: '2024-01-01',
    isActive: true,
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setAuthState({
        user: JSON.parse(savedUser),
        isAuthenticated: true,
      });
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication
    const user = mockUsers.find(u => u.email === email);
    if (user && password === 'password') {
      setAuthState({ user, isAuthenticated: true });
      localStorage.setItem('currentUser', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) {
      return false;
    }

    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      skillsOffered: [],
      skillsWanted: [],
      availability: [],
      isPublic: true,
      role: 'user',
      rating: 0,
      reviewCount: 0,
      joinedAt: new Date().toISOString().split('T')[0],
      isActive: true,
    };

    mockUsers.push(newUser);
    setAuthState({ user: newUser, isAuthenticated: true });
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setAuthState({ user: null, isAuthenticated: false });
    localStorage.removeItem('currentUser');
  };

  const updateUser = (updatedUser: Partial<User>) => {
    if (authState.user) {
      const updated = { ...authState.user, ...updatedUser };
      setAuthState({ ...authState, user: updated });
      localStorage.setItem('currentUser', JSON.stringify(updated));
      
      // Update in mock data
      const userIndex = mockUsers.findIndex(u => u.id === updated.id);
      if (userIndex !== -1) {
        mockUsers[userIndex] = updated;
      }
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};