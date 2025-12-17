# Atlas_Core | Map Intelligence System

**Atlas_Core** es un generador de prompts profesional diseñado para creadores de juegos, masters de rol y escritores. Su objetivo es crear descripciones técnicas detalladas para generar assets visuales de alta calidad (Mapas, Personajes, UI) utilizando IAs generativas como Midjourney.

Desarrollado por [Norberto Cuartero](https://mistercuarter.es).

---

## 🚀 Características Principales

1.  **Modos de Operación:**
    *   **Presets:** Configuraciones rápidas predefinidas (Cyberpunk, Fantasía, Sci-Fi, etc.).
    *   **Constructor (Simple):** Flujo paso a paso para usuarios nuevos.
    *   **Arquitecto (Avanzado):** Control total sobre cada variable del prompt.
    *   **Storycrafter Engine:** Sistema narrativo para generar colecciones coherentes de assets (Mundo, UI, Personajes) manteniendo el mismo estilo visual.

2.  **Integración con IA (Google Gemini):**
    *   Refinamiento automático de prompts para añadir vocabulario evocador.
    *   Generación de assets de juego (UI, Iconos) basados en el contexto.
    *   Sugerencia inteligente de POIs (Puntos de Interés) basada en el lugar y la civilización.

3.  **Tecnología:**
    *   React + TypeScript + Vite.
    *   Tailwind CSS para estilos futuristas.
    *   Google Generative AI SDK (@google/genai).

---

## 🛠️ Instalación y Replicación

Sigue estos pasos para ejecutar el proyecto en tu entorno local.

### Prerrequisitos
*   Node.js (v18 o superior).
*   Una API Key de Google Gemini (gratuita en Google AI Studio).

### Pasos

1.  **Clonar el repositorio (o descargar los archivos):**
    Asegúrate de tener la estructura de carpetas correcta (`src/`, `components/`, `services/`, etc.).

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Configurar Variables de Entorno:**
    Crea un archivo `.env` en la raíz del proyecto y añade tu clave de API:
    ```env
    VITE_API_KEY=tu_clave_de_google_gemini_aqui
    ```
    *Nota: El sistema está configurado para inyectar esta clave de forma segura durante la compilación.*

4.  **Ejecutar en desarrollo:**
    ```bash
    npm run dev
    ```
    La aplicación estará disponible en `http://localhost:5173`.

---

## 📖 Guía de Uso: Storycrafter Engine

El modo más potente de la aplicación es el **Storycrafter Engine**, diseñado para crear todo el arte necesario para un juego o campaña de una sola vez.

### Fases de Generación

1.  **Contexto:**
    *   Define el **Lugar** (ej. "Castillo Flotante") y la **Civilización** (ej. "Elfos Oscuros").
    *   En modo **Asistente**, la IA sugerirá automáticamente 6 Puntos de Interés (POIs).
    *   En modo **Manual**, puedes escribir tus propios POIs y detalles concretos.

2.  **Generación (3 Botones):**
    *   🌍 **GENERAR MUNDO:** Crea prompts para un Mapa Táctico, una Portada Épica (Splash Art), la Entrada Principal y los 6 interiores (POIs).
    *   🔮 **GENERAR INTERFAZ:** Crea prompts para botones, ventanas de diálogo y barras de vida/maná acorde al estilo visual.
    *   ⚔️ **GENERAR PERSONAJES:** Crea prompts para el Héroe, Heroína, Villano, Esbirro, NPC y una mascota/compinche, además de una hoja de insignias (tokens).

3.  **Ejecución:**
    *   Copia los prompts generados.
    *   Pégalos en Midjourney (o tu generador favorito).
    *   ¡Disfruta de assets coherentes visualmente!

---

## 📂 Estructura del Proyecto

*   **`components/`**: Contiene las vistas principales (`NarrativeView`, `SimpleView`, etc.) y componentes de UI (`PromptDisplay`).
*   **`services/`**: Lógica de negocio.
    *   `promptGenerator.ts`: El cerebro que construye los strings de los prompts.
    *   `geminiService.ts`: Comunicación con la API de Google.
    *   `audioService.ts`: Efectos de sonido de la UI.
*   **`constants.ts`**: Textos, traducciones y listas de datos (climas, estilos, lugares).
*   **`types.ts`**: Definiciones de TypeScript e interfaces.

---

## 📞 Soporte

Si encuentras errores o tienes propuestas de mejora, contacta a:
**hola@mistercuarter.es**
