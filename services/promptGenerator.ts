import { MapConfig, MediaType, PromptType, PromptCollectionItem, Language } from '../types';
import { PROMPT_TRANSLATIONS, POI_MAPPING, UI_TEXT } from '../constants';

// Helper to translate values
const t = (val: string): string => {
  if (!val) return '';
  return PROMPT_TRANSLATIONS[val] || val;
};

// 1. VISUAL DNA CONSTRUCTOR (Strict English & Technical)
const getVisualDNA = (civ: string, placeType: string, time: string, weather: string): string => {
    
    // PALETTE & MATERIALS (Based on Civ)
    let palette = "Neutral grey, earthy tones";
    let materials = "Standard construction materials";
    let tech = "Low tech";

    // Helper to detect keywords (English or Spanish inputs)
    const has = (str: string, key: string) => str.toLowerCase().includes(key.toLowerCase());

    if (has(civ, "Human") || has(civ, "Imperial") || has(civ, "Humana")) {
        palette = "Royal Blue (#4169E1), White Marble, Gold Accents";
        materials = "Polished stone, limestone, oak wood, iron reinforcements";
        tech = "Classical mechanics, torchlight";
    } else if (has(civ, "Elf") || has(civ, "Elfos")) {
        palette = "Emerald Green (#50C878), Silver, Pearl White";
        materials = "Living wood, bioluminescent flora, white marble, curved architecture";
        tech = "Magic-infused nature, glowing runes";
    } else if (has(civ, "Orc") || has(civ, "Orcos")) {
        palette = "Rust Red (#804040), Charcoal Black, Mud Brown";
        materials = "Scrap iron, raw timber, animal leather, jagged rocks";
        tech = "Primitive industrial, fire-based";
    } else if (has(civ, "Cyberpunk") || has(civ, "Futurist")) {
        palette = "Neon Cyan (#00FFFF), Magenta (#FF00FF), Deep Black";
        materials = "Carbon fiber, wet concrete, glass, holograms";
        tech = "High-tech, holographic displays, LED strips";
    } else if (has(civ, "Dwarven") || has(civ, "Enanos")) {
        palette = "Bronze (#CD7F32), Slate Grey, Lava Orange";
        materials = "Carved granite, heavy iron, molten gold geometry";
        tech = "Steam power, subterranean forges";
    } else if (has(civ, "Alien") || has(civ, "Alienígena")) {
        palette = "Bio-Luminescent Purple (#9932CC), Acid Green, Obsidian";
        materials = "Organic resin, chitin, unknown alloys, pulsating veins";
        tech = "Biotechnology, anti-gravity";
    }

    // WEAR LEVEL (Based on Place Type)
    let wear = "Moderate wear";
    if (has(placeType, "Ruins") || has(placeType, "Dungeon") || has(placeType, "Desguace")) {
        wear = "Heavy weathering, cracks, moss, decay, dust";
    } else if (has(placeType, "Palace") || has(placeType, "Lab") || has(placeType, "Temple")) {
        wear = "Pristine condition, polished surfaces, clean";
    }

    // LIGHTING TEMPERATURE (Based on Time/Weather)
    let light = "Neutral daylight";
    if (has(time, "Night") || has(time, "Noche")) {
        light = "Moonlight (Blue Tones), high contrast shadows, artificial light sources";
    } else if (has(time, "Sunset") || has(time, "Atardecer")) {
        light = "Golden Hour (Warm Orange Tones), long shadows, rim lighting";
    }
    
    if (has(weather, "Fog") || has(weather, "Niebla")) {
        light += ", Volumetric fog, soft diffusion";
    } else if (has(weather, "Rain") || has(weather, "Lluvia")) {
        light += ", Wet surfaces, reflections, moody atmosphere";
    }

    return `VISUAL DNA: [Palette: ${palette}] [Materials: ${materials}] [Lighting: ${light}] [Wear: ${wear}] [Tech: ${tech}]`;
};

// 2. EXCLUSIONS (Negative Prompts)
const getExclusions = (promptType: PromptType): string => {
    const base = "text, watermark, ui elements, hud, blur, distortion, low quality, pixelated, cartoon, anime";
    if (promptType === PromptType.MIDJOURNEY) {
        return `--no ${base}`;
    }
    return `Exclusions: ${base}.`;
};

// Helper: Fisher-Yates Shuffle
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export const generatePrompt = (
  config: MapConfig,
  mediaType: MediaType,
  promptType: PromptType
): string => {
   // Legacy single prompt generator - kept for Simple/Advanced modes
   // But we will inject a bit of English translation to ensure stability
   const place = t(config.placeType);
   const style = t(config.artStyle);
   
   if (promptType === PromptType.MIDJOURNEY) {
       return `**${place}** :: ${t(config.civilization)} style :: ${t(config.time)}, ${t(config.weather)} :: ${style} --ar 16:9 --v 6.0`;
   }
   return `A high quality image of ${place} in a ${t(config.civilization)} style. Atmosphere: ${t(config.time)}, ${t(config.weather)}. Style: ${style}. Aspect Ratio 16:9.`;
};


export const generateNarrativeCollection = (
  config: MapConfig,
  promptType: PromptType,
  lang: Language
): PromptCollectionItem[] => {
  const collection: PromptCollectionItem[] = [];
  const labels = UI_TEXT[lang];

  // 1. TRANSLATE INPUTS TO ENGLISH
  const placeTypeVal = t(config.placeType);
  const civVal = t(config.civilization);
  const timeVal = t(config.time);
  const weatherVal = t(config.weather);
  const styleVal = t(config.artStyle);
  const renderVal = t(config.renderTech);

  // 2. CONSTRUCT DNA
  const visualDNA = getVisualDNA(config.civilization, config.placeType, config.time, config.weather);
  const exclusions = getExclusions(promptType);

  // 3. DEFINE GLOBAL STYLE STRING
  // "Cinematic 3D Render" or "Hand drawn map"
  const globalStyle = `${renderVal}, ${styleVal} style, high fidelity game asset`;

  // --- GENERATOR FUNCTIONS ---

  const buildPrompt = (subject: string, camera: string, focus: string): string => {
      if (promptType === PromptType.MIDJOURNEY) {
          return `**${subject}** :: ${focus} :: ${visualDNA} :: Camera: ${camera} :: Global Style: ${globalStyle} --ar 16:9 --v 6.0 --stylize 250 ${exclusions}`;
      } else {
          return `Generate a game asset of **${subject}**. Focus on ${focus}. ${visualDNA}. Camera Settings: ${camera}. Visual Style: ${globalStyle}. Aspect Ratio: 16:9. High resolution. ${exclusions}`;
      }
  };

  // --- ASSET 1: TACTICAL MAP ---
  collection.push({
    title: labels.assetMap,
    type: 'MAP',
    prompt: buildPrompt(
        `Tactical Battle Map of ${placeTypeVal}`, 
        "Top-down Orthographic 90-degree, f/8 (everything in focus)", 
        "Clear grid layout possibility, high contrast for visibility, playable terrain, flat projection, VTT optimized"
    )
  });

  // --- ASSET 2: ISOMETRIC VIEW ---
  collection.push({
    title: labels.assetIso,
    type: 'PERSPECTIVE',
    prompt: buildPrompt(
        `Isometric Establishing Shot of ${placeTypeVal}`, 
        "Isometric 45-degree angle, Telephoto lens", 
        "Showcasing the scale, layout and verticality of the location, regional overview"
    )
  });

  // --- ASSET 3: ENTRANCE ---
  collection.push({
    title: labels.assetEntrance,
    type: 'SCENE',
    prompt: buildPrompt(
        `Main Entrance to ${placeTypeVal}`, 
        "Eye-level 35mm lens, f/5.6", 
        "Imposing doorway/gate, transitional space, distinct architectural threshold, welcoming or forbidding mood"
    )
  });

  // --- ASSETS 4-10: POINTS OF INTEREST (Unique Variations) ---
  let rawPOIs = POI_MAPPING[config.placeType] || POI_MAPPING['DEFAULT'];
  let shuffledPOIs = shuffleArray(rawPOIs);

  // Differentiators to prevent repetitive images
  const differentiators = [
      "Focus on a specific light source casting long shadows",
      "Focus on a central hero prop or artifact",
      "Focus on architectural symmetry and columns",
      "Focus on a damaged or destroyed section",
      "Focus on verticality and ceiling details",
      "Focus on floor textures and debris",
      "Focus on atmospheric depth and particles"
  ];

  for (let i = 0; i < 7; i++) {
    const poiKey = shuffledPOIs[i % shuffledPOIs.length];
    const poiName = t(poiKey); // Translate to English
    const diff = differentiators[i % differentiators.length];

    collection.push({
      title: `${labels.poi} ${i + 1}: ${poiName}`,
      type: 'SCENE',
      prompt: buildPrompt(
        `Interior Scene: ${poiName} inside ${placeTypeVal}`, 
        "Cinematic 50mm lens, f/2.8 (shallow depth of field)", 
        `Detailed environmental storytelling. ${diff}. Specific function: ${poiName}`
      )
    });
  }

  // --- ASSET 11: UI KIT ---
  const uiDesc = `Game UI Sprite Sheet for ${civVal} setting`;
  const uiFocus = "Empty modular window frames, health bars, action buttons, inventory slots. Knolling layout. Isolated on solid black background";
  const uiCam = "Flat Vector Graphic, No perspective";
  
  collection.push({
    title: labels.assetUI,
    type: 'SCENE',
    prompt: buildPrompt(uiDesc, uiCam, uiFocus)
  });

  // --- ASSET 12: ITEMS ---
  const itemDesc = `RPG Item Icons Grid for ${placeTypeVal}`;
  const itemFocus = "6 distinct items (Key, Potion, Weapon, Map, Relic, Tool). Grid layout. Isolated on solid black background";
  
  collection.push({
    title: labels.assetItems,
    type: 'SCENE',
    prompt: buildPrompt(itemDesc, uiCam, itemFocus)
  });

  // --- ASSET 13: VICTORY ---
  collection.push({
    title: labels.assetVictory,
    type: 'VICTORY',
    prompt: buildPrompt(
        `Victory Reward Scene inside ${placeTypeVal}`, 
        "Low angle Hero shot, 24mm wide lens", 
        "Treasure chest or altar, Golden God Rays lighting, floating particles, feeling of success and reward"
    )
  });

  return collection;
};

export const getRandomElement = <T>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)];
};