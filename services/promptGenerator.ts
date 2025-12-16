import { MapConfig, MediaType, PromptType, PromptCollectionItem, Language } from '../types';
import { PROMPT_TRANSLATIONS, POI_MAPPING, UI_TEXT } from '../constants';

// Helper to translate values
const t = (val: string): string => {
  if (!val) return '';
  // Check exact match first
  if (PROMPT_TRANSLATIONS[val]) return PROMPT_TRANSLATIONS[val];
  
  // If no exact match, try to find if the value contains a key part (heuristic)
  // e.g., "Micro (Bosque...)" -> "Micro"
  return val; 
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

/**
 * ROBUST PROMPT GENERATOR (MANUAL MODE)
 * Fixes: Includes all fields, handles empty values, proper grammar.
 */
export const generatePrompt = (
  config: MapConfig,
  mediaType: MediaType,
  promptType: PromptType
): string => {
   // 1. Extract and Translate inputs
   const scale = t(config.scale);
   const place = t(config.placeType);
   const poi = t(config.poi);
   const civ = t(config.civilization);
   const time = t(config.time);
   const weather = t(config.weather);
   const style = t(config.artStyle);
   const render = t(config.renderTech);
   const zoom = t(config.zoom);
   const camera = t(config.camera);
   const customScen = config.customScenario || '';
   const customAtm = config.customAtmosphere || '';
   
   // Video params
   const movement = t(config.videoMovement || '');
   const dynamics = t(config.videoDynamics || '');
   const rhythm = t(config.videoRhythm || '');
   
   // DYNAMIC ASPECT RATIO
   const arValue = config.aspectRatio || '16:9';
   const ar = `--ar ${arValue}`; 

   if (promptType === PromptType.MIDJOURNEY) {
       // --- MIDJOURNEY LOGIC (Multi-Prompt Blocks) ---
       
       // Block 1: SUBJECT & CONTENT
       const subjectParts = [];
       if (scale) subjectParts.push(`${scale} scale`);
       if (place) subjectParts.push(`**${place}**`);
       if (poi) subjectParts.push(`focusing on ${poi}`);
       if (customScen) subjectParts.push(customScen);
       const subjectBlock = subjectParts.join(', ');

       // Block 2: STYLE & CIV
       const styleParts = [];
       if (civ) styleParts.push(`${civ} Architecture`);
       if (style) styleParts.push(`${style} Style`);
       if (render) styleParts.push(render);
       const styleBlock = styleParts.join(', ');

       // Block 3: ATMOSPHERE
       const atmParts = [];
       if (time) atmParts.push(time);
       if (weather) atmParts.push(weather);
       if (customAtm) atmParts.push(customAtm);
       const atmBlock = atmParts.join(', ');

       // Block 4: CAMERA & COMPOSITION
       const camParts = [];
       if (zoom) camParts.push(zoom);
       if (camera) camParts.push(`${camera} View`);
       if (mediaType === MediaType.VIDEO) {
           if (movement) camParts.push(`Camera Movement: ${movement}`);
           if (dynamics) camParts.push(`Dynamic Elements: ${dynamics}`);
           if (rhythm) camParts.push(`Rhythm: ${rhythm}`);
           if (config.videoLoop) camParts.push("Seamless Loop");
       }
       const camBlock = camParts.join(', ');

       // Combine blocks with '::' only if they have content
       const finalParts = [subjectBlock, styleBlock, atmBlock, camBlock].filter(p => p.length > 0);
       
       return `${finalParts.join(' :: ')} ${ar} --v 6.0`;

   } else {
       // --- GENERIC LOGIC (Natural Language) ---
       
       let text = "";

       // Sentence 1: The Core Subject
       if (place) {
           text += `A high quality ${mediaType === MediaType.VIDEO ? 'video' : 'image'} of a ${place}`;
           if (scale) text += ` (${scale} scale)`;
           text += ". ";
       }

       // Sentence 2: Specifics
       if (poi || customScen) {
           const details = [];
           if (poi) details.push(`featuring a ${poi}`);
           if (customScen) details.push(customScen);
           text += `The scene includes ${details.join(' and ')}. `;
       }

       // Sentence 3: Style
       if (civ || style || render) {
           const styles = [];
           if (civ) styles.push(`designed by a ${civ} civilization`);
           if (style) styles.push(`in ${style} art style`);
           if (render) styles.push(`rendered as ${render}`);
           text += `The visual aesthetic is ${styles.join(', ')}. `;
       }

       // Sentence 4: Atmosphere
       if (time || weather || customAtm) {
           const env = [];
           if (time) env.push(`set during ${time}`);
           if (weather) env.push(`with ${weather} weather`);
           if (customAtm) env.push(customAtm);
           text += `Atmosphere: ${env.join(', ')}. `;
       }

       // Sentence 5: Camera
       if (zoom || camera) {
           const cam = [];
           if (zoom) cam.push(zoom);
           if (camera) cam.push(`${camera} angle`);
           text += `Composition: ${cam.join(', ')}. `;
       }

       // Sentence 6: Video Specifics
       if (mediaType === MediaType.VIDEO) {
           const vid = [];
           if (movement) vid.push(`${movement} camera movement`);
           if (dynamics) vid.push(dynamics);
           if (rhythm) vid.push(`${rhythm} pacing`);
           if (config.videoLoop) vid.push("seamless loop");
           if (vid.length > 0) text += `Video requirements: ${vid.join(', ')}. `;
       }

       // Final Polish
       text += `Aspect Ratio ${arValue}.`;
       
       // Cleanup double spaces and empty punctuation
       return text.replace(/\s+/g, ' ').replace(/\.\s*\./g, '.').trim();
   }
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
  
  // USER DEFINED CAMERA (For Scenes)
  const userCamera = t(config.camera) || "Cinematic View";
  const userZoom = t(config.zoom) || "Focused view";
  
  // DYNAMIC ASPECT RATIO (For All)
  const userAR = config.aspectRatio || '16:9';

  // 2. CONSTRUCT DNA
  const visualDNA = getVisualDNA(config.civilization, config.placeType, config.time, config.weather);
  const exclusions = getExclusions(promptType);

  // 3. DEFINE GLOBAL STYLE STRING
  const globalStyle = `${renderVal}, ${styleVal} style, high fidelity game asset`;

  // --- GENERATOR FUNCTIONS ---

  const buildPrompt = (subject: string, camera: string, focus: string): string => {
      if (promptType === PromptType.MIDJOURNEY) {
          return `**${subject}** :: ${focus} :: ${visualDNA} :: Camera: ${camera} :: Global Style: ${globalStyle} --ar ${userAR} --v 6.0 --stylize 250 ${exclusions}`;
      } else {
          return `Generate a game asset of **${subject}**. Focus on ${focus}. ${visualDNA}. Camera Settings: ${camera}. Visual Style: ${globalStyle}. Aspect Ratio: ${userAR}. High resolution. ${exclusions}`;
      }
  };

  // --- ASSET 1: TACTICAL MAP (FIXED PERSPECTIVE) ---
  // Always needs Orthographic for playability
  collection.push({
    title: labels.assetMap,
    type: 'MAP',
    prompt: buildPrompt(
        `Tactical Battle Map of ${placeTypeVal}`, 
        "Top-down Orthographic 90-degree, f/8 (everything in focus)", 
        "Clear grid layout possibility, high contrast for visibility, playable terrain, flat projection, VTT optimized"
    )
  });

  // --- ASSET 2: ISOMETRIC VIEW (FIXED PERSPECTIVE) ---
  // Establishing shot implies wide/iso usually
  collection.push({
    title: labels.assetIso,
    type: 'PERSPECTIVE',
    prompt: buildPrompt(
        `Isometric Establishing Shot of ${placeTypeVal}`, 
        "Isometric 45-degree angle, Telephoto lens", 
        "Showcasing the scale, layout and verticality of the location, regional overview"
    )
  });

  // --- ASSET 3: ENTRANCE (USER CAMERA) ---
  collection.push({
    title: labels.assetEntrance,
    type: 'SCENE',
    prompt: buildPrompt(
        `Main Entrance to ${placeTypeVal}`, 
        `${userCamera}, ${userZoom}`, 
        "Imposing doorway/gate, transitional space, distinct architectural threshold, welcoming or forbidding mood"
    )
  });

  // --- ASSETS 4-10: POINTS OF INTEREST (USER CAMERA) ---
  let rawPOIs = POI_MAPPING[config.placeType] || POI_MAPPING['DEFAULT'];
  let shuffledPOIs = shuffleArray(rawPOIs);

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
        `${userCamera}, ${userZoom}`, 
        `Detailed environmental storytelling. ${diff}. Specific function: ${poiName}`
      )
    });
  }

  // --- ASSET 11: UI KIT (FIXED FLAT) ---
  const uiDesc = `Game UI Sprite Sheet for ${civVal} setting`;
  const uiFocus = "Empty modular window frames, health bars, action buttons, inventory slots. Knolling layout. Isolated on solid black background";
  const uiCam = "Flat Vector Graphic, No perspective";
  
  collection.push({
    title: labels.assetUI,
    type: 'SCENE',
    prompt: buildPrompt(uiDesc, uiCam, uiFocus)
  });

  // --- ASSET 12: ITEMS (FIXED FLAT) ---
  const itemDesc = `RPG Item Icons Grid for ${placeTypeVal}`;
  const itemFocus = "6 distinct items (Key, Potion, Weapon, Map, Relic, Tool). Grid layout. Isolated on solid black background";
  
  collection.push({
    title: labels.assetItems,
    type: 'SCENE',
    prompt: buildPrompt(itemDesc, uiCam, itemFocus)
  });

  // --- ASSET 13: VICTORY (FIXED EPIC) ---
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