import { GoogleGenAI } from "@google/genai";
import { PromptType } from "../types";

export const enhancePromptWithGemini = async (currentPrompt: string, promptType: PromptType): Promise<string> => {
  try {
    // We initialize inside the function to avoid "process is not defined" crashes 
    // during the initial app load in browsers.
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.warn("API Key not found in environment.");
      return currentPrompt;
    }

    const ai = new GoogleGenAI({ apiKey: apiKey });
    const modelId = "gemini-2.5-flash";
    
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

    return response.text?.trim() || currentPrompt;
  } catch (error) {
    console.error("Error enhancing prompt:", error);
    // Return original prompt on failure so the user experience isn't broken
    return currentPrompt; 
  }
};