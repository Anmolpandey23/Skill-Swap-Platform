import React, { useState, useMemo, useEffect } from 'react';
import { Send, Inbox, CheckCircle, XCircle, Clock, Filter } from 'lucide-react';
import { SwapRequestCard } from './SwapRequestCard';
import { useAuth } from '../../contexts/AuthContext';
import { apiService, Swap } from '../../services/api';

export const SwapsPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [swaps, setSwaps] = useState<Swap[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSwaps = async () => {
      if (!user) return;
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) throw new Error('Not authenticated');
        const { swaps } = await apiService.getSwaps(token);
        setSwaps(swaps);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch swaps');
      } finally {
        setLoading(false);
      }
    };
    fetchSwaps();
  }, [user]);

  const receivedRequests = useMemo(() =>
    swaps.filter(s => s.requested_from_user_id === user?.id),
    [swaps, user]
  );
  const sentRequests = useMemo(() =>
    swaps.filter(s => s.offered_by_user_id === user?.id),
    [swaps, user]
  );

  const filteredRequests = useMemo(() => {
    const requests = activeTab === 'received' ? receivedRequests : sentRequests;
    if (statusFilter === 'all') return requests;
    return requests.filter(request => request.status === statusFilter);
  }, [activeTab, receivedRequests, sentRequests, statusFilter]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'accepted':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-gray-500" />;
      default:
        return null;
    }
  };

  const getStatusCounts = (requests: Swap[]) => {
    return {
      pending: requests.filter(r => r.status === 'pending').length,
      accepted: requests.filter(r => r.status === 'accepted').length,
      completed: requests.filter(r => r.status === 'completed').length,
      rejected: requests.filter(r => r.status === 'rejected').length,
    };
  };

  const receivedCounts = getStatusCounts(receivedRequests);
  const sentCounts = getStatusCounts(sentRequests);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Swaps</h1>
          <p className="text-gray-600">Manage your skill exchange requests and offers</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-yellow-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(receivedCounts.pending + sentCounts.pending)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Accepted</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(receivedCounts.accepted + sentCounts.accepted)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-blue-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(receivedCounts.completed + sentCounts.completed)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center">
              <XCircle className="w-8 h-8 text-red-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(receivedCounts.rejected + sentCounts.rejected)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('received')}
              className={`flex items-center px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'received'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Inbox className="w-4 h-4 mr-2" />
              Received Requests ({receivedRequests.length})
            </button>
            <button
              onClick={() => setActiveTab('sent')}
              className={`flex items-center px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'sent'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Send className="w-4 h-4 mr-2" />
              Sent Requests ({sentRequests.length})
            </button>
          </div>

          {/* Filters */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="completed">Completed</option>
                <option value="rejected">Rejected</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Request List */}
          <div className="p-6">
            {loading ? (
              <div className="text-center py-12 text-gray-500">Loading swaps...</div>
            ) : error ? (
              <div className="text-center py-12 text-red-500">{error}</div>
            ) : filteredRequests.length > 0 ? (
              <div className="space-y-4">
                {filteredRequests.map((request) => (
                  <SwapRequestCard
                    key={request.id}
                    request={request}
                    isReceived={activeTab === 'received'}
                    currentUser={user!}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  {activeTab === 'received' ? (
                    <Inbox className="w-8 h-8 text-gray-400" />
                  ) : (
                    <Send className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No {statusFilter === 'all' ? '' : statusFilter} requests
                </h3>
                <p className="text-gray-600">
                  {activeTab === 'received'
                    ? 'You haven\'t received any swap requests yet.'
                    : 'You haven\'t sent any swap requests yet.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};