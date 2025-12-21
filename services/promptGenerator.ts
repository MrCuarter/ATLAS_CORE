
import { MapConfig, MediaType, PromptType, PromptCollectionItem, Language, NarrativeMode } from '../types';
import { PROMPT_TRANSLATIONS, UI_TEXT, STYLE_WIZARD_DATA } from '../constants';

const t = (val: string): string => PROMPT_TRANSLATIONS[val] || val || '';

// HELPER: Extract internal wizard tokens if they exist, otherwise fallback to legacy field
const getStyleToken = (config: MapConfig): { ref: string, vibe: string, detail: string, clarity: string, finish: string } => {
    const cat = config.styleCategory || 'Videojuego';
    const refObj = STYLE_WIZARD_DATA.references[cat]?.find(r => r.label === config.styleReference);
    const vibeObj = STYLE_WIZARD_DATA.vibes.find(v => v.label === config.styleVibe);
    const detailObj = STYLE_WIZARD_DATA.details.find(d => d.label === config.styleDetail);
    const clarityObj = STYLE_WIZARD_DATA.clarity.find(c => c.label === config.styleClarity);
    const finishObj = STYLE_WIZARD_DATA.finish.find(f => f.label === config.styleFinish);

    return {
        ref: refObj?.token || config.artStyle || 'High fantasy style',
        vibe: vibeObj?.token || '',
        detail: detailObj?.token || '',
        clarity: clarityObj?.token || '',
        finish: finishObj?.token || ''
    };
};

const getInternalMovement = (label: string): string => {
    // Map User Label to Internal English Token
    switch (label) {
        case 'Cámara fija': return 'Static camera shot';
        case 'Desplazamiento suave': return 'Slow, smooth camera pan';
        case 'Acercamiento (Zoom In)': return 'Slow cinematic zoom in';
        case 'Alejamiento (Zoom Out)': return 'Slow pull back (zoom out) reveal';
        case 'Barrido panorámico': return 'Wide panoramic camera sweep';
        case 'Movimiento orbital': return 'Orbital rotation around the subject';
        default: return 'Slow, smooth camera movement';
    }
};

export const getRandomElement = <T>(arr: T[]): T => {
    if (!arr || arr.length === 0) return undefined as any;
    return arr[Math.floor(Math.random() * arr.length)];
};

export const generatePrompt = (config: MapConfig, mediaType: MediaType, promptType: PromptType): string => {
    // 1. DETERMINE CORE SUBJECTS
    const isVideo = mediaType === MediaType.VIDEO;
    // Check asset type or fallback to camera keywords
    const isScene = config.assetType === 'SCENE' || 
                    (!config.assetType && (config.camera?.toLowerCase().includes('frontal') || config.camera?.toLowerCase().includes('scenic')));

    const place = t(config.placeType);
    const civ = t(config.civilization);
    const building = t(config.buildingType);
    const poi = (config.manualPOIs && config.manualPOIs[0]) ? config.manualPOIs[0] : building;
    
    // Ensure all variables passed to string templates are translated
    const time = config.time ? `${t(config.time)}` : 'daytime';
    const weather = config.weather ? `${t(config.weather)}` : 'clear weather';
    const camera = t(config.camera) || (isScene ? 'Cinematic Eye-Level Shot' : 'Top-down Map View');
    const ar = config.aspectRatio?.split(' ')[0] || '16:9';
    const tokens = getStyleToken(config);
    
    // Use mapped motion or default
    const videoAction = isVideo ? getInternalMovement(config.videoMovement || 'Desplazamiento suave') : "";

    // 2. BRANCH BY PROMPT TYPE
    
    // === TYPE A: UNIVERSAL (GEMINI, DALL-E, WEB) - NATURAL LANGUAGE REFACTOR ===
    if (promptType === PromptType.UNIVERSAL) {
        const typeStr = isVideo ? "cinematic video clip" : "high-resolution concept art image";
        const viewStr = isScene ? "eye-level perspective" : "top-down tactical view";
        const subjectStr = isScene ? `depicting ${poi} located within ${place}` : `showing a detailed map of ${place} centered on ${building}`;
        
        // Remove "Visual Style:" prefix from token if present for smoother flow
        const cleanRef = tokens.ref.replace('Visual Style:', '').trim();

        return `Create a ${typeStr} ${subjectStr}. The setting belongs to the ${civ} civilization.
        
        The art direction is inspired by ${config.styleReference}. ${cleanRef}.
        The scene features a ${tokens.vibe.toLowerCase()} atmosphere with ${tokens.finish.toLowerCase()}.
        Lighting conditions are ${time.toLowerCase()} with ${weather.toLowerCase()}.
        
        Technical details: ${camera} ${viewStr}. ${isVideo ? `Camera Action: ${videoAction}. Duration: 5s.` : ''}
        High quality, wide ${ar} aspect ratio, professional game asset.`;
    }

    // === TYPE B: MIDJOURNEY ===
    if (promptType === PromptType.MIDJOURNEY) {
        const mainSubject = isScene 
            ? `Cinematic shot of ${poi} in ${place}, ${civ} architecture`
            : `Top-down game map of ${place}, ${building}, ${civ} style`;

        const envDetails = `Time: ${time}, Weather: ${weather}, ${config.customAtmosphere || 'Atmospheric lighting'}`;
        const styleBlock = `**${config.styleReference} Style** :: ${tokens.ref} :: ${tokens.vibe} :: ${tokens.finish}`;
        const motionText = isVideo ? `, ${videoAction} motion` : "";

        return `${mainSubject} ${motionText} :: ${envDetails} :: ${styleBlock} :: ${camera}, ${tokens.clarity} --ar ${ar} --v 6.0 --stylize 250 --no text ui interface`;
    }

    // === TYPE C: ADVANCED (STABLE DIFFUSION / COMFYUI) ===
    if (promptType === PromptType.ADVANCED) {
        const qualityPrefix = "(masterpiece, best quality, 8k, highres),";
        const subjectTags = isScene 
            ? `scenery, ${poi}, ${place}, ${civ} architecture,` 
            : `top-down map, game map, ${place}, ${building}, ${civ} style,`;
        
        const envTags = `${time}, ${weather}, ${config.customAtmosphere || ''},`;
        const styleTags = `${tokens.ref}, ${tokens.vibe}, ${tokens.detail}, ${tokens.finish},`;
        const techTags = `${camera}, ${tokens.clarity}, ${isVideo ? videoAction : ''}`;
        const negative = "Negative prompt: (worst quality, low quality:1.4), text, watermark, ui, interface, hud, username, blurry, artifacts, bad anatomy, deformed";

        return `${qualityPrefix} ${subjectTags} ${envTags} ${styleTags} ${techTags}\n${negative}`;
    }

    return "Error: Unknown Prompt Type";
}

// === STORYCRAFTER ENGINE (OFFLINE LOGIC) ===
export const generateNarrativeCollection = (config: MapConfig, promptType: PromptType, lang: Language, mode: NarrativeMode): PromptCollectionItem[] => {
    const items: PromptCollectionItem[] = [];
    const civ = t(config.civilization);
    const place = t(config.placeType);
    const time = config.time ? `${t(config.time)}` : 'daytime';
    const weather = config.weather ? `${t(config.weather)}` : 'clear';
    
    // Detailed Wizard Tokens
    const tokens = getStyleToken(config);
    const styleRef = config.styleReference || config.artStyle || 'Fantasy';
    const cleanRef = tokens.ref.replace('Visual Style:', '').trim();
    
    // --- FORMATTING HELPER BASED ON PROMPT TYPE ---
    const formatAsset = (assetType: string, subject: string, context: string, view: string, extraTech: string = "", customAr: string = "16:9"): string => {
        // LOGIC: Isolated background is ONLY for Characters and UI, NOT for World maps/scenes
        const isWorldMode = mode === NarrativeMode.WORLD;
        const safetyMargin = isWorldMode 
            ? "High quality, wide aspect ratio, professional game asset." 
            : "ISOLATED ON PURE WHITE BACKGROUND. Wide safety margin around the subject. NO CROPPING. Wide negative space between elements.";
        
        const techLine = `${view}. ${extraTech}`;
        const ar = customAr;

        // 1. UNIVERSAL
        if (promptType === PromptType.UNIVERSAL) {
            return `Create a high-resolution ${assetType} showing ${subject}. The setting belongs to the ${civ} civilization.
            
            The art direction is inspired by ${styleRef}. ${cleanRef}.
            The scene features a ${tokens.vibe.toLowerCase()} atmosphere with ${tokens.finish.toLowerCase()}.
            Lighting conditions are ${time.toLowerCase()} with ${weather.toLowerCase()}.
            
            Technical details: ${techLine}.
            ${safetyMargin}
            Aspect Ratio: ${ar}`;
        }

        // 2. MIDJOURNEY
        if (promptType === PromptType.MIDJOURNEY) {
            return `${assetType} of ${subject}, ${civ} style :: ${context}, Time: ${time}, Weather: ${weather} :: **${styleRef} Style** :: ${cleanRef} :: ${tokens.vibe}, ${tokens.finish} :: ${techLine}, Balanced composition, Natural blending --ar ${ar} --v 6.0 --stylize 250 --no text ui interface`;
        }

        // 3. TECHNICAL (Stable Diffusion)
        if (promptType === PromptType.ADVANCED) {
            const quality = "(masterpiece, best quality, 8k, highres),";
            const isolationTag = isWorldMode ? "" : ", isolated on white background, simple background";
            const neg = "Negative prompt: (worst quality, low quality:1.4), text, watermark, ui, interface, hud, username, blurry, artifacts, bad anatomy, deformed";
            return `${quality} ${assetType}, ${subject}, ${civ} style, ${time}, ${weather}, ${cleanRef}, ${tokens.vibe}, ${tokens.detail}, ${tokens.finish}, ${techLine}${isolationTag}, ${tokens.clarity} \n${neg}`;
        }

        return "";
    };

    // --- MODE 1: WORLD (Maps + Scenes) ---
    if (mode === NarrativeMode.WORLD) {
        // 1. Top Down Map
        items.push({
            title: "MAP: Top Down View",
            type: 'MAP',
            prompt: formatAsset(
                "game map", 
                `a detailed map of ${place}`, 
                `${place} terrain`, 
                "Top-Down View (90º), top-down tactical view"
            )
        });

        // 2. Isometric Map
        items.push({
            title: "MAP: Isometric View",
            type: 'MAP',
            prompt: formatAsset(
                "isometric environment", 
                `${place} with ${civ} architecture`, 
                `${place} terrain`, 
                "45-degree isometric view, tactical RPG perspective"
            )
        });

        // 3. POIs (Scenes)
        const pois = (config.manualPOIs && config.manualPOIs.some(p => p !== '')) 
            ? config.manualPOIs.filter(p => p !== '') 
            : ['Main Entrance', 'Market Square', 'Throne Room', 'Secret Passage', 'Armory', 'Living Quarters'];

        pois.forEach((poiName, idx) => {
            items.push({
                title: `SCENE ${idx + 1}: ${poiName}`,
                type: 'SCENE',
                prompt: formatAsset(
                    "concept art image", 
                    `${poiName} located within ${place}`, 
                    `Interior/Exterior of ${poiName}`, 
                    "Cinematic Eye-Level Shot, immersive perspective"
                )
            });
        });
    }

    // --- MODE 2: UI (Interface) ---
    if (mode === NarrativeMode.UI) {
        const uiElements = ['Main Menu Screen', 'Inventory Slot Frame', 'Dialogue Box Background', 'Health and Mana Bars', 'Action Button Icons'];
        
        uiElements.forEach((el, idx) => {
             items.push({
                title: `UI: ${el}`,
                type: 'UI',
                prompt: formatAsset(
                    "Game UI Asset", 
                    `${el} interface element`, 
                    `User Interface design`, 
                    "Flat vector graphic, front view, UI design"
                )
            });
        });
    }

    // --- MODE 3: CHARACTERS (Action Poses & Pet) ---
    if (mode === NarrativeMode.CHARACTERS) {
        const roles = [
            { role: 'Male Hero', desc: 'Main Warrior Character' },
            { role: 'Female Hero', desc: 'Main Mage/Rogue Character' },
            { role: 'Main Villain', desc: 'Antagonist, dark aura' },
            { role: 'Minion/Soldier', desc: 'Generic enemy unit' },
            { role: 'Sage/NPC', desc: 'Wise elder or Quest giver' }
        ];

        // Humanoids: Horizontal, 3 action poses (16:9)
        roles.forEach((r, idx) => {
            items.push({
                title: `CHAR: ${r.role}`,
                type: 'CHARACTER',
                prompt: formatAsset(
                    "Character Concept Sheet", 
                    `${r.role} (${r.desc})`, 
                    `Character design`, 
                    "Horizontal sheet showing **Three Distinct Dynamic Action Poses** (attacking, casting, running), surrounded by ample negative space, strictly separated, no overlapping elements. Full body",
                    "16:9"
                )
            });
        });

        // Pet/Creature: Vertical, 3 Poses (9:16)
        items.push({
            title: `CHAR: Companion/Pet`,
            type: 'CHARACTER',
            prompt: formatAsset(
                "Creature Concept Sheet", 
                `${civ} Quadruped Beast or Mythological Creature (Fantasy/Invented)`, 
                `Creature design`, 
                "Vertical Character Sheet (9:16 aspect ratio). Three distinct poses arranged vertically: Top (Alert/Standing), Center (Action/Attacking), Bottom (Resting/Sleeping). Wide negative space between poses.",
                "9:16"
            )
        });
    }

    return items;
};
