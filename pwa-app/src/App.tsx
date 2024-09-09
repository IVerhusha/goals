import React, { useEffect, useState } from 'react';
import './App.css';

interface AppProps {
  isCached: boolean;
}

const App: React.FC<AppProps> = ({ isCached }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>PWA App</h1>
        <p>PWA PWA PWA SUPER PWA!!!!!</p>
        <img className="App-logo" src="/icons/icon-512x512.png" />

        {!isOnline && (
          <div style={{ color: 'red', marginTop: '20px' }}>
            ⚠️ You are currently offline. The app is using cached data.
          </div>
        )}

        {isCached && (
          <div style={{ color: 'orange', marginTop: '20px' }}>
            ⚠️ The app is loading cached data because the network is unavailable.
          </div>
        )}
      </header>
    </div>
  );
};

export default App;
