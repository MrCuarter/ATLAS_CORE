
# 🗺️ ATLAS_CORE: Manual de Supervivencia para Creadores de Mundos

¡Hola, ser creativo! 👋

Bienvenido a **Atlas_Core**. Si estás aquí es porque probablemente te has cansado de escribir *"mapa de fantasía chulo"* en Midjourney y recibir una imagen de una patata con carreteras. No te preocupes, nos pasa a todos.

Esta herramienta es básicamente un **exoesqueleto para tu imaginación**. Tú pones la idea (o dejas que el caos decida por ti) y Atlas_Core escupe un bloque de texto técnico tan preciso que la IA no tendrá más remedio que obedecerte.

---

## 🚀 ¿Qué demonios es esto?

Atlas_Core es un generador de **prompts técnicos** (instrucciones para IAs generativas).
Sirve para crear **Mapas, Escenarios, Personajes e Interfaces de Usuario (UI)** para videojuegos, rol o novelas.

**No genera imágenes directamente** (todavía no hacemos magia negra), genera el *texto perfecto* para que se lo pegues a Midjourney, DALL-E 3, Stable Diffusion o Gemini y ellos hagan el trabajo sucio.

---

## 🎛️ Los Tres Modos de la Felicidad

La app tiene tres personalidades, dependiendo de cuántas ganas de trabajar tengas hoy:

### 1. 🏗️ El CONSTRUCTOR (Modo "Tengo Prisa")
Ideal para cuando necesitas inspiración **YA** o te da pereza pensar.

*   **¿Qué hace?** Te ofrece prototipos predefinidos y curados.
*   **El Botón Mágico:** Hay un botón que dice **"GENERAR NUEVOS PROTOTIPOS"**. Púlsalo. El sistema mezclará civilizaciones, lugares y estilos artísticos de forma aleatoria pero coherente (o no, a veces sale "Ciberpunk en el Antiguo Egipto" y mola).
*   **Uso:** Ves una tarjeta que te gusta -> Click -> Prompt copiado -> A generar.

### 2. 📐 El ARQUITECTO (Modo "Control Freak")
Para cuando tienes una visión exacta en tu cabeza y nadie te va a decir cómo diseñar tu mazmorra.

*   **Paso a Paso:** Un asistente te guía por 10 pasos. Escala, Temática, Civilización, Clima, Cámara...
*   **ADN Visual:** Aquí es donde la matan. Puedes definir el estilo exacto (¿Zelda? ¿Dark Souls? ¿Wes Anderson?).
*   **📸 Novedad - Robo de Estilo (Ups, perdón, "Extracción"):**
    ¿Tienes una imagen con un estilo brutal y quieres copiarlo? En el paso 6, sube esa imagen. Atlas_Core usará sus ojos biónicos (Gemini Vision) para analizar técnicamente el estilo y aplicarlo a tu prompt. Así de fácil.

### 3. 🔮 STORYCRAFTER (Modo "Quiero hacer un juego entero")
Este es el peso pesado. Diseñado para crear **colecciones coherentes**. Porque de nada sirve tener un mapa estilo "Pixel Art" y un personaje estilo "Renacimiento Italiano".

*   **El Flujo:**
    1.  Eliges una Raza y un Lugar (o dejas que el azar decida).
    2.  Atlas_Core inventa el contexto.
    3.  **Generar POIs:** Pulsa el botón y la IA se inventará 6 lugares lógicos dentro de tu edificio (ej: si es una Nave Espacial, te sugerirá "Sala de Motores", "Puente de Mando", etc.).
*   **Los 3 Botones del Poder:**
    *   🌍 **Mundo:** Genera mapa táctico, vistas isométricas y los 6 interiores.
    *   🔮 **UI:** Genera botones, ventanas y barras de vida que pegan con tu civilización.
    *   ⚔️ **Personajes:** Genera al Héroe, Villano, NPCs, Mascota y hasta una hoja de insignias (tokens) con sus caras.
*   **Resultado:** Una lista enorme de prompts que comparten el mismo ADN visual. Copias todo, lo pegas en tu generador, y a dormir.

---

## 🧠 Inteligencia Artificial (Tu Becario Digital)

Atlas_Core no está solo. Tiene a Gemini (la IA de Google) encerrada en el sótano trabajando para ti.

*   **Optimizar con IA:** ¿Tu prompt es soso? Dale a este botón y Gemini lo reescribirá usando palabras de crítico de arte pedante ("iluminación volumétrica", "subsurface scattering", "claroscuro").
*   **Derivar Escena:** ¿Te gusta el lugar pero quieres ver otra habitación? Dale al botón y la IA imaginará una sala adyacente.

---

## ⚙️ Configuración Técnica (La letra pequeña)

En el paso 10 (o abajo del todo) eliges el dialecto de la IA:

1.  **Universal:** Lenguaje natural rico. Funciona bien en DALL-E 3 y Gemini.
2.  **Midjourney:** El estándar de oro. Añade parámetros raros como `--ar 16:9 --stylize 250`. Si usas MJ, usa este.
3.  **Técnico (SD):** Solo palabras clave separadas por comas. Para los valientes que usan Stable Diffusion o ComfyUI.

---

## ⚠️ Advertencias Finales

*   **Anacronismos:** Si mezclas "Vikingos" con "Futuro Lejano", la herramienta te juzgará en silencio, pero generará un prompt increíble sobre Vikingos Espaciales.
*   **Memoria:** Hay un botón "MEMORY" arriba. Guarda tus últimos 100 prompts. Úsalo antes de cerrar la pestaña y perder la obra maestra de tu vida.

¡Ahora ve y crea mundos! (Y si salen mal, culpa a la IA).
