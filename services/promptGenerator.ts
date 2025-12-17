import { MapConfig, MediaType, PromptType, PromptCollectionItem, Language, NarrativeMode } from '../types';
import { PROMPT_TRANSLATIONS, UI_TEXT } from '../constants';

const t = (val: string): string => PROMPT_TRANSLATIONS[val] || val || '';

const getPersonaInstruction = () => {
    return `You are a world-class Game Illustrator and Narrative UX Designer. Your expertise lies in creating high-fidelity, immersive game environments and tactical map assets for AAA titles. Your goal is to generate a visual asset that strictly adheres to the requested technical specifications.`;
};

const getVisualDNA = (config: MapConfig): string => {
    const style = t(config.artStyle);
    const civ = t(config.civilization);
    const era = t(config.era);
    const manual = config.manualDetails ? `CUSTOM DETAILS: ${config.manualDetails}.` : "";
    const manualPOI = config.manualPOIs && config.manualPOIs[0] ? `KEY FEATURE: ${config.manualPOIs[0]}.` : "";
    
    return `**Visual DNA: ${style}**. Cultural Context: ${civ} heritage during the era of ${era}. [Render Engine: Unreal Engine 5.4] [Visual Density: High] ${manual} ${manualPOI} [Atmosphere: ${config.customAtmosphere || 'Default atmospheric depth'}]`;
};

export const generatePrompt = (config: MapConfig, mediaType: MediaType, promptType: PromptType): string => {
    const place = t(config.placeType);
    const civ = t(config.civilization);
    const settlement = t(config.buildingType);
    const era = t(config.era);
    const zoom = t(config.zoom);
    const camera = t(config.camera);
    const arValue = config.aspectRatio?.split(' ')[0] || '16:9';
    const dna = getVisualDNA(config);

    // CRITICAL: NEGATIVE PROMPT INJECTION FOR ALL MODES
    const negativeConstraints = "STRICT NEGATIVE PROMPT (DO NOT INCLUDE): Text, typography, letters, watermarks, signatures, UI elements, HUD, interface, buttons, menu bars, floating icons, health bars, speech bubbles, blurry areas, low quality.";

    if (promptType === PromptType.MIDJOURNEY) {
        return `**MAP PROTOCOL: ${t(config.artStyle)}** :: Top-down tactical game map of ${place} featuring ${settlement} inhabited by ${civ} :: Era: ${era} :: ${dna} :: ${zoom}, ${camera} --ar ${arValue} --v 6.0 --stylize 400 --no text ui hud watermarks interface`;
    } else {
        return `${getPersonaInstruction()}
---
EXECUTIVE DIRECTIVE: Generate a professional game asset.
SUBJECT: Highly detailed top-down view of ${place}.
COMPONENT: ${settlement}, architectural style of ${civ} from the ${era} era.
VISUAL ADN: ${dna}.
TECHNICAL SETUP: ${zoom}, ${camera}.
ASPECT RATIO: CRITICAL! Ensure a wide horizontal layout at exactly ${arValue} aspect ratio.
STYLE FIDELITY: Maintain the aesthetic of ${t(config.artStyle)} consistently across the entire frame. 
${negativeConstraints}
8K High Definition.`;
    }
}

export const getRandomElement = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export const generateNarrativeCollection = (config: MapConfig, promptType: PromptType, lang: Language, mode: NarrativeMode): PromptCollectionItem[] => {
    const baseMap = generatePrompt(config, MediaType.IMAGE, promptType);
    const dna = getVisualDNA(config);
    
    // UPDATED BACKGROUND INSTRUCTION: Priority Transparency > White
    const backgroundInstruction = "BACKGROUND PROTOCOL: ISOLATED ON TRANSPARENT BACKGROUND (PNG ALPHA). IF ALPHA IS NOT POSSIBLE, USE SOLID PURE WHITE (#FFFFFF). NO SHADOWS, NO GRADIENTS, NO CHECKERBOARD.";
    const noText = "NO TEXT, NO UI, NO HUD.";

    const items: PromptCollectionItem[] = [];
    
    if (mode === NarrativeMode.WORLD) {
        items.push({ title: "Mapa Táctico de Campaña", type: 'MAP', prompt: baseMap });
        items.push({ title: "Vista de Perspectiva Épica", type: 'PERSPECTIVE', prompt: `${baseMap} -- Cinematic aerial view, epic wide angle perspective. ${noText}` });
        items.push({ title: "Entrada Principal al Escenario", type: 'SCENE', prompt: `Concept art of the main entrance to ${t(config.placeType)}. ${dna}. Ground level perspective. ${noText}` });
    }
    
    // Future expansion for CHARACTERS or UI would use the backgroundInstruction here.
    
    return items;
};