import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // 1. Cargar variables locales (.env) si estamos en local
  const env = loadEnv(mode, (process as any).cwd(), '');

  // 2. Priorizar la variable del sistema (Vercel) sobre la local.
  // Buscamos tanto VITE_API_KEY (estándar Vite) como API_KEY (estándar Node)
  const apiKey = process.env.VITE_API_KEY || process.env.API_KEY || env.VITE_API_KEY || env.API_KEY || "";

  return {
    plugins: [react()],
    define: {
      // 3. INCRUSTACIÓN MANUAL: Reemplaza 'process.env.API_KEY' por el valor real en el bundle final.
      // Esto hace que el navegador vea: const apiKey = "AIzaSy..." en lugar de undefined.
      'process.env.API_KEY': JSON.stringify(apiKey),
      
      // Opcional: Definir process.env vacío para evitar crashes si alguna librería intenta acceder a process.env.algoMas
      'process.env': JSON.stringify({ API_KEY: apiKey }),
    }
  };
});