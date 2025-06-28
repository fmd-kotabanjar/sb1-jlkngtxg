import React, { useState, useEffect } from 'react';
import { 
  Users,
  FileText,
  MessageSquare,
  TrendingUp,
  Crown,
  Zap,
  Eye,
  Calendar,
  Activity
} from 'lucide-react';
import { User, Prompt, PromptRequest } from '../../types';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPrompts: 0,
    totalRequests: 0,
    pendingRequests: 0,
    freePrompts: 0,
    exclusivePrompts: 0,
    superPrompts: 0,
    basicUsers: 0,
    premiumUsers: 0,
    adminUsers: 0
  });

  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    loadStats();
    loadRecentActivity();
  }, []);

  const loadStats = () => {
    try {
      const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
      const prompts: Prompt[] = JSON.parse(localStorage.getItem('prompts') || '[]');
      const requests: PromptRequest[] = JSON.parse(localStorage.getItem('promptRequests') || '[]');

      setStats({
        totalUsers: users.length,
        totalPrompts: prompts.filter(p => p.isActive).length,
        totalRequests: requests.length,
        pendingRequests: requests.filter(r => r.status === 'pending').length,
        freePrompts: prompts.filter(p => p.type === 'free' && p.isActive).length,
        exclusivePrompts: prompts.filter(p => p.type === 'exclusive' && p.isActive).length,
        superPrompts: prompts.filter(p => p.type === 'super' && p.isActive).length,
        basicUsers: users.filter(u => u.role === 'basic').length,
        premiumUsers: users.filter(u => u.role === 'premium').length,
        adminUsers: users.filter(u => u.role === 'admin').length
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadRecentActivity = () => {
    try {
      const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
      const requests: PromptRequest[] = JSON.parse(localStorage.getItem('promptRequests') || '[]');
      
      const activities = [
        ...users.slice(-5).map(user => ({
          type: 'user_registered',
          description: `${user.name} bergabung sebagai ${user.role}`,
          timestamp: user.createdAt,
          icon: Users,
          color: 'text-blue-600 dark:text-blue-400'
        })),
        ...requests.slice(-5).map(request => ({
          type: 'request_submitted',
          description: `${request.userName} mengajukan request: ${request.title}`,
          timestamp: request.createdAt,
          icon: MessageSquare,
          color: 'text-purple-600 dark:text-purple-400'
        }))
      ];

      activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setRecentActivity(activities.slice(0, 10));
    } catch (error) {
      console.error('Error loading recent activity:', error);
    }
  };

  const StatCard: React.FC<{
    title: string;
    value: number;
    icon: React.ElementType;
    color: string;
    bgColor: string;
  }> = ({ title, value, icon: Icon, color, bgColor }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 truncate">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
        </div>
        <div className={`p-3 ${bgColor} rounded-lg flex-shrink-0`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
            Kelola platform RacikanPrompt dengan mudah
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <StatCard
            title="Total Pengguna"
            value={stats.totalUsers}
            icon={Users}
            color="text-blue-600 dark:text-blue-400"
            bgColor="bg-blue-100 dark:bg-blue-900"
          />
          <StatCard
            title="Total Prompt"
            value={stats.totalPrompts}
            icon={FileText}
            color="text-green-600 dark:text-green-400"
            bgColor="bg-green-100 dark:bg-green-900"
          />
          <StatCard
            title="Request Pending"
            value={stats.pendingRequests}
            icon={MessageSquare}
            color="text-yellow-600 dark:text-yellow-400"
            bgColor="bg-yellow-100 dark:bg-yellow-900"
          />
          <StatCard
            title="Total Request"
            value={stats.totalRequests}
            icon={TrendingUp}
            color="text-purple-600 dark:text-purple-400"
            bgColor="bg-purple-100 dark:bg-purple-900"
          />
        </div>

        {/* Detailed Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Prompt Stats */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Statistik Prompt
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center">
                  <Eye className="w-5 h-5 text-green-600 dark:text-green-400 mr-3" />
                  <span className="font-medium text-gray-900 dark:text-white">Gratis</span>
                </div>
                <span className="text-lg font-bold text-green-600 dark:text-green-400">
                  {stats.freePrompts}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="flex items-center">
                  <Crown className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-3" />
                  <span className="font-medium text-gray-900 dark:text-white">Eksklusif</span>
                </div>
                <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                  {stats.exclusivePrompts}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="flex items-center">
                  <Zap className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-3" />
                  <span className="font-medium text-gray-900 dark:text-white">Super</span>
                </div>
                <span className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                  {stats.superPrompts}
                </span>
              </div>
            </div>
          </div>

          {/* User Stats */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Statistik Pengguna
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-3" />
                  <span className="font-medium text-gray-900 dark:text-white">Basic</span>
                </div>
                <span className="text-lg font-bold text-gray-600 dark:text-gray-400">
                  {stats.basicUsers}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="flex items-center">
                  <Crown className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-3" />
                  <span className="font-medium text-gray-900 dark:text-white">Premium</span>
                </div>
                <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                  {stats.premiumUsers}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-red-600 dark:text-red-400 mr-3" />
                  <span className="font-medium text-gray-900 dark:text-white">Admin</span>
                </div>
                <span className="text-lg font-bold text-red-600 dark:text-red-400">
                  {stats.adminUsers}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Aktivitas Terbaru
            </h3>
            <Activity className="w-5 h-5 text-gray-400" />
          </div>
          
          {recentActivity.length > 0 ? (
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className={`p-2 rounded-lg mr-4 ${
                    activity.type === 'user_registered' 
                      ? 'bg-blue-100 dark:bg-blue-900' 
                      : 'bg-purple-100 dark:bg-purple-900'
                  }`}>
                    <activity.icon className={`w-4 h-4 ${activity.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.description}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center mt-1">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(activity.timestamp).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                Belum ada aktivitas terbaru
              </p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <a
            href="/admin/prompts"
            className="flex items-center justify-center p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FileText className="w-5 h-5 mr-2" />
            Kelola Prompt
          </a>
          <a
            href="/admin/users"
            className="flex items-center justify-center p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Users className="w-5 h-5 mr-2" />
            Kelola User
          </a>
          <a
            href="/admin/requests"
            className="flex items-center justify-center p-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <MessageSquare className="w-5 h-5 mr-2" />
            Kelola Request
          </a>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center justify-center p-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <TrendingUp className="w-5 h-5 mr-2" />
            Refresh Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;