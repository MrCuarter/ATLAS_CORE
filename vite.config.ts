
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // 1. Cargar variables locales (.env) si estamos en local
  const env = loadEnv(mode, (process as any).cwd(), '');

  // 2. Priorizar la variable del sistema (Vercel/Hostinger) sobre la local.
  const apiKey = process.env.VITE_API_KEY || process.env.API_KEY || env.VITE_API_KEY || env.API_KEY || "";
  const apiKey2 = process.env.VITE_API_KEY_SECONDARY || process.env.API_KEY_SECONDARY || env.VITE_API_KEY_SECONDARY || env.API_KEY_SECONDARY || "";
  const apiKey3 = process.env.VITE_API_KEY_TERTIARY || process.env.API_KEY_TERTIARY || env.VITE_API_KEY_TERTIARY || env.API_KEY_TERTIARY || "";

  return {
    plugins: [react()],
    define: {
      // 3. INCRUSTACIÓN MANUAL: Reemplaza 'process.env.API_KEY' por el valor real en el bundle final.
      'process.env.API_KEY': JSON.stringify(apiKey),
      'process.env.API_KEY_SECONDARY': JSON.stringify(apiKey2),
      'process.env.API_KEY_TERTIARY': JSON.stringify(apiKey3),
      
      // Opcional: Definir process.env vacío para evitar crashes si alguna librería intenta acceder a process.env.algoMas
      'process.env': JSON.stringify({ 
        API_KEY: apiKey,
        API_KEY_SECONDARY: apiKey2,
        API_KEY_TERTIARY: apiKey3
      }),
    }
  };
});
