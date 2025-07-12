import React, { useState } from 'react';
import { Send, Bell, Users, AlertTriangle } from 'lucide-react';

interface PlatformMessage {
  id: string;
  title: string;
  message: string;
  type: 'announcement' | 'maintenance' | 'update' | 'alert';
  sentAt: string;
  recipients: 'all' | 'active' | 'admins';
}

export const PlatformMessages: React.FC = () => {
  const [messageType, setMessageType] = useState<PlatformMessage['type']>('announcement');
  const [recipients, setRecipients] = useState<PlatformMessage['recipients']>('all');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [sentMessages] = useState<PlatformMessage[]>([
    {
      id: '1',
      title: 'Welcome to SkillSwap 2.0!',
      message: 'We\'ve updated our platform with new features including improved search, better messaging, and enhanced user profiles.',
      type: 'update',
      sentAt: '2024-12-01T10:00:00Z',
      recipients: 'all',
    },
    {
      id: '2',
      title: 'Scheduled Maintenance',
      message: 'Our platform will be undergoing maintenance on December 15th from 2-4 AM PST. During this time, some features may be temporarily unavailable.',
      type: 'maintenance',
      sentAt: '2024-11-30T15:30:00Z',
      recipients: 'all',
    },
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !message.trim()) {
      alert('Please fill in both title and message');
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real app, this would make an API call
      console.log('Sending platform message:', {
        title,
        message,
        type: messageType,
        recipients,
      });

      alert('Platform message sent successfully!');
      setTitle('');
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMessageIcon = (type: PlatformMessage['type']) => {
    switch (type) {
      case 'announcement':
        return <Bell className="w-4 h-4 text-blue-500" />;
      case 'maintenance':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'update':
        return <Users className="w-4 h-4 text-green-500" />;
      case 'alert':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const getMessageTypeColor = (type: PlatformMessage['type']) => {
    switch (type) {
      case 'announcement':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'update':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'alert':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Platform Messages</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Send New Message */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h4 className="text-md font-semibold text-gray-900 mb-4">Send New Message</h4>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message Type
                </label>
                <select
                  value={messageType}
                  onChange={(e) => setMessageType(e.target.value as PlatformMessage['type'])}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="announcement">Announcement</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="update">Feature Update</option>
                  <option value="alert">Alert</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipients
                </label>
                <select
                  value={recipients}
                  onChange={(e) => setRecipients(e.target.value as PlatformMessage['recipients'])}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Users</option>
                  <option value="active">Active Users Only</option>
                  <option value="admins">Admins Only</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter message title..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                placeholder="Enter your message..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting ? (
                'Sending...'
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </>
              )}
            </button>
          </form>
        </div>

        {/* Message History */}
        <div>
          <h4 className="text-md font-semibold text-gray-900 mb-4">Recent Messages</h4>
          
          <div className="space-y-4">
            {sentMessages.map((msg) => (
              <div key={msg.id} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center">
                    {getMessageIcon(msg.type)}
                    <h5 className="ml-2 font-medium text-gray-900">{msg.title}</h5>
                  </div>
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getMessageTypeColor(msg.type)}`}>
                    {msg.type}
                  </div>
                </div>
                
                <p className="text-sm text-gray-700 mb-3">{msg.message}</p>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Sent to: {msg.recipients}</span>
                  <span>{new Date(msg.sentAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};