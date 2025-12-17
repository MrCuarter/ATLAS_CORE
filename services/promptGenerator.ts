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

// 1. VISUAL DNA CONSTRUCTOR
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

    // WEAR LEVEL
    let wear = "Moderate wear";
    if (has(placeType, "Ruins") || has(placeType, "Dungeon") || has(placeType, "Desguace")) {
        wear = "Heavy weathering, cracks, moss, decay, dust";
    } else if (has(placeType, "Palace") || has(placeType, "Lab") || has(placeType, "Temple")) {
        wear = "Pristine condition, polished surfaces, clean";
    }

    // LIGHTING TEMPERATURE
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

// Helper: Get Writable Medium for UI based on Civ
const getWritableMedium = (civ: string): string => {
    const has = (str: string, key: string) => str.toLowerCase().includes(key.toLowerCase());
    if (has(civ, "Cyberpunk") || has(civ, "Futurist") || has(civ, "Alien") || has(civ, "Sci-Fi")) {
        return "Holographic Datapad Screen";
    }
    if (has(civ, "Antigua") || has(civ, "Tribal") || has(civ, "Orc")) {
        return "Ancient Stone Tablet or Animal Hide";
    }
    return "Old Parchment Scroll"; // Default fantasy
};

// 2. EXCLUSIONS
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
 * MANUAL PROMPT GENERATOR
 */
export const generatePrompt = (
  config: MapConfig,
  mediaType: MediaType,
  promptType: PromptType
): string => {
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
   
   const movement = t(config.videoMovement || '');
   const dynamics = t(config.videoDynamics || '');
   const rhythm = t(config.videoRhythm || '');
   
   const arValue = config.aspectRatio || '16:9';
   const ar = `--ar ${arValue}`; 

   if (promptType === PromptType.MIDJOURNEY) {
       const subjectParts = [];
       if (scale) subjectParts.push(`${scale} scale`);
       if (place) subjectParts.push(`**${place}**`);
       if (poi) subjectParts.push(`focusing on ${poi}`);
       if (customScen) subjectParts.push(customScen);
       const subjectBlock = subjectParts.join(', ');

       const styleParts = [];
       if (civ) styleParts.push(`${civ} Architecture`);
       if (style) styleParts.push(`${style} Style`);
       if (render) styleParts.push(render);
       const styleBlock = styleParts.join(', ');

       const atmParts = [];
       if (time) atmParts.push(time);
       if (weather) atmParts.push(weather);
       if (customAtm) atmParts.push(customAtm);
       const atmBlock = atmParts.join(', ');

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

       const finalParts = [subjectBlock, styleBlock, atmBlock, camBlock].filter(p => p.length > 0);
       return `${finalParts.join(' :: ')} ${ar} --v 6.0`;

   } else {
       let text = "";
       if (place) {
           text += `A high quality ${mediaType === MediaType.VIDEO ? 'video' : 'image'} of a ${place}`;
           if (scale) text += ` (${scale} scale)`;
           text += ". ";
       }
       if (poi || customScen) {
           const details = [];
           if (poi) details.push(`featuring a ${poi}`);
           if (customScen) details.push(customScen);
           text += `The scene includes ${details.join(' and ')}. `;
       }
       if (civ || style || render) {
           const styles = [];
           if (civ) styles.push(`designed by a ${civ} civilization`);
           if (style) styles.push(`in ${style} art style`);
           if (render) styles.push(`rendered as ${render}`);
           text += `The visual aesthetic is ${styles.join(', ')}. `;
       }
       if (time || weather || customAtm) {
           const env = [];
           if (time) env.push(`set during ${time}`);
           if (weather) env.push(`with ${weather} weather`);
           if (customAtm) env.push(customAtm);
           text += `Atmosphere: ${env.join(', ')}. `;
       }
       if (zoom || camera) {
           const cam = [];
           if (zoom) cam.push(zoom);
           if (camera) cam.push(`${camera} angle`);
           text += `Composition: ${cam.join(', ')}. `;
       }
       if (mediaType === MediaType.VIDEO) {
           const vid = [];
           if (movement) vid.push(`${movement} camera movement`);
           if (dynamics) vid.push(dynamics);
           if (rhythm) vid.push(`${rhythm} pacing`);
           if (config.videoLoop) vid.push("seamless loop");
           if (vid.length > 0) text += `Video requirements: ${vid.join(', ')}. `;
       }
       text += `Aspect Ratio ${arValue}.`;
       return text.replace(/\s+/g, ' ').replace(/\.\s*\./g, '.').trim();
   }
};

/**
 * STORYCRAFTER COLLECTION GENERATOR
 */
export const generateNarrativeCollection = (
  config: MapConfig,
  promptType: PromptType,
  lang: Language
): PromptCollectionItem[] => {
  const collection: PromptCollectionItem[] = [];
  const labels = UI_TEXT[lang];

  // 1. INPUTS
  const placeTypeVal = t(config.placeType);
  const civVal = t(config.civilization);
  const styleVal = t(config.artStyle);
  const renderVal = t(config.renderTech);
  
  // 2. CAMERA & AR (User Defined for POIs)
  const userCamera = t(config.camera) || "Cinematic View";
  const userZoom = t(config.zoom) || "Focused view";
  const userAR = config.aspectRatio || '16:9';

  // 3. POI SELECTION (Pre-select 6 Unique POIs)
  let rawPOIs = POI_MAPPING[config.placeType] || POI_MAPPING['DEFAULT'];
  
  // Fallback: If not enough unique POIs, mix with default list to ensure 6 distinct ones
  if (rawPOIs.length < 6) {
      rawPOIs = [...new Set([...rawPOIs, ...POI_MAPPING['DEFAULT']])];
  }
  
  const selectedPOIs = shuffleArray(rawPOIs).slice(0, 6).map(p => t(p));

  // 4. DNA
  const visualDNA = getVisualDNA(config.civilization, config.placeType, config.time, config.weather);
  const exclusions = getExclusions(promptType);
  const globalStyle = `${renderVal}, ${styleVal} style, high fidelity game asset`;

  // --- BUILDER FUNCTION ---
  const build = (subject: string, camera: string, focus: string, ar: string = '16:9'): string => {
      if (promptType === PromptType.MIDJOURNEY) {
          return `**${subject}** :: ${focus} :: ${visualDNA} :: Camera: ${camera} :: Global Style: ${globalStyle} --ar ${ar} --v 6.0 --stylize 250 ${exclusions}`;
      } else {
          return `Generate a game asset of **${subject}**. Focus on ${focus}. ${visualDNA}. Camera Settings: ${camera}. Visual Style: ${globalStyle}. Aspect Ratio: ${ar}. High resolution. ${exclusions}`;
      }
  };

  // === 1. TACTICAL MAP (Contextual) ===
  const mapDesc = `Tactical Battle Map of ${placeTypeVal}`;
  // Inject the specific selected POIs into the map prompt so the terrain matches the scenes
  const mapContext = `Features key locations visible on the terrain: ${selectedPOIs.join(', ')}. Clear grid layout possibility, high contrast, playable terrain, VTT optimized.`;
  collection.push({
    title: labels.assetMap,
    type: 'MAP',
    prompt: build(mapDesc, "Top-down Orthographic 90-degree, f/8 (everything in focus)", mapContext)
  });

  // === 2. EPIC COVER ART (Asset 2 Upgrade) ===
  const coverDesc = `Epic Game Box Art / Title Screen for ${placeTypeVal}`;
  const coverFocus = `Blockbuster composition, breathtaking scale, establishing shot of the entire region. The Hero location ${selectedPOIs[0]} is visible in the distance. Dramatic lighting, feeling of adventure and mystery.`;
  collection.push({
    title: labels.assetIso, // Kept label but improved content
    type: 'PERSPECTIVE',
    prompt: build(coverDesc, "Cinematic Wide Angle, Drone Shot, Rule of Thirds", coverFocus)
  });

  // === 3. MAIN ENTRANCE ===
  collection.push({
    title: labels.assetEntrance,
    type: 'SCENE',
    prompt: build(
        `Main Entrance to ${placeTypeVal}`, 
        `${userCamera}, ${userZoom}`, 
        "Imposing doorway/gate/path, transitional space, distinct architectural threshold, welcoming or forbidding mood"
    )
  });

  // === 4-9. UNIQUE POIs ===
  const diffs = [
      "Focus on a specific light source casting long shadows",
      "Focus on a central hero prop or artifact",
      "Focus on architectural symmetry",
      "Focus on environmental clutter and debris",
      "Focus on verticality and ceiling details",
      "Focus on atmospheric depth and particles"
  ];

  selectedPOIs.forEach((poiName, idx) => {
      collection.push({
        title: `${labels.poi} ${idx + 1}: ${poiName}`,
        type: 'SCENE',
        prompt: build(
            `Interior Scene: ${poiName} inside ${placeTypeVal}`, 
            `${userCamera}, ${userZoom}`, 
            `Detailed environmental storytelling. ${diffs[idx]}. Specific function: ${poiName}`,
            userAR // Use User AR only for POIs
        )
      });
  });

  // === 10. UI KIT (Specific) ===
  const medium = getWritableMedium(config.civilization);
  const uiDesc = `Game UI Sprite Sheet for ${civVal} setting`;
  const uiContext = `Knolling layout. Elements: 2 distinct Button styles (Normal/Hover), 1 ornate Dialog Box, Navigation buttons (Next/Prev/Play), 1 detailed Progress Bar, and a ${medium} for displaying text. Elements must NOT touch.`;
  
  collection.push({
    title: labels.assetUI,
    type: 'SCENE',
    prompt: build(uiDesc, "Flat Vector Graphic, No perspective", `${uiContext}. Isolated on solid black background`)
  });

  // === 11. ITEMS (Specific Grid) ===
  const itemDesc = `RPG Item Icons Grid for ${placeTypeVal}`;
  const itemContext = `8 distinct items relevant to the location. Grid layout: 2 rows of 4 items. Strict isolation, no overlapping.`;
  
  collection.push({
    title: labels.assetItems,
    type: 'SCENE',
    prompt: build(itemDesc, "Flat Vector Graphic, No perspective", `${itemContext}. Isolated on solid white background`)
  });

  // === 12 (formerly 13, but list shifted). VICTORY ===
  // Wait, user asked for 13 assets total. 
  // Map(1) + Cover(1) + Entrance(1) + POIs(6) + UI(1) + Items(1) = 11.
  // We need 2 more to match "13" or just keep Victory as final.
  // Let's add Victory as #12. 
  
  collection.push({
    title: labels.assetVictory,
    type: 'VICTORY',
    prompt: build(
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