import React, { useState, useMemo } from 'react';
import { Search, MapPin, Star, Users, Filter, X } from 'lucide-react';
import { mockUsers } from '../../data/mockData';
import { UserCard } from './UserCard';
import { SwapRequestModal } from '../Swaps/SwapRequestModal';
import { User } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

interface BrowsePageProps {
  currentUser?: User;
}

export const BrowsePage: React.FC<BrowsePageProps> = ({ currentUser }) => {
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showSwapModal, setShowSwapModal] = useState(false);

  const filteredUsers = useMemo(() => {
    return mockUsers.filter(user => {
      if (!user.isPublic || (currentUser && user.id === currentUser.id)) return false;

      const matchesSearch = !searchQuery || 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.skillsOffered.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
        user.skillsWanted.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesLocation = !locationFilter || 
        (user.location && user.location.toLowerCase().includes(locationFilter.toLowerCase()));

      const matchesSkill = !skillFilter ||
        user.skillsOffered.some(skill => skill.toLowerCase().includes(skillFilter.toLowerCase()));

      const matchesAvailability = !availabilityFilter ||
        user.availability.some(avail => avail.toLowerCase().includes(availabilityFilter.toLowerCase()));

      return matchesSearch && matchesLocation && matchesSkill && matchesAvailability;
    });
  }, [searchQuery, locationFilter, skillFilter, availabilityFilter, currentUser?.id]);

  const allSkills = useMemo(() => {
    const skills = new Set<string>();
    mockUsers.forEach(user => {
      user.skillsOffered.forEach(skill => skills.add(skill));
    });
    return Array.from(skills).sort();
  }, []);

  const allAvailability = ['Weekends', 'Weekdays', 'Evenings', 'Mornings'];

  const handleRequestSwap = (user: User) => {
    if (!isAuthenticated || !currentUser) {
      alert('Please login to request a skill swap');
      return;
    }
    setSelectedUser(user);
    setShowSwapModal(true);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setLocationFilter('');
    setSkillFilter('');
    setAvailabilityFilter('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Skills</h1>
          <p className="text-gray-600">Discover amazing people and their skills in our community</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          {/* Main Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, skills offered, or skills wanted..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filter Toggle */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            >
              <Filter className="w-4 h-4 mr-2" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
            
            {(locationFilter || skillFilter || availabilityFilter) && (
              <button
                onClick={clearFilters}
                className="flex items-center text-red-600 hover:text-red-700 transition-colors"
              >
                <X className="w-4 h-4 mr-1" />
                Clear Filters
              </button>
            )}
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  placeholder="Enter location..."
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Skill</label>
                <select
                  value={skillFilter}
                  onChange={(e) => setSkillFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Skills</option>
                  {allSkills.map(skill => (
                    <option key={skill} value={skill}>{skill}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
                <select
                  value={availabilityFilter}
                  onChange={(e) => setAvailabilityFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Any Time</option>
                  {allAvailability.map(avail => (
                    <option key={avail} value={avail}>{avail}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="mb-4">
          <p className="text-gray-600">
            Found {filteredUsers.length} {filteredUsers.length === 1 ? 'person' : 'people'}
          </p>
        </div>

        {/* User Grid */}
        {filteredUsers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map(user => (
              <UserCard
                key={user.id}
                user={user}
                onRequestSwap={handleRequestSwap}
                isAuthenticated={isAuthenticated}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search criteria or filters</p>
            <button
              onClick={clearFilters}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Swap Request Modal */}
      {showSwapModal && selectedUser && currentUser && (
        <SwapRequestModal
          targetUser={selectedUser}
          currentUser={currentUser}
          onClose={() => {
            setShowSwapModal(false);
            setSelectedUser(null);
          }}
        />
      )}
    </div>
  );
};