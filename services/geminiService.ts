
import { GoogleGenAI } from "@google/genai";
import { PromptType, MediaType } from "../types";

const getApiKey = () => process.env.API_KEY || "";

export const enhancePromptWithGemini = async (currentPrompt: string, promptType: PromptType): Promise<string> => {
  try {
    const apiKey = getApiKey();
    if (!apiKey) return currentPrompt;
    const ai = new GoogleGenAI({ apiKey });
    const modelId = "gemini-3-flash-preview";

    let systemInstruction = "";

    if (promptType === PromptType.MIDJOURNEY) {
        // TYPE B: MIDJOURNEY ENHANCER
        systemInstruction = `You are a Midjourney V6 Prompt Expert.
        TASK: Optimize the input prompt specifically for Midjourney V6.
        
        RULES:
        1. Keep the '::' separator structure if present.
        2. Enhance the 'Artistic keywords' to be more evocative (e.g. change "red" to "crimson, vermilion").
        3. Ensure '--ar' and '--v 6.0' flags are at the very end.
        4. Do NOT remove the subject or the core style.
        `;
    } else if (promptType === PromptType.UNIVERSAL) {
        // TYPE A: UNIVERSAL ENHANCER (Conversational)
        systemInstruction = `You are a Creative Writing Assistant for Generative AI.
        TASK: Rewrite the prompt to be a flowing, descriptive paragraph.
        
        RULES:
        1. Use natural language (English).
        2. Focus on lighting, texture, and mood.
        3. Remove technical jargon like "Visual DNA:" or brackets [].
        4. Ensure the first sentence clearly states the subject and view (e.g. "Create a high-resolution image of...").
        `;
    } else {
        // TYPE C: ADVANCED/TECHNICAL ENHANCER (Tokens)
        systemInstruction = `You are a Stable Diffusion Prompt Engineer.
        TASK: Optimize the comma-separated token list.
        
        RULES:
        1. Keep the format: (quality tags), subject, style, technical.
        2. Add danbooru-style tags where appropriate for the requested style.
        3. Ensure the 'Negative prompt:' section is preserved at the end.
        4. Do NOT convert to sentences. Keep it as a list of tags.
        `;
    }

    const response = await ai.models.generateContent({
      model: modelId,
      contents: `CURRENT PROMPT:\n${currentPrompt}`,
      config: { systemInstruction, temperature: 0.7 }
    });
    return response.text?.trim() || currentPrompt;
  } catch (error) {
    console.error(error);
    return currentPrompt; 
  }
};

export const generateGameAssetsPrompt = async (context: string): Promise<string> => {
    // Legacy function, keeping generic structure
     try {
        const apiKey = getApiKey();
        if (!apiKey) return "";
        const ai = new GoogleGenAI({ apiKey });
        const modelId = "gemini-3-flash-preview";

        const systemInstruction = `You are a Lead Game Artist. Generate Midjourney prompts for a professional Game UI Kit based on: "${context}".
        
        Output ONLY the prompts.`;

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

export const generateDerivedScene = async (currentPrompt: string, mediaType: MediaType): Promise<string> => {
    try {
        const apiKey = getApiKey();
        if (!apiKey) return currentPrompt;
        const ai = new GoogleGenAI({ apiKey });
        const modelId = "gemini-3-flash-preview";
        
        const systemInstruction = `You are a Creative Director. Analyze the prompt. Create a NEW prompt for a related Point of Interest (POI) derived from that location. Maintain the same format style (Universal, MJ, or Token list).`;

        const response = await ai.models.generateContent({
            model: modelId,
            contents: `Original: ${currentPrompt}`,
            config: { systemInstruction, temperature: 0.8 }
        });
        return response.text?.trim() || currentPrompt;
    } catch (error) {
        console.error(error);
        return currentPrompt;
    }
}
