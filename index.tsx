import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// --- BRIDGE FOR VERCEL/VITE ENV VARS ---
// This ensures 'process.env.API_KEY' works in the browser by mapping it 
// from the standard Vite environment variable 'VITE_API_KEY'.
// This is necessary because the Google GenAI SDK strictly expects process.env.API_KEY
try {
  // @ts-ignore
  if (typeof window !== 'undefined') {
    // @ts-ignore
    window.process = window.process || {};
    // @ts-ignore
    window.process.env = window.process.env || {};
    // @ts-ignore
    // Map the Vercel/Vite variable to the place where the SDK looks for it
    window.process.env.API_KEY = import.meta.env.VITE_API_KEY;
  }
} catch (e) {
  console.warn("Environment polyfill skipped", e);
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