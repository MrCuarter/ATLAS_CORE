import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// --- PUENTE DE VARIABLES DE ENTORNO ---
// Vite (usado por Vercel) guarda las variables en import.meta.env.
// El SDK de Google busca en process.env.
// Este código hace la traducción manual al iniciar la app.
try {
  // @ts-ignore
  window.process = window.process || {};
  // @ts-ignore
  window.process.env = window.process.env || {};
  
  // Mapeamos la variable expuesta por Vite (VITE_API_KEY) a donde la busca el SDK (API_KEY)
  // @ts-ignore
  if (import.meta.env.VITE_API_KEY) {
    // @ts-ignore
    window.process.env.API_KEY = import.meta.env.VITE_API_KEY;
    console.log("✅ API Key cargada correctamente desde VITE_API_KEY");
  } else {
    console.warn("⚠️ No se detectó VITE_API_KEY. Asegúrate de configurarla en Vercel.");
  }
} catch (e) {
  console.warn("Error inicializando entorno:", e);
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