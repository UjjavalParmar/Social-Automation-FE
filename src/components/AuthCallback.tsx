import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';

const API_BASE = 'https://social-api.ujjavaldeploys.in';

const AuthCallback: React.FC = () => {
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('Processing authentication...');

  useEffect(() => {
    handleCallback();
  }, []);

  const handleCallback = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const error = urlParams.get('error');

    if (error) {
      setStatus('error');
      setMessage(`Authentication failed: ${error}`);
      setTimeout(() => {
        window.location.href = '/';
      }, 3000);
      return;
    }

    if (!code) {
      setStatus('error');
      setMessage('No authorization code received');
      setTimeout(() => {
        window.location.href = '/';
      }, 3000);
      return;
    }

    try {
      // Forward the entire callback URL to the backend
      const callbackUrl = `${API_BASE}/auth/callback${window.location.search}`;
      
      setMessage('Completing authentication with backend...');
      
      // Redirect to backend callback handler
      window.location.href = callbackUrl;
      
    } catch (error) {
      console.error('Auth callback error:', error);
      setStatus('error');
      setMessage('Failed to complete authentication');
      setTimeout(() => {
        window.location.href = '/';
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4"
      >
        <div className="text-center">
          {status === 'processing' && (
            <>
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full">
                  <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Completing Sign In</h2>
              <p className="text-gray-600">{message}</p>
              <p className="text-sm text-gray-500 mt-4">Please wait while we redirect you...</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign In Successful!</h2>
              <p className="text-gray-600">{message}</p>
              <p className="text-sm text-gray-500 mt-4">Redirecting to dashboard...</p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Failed</h2>
              <p className="text-gray-600">{message}</p>
              <p className="text-sm text-gray-500 mt-4">Redirecting back...</p>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AuthCallback;
