import React, { useState } from 'react';
import { X, Send, ArrowRight } from 'lucide-react';
import { User } from '../../types';

interface SwapRequestModalProps {
  targetUser: User;
  currentUser: User;
  onClose: () => void;
}

export const SwapRequestModal: React.FC<SwapRequestModalProps> = ({
  targetUser,
  currentUser,
  onClose,
}) => {
  const [selectedOfferedSkill, setSelectedOfferedSkill] = useState('');
  const [selectedWantedSkill, setSelectedWantedSkill] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Find skills that match between users
  const matchingSkills = currentUser.skillsOffered.filter(skill =>
    targetUser.skillsWanted.includes(skill)
  );
  
  const wantedSkills = targetUser.skillsOffered.filter(skill =>
    currentUser.skillsWanted.includes(skill)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedOfferedSkill || !selectedWantedSkill) {
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real app, this would make an API call
      console.log('Creating swap request:', {
        fromUserId: currentUser.id,
        toUserId: targetUser.id,
        offeredSkill: selectedOfferedSkill,
        requestedSkill: selectedWantedSkill,
        message,
      });

      // Show success message
      alert('Swap request sent successfully!');
      onClose();
    } catch (error) {
      console.error('Error creating swap request:', error);
      alert('Failed to send swap request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Request Skill Swap</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* User Info */}
        <div className="p-6 bg-gray-50">
          <div className="flex items-center">
            {targetUser.profilePhoto ? (
              <img
                src={targetUser.profilePhoto}
                alt={targetUser.name}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-600 font-bold text-xl">
                  {targetUser.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">{targetUser.name}</h3>
              <p className="text-gray-600">{targetUser.location}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Skill Exchange Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Your Offered Skill */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skill You'll Offer
              </label>
              <select
                value={selectedOfferedSkill}
                onChange={(e) => setSelectedOfferedSkill(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a skill to offer</option>
                {currentUser.skillsOffered.map((skill) => (
                  <option key={skill} value={skill}>
                    {skill}
                    {matchingSkills.includes(skill) && ' ⭐ (They want this!)'}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Skills marked with ⭐ are specifically wanted by {targetUser.name}
              </p>
            </div>

            {/* Skill You Want */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skill You Want to Learn
              </label>
              <select
                value={selectedWantedSkill}
                onChange={(e) => setSelectedWantedSkill(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a skill to learn</option>
                {targetUser.skillsOffered.map((skill) => (
                  <option key={skill} value={skill}>
                    {skill}
                    {wantedSkills.includes(skill) && ' ⭐ (Perfect match!)'}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Skills marked with ⭐ are on your wanted list
              </p>
            </div>
          </div>

          {/* Exchange Preview */}
          {selectedOfferedSkill && selectedWantedSkill && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <div className="text-sm text-gray-600">You teach</div>
                  <div className="font-semibold text-blue-700">{selectedOfferedSkill}</div>
                </div>
                <ArrowRight className="w-6 h-6 text-blue-500 mx-4" />
                <div className="text-center">
                  <div className="text-sm text-gray-600">You learn</div>
                  <div className="font-semibold text-blue-700">{selectedWantedSkill}</div>
                </div>
              </div>
            </div>
          )}

          {/* Message */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message (Optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              placeholder={`Hi ${targetUser.name}! I'd love to learn ${selectedWantedSkill || '[skill]'} from you in exchange for ${selectedOfferedSkill || '[skill]'} lessons. Let me know if you're interested!`}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Availability Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Availability</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Your availability:</span>
                <div className="text-gray-900">
                  {currentUser.availability.length > 0 
                    ? currentUser.availability.join(', ')
                    : 'Not specified'
                  }
                </div>
              </div>
              <div>
                <span className="text-gray-600">{targetUser.name}'s availability:</span>
                <div className="text-gray-900">
                  {targetUser.availability.length > 0 
                    ? targetUser.availability.join(', ')
                    : 'Not specified'
                  }
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedOfferedSkill || !selectedWantedSkill || isSubmitting}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting ? (
                'Sending...'
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Request
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};