import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// El puente manual se ha eliminado porque ahora vite.config.ts inyecta 
// process.env.API_KEY directamente durante la compilación.

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);