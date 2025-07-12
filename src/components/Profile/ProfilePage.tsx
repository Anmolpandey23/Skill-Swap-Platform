import React, { useState } from 'react';
import { Camera, MapPin, Clock, Eye, EyeOff, Save, Plus, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    location: user?.location || '',
    skillsOffered: user?.skillsOffered || [],
    skillsWanted: user?.skillsWanted || [],
    availability: user?.availability || [],
    isPublic: user?.isPublic ?? true,
  });

  const [newSkillOffered, setNewSkillOffered] = useState('');
  const [newSkillWanted, setNewSkillWanted] = useState('');
  const [newAvailability, setNewAvailability] = useState('');

  const availabilityOptions = ['Weekends', 'Weekdays', 'Evenings', 'Mornings'];

  const handleSave = () => {
    updateUser(formData);
    setIsEditing(false);
  };

  const addSkillOffered = () => {
    if (newSkillOffered.trim() && !formData.skillsOffered.includes(newSkillOffered.trim())) {
      setFormData(prev => ({
        ...prev,
        skillsOffered: [...prev.skillsOffered, newSkillOffered.trim()]
      }));
      setNewSkillOffered('');
    }
  };

  const removeSkillOffered = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skillsOffered: prev.skillsOffered.filter(s => s !== skill)
    }));
  };

  const addSkillWanted = () => {
    if (newSkillWanted.trim() && !formData.skillsWanted.includes(newSkillWanted.trim())) {
      setFormData(prev => ({
        ...prev,
        skillsWanted: [...prev.skillsWanted, newSkillWanted.trim()]
      }));
      setNewSkillWanted('');
    }
  };

  const removeSkillWanted = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skillsWanted: prev.skillsWanted.filter(s => s !== skill)
    }));
  };

  const toggleAvailability = (availability: string) => {
    setFormData(prev => ({
      ...prev,
      availability: prev.availability.includes(availability)
        ? prev.availability.filter(a => a !== availability)
        : [...prev.availability, availability]
    }));
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {isEditing ? (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            ) : (
              <>
                <Camera className="w-4 h-4 mr-2" />
                Edit Profile
              </>
            )}
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-500 to-teal-500 px-6 py-8">
            <div className="flex items-center">
              {user.profilePhoto ? (
                <img
                  src={user.profilePhoto}
                  alt={user.name}
                  className="w-20 h-20 rounded-full object-cover border-4 border-white"
                />
              ) : (
                <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center border-4 border-white">
                  <span className="text-white font-bold text-2xl">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div className="ml-6 text-white">
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="text-2xl font-bold bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg px-3 py-2 text-white placeholder-white placeholder-opacity-70"
                    placeholder="Your name"
                  />
                ) : (
                  <h2 className="text-2xl font-bold">{user.name}</h2>
                )}
                <div className="flex items-center mt-2">
                  <MapPin className="w-4 h-4 mr-1" />
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      className="bg-white bg-opacity-20 border border-white border-opacity-30 rounded px-2 py-1 text-white placeholder-white placeholder-opacity-70"
                      placeholder="Your location"
                    />
                  ) : (
                    <span>{user.location || 'Location not set'}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Profile Visibility */}
            <div className="mb-8">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  {formData.isPublic ? (
                    <Eye className="w-5 h-5 text-green-600 mr-3" />
                  ) : (
                    <EyeOff className="w-5 h-5 text-gray-400 mr-3" />
                  )}
                  <div>
                    <h3 className="font-medium text-gray-900">Profile Visibility</h3>
                    <p className="text-sm text-gray-600">
                      {formData.isPublic ? 'Your profile is public and visible to others' : 'Your profile is private'}
                    </p>
                  </div>
                </div>
                {isEditing && (
                  <button
                    onClick={() => setFormData(prev => ({ ...prev, isPublic: !prev.isPublic }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      formData.isPublic ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.isPublic ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                )}
              </div>
            </div>

            {/* Skills Offered */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills I Offer</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {formData.skillsOffered.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                  >
                    {skill}
                    {isEditing && (
                      <button
                        onClick={() => removeSkillOffered(skill)}
                        className="ml-2 text-blue-500 hover:text-blue-700"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </span>
                ))}
              </div>
              {isEditing && (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newSkillOffered}
                    onChange={(e) => setNewSkillOffered(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addSkillOffered()}
                    placeholder="Add a skill you can offer"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={addSkillOffered}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Skills Wanted */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills I Want to Learn</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {formData.skillsWanted.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-medium"
                  >
                    {skill}
                    {isEditing && (
                      <button
                        onClick={() => removeSkillWanted(skill)}
                        className="ml-2 text-teal-500 hover:text-teal-700"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </span>
                ))}
              </div>
              {isEditing && (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newSkillWanted}
                    onChange={(e) => setNewSkillWanted(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addSkillWanted()}
                    placeholder="Add a skill you want to learn"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <button
                    onClick={addSkillWanted}
                    className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Availability */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Availability
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {availabilityOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => isEditing && toggleAvailability(option)}
                    disabled={!isEditing}
                    className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                      formData.availability.includes(option)
                        ? 'bg-orange-100 border-orange-300 text-orange-700'
                        : 'bg-gray-50 border-gray-200 text-gray-600'
                    } ${isEditing ? 'hover:bg-orange-50 cursor-pointer' : 'cursor-default'}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-6 border-t border-gray-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{user.rating}</div>
                <div className="text-sm text-gray-600">Average Rating</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-teal-600">{user.reviewCount}</div>
                <div className="text-sm text-gray-600">Total Reviews</div>
              </div>
              <div className="text-center md:col-span-1 col-span-2">
                <div className="text-2xl font-bold text-orange-600">
                  {new Date(user.joinedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </div>
                <div className="text-sm text-gray-600">Member Since</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};