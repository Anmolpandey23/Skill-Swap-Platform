import React, { useState } from 'react';
import { CheckCircle, XCircle, Clock, Star, Trash2, MessageCircle } from 'lucide-react';
import { SwapRequest, User } from '../../types';
import { ReviewModal } from './ReviewModal';

interface SwapRequestCardProps {
  request: SwapRequest;
  isReceived: boolean;
  currentUser: User;
}

export const SwapRequestCard: React.FC<SwapRequestCardProps> = ({
  request,
  isReceived,
  currentUser,
}) => {
  const [showReviewModal, setShowReviewModal] = useState(false);
  const otherUser = isReceived ? request.fromUser : request.toUser;

  const getStatusColor = (status: SwapRequest['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'accepted':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: SwapRequest['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'accepted':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const handleAccept = () => {
    // In a real app, this would make an API call
    console.log('Accepting request:', request.id);
  };

  const handleReject = () => {
    // In a real app, this would make an API call
    console.log('Rejecting request:', request.id);
  };

  const handleDelete = () => {
    // In a real app, this would make an API call
    console.log('Deleting request:', request.id);
  };

  const handleMarkCompleted = () => {
    // In a real app, this would make an API call
    console.log('Marking as completed:', request.id);
    setShowReviewModal(true);
  };

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            {otherUser.profilePhoto ? (
              <img
                src={otherUser.profilePhoto}
                alt={otherUser.name}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-600 font-semibold">
                  {otherUser.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div className="ml-4">
              <h3 className="font-semibold text-gray-900">{otherUser.name}</h3>
              <div className="flex items-center text-sm text-gray-500">
                <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                {otherUser.rating} ({otherUser.reviewCount} reviews)
              </div>
            </div>
          </div>
          
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
            {getStatusIcon(request.status)}
            <span className="ml-1 capitalize">{request.status}</span>
          </div>
        </div>

        {/* Skills Exchange */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                {isReceived ? 'They offer:' : 'You offer:'}
              </p>
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                {request.offeredSkill}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                {isReceived ? 'They want:' : 'You want:'}
              </p>
              <span className="inline-block px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-medium">
                {request.requestedSkill}
              </span>
            </div>
          </div>
        </div>

        {/* Message */}
        {request.message && (
          <div className="mb-4">
            <div className="flex items-start">
              <MessageCircle className="w-4 h-4 text-gray-400 mt-1 mr-2 flex-shrink-0" />
              <p className="text-gray-700 text-sm italic">"{request.message}"</p>
            </div>
          </div>
        )}

        {/* Timestamp */}
        <div className="text-xs text-gray-500 mb-4">
          {isReceived ? 'Received' : 'Sent'} on {new Date(request.createdAt).toLocaleDateString()}
          {request.updatedAt !== request.createdAt && (
            <span> • Updated {new Date(request.updatedAt).toLocaleDateString()}</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex space-x-3">
          {isReceived && request.status === 'pending' && (
            <>
              <button
                onClick={handleAccept}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Accept
              </button>
              <button
                onClick={handleReject}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
              >
                <XCircle className="w-4 h-4 mr-1" />
                Reject
              </button>
            </>
          )}

          {!isReceived && request.status === 'pending' && (
            <button
              onClick={handleDelete}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Cancel Request
            </button>
          )}

          {request.status === 'accepted' && (
            <button
              onClick={handleMarkCompleted}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              <CheckCircle className="w-4 h-4 mr-1" />
              Mark as Completed
            </button>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <ReviewModal
          request={request}
          otherUser={otherUser}
          onClose={() => setShowReviewModal(false)}
        />
      )}
    </>
  );
};