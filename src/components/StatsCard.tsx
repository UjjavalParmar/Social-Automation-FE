import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon, TrendingUp, TrendingDown, Loader2 } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'pink' | 'purple';
  trend?: number;
  loading?: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  trend,
  loading 
}) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    pink: 'from-pink-500 to-pink-600',
    purple: 'from-purple-500 to-purple-600'
  };

  const bgColorClasses = {
    blue: 'bg-blue-50',
    green: 'bg-green-50',
    pink: 'bg-pink-50',
    purple: 'bg-purple-50'
  };

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 border border-gray-100"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <div className="flex items-baseline space-x-2">
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            ) : (
              <motion.h3 
                key={value}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-3xl font-bold text-gray-900"
              >
                {value.toLocaleString()}
              </motion.h3>
            )}
            {trend !== undefined && !loading && (
              <div className={`flex items-center space-x-1 text-sm ${
                trend > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {trend > 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span>{Math.abs(trend)}%</span>
              </div>
            )}
          </div>
        </div>
        <div className={`p-3 rounded-xl ${bgColorClasses[color]}`}>
          <div className={`bg-gradient-to-br ${colorClasses[color]} p-2 rounded-lg`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StatsCard;
