import { GoogleGenAI } from "@google/genai";
import { PromptType } from "../types";

const getApiKey = () => process.env.API_KEY || "";

export const enhancePromptWithGemini = async (currentPrompt: string, promptType: PromptType): Promise<string> => {
  try {
    const apiKey = getApiKey();
    if (!apiKey) return currentPrompt;
    const ai = new GoogleGenAI({ apiKey });
    const modelId = "gemini-3-flash-preview";

    const systemInstruction = `You are an expert Prompt Engineer. Rewrite the input prompt to be highly professional.
    
    ### CRITICAL RULE: ART STYLE SUPREMACY
    If the Style (e.g. Cyberpunk) clashes with the Theme (e.g. Medieval), OVERRIDE THE THEME'S MATERIALS. 
    Use "Neo-Medieval" or "Techno-Organic" keywords. 

    ### BACKGROUND PROTOCOL (FOR CHARACTERS/ASSETS)
    Always request: "ISOLATED ON TRANSPARENT BACKGROUND (PNG ALPHA). FALLBACK IF IMPOSSIBLE: SOLID PURE WHITE (#FFFFFF). NO shadows, NO background clutter."

    ### OUTPUT
    Aspect Ratio must match original or be 16:9. For Midjourney, use '::' structure. Output ONLY text.`;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: `Target: ${promptType}\nPrompt: ${currentPrompt}`,
      config: { systemInstruction, temperature: 0.7 }
    });
    return response.text?.trim() || currentPrompt;
  } catch (error) {
    console.error(error);
    return currentPrompt; 
  }
};

export const generateGameAssetsPrompt = async (context: string): Promise<string> => {
    try {
        const apiKey = getApiKey();
        if (!apiKey) return "";
        const ai = new GoogleGenAI({ apiKey });
        const modelId = "gemini-3-flash-preview";

        const systemInstruction = `You are a Lead Game Artist. Generate Midjourney prompts for a professional Game UI Kit based on: "${context}".
        
        ### REQUIREMENTS
        - BACKGROUND: Strict Transparent (PNG Alpha). If not supported, use Solid Pure White (#FFFFFF). No checkerboard. No false transparency.
        - STYLE: Must match the context's art style exactly.
        
        - UI COMPONENTS TO INCLUDE:
          * ICONS: 8 Circular buttons (OK, Cancel, Settings, Play, Pause, List, and templates).
          * HUD BARS: 4 short bars (Health/Heart, Energy/Bolt, Currency/Coin, Blank) and 2 long cinematic bars (one organic, one tech).
          * WINDOWS: Frames for UI dialogs.
        
        - ITEM SHEET: 
          * Layout: Perfect 3x5 Grid (15 unique items).
        
        Output ONLY the prompts in clear labeled sections.`;

        const response = await ai.models.generateContent({
            model: modelId,
            contents: "Execute.",
            config: { systemInstruction, temperature: 0.6 }
        });
        return response.text?.trim() || "";
    } catch (error) {
        console.error(error);
        return "";
    }
}

export const generatePOISuggestions = async (place: string, civ: string): Promise<string[]> => {
    try {
        const apiKey = getApiKey();
        if (!apiKey) return [];
        const ai = new GoogleGenAI({ apiKey });
        const modelId = "gemini-3-flash-preview";
        const systemInstruction = `List 6 creative "Points of Interest" inside "${place}" for a "${civ}" theme. Return strictly as a JSON array of strings. No extra text.`;
        const response = await ai.models.generateContent({
            model: modelId,
            contents: "Generate.",
            config: { systemInstruction, temperature: 0.7, responseMimeType: "application/json" }
        });
        const text = response.text?.trim();
        return text ? JSON.parse(text) : [];
    } catch (error) {
        console.error(error);
        return [];
    }
}