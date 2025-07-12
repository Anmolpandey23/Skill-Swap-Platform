export interface User {
  id: string;
  name: string;
  email: string;
  location?: string;
  profilePhoto?: string;
  skillsOffered: string[];
  skillsWanted: string[];
  availability: string[];
  isPublic: boolean;
  role: 'user' | 'admin';
  rating: number;
  reviewCount: number;
  joinedAt: string;
  isActive: boolean;
}

export interface SwapRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  fromUser: User;
  toUser: User;
  offeredSkill: string;
  requestedSkill: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
  message: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  swapRequestId: string;
  reviewerId: string;
  revieweeId: string;
  reviewer: User;
  reviewee: User;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalSwaps: number;
  pendingSwaps: number;
  completedSwaps: number;
  averageRating: number;
}

export interface Swap {
  id: string;
  offered_by_user_id: string;
  requested_from_user_id: string;
  skill_offered: string;
  skill_requested: string;
  message: string;
  status: string;
  created_at: string;
  updated_at: string;
}