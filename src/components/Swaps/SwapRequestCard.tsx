import React from 'react';
import { CheckCircle, XCircle, Clock, MessageCircle } from 'lucide-react';
import { Swap } from '../../types';

interface SwapRequestCardProps {
  request: Swap;
  isReceived: boolean;
  currentUser: { id: string };
}

export const SwapRequestCard: React.FC<SwapRequestCardProps> = ({
  request,
  isReceived,
  currentUser,
}) => {
  const getStatusColor = (status: string) => {
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

  const getStatusIcon = (status: string) => {
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

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="font-semibold text-gray-900">
            {isReceived ? 'From User ID: ' + request.offered_by_user_id : 'To User ID: ' + request.requested_from_user_id}
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
              {request.skill_offered}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">
              {isReceived ? 'They want:' : 'You want:'}
            </p>
            <span className="inline-block px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-medium">
              {request.skill_requested}
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
        {isReceived ? 'Received' : 'Sent'} on {new Date(request.created_at).toLocaleDateString()}
        {request.updated_at !== request.created_at && (
          <span> • Updated {new Date(request.updated_at).toLocaleDateString()}</span>
        )}
      </div>
    </div>
  );
};