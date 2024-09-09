import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const RootComponent = () => {
  const [isCached, setIsCached] = useState(false);

  useEffect(() => {
    // Регистрация Service Worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/service-worker.js')
          .then((registration) => {
            console.log('Service Worker зарегистрирован с областью: ', registration.scope);
          })
          .catch((error) => {
            console.error('Ошибка регистрации Service Worker:', error);
          });
      });

      // Получение сообщений от Service Worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'CACHED') {
          setIsCached(true);
        }
      });
    }
  }, []);

  return <App isCached={isCached} />;
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RootComponent />
  </React.StrictMode>
);
