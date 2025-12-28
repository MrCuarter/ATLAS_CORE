
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
        // TYPE B: MIDJOURNEY ENHANCER - STRICT PRESERVATION
        systemInstruction = `You are a Midjourney V6 Prompt Expert.
        TASK: Optimize the input prompt by translating to English and adding high-quality texture/lighting keywords, BUT YOU MUST PRESERVE THE USER'S CORE SELECTIONS.
        
        CRITICAL RULES:
        1. **TRANSLATE TO ENGLISH**: All Spanish text must be translated.
        2. **PRESERVE STYLE**: If the prompt says specific style references (e.g. "**Disney/Pixar Style**", "Arcane", "Pixel Art"), YOU MUST KEEP THEM EXACTLY AS IS.
        3. **PRESERVE CAMERA**: If the prompt says "Top-Down View", "Isometric", or "Side View", YOU MUST KEEP THAT EXACT CAMERA TOKEN.
        4. **STRUCTURE**: Keep the '::' separators.
        5. **ENHANCE**: Add technical keywords (e.g. "volumetric lighting", "octane render", "8k") ONLY if they fit the requested style.
        6. **NO HALLUCINATIONS**: Do not change the Civilization or Place type.
        
        7. **INTERIOR FOCUS FOR SCENES**: If the prompt is for a scene/POI (like a tavern, shop, library, temple):
           - YOU MUST describe the INTERIOR of the place.
           - THE PERSPECTIVE MUST be from the character's POV standing at the doorway/entrance threshold, looking deep into the room.
           - Use terms like "viewed from the threshold", "POV from the entrance looking in", "framing the interior through the open door".

        8. **CHARACTER SHEETS**: If the prompt mentions "Character Sheet" or "Poses", you MUST add parameters to ensure separation: "Wide spacing between poses, no overlapping, white background".
        
        9. **PET SHEETS**: If the prompt mentions "Companion/Pet" or "Creature Concept Sheet":
           - MUST specify "Quadruped" or "Beast".
           - MUST specify "Vertical Layout" and "Three distinct poses: Top, Center, Bottom".
           - MUST use "--ar 9:16".
        
        10. **NO PEOPLE**: If the prompt is for a Map or Scene (and not a Character Sheet), add "--no people characters figures" and ensure the description emphasizes "empty environment, architectural focus".
        `;
    } else if (promptType === PromptType.UNIVERSAL) {
        // TYPE A: UNIVERSAL ENHANCER - TECHNICAL ART DIRECTOR
        systemInstruction = `You are a Technical Art Director for Game Assets (DALL-E 3 / Gemini).
        TASK: Rewrite the prompt into a rich English description, but strictly adhere to the technical constraints provided in the input.
        
        STRICT CONSTRAINTS (DO NOT IGNORE):
        1. **PERSPECTIVE IS SACRED**: If the input specifies "Top-Down View (90º)" or "Isometric", the output MUST explicitly state "Top-Down View" or "Isometric view".
        2. **STYLE FIDELITY**: If the input mentions a specific influence (e.g. "Disney / Pixar", "Elden Ring"), the output must explicitly mention "in the style of [Reference]".
        
        3. **INTERIOR POI FOCUS**: If generating a scene for a specific location (POI):
           - The prompt MUST depict the INTERIOR of the location.
           - The view MUST be a first-person perspective standing exactly at the entrance threshold, looking into the room.
           - Describe the interior atmosphere, furniture, and depth as seen from the doorway.

        4. **BACKGROUND**: If the input says "Isolated on white background", KEEP IT.
        5. **CHARACTER SEPARATION**: If generating a Character Sheet with multiple poses, you MUST explicitly state: "Ensure wide negative space between character poses, no overlapping elements, distinct separation".
        6. **PET SHEETS**: If the input is for a "Companion/Pet" or "Creature", ensure the output describes a QUADRUPED beast in a VERTICAL layout (9:16) with 3 DISTINCT POSES (Top, Center, Bottom).
        7. **NO PEOPLE**: If the prompt is for a MAP or SCENE, explicit state: "The scene is devoid of people. No characters present. Focus on environment and architecture."
        
        ENHANCEMENT STRATEGY:
        - Translate to English.
        - Improve lighting/texture (e.g. "subsurface scattering", "dynamic shadows") to match the mood.
        - Use diverse vocabulary to avoid repetitiveness.
        `;
    } else {
        // TYPE C: ADVANCED/TECHNICAL ENHANCER (Tokens)
        systemInstruction = `You are a Stable Diffusion Prompt Engineer.
        TASK: Optimize the comma-separated token list.
        
        RULES:
        1. **TRANSLATE TO ENGLISH**.
        2. **ENFORCE INTERIOR FOR POIs**: If the location is an interior place, add tags like "indoor, interior view, looking through doorway, first person view from threshold".
        3. **PRESERVE CORE TOKENS**: Do not remove the camera type, the Style Reference, or the Civilization.
        4. **EXPAND**: Add technical tags (e.g., "ray tracing", "8k", "highly detailed", "sharp focus").
        5. **NEGATIVE PROMPT**: Ensure the 'Negative prompt:' section is preserved at the end.
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
        const systemInstruction = `List 6 creative "Points of Interest" inside "${place}" for a "${civ}" theme. Return strictly as a JSON array of strings. No extra text. Keep names in the original language if it adds flavor, but prefer English if generic.`;
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
        
        const systemInstruction = `You are a Creative Director. Analyze the prompt. Create a NEW prompt for a related Point of Interest (POI) derived from that location. Maintain the same format style (Universal, MJ, or Token list). Translate to English if needed. Ensure the view is from the doorway threshold looking into the interior.`;

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
