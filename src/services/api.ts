// API service for backend communication
const API_BASE_URL = 'http://localhost:3001/api/auth';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  user_metadata: {
    name: string;
    joinedAt: string;
    role: string;
    isPublic: boolean;
  };
}

export interface AuthResponse {
  message: string;
  user: any;
  session?: {
    access_token: string;
    refresh_token: string;
  };
}

export interface UserResponse {
  user: any;
}

export interface ErrorResponse {
  error: string;
}

export interface CreateSwapRequest {
  requested_from_user_id: string;
  skill_offered: string;
  skill_requested: string;
  message?: string;
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

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'API request failed');
    }

    return data;
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/signin', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout(token: string): Promise<{ message: string }> {
    return this.request<{ message: string }>('/signout', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async getCurrentUser(token: string): Promise<UserResponse> {
    return this.request<UserResponse>('/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async updateProfile(
    token: string,
    userMetadata: any
  ): Promise<AuthResponse> {
    return this.request<AuthResponse>('/profile', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ user_metadata: userMetadata }),
    });
  }

  async refreshToken(refreshToken: string): Promise<{ session: any }> {
    return this.request<{ session: any }>('/refresh', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
  }

  async resetPassword(email: string): Promise<{ message: string }> {
    return this.request<{ message: string }>('/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async createSwap(token: string, swap: CreateSwapRequest): Promise<{ message: string; swap: Swap }> {
    const response = await fetch('http://localhost:3001/api/swaps', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(swap),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to create swap');
    return data;
  }

  async getSwaps(token: string): Promise<{ swaps: Swap[] }> {
    const response = await fetch('http://localhost:3001/api/swaps', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to fetch swaps');
    return data;
  }
}

export const apiService = new ApiService(); 