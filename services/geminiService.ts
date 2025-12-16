import { GoogleGenAI } from "@google/genai";
import { PromptType } from "../types";

export const enhancePromptWithGemini = async (currentPrompt: string, promptType: PromptType): Promise<string> => {
  console.log("🚀 Iniciando petición a Gemini...");
  
  try {
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