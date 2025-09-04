import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Send, MessageCircle, Heart, User } from 'lucide-react';
import { format } from 'date-fns';

interface Activity {
  id: string;
  type: 'tweet' | 'reply' | 'like';
  content: string;
  timestamp: Date;
  user?: string;
}

const RecentActivity: React.FC = () => {
  // Mock data for demonstration
  const activities: Activity[] = [
    {
      id: '1',
      type: 'tweet',
      content: 'Just launched our new AI-powered feature! Check it out...',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
    },
    {
      id: '2',
      type: 'reply',
      content: 'Great question! The implementation uses...',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      user: '@techguru'
    },
    {
      id: '3',
      type: 'like',
      content: 'Liked a tweet about Web3 innovations',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
      user: '@web3builder'
    },
    {
      id: '4',
      type: 'tweet',
      content: 'Thread: 10 tips for better code reviews 🧵',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8),
    },
    {
      id: '5',
      type: 'reply',
      content: 'Thanks for sharing! This is exactly what I needed.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12),
      user: '@devlife'
    },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'tweet':
        return <Send className="w-4 h-4" />;
      case 'reply':
        return <MessageCircle className="w-4 h-4" />;
      case 'like':
        return <Heart className="w-4 h-4" />;
      default:
        return <Send className="w-4 h-4" />;
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'tweet':
        return 'text-blue-500 bg-blue-100';
      case 'reply':
        return 'text-green-500 bg-green-100';
      case 'like':
        return 'text-pink-500 bg-pink-100';
      default:
        return 'text-gray-500 bg-gray-100';
    }
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
        </div>
      </div>

      <div className="space-y-4">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="flex space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className={`p-2 rounded-lg ${getIconColor(activity.type)}`}>
              {getIcon(activity.type)}
            </div>
            <div className="flex-1min-w-0">
              <p className="text-sm text-gray-800 line-clamp-2">{activity.content}</p>
              <div className="flex items-center space-x-2 mt-1">
                {activity.user && (
                  <div className="flex items-center space-x-1">
                    <User className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-500">{activity.user}</span>
                  </div>
                )}
                <span className="text-xs text-gray-400">
                  {format(activity.timestamp, 'MMM d, h:mm a')}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full mt-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
      >
        View All Activity →
      </motion.button>
    </motion.div>
  );
};

export default RecentActivity;
