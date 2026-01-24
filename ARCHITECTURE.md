
# 🏗️ Arquitectura Técnica: Atlas_Core

Este documento describe la arquitectura, capacidades y flujo de datos de **Atlas_Core**, una aplicación web diseñada para la ingeniería de prompts orientada a la generación de assets de videojuegos mediante Inteligencia Artificial Generativa.

---

## 1. Capacidades del Sistema (Features)

Atlas_Core actúa como una capa de abstracción técnica entre la intención creativa del usuario y los modelos de generación de imágenes (Midjourney, DALL-E 3, Stable Diffusion).

### Principales Funcionalidades:
1.  **Generación Determinista de Prompts:** Convierte configuraciones de UI (selectores, toggles) en bloques de texto técnico optimizados para diferentes motores de IA.
2.  **Tres Modos de Operación:**
    *   **Constructor:** Selección rápida basada en arquetipos predefinidos (Presets) con aleatorización inteligente.
    *   **Arquitecto:** Flujo paso a paso (Wizard) para configurar escala, clima, cámara y estilo visual detallado.
    *   **Storycrafter Engine:** Generación masiva (Batch) de assets coherentes (Mapa + Escenas Interiores + UI + Personajes) compartiendo el mismo "ADN Visual".
3.  **Integración con LLM (Gemini 2.5/3.0):**
    *   **Refinamiento de Prompts:** Reescribe prompts básicos añadiendo vocabulario artístico técnico (iluminación, texturas, renderizado).
    *   **Sugerencia de Contenido (POIs):** Genera puntos de interés narrativos basados en la civilización y el tipo de edificio seleccionado.
    *   **Visión por Computadora:** Analiza imágenes subidas por el usuario para extraer su estilo artístico y convertirlo en keywords de texto.
4.  **Soporte Multi-Modelo:** Adapta la sintaxis del prompt final según el destino:
    *   **Universal:** Lenguaje natural descriptivo (Gemini / DALL-E).
    *   **Midjourney:** Parámetros específicos (`--ar`, `--stylize`, `::` weights).
    *   **Técnico (SD):** Lista de tokens separados por comas y *Negative Prompts*.

---

## 2. Stack Tecnológico

*   **Core:** React 18 + TypeScript + Vite.
*   **Estilos:** Tailwind CSS (Diseño responsive, tema oscuro "Deep Space").
*   **IA SDK:** `@google/genai` (Google Gemini API).
*   **Estado:** React `useState` / `useReducer` (Gestión local centralizada en `App.tsx`).
*   **Persistencia:** `localStorage` para el historial de prompts.
*   **Audio:** Web Audio API (Sintetizador nativo para efectos de sonido UI).

---

## 3. Arquitectura y Flujo de Datos

La aplicación sigue una arquitectura **Unidireccional** centrada en un objeto de configuración maestro.

### 3.1. El Objeto `MapConfig` (Single Source of Truth)
Toda la UI modifica un único objeto de estado (`config`) definido en `types.ts`. Este objeto contiene:
*   Datos Semánticos: `civilization`, `placeType`, `era`.
*   Datos Técnicos: `camera`, `aspectRatio`, `renderTech`.
*   Datos de Estilo: `artStyle`, `styleReference`, `manualStyle`.

### 3.2. Pipeline de Generación

```mermaid
[UI Inputs] -> [Update MapConfig] -> [PromptGenerator Service] -> [Prompt String] -> [PromptDisplay]
                                              |
                                              v
                                      [Gemini API (Opcional)]
                                              |
                                              v
                                      [Enhanced Prompt String]
```

1.  **Entrada:** El usuario interactúa con `SimpleView`, `PresetsView` o `NarrativeView`.
2.  **Estado:** `App.tsx` actualiza `config`.
3.  **Procesamiento Determinista (`services/promptGenerator.ts`):**
    *   Se ejecuta cada vez que cambia `config`.
    *   Utiliza plantillas literales (Template Literals) para construir el string base.
    *   Aplica lógica condicional según `PromptType` (Universal vs MJ vs SD).
    *   **Regla Crítica:** Traduce términos de UI (Español) a Keywords Técnicas (Inglés) usando el diccionario en `constants.ts`.
4.  **Refinamiento Estocástico (`services/geminiService.ts`):**
    *   Si el usuario solicita "Optimizar con IA", se envía el string base a Gemini.
    *   Gemini utiliza `SystemInstructions` estrictas para mantener la estructura técnica pero enriquecer el vocabulario artístico.

---

## 4. Estructura de Directorios

```
/src
  ├── /components       # Componentes de UI
  │   ├── NarrativeView.tsx  # Lógica compleja del modo Storycrafter
  │   ├── SimpleView.tsx     # Wizard paso a paso (Arquitecto)
  │   ├── PromptDisplay.tsx  # Visualizador de salida y acciones (Copiar/Refinar)
  │   └── ...
  │
  ├── /services         # Lógica de Negocio (Business Logic)
  │   ├── promptGenerator.ts # Lógica pura de construcción de strings (Core)
  │   ├── geminiService.ts   # Comunicación con API de Google
  │   └── audioService.ts    # Feedback sonoro
  │
  ├── constants.ts      # Diccionarios de traducción, listas de estilos, assets.
  ├── types.ts          # Interfaces TypeScript (Contratos de datos).
  ├── App.tsx           # Controlador principal y Router de estado.
  └── main.tsx          # Punto de entrada.
```

---

## 5. Puntos Clave para Desarrolladores

### 5.1. Renderizado Condicional de Componentes
Para evitar problemas de rendimiento y pérdida de foco en los inputs (especialmente en `NarrativeView`), los componentes de formulario (`SimpleInput`, `SmartSelect`) se definen fuera del componente principal o se memorizan con `React.memo`. Esto evita que se vuelvan a montar en cada pulsación de tecla.

### 5.2. Gestión de API Keys
*   Las keys se inyectan vía `process.env` (configurado en `vite.config.ts`).
*   `geminiService` implementa una lógica de **Fallback**: intenta usar la Key primaria, luego la secundaria y la terciaria si encuentra errores de cuota (429).

### 5.3. Sistema Storycrafter
A diferencia del modo normal que genera un solo prompt, `NarrativeView` genera una **Colección (`PromptCollectionItem[]`)**.
*   Utiliza `generateNarrativeCollection` en `promptGenerator.ts`.
*   Itera sobre tipos de assets (MAP, UI, CHARACTER) aplicando reglas de consistencia (mismo `artStyle`, misma `civilization`) para garantizar que todos los assets parezcan del mismo "juego".

### 5.4. Reglas de "No Texto"
El sistema fuerza instrucciones negativas (`--no text`, `negative prompt: text`) tanto en la generación determinista como en las instrucciones del sistema de la IA para evitar alucinaciones tipográficas en las imágenes generadas.
