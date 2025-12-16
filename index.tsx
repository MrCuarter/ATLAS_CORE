import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// --- BRIDGE FOR VERCEL/VITE ENV VARS ---
// This ensures 'process.env.API_KEY' works in the browser by mapping it 
// from the standard Vite environment variable 'VITE_API_KEY'.
try {
  // @ts-ignore
  if (typeof process === 'undefined') {
    // @ts-ignore
    window.process = { env: { API_KEY: import.meta.env.VITE_API_KEY } };
  } else {
    // @ts-ignore
    if (!process.env) { process.env = {}; }
    // @ts-ignore
    process.env.API_KEY = import.meta.env.VITE_API_KEY || process.env.API_KEY;
  }
} catch (e) {
  console.warn("Environment polyfill skipped");
}
// ---------------------------------------

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