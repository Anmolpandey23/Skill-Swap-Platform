import React from 'react';
import { MapPin, Star, Clock, Send } from 'lucide-react';
import { User } from '../../types';

interface UserCardProps {
  user: User;
  onRequestSwap: (user: User) => void;
  isAuthenticated: boolean;
}

export const UserCard: React.FC<UserCardProps> = ({ user, onRequestSwap, isAuthenticated }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200">
      {/* User Header */}
      <div className="flex items-center mb-4">
        {user.profilePhoto ? (
          <img
            src={user.profilePhoto}
            alt={user.name}
            className="w-14 h-14 rounded-full object-cover"
          />
        ) : (
          <div className="w-14 h-14 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-gray-600 font-semibold text-lg">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div className="ml-4 flex-1">
          <h3 className="font-semibold text-gray-900 text-lg">{user.name}</h3>
          {user.location && (
            <div className="flex items-center text-gray-500 text-sm mt-1">
              <MapPin className="w-3 h-3 mr-1" />
              {user.location}
            </div>
          )}
          <div className="flex items-center mt-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="ml-1 text-sm font-medium text-gray-700">{user.rating}</span>
            <span className="ml-1 text-sm text-gray-500">({user.reviewCount} reviews)</span>
          </div>
        </div>
      </div>

      {/* Skills Offered */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Skills Offered:</h4>
        <div className="flex flex-wrap gap-1">
          {user.skillsOffered.slice(0, 3).map((skill) => (
            <span
              key={skill}
              className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium"
            >
              {skill}
            </span>
          ))}
          {user.skillsOffered.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              +{user.skillsOffered.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Skills Wanted */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Skills Wanted:</h4>
        <div className="flex flex-wrap gap-1">
          {user.skillsWanted.slice(0, 3).map((skill) => (
            <span
              key={skill}
              className="px-2 py-1 bg-teal-100 text-teal-700 text-xs rounded-full font-medium"
            >
              {skill}
            </span>
          ))}
          {user.skillsWanted.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              +{user.skillsWanted.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Availability */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Available:</h4>
        <div className="flex items-center text-gray-600 text-sm">
          <Clock className="w-4 h-4 mr-1" />
          {user.availability.join(', ') || 'Not specified'}
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={() => onRequestSwap(user)}
        className={`w-full py-2 px-4 rounded-lg transition-all font-medium flex items-center justify-center ${
          isAuthenticated
            ? 'bg-gradient-to-r from-blue-500 to-teal-500 text-white hover:from-blue-600 hover:to-teal-600'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
        disabled={!isAuthenticated}
      >
        <Send className="w-4 h-4 mr-2" />
        {isAuthenticated ? 'Request Swap' : 'Login to Request'}
      </button>
    </div>
  );
};