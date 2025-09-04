import React from 'react';
import Dashboard from './components/Dashboard';
import AuthCallback from './components/AuthCallback';

function App() {
  // Check if we're on the auth callback route
  if (window.location.pathname === '/auth/callback') {
    return <AuthCallback />;
  }
  
  return <Dashboard />;
}

export default App;
