import React, { useState } from 'react';
import { Download, TrendingUp, Users, Star, Calendar } from 'lucide-react';
import { mockUsers, mockSwapRequests, mockReviews } from '../../data/mockData';

type ReportType = 'user-activity' | 'swap-stats' | 'feedback-logs' | 'platform-analytics';

export const Reports: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState<ReportType>('user-activity');
  const [dateRange, setDateRange] = useState('last-30-days');

  const reportTypes = [
    { id: 'user-activity', name: 'User Activity', icon: Users },
    { id: 'swap-stats', name: 'Swap Statistics', icon: TrendingUp },
    { id: 'feedback-logs', name: 'Feedback Logs', icon: Star },
    { id: 'platform-analytics', name: 'Platform Analytics', icon: Calendar },
  ];

  const handleDownloadReport = (reportType: ReportType) => {
    // In a real app, this would generate and download actual reports
    const reportData = generateReportData(reportType);
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportType}-${dateRange}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateReportData = (reportType: ReportType) => {
    switch (reportType) {
      case 'user-activity':
        return {
          report_type: 'User Activity Report',
          date_range: dateRange,
          generated_at: new Date().toISOString(),
          data: {
            total_users: mockUsers.length,
            active_users: mockUsers.filter(u => u.isActive).length,
            new_registrations: mockUsers.filter(u => 
              new Date(u.joinedAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            ).length,
            users_by_skills: mockUsers.reduce((acc, user) => {
              user.skillsOffered.forEach(skill => {
                acc[skill] = (acc[skill] || 0) + 1;
              });
              return acc;
            }, {} as Record<string, number>),
          }
        };
      
      case 'swap-stats':
        return {
          report_type: 'Swap Statistics Report',
          date_range: dateRange,
          generated_at: new Date().toISOString(),
          data: {
            total_swaps: mockSwapRequests.length,
            pending_swaps: mockSwapRequests.filter(s => s.status === 'pending').length,
            completed_swaps: mockSwapRequests.filter(s => s.status === 'completed').length,
            success_rate: (mockSwapRequests.filter(s => s.status === 'completed').length / mockSwapRequests.length * 100).toFixed(2) + '%',
            popular_skills: mockSwapRequests.reduce((acc, swap) => {
              acc[swap.offeredSkill] = (acc[swap.offeredSkill] || 0) + 1;
              acc[swap.requestedSkill] = (acc[swap.requestedSkill] || 0) + 1;
              return acc;
            }, {} as Record<string, number>),
          }
        };
      
      case 'feedback-logs':
        return {
          report_type: 'Feedback Logs Report',
          date_range: dateRange,
          generated_at: new Date().toISOString(),
          data: {
            total_reviews: mockReviews.length,
            average_rating: (mockReviews.reduce((sum, r) => sum + r.rating, 0) / mockReviews.length).toFixed(2),
            rating_distribution: mockReviews.reduce((acc, review) => {
              acc[review.rating] = (acc[review.rating] || 0) + 1;
              return acc;
            }, {} as Record<number, number>),
            reviews: mockReviews,
          }
        };
      
      case 'platform-analytics':
        return {
          report_type: 'Platform Analytics Report',
          date_range: dateRange,
          generated_at: new Date().toISOString(),
          data: {
            user_growth: {
              total_users: mockUsers.length,
              growth_rate: '15%', // Mock data
            },
            engagement_metrics: {
              daily_active_users: Math.floor(mockUsers.length * 0.6),
              weekly_active_users: Math.floor(mockUsers.length * 0.8),
              monthly_active_users: Math.floor(mockUsers.length * 0.9),
            },
            skill_categories: {
              'Technology': mockUsers.filter(u => 
                u.skillsOffered.some(s => ['JavaScript', 'React', 'Python', 'Node.js'].includes(s))
              ).length,
              'Design': mockUsers.filter(u => 
                u.skillsOffered.some(s => ['Photoshop', 'UI/UX Design', 'Figma'].includes(s))
              ).length,
              'Data': mockUsers.filter(u => 
                u.skillsOffered.some(s => ['Data Analysis', 'Excel', 'SQL'].includes(s))
              ).length,
            }
          }
        };
      
      default:
        return {};
    }
  };

  const getReportPreview = (reportType: ReportType) => {
    const data = generateReportData(reportType);
    
    switch (reportType) {
      case 'user-activity':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-900">{data.data?.total_users}</div>
              <div className="text-blue-700">Total Users</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-900">{data.data?.active_users}</div>
              <div className="text-green-700">Active Users</div>
            </div>
          </div>
        );
      
      case 'swap-stats':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-900">{data.data?.total_swaps}</div>
              <div className="text-purple-700">Total Swaps</div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-orange-900">{data.data?.success_rate}</div>
              <div className="text-orange-700">Success Rate</div>
            </div>
          </div>
        );
      
      case 'feedback-logs':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-yellow-900">{data.data?.total_reviews}</div>
              <div className="text-yellow-700">Total Reviews</div>
            </div>
            <div className="bg-teal-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-teal-900">{data.data?.average_rating}/5</div>
              <div className="text-teal-700">Average Rating</div>
            </div>
          </div>
        );
      
      case 'platform-analytics':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-indigo-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-indigo-900">{data.data?.engagement_metrics?.daily_active_users}</div>
              <div className="text-indigo-700">Daily Active Users</div>
            </div>
            <div className="bg-pink-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-pink-900">{data.data?.user_growth?.growth_rate}</div>
              <div className="text-pink-700">Growth Rate</div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Reports & Analytics</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Report Selection */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-4">Report Type</h4>
            <div className="space-y-2">
              {reportTypes.map((report) => {
                const Icon = report.icon;
                return (
                  <button
                    key={report.id}
                    onClick={() => setSelectedReport(report.id as ReportType)}
                    className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                      selectedReport === report.id
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-3" />
                    {report.name}
                  </button>
                );
              })}
            </div>
            
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Range
              </label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="last-7-days">Last 7 days</option>
                <option value="last-30-days">Last 30 days</option>
                <option value="last-90-days">Last 90 days</option>
                <option value="last-year">Last year</option>
                <option value="all-time">All time</option>
              </select>
            </div>
          </div>
        </div>

        {/* Report Preview and Download */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-lg font-semibold text-gray-900">
                {reportTypes.find(r => r.id === selectedReport)?.name}
              </h4>
              <button
                onClick={() => handleDownloadReport(selectedReport)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </button>
            </div>

            {/* Report Preview */}
            <div className="mb-6">
              <h5 className="text-sm font-medium text-gray-700 mb-3">Preview</h5>
              {getReportPreview(selectedReport)}
            </div>

            {/* Report Description */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h5 className="text-sm font-medium text-gray-700 mb-2">Report Contents</h5>
              <ul className="text-sm text-gray-600 space-y-1">
                {selectedReport === 'user-activity' && (
                  <>
                    <li>• Total user count and active users</li>
                    <li>• New registrations in selected period</li>
                    <li>• Skills distribution among users</li>
                    <li>• User engagement metrics</li>
                  </>
                )}
                {selectedReport === 'swap-stats' && (
                  <>
                    <li>• Total swap requests and completion rates</li>
                    <li>• Popular skills and trending exchanges</li>
                    <li>• Success/failure ratios by category</li>
                    <li>• Average time to completion</li>
                  </>
                )}
                {selectedReport === 'feedback-logs' && (
                  <>
                    <li>• All user reviews and ratings</li>
                    <li>• Rating distribution and averages</li>
                    <li>• Detailed feedback comments</li>
                    <li>• Quality metrics and trends</li>
                  </>
                )}
                {selectedReport === 'platform-analytics' && (
                  <>
                    <li>• User growth and retention metrics</li>
                    <li>• Daily, weekly, monthly active users</li>
                    <li>• Skill category popularity</li>
                    <li>• Platform usage patterns</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};