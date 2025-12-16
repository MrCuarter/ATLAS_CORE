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
    
    If the target is 'Midjourney':
    - Maintain the '::' multi-prompt structure if present.
    - Enhance vocabulary (e.g., change "fog" to "ethereal thick volumetric fog").
    - Add lighting details (e.g., "cinematic lighting", "ray tracing").
    - Keep parameters like --ar at the end.
    
    If the target is 'Generic':
    - Write a flowing, descriptive paragraph.
    - Focus on texture, mood, and specific details implied by the input.
    
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

        const systemInstruction = `You are a Game Asset Designer expert.
        Your task is to create TWO specific image prompts based on the context of a game world provided by the user.
        
        The context is: "${contextDescription}"

        You must output specific instructions to generate:
        1. A "Game UI Kit" (User Interface). 
           - Must include: empty dialog boxes, blank rectangular buttons, blank round buttons, window frames of different shapes.
           - Constraint: "Not too many elements, ensure high resolution and quality".
           - Style: Must match the civilization/atmosphere of the context (e.g., stone for medieval, holograms for sci-fi).
           - View: Isolated on a plain background (sprite sheet style).

        2. A "Game Items & Icons Set".
           - Must include: 5-6 items directly related to the context (e.g., potions, weapons, tools, artifacts).
           - Style: Consistent with the UI.
           - View: Grid layout, isolated.

        Output Format:
        Return the result as a single text block formatted like this:
        
        **UI KIT PROMPT:**
        [Prompt description here]

        **ITEMS PROMPT:**
        [Prompt description here]
        `;

        const response = await ai.models.generateContent({
            model: modelId,
            contents: "Generate the assets prompts now.",
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.7,
            }
        });

        return response.text?.trim() || "";

    } catch (error) {
        console.error("❌ Error generating assets:", error);
        return "";
    }
}