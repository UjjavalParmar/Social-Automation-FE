import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Send, 
  Trash2, 
  Hash, 
  Palette,
  AlertCircle,
  CheckCircle,
  Loader2,
  RefreshCw,
  Copy,
  Edit3
} from 'lucide-react';

const API_BASE = 'https://social-api.ujjavaldeploys.in';

interface TweetComposerProps {
  topics: string[][];
  styles: string[];
  onTweetPosted: () => void;
}

const TweetComposer: React.FC<TweetComposerProps> = ({ topics, styles, onTweetPosted }) => {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedStyle, setSelectedStyle] = useState(styles[0] || 'Professional');
  const [generatedTweet, setGeneratedTweet] = useState('');
  const [editedTweet, setEditedTweet] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info' | null; text: string }>({ type: null, text: '' });
  const [isEditing, setIsEditing] = useState(false);

  const handleTopicToggle = (topic: string) => {
    setSelectedTopics(prev => 
      prev.includes(topic) 
        ? prev.filter(t => t !== topic)
        : [...prev, topic]
    );
  };

  const generateTweet = async () => {
    if (selectedTopics.length === 0) {
      setMessage({ type: 'error', text: 'Please select at least one topic' });
      return;
    }

    setIsGenerating(true);
    setMessage({ type: null, text: '' });

    try {
      const res = await fetch(`${API_BASE}/api/generate-tweet`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ 
          topics: selectedTopics, 
          style: selectedStyle,
          prompt: `Generate a tweet about ${selectedTopics.join(', ')} in ${selectedStyle} style`
        })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to generate tweet');
      }

      const data = await res.json();
      const tweetText = data.tweet || data.text || data.content || '';
      
      setGeneratedTweet(tweetText);
      setEditedTweet(tweetText);
      setIsEditing(false);
      setMessage({ type: 'success', text: 'Tweet generated successfully!' });
    } catch (error) {
      console.error('Failed to generate tweet:', error);
      setMessage({ type: 'error', text: `Failed to generate tweet: ${error}` });
    } finally {
      setIsGenerating(false);
    }
  };

  const postTweet = async () => {
    const tweetToPost = isEditing ? editedTweet : generatedTweet;
    if (!tweetToPost.trim()) {
      setMessage({ type: 'error', text: 'Cannot post empty tweet' });
      return;
    }

    setIsPosting(true);
    setMessage({ type: null, text: '' });

    try {
      const res = await fetch(`${API_BASE}/api/post-tweet`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ 
          content: tweetToPost,
          text: tweetToPost 
        })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to post tweet');
      }

      const data = await res.json();
      setMessage({ type: 'success', text: `Tweet posted successfully! ${data.id ? `ID: ${data.id}` : ''}` });
      setGeneratedTweet('');
      setEditedTweet('');
      setIsEditing(false);
      onTweetPosted();
    } catch (error) {
      console.error('Failed to post tweet:', error);
      setMessage({ type: 'error', text: `Failed to post tweet: ${error}` });
    } finally {
      setIsPosting(false);
    }
  };

  const discardTweet = () => {
    setGeneratedTweet('');
    setEditedTweet('');
    setIsEditing(false);
    setMessage({ type: 'info', text: 'Draft discarded' });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(isEditing ? editedTweet : generatedTweet);
    setMessage({ type: 'success', text: 'Copied to clipboard!' });
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Compose Tweet</h2>
        </div>
        {generatedTweet && (
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={copyToClipboard}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Copy className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditing(!isEditing)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Edit3 className="w-4 h-4" />
            </motion.button>
          </div>
        )}
      </div>

      {/* Topics Selection */}
      <div className="space-y-4 mb-6">
        {topics.map((group, groupIndex) => (
          <div key={groupIndex}>
            <div className="flex items-center space-x-2 mb-3">
              <Hash className="w-4 h-4 text-gray-400" />
              <h3 className="text-sm font-semibold text-gray-700">Topic Group {groupIndex + 1}</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {group.map((topic) => (
                <motion.button
                  key={topic}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleTopicToggle(topic)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedTopics.includes(topic)
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {topic}
                </motion.button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Style Selection */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-3">
          <Palette className="w-4 h-4 text-gray-400" />
          <h3 className="text-sm font-semibold text-gray-700">Writing Style</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {styles.map((style) => (
            <motion.button
              key={style}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedStyle(style)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedStyle === style
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {style}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={generateTweet}
          disabled={isGenerating || selectedTopics.length === 0}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Generate Tweet</span>
            </>
          )}
        </motion.button>

        {generatedTweet && (
          <>
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={postTweet}
              disabled={isPosting}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isPosting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Posting...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Post Tweet</span>
                </>
              )}
            </motion.button>

            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={discardTweet}
              className="flex items-center space-x-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-all"
            >
              <Trash2 className="w-5 h-5" />
              <span>Discard</span>
            </motion.button>

            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={generateTweet}
              className="flex items-center space-x-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-all"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Regenerate</span>
            </motion.button>
          </>
        )}
      </div>

      {/* Tweet Preview */}
      <AnimatePresence>
        {generatedTweet && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Preview</h4>
              {isEditing ? (
                <textarea
                  value={editedTweet}
                  onChange={(e) => setEditedTweet(e.target.value)}
                  className="w-full p-3 bg-white rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
                  rows={4}
                  maxLength={280}
                />
              ) : (
                <p className="text-gray-800 whitespace-pre-wrap">{generatedTweet}</p>
              )}
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {(isEditing ? editedTweet : generatedTweet).length}/280 characters
                </span>
                {isEditing && (
                  <button
                    onClick={() => setIsEditing(false)}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Done Editing
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status Messages */}
      <AnimatePresence>
        {message.type && (
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            className={`mt-4 p-4 rounded-lg flex items-center space-x-2 ${
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
    </motion.div>
  );
};

export default TweetComposer;
