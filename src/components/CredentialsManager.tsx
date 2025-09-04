import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Key, 
  Save, 
  AlertCircle, 
  CheckCircle,
  Loader2,
  Eye,
  EyeOff,
  Shield,
  Lock
} from 'lucide-react';

const API_BASE = 'https://social-api.ujjavaldeploys.in';

interface TwitterCredentials {
  consumer_key: string;
  consumer_secret: string;
  access_token: string;
  access_token_secret: string;
}

const CredentialsManager: React.FC = () => {
  const [credentials, setCredentials] = useState<TwitterCredentials>({
    consumer_key: '',
    consumer_secret: '',
    access_token: '',
    access_token_secret: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info' | null; text: string }>({ type: null, text: '' });
  const [showSecrets, setShowSecrets] = useState({
    consumer_secret: false,
    access_token_secret: false
  });
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    loadCredentials();
  }, []);

  const loadCredentials = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/twitter/credentials`, { 
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
        }
      });
      if (res.ok) {
        const data = await res.json();
        setCredentials({
          consumer_key: data.consumer_key || '',
          consumer_secret: data.consumer_secret || '',
          access_token: data.access_token || '',
          access_token_secret: data.access_token_secret || ''
        });
        if (!data.consumer_key) {
          setMessage({ type: 'info', text: 'Add your Twitter API credentials to enable posting.' });
          setIsExpanded(true);
        }
      }
    } catch (error) {
      console.error('Failed to load credentials:', error);
      setMessage({ type: 'error', text: 'Failed to load credentials.' });
    } finally {
      setLoading(false);
    }
  };

  const saveCredentials = async () => {
    setSaving(true);
    setMessage({ type: null, text: '' });

    try {
      const res = await fetch(`${API_BASE}/api/twitter/credentials`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(credentials)
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Twitter credentials saved successfully!' });
        setIsExpanded(false);
      } else {
        const errorData = await res.json().catch(() => ({}));
        setMessage({ type: 'error', text: errorData.error || 'Failed to save credentials.' });
      }
    } catch (error) {
      console.error('Failed to save credentials:', error);
      setMessage({ type: 'error', text: 'Failed to save credentials.' });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof TwitterCredentials, value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
  };

  const toggleSecretVisibility = (field: 'consumer_secret' | 'access_token_secret') => {
    setShowSecrets(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const hasCredentials = credentials.consumer_key || credentials.consumer_secret || credentials.access_token || credentials.access_token_secret;

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
    >
      <div 
        className="p-6 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl">
              <Key className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Twitter API Credentials</h2>
              <p className="text-sm text-gray-500">
                {hasCredentials ? 'Credentials configured' : 'Configure your Twitter API credentials'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {hasCredentials && (
              <div className="flex items-center space-x-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                <Shield className="w-4 h-4" />
                <span>Configured</span>
              </div>
            )}
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              className="text-gray-400"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </motion.div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-gray-100"
          >
            <div className="p-6 space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Consumer Key (API Key)
                      </label>
                      <input
                        type="text"
                        value={credentials.consumer_key}
                        onChange={(e) => handleInputChange('consumer_key', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        placeholder="Enter Consumer Key"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Consumer Secret (API Secret)
                      </label>
                      <div className="relative">
                        <input
                          type={showSecrets.consumer_secret ? 'text' : 'password'}
                          value={credentials.consumer_secret}
                          onChange={(e) => handleInputChange('consumer_secret', e.target.value)}
                          className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                          placeholder="Enter Consumer Secret"
                        />
                        <button
                          type="button"
                          onClick={() => toggleSecretVisibility('consumer_secret')}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700"
                        >
                          {showSecrets.consumer_secret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Access Token
                      </label>
                      <input
                        type="text"
                        value={credentials.access_token}
                        onChange={(e) => handleInputChange('access_token', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        placeholder="Enter Access Token"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Access Token Secret
                      </label>
                      <div className="relative">
                        <input
                          type={showSecrets.access_token_secret ? 'text' : 'password'}
                          value={credentials.access_token_secret}
                          onChange={(e) => handleInputChange('access_token_secret', e.target.value)}
                          className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                          placeholder="Enter Access Token Secret"
                        />
                        <button
                          type="button"
                          onClick={() => toggleSecretVisibility('access_token_secret')}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700"
                        >
                          {showSecrets.access_token_secret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-blue-800 mb-2">How to get Twitter API credentials:</h4>
                    <ol className="text-xs text-blue-700 space-y-1 list-decimal list-inside">
                      <li>Go to <a href="https://developer.twitter.com" target="_blank" rel="noopener noreferrer" className="underline">Twitter Developer Portal</a></li>
                      <li>Create a new app or select an existing one</li>
                      <li>Navigate to "Keys and tokens" section</li>
                      <li>Generate Consumer Keys and Access Token & Secret</li>
                      <li>Copy the credentials and paste them here</li>
                    </ol>
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Lock className="w-4 h-4" />
                      <span>Your credentials are encrypted and stored securely</span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={saveCredentials}
                      disabled={saving}
                      className="flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Save Credentials</span><span>Save Credentials</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </>
              )}

              {/* Status Messages */}
              <AnimatePresence>
                {message.type && (
                  <motion.div
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    className={`p-4 rounded-lg flex items-center space-x-2 ${
                      message.type === 'success' ? 'bg-green-100 text-green-700' :
                      message.type === 'error' ? 'bg-red-100 text-red-700' :
                      'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {message.type === 'success' && <CheckCircle className="w-5 h-5" />}
                    {message.type === 'error' && <AlertCircle className="w-5 h-5" />}
                    {message.type === 'info' && <AlertCircle className="w-5 h-5" />}
                    <span className="text-sm font-medium">{message.text}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CredentialsManager;
