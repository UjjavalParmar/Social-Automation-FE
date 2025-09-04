import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const EngagementChart: React.FC = () => {
  // Mock data for demonstration
  const data = [
    { day: 'Mon', tweets: 4, likes: 45, replies: 12, impressions: 1200 },
    { day: 'Tue', tweets: 3, likes: 38, replies: 8, impressions: 980 },
    { day: 'Wed', tweets: 5, likes: 62, replies: 15, impressions: 1500 },
    { day: 'Thu', tweets: 2, likes: 28, replies: 6, impressions: 750 },
    { day: 'Fri', tweets: 6, likes: 78, replies: 20, impressions: 2100 },
    { day: 'Sat', tweets: 3, likes: 42, replies: 10, impressions: 1100 },
    { day: 'Sun', tweets: 4, likes: 55, replies: 14, impressions: 1400 },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="text-sm font-semibold text-gray-800">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-xs" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Weekly Engagement</h2>
            <p className="text-sm text-gray-500">Your performance over the last 7 days</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium">
          <TrendingUp className="w-4 h-4" />
          <span>+18%</span>
        </div>
      </div>

      <div className="space-y-6">
        {/* Impressions Chart */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Impressions</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorImpressions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#9CA3AF" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9CA3AF" />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="impressions" 
                stroke="#3B82F6" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorImpressions)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Engagement Metrics */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Engagement Metrics</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#9CA3AF" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9CA3AF" />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="likes" fill="#EC4899" radius={[4, 4, 0, 0]} />
              <Bar dataKey="replies" fill="#10B981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="tweets" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center space-x-6 pt-2">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-pink-500 rounded"></div>
            <span className="text-xs text-gray-600">Likes</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-xs text-gray-600">Replies</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-500 rounded"></div>
            <span className="text-xs text-gray-600">Tweets</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EngagementChart;
