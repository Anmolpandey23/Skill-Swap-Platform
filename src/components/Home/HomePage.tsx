import React, { useState } from 'react';
import { Search, MapPin, Star, Users, TrendingUp, Award } from 'lucide-react';
import { mockUsers } from '../../data/mockData';
import { User } from '../../types';

interface HomePageProps {
  onPageChange: (page: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onPageChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const featuredUsers = mockUsers.filter(user => user.isPublic).slice(0, 3);
  const popularSkills = ['JavaScript', 'React', 'Python', 'UI/UX Design', 'Photography', 'Data Analysis'];
  
  const stats = [
    { label: 'Active Users', value: '1,200+', icon: Users },
    { label: 'Skills Available', value: '500+', icon: Award },
    { label: 'Successful Swaps', value: '3,400+', icon: TrendingUp },
  ];

  const filteredUsers = featuredUsers.filter(user =>
    user.skillsOffered.some(skill => 
      skill.toLowerCase().includes(searchQuery.toLowerCase())
    ) ||
    user.skillsWanted.some(skill => 
      skill.toLowerCase().includes(searchQuery.toLowerCase())
    ) ||
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-teal-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Exchange Skills,
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                Build Community
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Connect with skilled individuals in your area. Learn something new while sharing your expertise.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto bg-white rounded-full p-2 shadow-lg">
              <div className="flex items-center">
                <Search className="w-5 h-5 text-gray-400 ml-4" />
                <input
                  type="text"
                  placeholder="Search for skills like 'JavaScript', 'Photography', 'Cooking'..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-4 py-3 text-gray-900 bg-transparent focus:outline-none"
                />
                <button
                  onClick={() => onPageChange('browse')}
                  className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-colors font-medium"
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Popular Skills */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Skills</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover the most sought-after skills in our community
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3">
            {popularSkills.map((skill) => (
              <button
                key={skill}
                onClick={() => onPageChange('browse')}
                className="px-6 py-3 bg-white text-gray-700 rounded-full border border-gray-200 hover:border-blue-300 hover:text-blue-600 hover:shadow-md transition-all"
              >
                {skill}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Users */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Members</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Connect with these amazing skill sharers in our community
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(searchQuery ? filteredUsers : featuredUsers).map((user) => (
              <div
                key={user.id}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center mb-4">
                  {user.profilePhoto ? (
                    <img
                      src={user.profilePhoto}
                      alt={user.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-gray-600" />
                    </div>
                  )}
                  <div className="ml-3">
                    <h3 className="font-semibold text-gray-900">{user.name}</h3>
                    {user.location && (
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="w-3 h-3 mr-1" />
                        {user.location}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm font-medium">{user.rating}</span>
                    <span className="ml-1 text-sm text-gray-500">({user.reviewCount} reviews)</span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Skills Offered:</h4>
                  <div className="flex flex-wrap gap-1">
                    {user.skillsOffered.slice(0, 3).map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                    {user.skillsOffered.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{user.skillsOffered.length - 3}
                      </span>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={() => onPageChange('browse')}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  View Profile
                </button>
              </div>
            ))}
          </div>
          
          {searchQuery && filteredUsers.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-600">No users found for "{searchQuery}"</p>
            </div>
          )}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Swapping?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join our community of learners and teachers. Share your skills and discover new ones.
          </p>
          <button
            onClick={() => onPageChange('profile')}
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Complete Your Profile
          </button>
        </div>
      </div>
    </div>
  );
};