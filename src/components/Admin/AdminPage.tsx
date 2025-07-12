import React, { useState } from 'react';
import { Users, MessageSquare, TrendingUp, Download, Ban, AlertTriangle, CheckCircle, Eye } from 'lucide-react';
import { AdminStats } from '../../types';
import { mockUsers, mockSwapRequests, mockReviews } from '../../data/mockData';
import { UserManagement } from './UserManagement';
import { SwapMonitoring } from './SwapMonitoring';
import { PlatformMessages } from './PlatformMessages';
import { Reports } from './Reports';

export const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'swaps' | 'messages' | 'reports'>('overview');

  // Calculate admin stats
  const stats: AdminStats = {
    totalUsers: mockUsers.length,
    activeUsers: mockUsers.filter(u => u.isActive).length,
    totalSwaps: mockSwapRequests.length,
    pendingSwaps: mockSwapRequests.filter(s => s.status === 'pending').length,
    completedSwaps: mockSwapRequests.filter(s => s.status === 'completed').length,
    averageRating: mockReviews.length > 0 
      ? mockReviews.reduce((sum, r) => sum + r.rating, 0) / mockReviews.length 
      : 0,
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: TrendingUp },
    { id: 'users', name: 'User Management', icon: Users },
    { id: 'swaps', name: 'Swap Monitoring', icon: Eye },
    { id: 'messages', name: 'Platform Messages', icon: MessageSquare },
    { id: 'reports', name: 'Reports', icon: Download },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage users, monitor activities, and oversee platform operations</p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="flex border-b border-gray-200 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.name}
                </button>
              );
            })}
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div>
                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <Users className="w-8 h-8 text-blue-600" />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-blue-600">Total Users</p>
                        <p className="text-2xl font-bold text-blue-900">{stats.totalUsers}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-green-600">Active Users</p>
                        <p className="text-2xl font-bold text-green-900">{stats.activeUsers}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <TrendingUp className="w-8 h-8 text-purple-600" />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-purple-600">Total Swaps</p>
                        <p className="text-2xl font-bold text-purple-900">{stats.totalSwaps}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <AlertTriangle className="w-8 h-8 text-yellow-600" />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-yellow-600">Pending</p>
                        <p className="text-2xl font-bold text-yellow-900">{stats.pendingSwaps}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-teal-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <CheckCircle className="w-8 h-8 text-teal-600" />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-teal-600">Completed</p>
                        <p className="text-2xl font-bold text-teal-900">{stats.completedSwaps}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-orange-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <TrendingUp className="w-8 h-8 text-orange-600" />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-orange-600">Avg Rating</p>
                        <p className="text-2xl font-bold text-orange-900">{stats.averageRating.toFixed(1)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      <span className="text-gray-600">New user registration: Emma Wilson</span>
                      <span className="ml-auto text-gray-400">2 hours ago</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      <span className="text-gray-600">Swap completed: React ↔ UI/UX Design</span>
                      <span className="ml-auto text-gray-400">4 hours ago</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                      <span className="text-gray-600">New swap request pending approval</span>
                      <span className="ml-auto text-gray-400">6 hours ago</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && <UserManagement />}
            {activeTab === 'swaps' && <SwapMonitoring />}
            {activeTab === 'messages' && <PlatformMessages />}
            {activeTab === 'reports' && <Reports />}
          </div>
        </div>
      </div>
    </div>
  );
};