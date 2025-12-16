import { GoogleGenAI } from "@google/genai";
import { PromptType } from "../types";

export const enhancePromptWithGemini = async (currentPrompt: string, promptType: PromptType): Promise<string> => {
  console.log("🚀 Iniciando petición a Gemini...");
  
  try {
    // Gracias al puente en index.tsx, ahora process.env.API_KEY debería tener valor
    const apiKey = process.env.API_KEY;

    if (!apiKey) {
      console.error("❌ ERROR CRÍTICO: No se encontró la API Key en process.env.API_KEY.");
      console.error("Pasos para solucionar:");
      console.error("1. En Vercel, la variable debe llamarse 'VITE_API_KEY'.");
      console.error("2. Debes hacer REDEPLOY tras cambiar la variable.");
      alert("Error: Falta la API Key. Revisa la consola (F12) para más detalles.");
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
         alert("Error de API Key: Verifica que es válida y tiene permisos.");
    }
    return currentPrompt; 
  }
};