import { GoogleGenAI } from "@google/genai";
import { PromptType } from "../types";

const getApiKey = () => {
    // Vite reemplazará 'process.env.API_KEY' por el string literal de la clave durante el build.
    const apiKey = process.env.API_KEY;

    // --- DEBUGGING SEGURO ---
    if (apiKey && apiKey.length > 4) {
        console.log(`🔑 API Key detectada e inyectada. Terminación: ...${apiKey.slice(-4)}`);
    } else {
        console.error("❌ API Key está vacía o undefined.");
        console.warn("Asegúrate de que VITE_API_KEY está definida en Vercel y has hecho REDEPLOY.");
    }
    // ------------------------
    return apiKey;
};

export const enhancePromptWithGemini = async (currentPrompt: string, promptType: PromptType): Promise<string> => {
  console.log("🚀 Iniciando petición a Gemini...");
  
  try {
    const apiKey = getApiKey();
    if (!apiKey) {
      alert("Error de Configuración: No se detectó la API Key. Revisa la consola.");
      return currentPrompt;
    }

    const ai = new GoogleGenAI({ apiKey });
    const modelId = "gemini-2.5-flash";
    
    console.log("⚡ Conectando con modelo:", modelId);

    const systemInstruction = `You are an expert Prompt Engineer for generative AI models like Midjourney and Stable Diffusion. 
    Your task is to take a raw, structured map description and rewrite it into a highly detailed, evocative, and professional prompt.
    
    ### CRITICAL RULE: ART STYLE SUPREMACY (OVERRIDE PROTOCOL)
    1. **Identify the Visual Style:** Look for "Visual Style", "Art Style" or specific game names (e.g., Cyberpunk 2077, Elden Ring, Pixar).
    2. **Identify the Civilization/Theme:** (e.g., Medieval, Steampunk, Tribal).
    3. **DETECT CONFLICTS:** If the Visual Style (e.g. Cyberpunk) clashes with the Civilization (e.g. Medieval), **YOU MUST OVERRIDE THE CIVILIZATION'S DEFAULT MATERIALS.**
       *   *Example Conflict:* "Medieval Knight" (Steel/Leather) + "Cyberpunk 2077 Style" (Neon/Plastic).
       *   *Correct Output:* "A Medieval Knight REIMAGINED with Cyberpunk aesthetics. High-tech composite armor plating, glowing neon heraldry, digital sword, rain-slicked chrome surfaces."
       *   *Incorrect Output:* "A knight in rusty steel armor standing in a neon city." (This looks like a cosplay, not a cohesive style).
    4. **ENFORCE THE STYLE:** The lighting, color palette, and rendering engine MUST match the Art Style, not the subject's time period.

    ### OUTPUT CONSTRAINTS
    - The output aspect ratio MUST be 16:9.
    
    ### TARGET: ${promptType}
    
    If 'Midjourney':
    - Maintain the '::' multi-prompt structure. Place the **Art Style** at the very beginning with high importance (e.g., **Style: Cyberpunk 2077** ::).
    - Enhance vocabulary (e.g., change "fog" to "ethereal thick volumetric fog").
    - ENSURE '--ar 16:9' is at the very end of the prompt.
    
    If 'Generic':
    - Write a flowing, descriptive paragraph.
    - Start by defining the visual style explicitly.
    - Focus on texture, mood, and specific details implied by the input Style.
    - Explicitly state "Aspect Ratio: 16:9" in the text.
    
    Output ONLY the final prompt text. No explanations.`;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: `Target Model: ${promptType}\nRaw Prompt: ${currentPrompt}`,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });

    const resultText = response.text?.trim();
    
    if (resultText) {
        console.log("✅ Respuesta recibida de Gemini");
        return resultText;
    } else {
        console.warn("⚠️ La respuesta de Gemini estaba vacía");
        return currentPrompt;
    }

  } catch (error) {
    console.error("❌ Error enhancing prompt:", error);
    // @ts-ignore
    if (error.message?.includes("API key")) {
         alert("Error de API Key: Verifica que es válida y tiene permisos en Google Cloud Console.");
    }
    return currentPrompt; 
  }
};

export const generateGameAssetsPrompt = async (contextDescription: string): Promise<string> => {
    console.log("🚀 Generando assets de juego...");
    try {
        const apiKey = getApiKey();
        if (!apiKey) return "";

        const ai = new GoogleGenAI({ apiKey });
        const modelId = "gemini-2.5-flash";

        // Advanced System Instruction for Professional Assets
        const systemInstruction = `You are a Lead Game UI/UX Artist and Illustrator specializing in Midjourney prompting.
        Your task is to analyze the provided Game World Context and generate TWO highly technical, polished Midjourney prompts.

        CONTEXT: "${contextDescription}"

        ---
        
        ### REQUIREMENTS FOR PROMPT 1: GAME UI KIT
        *   **Goal:** A modular sprite sheet for the game's interface.
        *   **Visual Style:** EXTRACT THE ART STYLE FROM THE CONTEXT FIRST. The UI must match that specific game/movie style (e.g., if Context says "Elden Ring", UI must be minimal, gold, spectral. If "Cyberpunk", UI must be glitchy, neon, holographic).
        *   **Elements:** Empty window frames (9-slice ready), Health/Mana bars, Action buttons (round/square), Dialogue box, Inventory slots.
        *   **Composition:** "Knolling" or "Sprite Sheet" layout. Elements must NOT touch.
        *   **Background:** Isolated on solid black (hex #000000).
        *   **Tech Specs:** --ar 16:9 --v 6.0 --stylize 250 --no text, blur, cropping

        ### REQUIREMENTS FOR PROMPT 2: ITEM ICONS
        *   **Goal:** A grid of inventory icons relevant to the location/theme.
        *   **Content:** 6 to 8 distinct items (e.g., specific weapon, potion, map, key, relic, tool) that fit the world.
        *   **Visual Style:** High-fidelity, vector game asset style, consistent with the identified Art Style.
        *   **Composition:** Grid layout, equal spacing.
        *   **Background:** Isolated on solid black (hex #000000).
        *   **Tech Specs:** --ar 16:9 --v 6.0 --stylize 250 --no text, blur

        ---

        ### OUTPUT FORMAT
        Return ONLY the two prompts below. Do not add introduction or conclusion.
        
        **UI KIT:**
        [Your optimized Midjourney prompt here] --ar 16:9 --v 6.0 --no text

        **ITEMS:**
        [Your optimized Midjourney prompt here] --ar 16:9 --v 6.0 --no text
        `;

        const response = await ai.models.generateContent({
            model: modelId,
            contents: "Execute generation.",
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.6, // Lower temperature for more precise adherence to structure
            }
        });

        return response.text?.trim() || "";

    } catch (error) {
        console.error("❌ Error generating assets:", error);
        return "";
    }
}

export const generatePOISuggestions = async (place: string, civ: string): Promise<string[]> => {
    console.log("🚀 Solicitando sugerencias de POIs a Gemini...");
    try {
        const apiKey = getApiKey();
        if (!apiKey) return [];

        const ai = new GoogleGenAI({ apiKey });
        const modelId = "gemini-2.5-flash";

        const systemInstruction = `You are an expert Worldbuilder for RPG games.
        Given a specific PLACE and CIVILIZATION/THEME, your task is to list 6 distinct, creative "Points of Interest" (POIs) or rooms found inside that location.
        
        INPUT PLACE: "${place}"
        INPUT CIV/THEME: "${civ}"

        Return strictly a JSON array of 6 strings. Example:
        ["Throne Room", "Secret Armory", "Gardens", "Dungeon Cell", "Kitchen", "Watchtower"]
        
        Do not add any other text.
        `;

        const response = await ai.models.generateContent({
            model: modelId,
            contents: "Generate POIs.",
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.7,
                responseMimeType: "application/json"
            }
        });

        const text = response.text?.trim();
        if (!text) return [];
        return JSON.parse(text);

    } catch (error) {
        console.error("❌ Error generating POI suggestions:", error);
        return [];
    }
}