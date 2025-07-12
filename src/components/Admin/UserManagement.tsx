import React, { useState } from 'react';
import { Search, Ban, CheckCircle, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { mockUsers } from '../../data/mockData';
import { User } from '../../types';

export const UserManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'banned'>('all');
  const [users, setUsers] = useState(mockUsers);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && user.isActive) ||
                         (statusFilter === 'banned' && !user.isActive);
    
    return matchesSearch && matchesStatus && user.role !== 'admin';
  });

  const handleBanUser = (userId: string) => {
    if (confirm('Are you sure you want to ban this user?')) {
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, isActive: false } : user
      ));
    }
  };

  const handleUnbanUser = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, isActive: true } : user
    ));
  };

  const handleReviewProfile = (user: User) => {
    alert(`Reviewing profile for ${user.name}:\n\nSkills Offered: ${user.skillsOffered.join(', ')}\nSkills Wanted: ${user.skillsWanted.join(', ')}\n\nNo inappropriate content detected.`);
  };

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">User Management</h3>
        
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Users</option>
            <option value="active">Active Users</option>
            <option value="banned">Banned Users</option>
          </select>
        </div>

        {/* Users Table */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Skills
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {user.profilePhoto ? (
                          <img
                            src={user.profilePhoto}
                            alt={user.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                            <span className="text-gray-600 font-semibold text-sm">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                          <div className="text-xs text-gray-400">
                            Joined {new Date(user.joinedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="text-gray-900 mb-1">
                          <span className="font-medium">Offers:</span> {user.skillsOffered.slice(0, 2).join(', ')}
                          {user.skillsOffered.length > 2 && ` +${user.skillsOffered.length - 2}`}
                        </div>
                        <div className="text-gray-500">
                          <span className="font-medium">Wants:</span> {user.skillsWanted.slice(0, 2).join(', ')}
                          {user.skillsWanted.length > 2 && ` +${user.skillsWanted.length - 2}`}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.rating}/5</div>
                      <div className="text-xs text-gray-500">{user.reviewCount} reviews</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {user.isActive ? (
                          <>
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                            <span className="text-sm text-green-700">Active</span>
                          </>
                        ) : (
                          <>
                            <Ban className="w-4 h-4 text-red-500 mr-2" />
                            <span className="text-sm text-red-700">Banned</span>
                          </>
                        )}
                        {!user.isPublic && (
                          <EyeOff className="w-4 h-4 text-gray-400 ml-2" title="Private Profile" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleReviewProfile(user)}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                          title="Review Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        {user.isActive ? (
                          <button
                            onClick={() => handleBanUser(user.id)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                            title="Ban User"
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUnbanUser(user.id)}
                            className="text-green-600 hover:text-green-900 transition-colors"
                            title="Unban User"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredUsers.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-600">No users found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};