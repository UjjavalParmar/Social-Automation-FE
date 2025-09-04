import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Twitter, 
  Send, 
  Heart, 
  MessageCircle, 
  Sparkles,
  Trash2,
  TrendingUp,
  Hash,
  Palette,
  AlertCircle,
  CheckCircle,
  Loader2,
  BarChart3,
  Activity,
  LogOut,
  User,
  Key,
  Shield,
  ExternalLink
} from 'lucide-react';
import StatsCard from './StatsCard';
import TweetComposer from './TweetComposer';
import RecentActivity from './RecentActivity';
import EngagementChart from './EngagementChart';
import CredentialsManager from './CredentialsManager';

const API_BASE = 'https://social-api.ujjavaldeploys.in';

interface Stats {
  posted_count: number;
  reply_count: number;
  likes_total: number;
  replies_total: number;
}

interface MetaData {
  topics: string[][];
  styles: string[];
}

interface UserInfo {
  id: string;
  email?: string;
  name?: string;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    posted_count: 0,
    reply_count: 0,
    likes_total: 0,
    replies_total: 0
  });
  const [metaData, setMetaData] = useState<MetaData>({ topics: [], styles: [] });
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    loadAuth();
    loadMetaData();
  }, []);

  useEffect(() => {
    if (user) {
      loadStats();
      const interval = setInterval(loadStats, 10000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const loadAuth = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/me`, { 
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
        }
      });
      if (res.status === 200) {
        const userData = await res.json();
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Failed to load auth:', error);
      setUser(null);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE}/auth/logout`, { 
        credentials: 'include',
        method: 'GET'
      });
      setUser(null);
      window.location.reload();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const loadStats = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/stats`, { 
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
        }
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Failed to load stats:', error);
      setLoading(false);
    }
  };

  const loadMetaData = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/topics`, {
        headers: {
          'Accept': 'application/json',
        }
      });
      if (res.ok) {
        const data = await res.json();
        setMetaData(data);
      } else {
        // Fallback data based on your backend structure
        setMetaData({
          topics: [
            ['Technology', 'AI', 'Web Development', 'Startups'],
            ['Marketing', 'Growth', 'SEO', 'Content'],
            ['Design', 'UX', 'Product', 'Innovation']
          ],
          styles: ['Professional', 'Casual', 'Humorous', 'Educational', 'Inspirational']
        });
      }
    } catch (error) {
      console.error('Failed to load metadata:', error);
      // Fallback data
      setMetaData({
        topics: [
          ['Technology', 'AI', 'Web Development', 'Startups'],
          ['Marketing', 'Growth', 'SEO', 'Content'],
          ['Design', 'UX', 'Product', 'Innovation']
        ],
        styles: ['Professional', 'Casual', 'Humorous', 'Educational', 'Inspirational']
      });
    }
  };

  const handleLogin = () => {
    sessionStorage.setItem('auth_redirect', window.location.href);
    window.location.href = `${API_BASE}/auth/google`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <Twitter className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Twitter Automation Hub
                </h1>
                <p className="text-sm text-gray-500">Manage your social presence with AI</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {authLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
              ) : user ? (
                <>
                  <div className="flex items-center space-x-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    <Activity className="w-4 h-4" />
                    <span>Active</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <User className="w-4 h-4" />
                      <span>{user.email || user.name || user.id}</span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleLogout}
                      className="flex items-center space-x-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors text-sm font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </motion.button>
                  </div>
                </>
              ) : (
                <motion.button
                  onClick={handleLogin}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all text-sm font-medium"
                >
                  <Shield className="w-4 h-4" />
                  <span>Sign in with Google</span>
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!user && !authLoading ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center"
          >
            <div className="max-w-md mx-auto">
              <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Welcome to Twitter Automation Hub</h2>
              <p className="text-gray-600 mb-6">Sign in with your Google account to start managing your Twitter presence with AI-powered automation.</p>
              <motion.button
                onClick={handleLogin}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
              >
                <Shield className="w-5 h-5" />
                <span>Sign in with Google</span>
              </motion.button>
              
              <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="text-left">
                    <p className="text-sm text-blue-800 font-medium">OAuth Configuration</p>
                    <p className="text-xs text-blue-700 mt-1">
                      Backend OAuth redirect should be configured to: 
                      <code className="bg-blue-100 px-1 py-0.5 rounded text-xs ml-1">https://social-api.ujjavaldeploys.in/auth/callback</code>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatsCard
                title="Posted Tweets"
                value={stats.posted_count}
                icon={Send}
                color="blue"
                trend={12}
                loading={loading}
              />
              <StatsCard
                title="Replies Sent"
                value={stats.reply_count}
                icon={MessageCircle}
                color="green"
                trend={8}
                loading={loading}
              />
              <StatsCard
                title="Total Likes"
                value={stats.likes_total}
                icon={Heart}
                color="pink"
                trend={24}
                loading={loading}
              />
              <StatsCard
                title="Total Replies"
                value={stats.replies_total}
                icon={TrendingUp}
                color="purple"
                trend={-5}
                loading={loading}
              />
            </div>

            {/* Credentials Manager */}
            {user && (
              <div className="mb-8">
                <CredentialsManager />
              </div>
            )}

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Tweet Composer - Takes 2 columns */}
              <div className="lg:col-span-2">
                <TweetComposer 
                  topics={metaData.topics} 
                  styles={metaData.styles}
                  onTweetPosted={loadStats}
                />
                
                {/* Engagement Chart */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mt-8"
                >
                  <EngagementChart />
                </motion.div>
              </div>

              {/* Recent Activity - Takes 1 column */}
              <div className="lg:col-span-1">
                <RecentActivity />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
