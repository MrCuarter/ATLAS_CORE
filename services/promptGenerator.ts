import { MapConfig, MediaType, PromptType, PromptCollectionItem, Language, NarrativeMode } from '../types';
import { PROMPT_TRANSLATIONS, POI_MAPPING, UI_TEXT } from '../constants';

// Helper to translate values
const t = (val: string): string => {
  if (!val) return '';
  if (PROMPT_TRANSLATIONS[val]) return PROMPT_TRANSLATIONS[val];
  return val; 
};

// 1. VISUAL DNA CONSTRUCTOR (REMASTERED FOR STYLE PRIORITY)
const getVisualDNA = (civ: string, style: string, placeType: string, time: string, weather: string, customAtm?: string): string => {
    let palette = "";
    let materials = "";
    let tech = "";
    let lighting = "";
    let renderStyle = "";

    const has = (str: string, key: string) => str?.toLowerCase().includes(key.toLowerCase());

    // --- STEP 1: STYLE DEFINES THE RENDER & PALETTE (HIGHEST PRIORITY) ---
    
    // VIDEO GAMES
    if (has(style, "Cyberpunk 2077")) {
        palette = "Neon Acid Green, Hot Pink, Electric Blue, Deep Black Shadows";
        materials = "Wet Asphalt, Chrome, Plastic, Synth-skin, Holograms";
        lighting = "Night City Lighting, High Contrast, Volumetric Neon Fog, Chromatic Aberration";
        renderStyle = "Red Engine 4, Ray Tracing Overdrive, Hyper-Realistic Game Asset";
    } else if (has(style, "Elden Ring") || has(style, "Dark Souls") || has(style, "Bloodborne")) {
        palette = "Golden Erdtree Light, Desaturated Green, Decay Brown, Faded Gold";
        materials = "Tarnished Metal, Ancient Stone, Rotting Cloth, Fog";
        lighting = "Divine yet melancholy lighting, Atmospheric bloom, God rays";
        renderStyle = "FromSoftware Art Style, Detailed Textures, Painterly Realism";
    } else if (has(style, "Overwatch") || has(style, "Fortnite") || has(style, "Warcraft")) {
        palette = "Vibrant, Saturated, Complementary Colors";
        materials = "Stylized PBR, Hand-painted textures, Chunky shapes";
        lighting = "Soft ambient occlusion, Bright daylight, stylized rim light";
        renderStyle = "Blizzard/Epic Games Style, Stylized 3D, Clean lines";
    } else if (has(style, "Zelda") || has(style, "Ghibli")) {
        palette = "Pastel Greens, Sky Blues, Vibrant Nature Tones";
        materials = "Cel-shaded textures, Soft Grass, Painted Stone";
        lighting = "Soft sunlight, fluffy clouds shadows, bloom";
        renderStyle = "Studio Ghibli / Breath of the Wild Style, Anime-inspired 3D";
    } else if (has(style, "Minecraft") || has(style, "Voxel")) {
        palette = "8-bit Vibrant";
        materials = "Blocks, Voxels, Pixels";
        lighting = "Ray Traced Global Illumination (RTX)";
        renderStyle = "Voxel Art, Blocky, Minecraft Aesthetic";
    } 
    // MOVIES / SERIES
    else if (has(style, "Pixar") || has(style, "Disney")) {
        palette = "Warm, Inviting, Highly Saturated";
        materials = "Subsurface scattering (skin/wax), Soft plastic, Fluffy fur";
        lighting = "Cinematic Studio Lighting, Soft Shadows, Warm Bounce Light";
        renderStyle = "Pixar 3D Render, RenderMan, Cute proportions";
    } else if (has(style, "Arcane")) {
        palette = "Oil Painting tones, Deep Purples and Golds";
        materials = "Painted textures with 3D depth, Brushstrokes on metal";
        lighting = "Dramatic, moody, painterly light shafts";
        renderStyle = "Fortiche Production Style, 2.5D, Hand-painted texture projection";
    } else if (has(style, "Spider-Verse")) {
        palette = "CMYK offset, Neon Glitch, Pop Art colors";
        materials = "Halftone patterns, Ink lines, Comic book paper texture";
        lighting = "Stylized rim lights, chromatic aberration";
        renderStyle = "Into the Spider-Verse Style, Comic Book Shader, Variable Frame Rate";
    } else if (has(style, "Wes Anderson")) {
        palette = "Pastel Pink, Mint Green, Symmetrical Yellows";
        materials = "Matte paint, Fabric, Dollhouse textures";
        lighting = "Flat lighting, High key, Symmetrical composition";
        renderStyle = "Symmetrical Cinematography, Flat lay aesthetic";
    }
    // ARTISTIC GENERIC
    else if (has(style, "Noir") || has(style, "B&W")) {
        palette = "Black, White, High Contrast Greys";
        materials = "Smoke, Rain, Concrete";
        lighting = "Chiaroscuro, Venetian blinds shadows, Silhouette";
        renderStyle = "Film Noir, Black and White Photography";
    } else if (has(style, "Blueprint")) {
        palette = "Royal Blue background, White lines";
        materials = "Paper, Ink";
        lighting = "Flat technical lighting";
        renderStyle = "Architectural Schematic, Technical Drawing";
    }

    // --- STEP 2: CIVILIZATION FILLS THE GAPS (IF STYLE DIDN'T DEFINE THEM) ---
    // Only apply Civ logic if palette/materials are still empty or generic
    if (!palette) {
        if (has(civ, "Human") || has(civ, "Imperial")) {
            palette = "Royal Blue, White Marble, Gold";
            materials = "Polished stone, steel";
        } else if (has(civ, "Elf")) {
            palette = "Emerald Green, Silver, Pearl";
            materials = "Living wood, bioluminescence";
        } else if (has(civ, "Cyberpunk") || has(civ, "Futurist")) {
            // Fallback if user picked "Cyberpunk Civ" but "Realistic" style
            palette = "Neon Cyan, Magenta, Black";
            materials = "Carbon fiber, glass, LEDs";
        } else if (has(civ, "Steampunk") || has(civ, "Dwarven")) {
            palette = "Bronze, Copper, Steam White";
            materials = "Brass, Gears, Leather, Wood";
        } else {
            palette = "Earthy tones, realistic";
            materials = "Standard environmental materials";
        }
    }

    // --- STEP 3: ENVIRONMENT INFLUENCE (ADDITIVE) ---
    let envDetails = "";
    if (has(time, "Night")) {
        envDetails += "Night time, artificial light sources dominant. ";
    } else if (has(time, "Sunset")) {
        envDetails += "Golden hour, long dramatic shadows. ";
    }
    
    if (has(weather, "Rain")) {
        envDetails += "Wet surfaces, reflections, puddles. ";
    } else if (has(weather, "Fog")) {
        envDetails += "Volumetric fog, atmospheric depth. ";
    }

    // --- CONSTRUCT DNA STRING ---
    let finalDNA = `**VISUAL STYLE PRIORITY: ${style}**. `;
    finalDNA += `[Render Engine: ${renderStyle || "Unreal Engine 5, Octane Render"}] `;
    finalDNA += `[Palette: ${palette}] `;
    finalDNA += `[Texture/Materials: ${materials}] `;
    finalDNA += `[Lighting: ${lighting || envDetails}] `;
    
    if (customAtm) finalDNA += ` [Custom Details: ${customAtm}]`;

    return finalDNA;
};

// 2. EXCLUSIONS
const getExclusions = (promptType: PromptType): string => {
    const base = "text, watermark, ui elements, hud, blur, distortion, low quality, pixelated, cartoon, anime, lowres, jpeg artifacts";
    if (promptType === PromptType.MIDJOURNEY) return `--no ${base}`;
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

// Helper: Get Sidekick Type based on Civ
const getSidekickConfig = (civ: string): { desc: string, ar: string } => {
    const c = civ.toLowerCase();
    if (c.includes('elf') || c.includes('nature') || c.includes('tribal')) return { desc: "Mystical Wolf or Spirit Beast", ar: "16:9" };
    if (c.includes('cyber') || c.includes('futur')) return { desc: "Floating Drone Companion or Mechanical Dog", ar: "16:9" };
    if (c.includes('magic') || c.includes('wizard')) return { desc: "Small Dragon or Familiar", ar: "16:9" };
    if (c.includes('orc') || c.includes('warrior')) return { desc: "War Beast or Goblin Slave", ar: "16:9" };
    return { desc: "Loyal Squire or Apprentice carrying supplies", ar: "9:16" };
}

/**
 * STORYCRAFTER COLLECTION GENERATOR (Refactored)
 */
export const generateNarrativeCollection = (
  config: MapConfig,
  promptType: PromptType,
  lang: Language,
  mode: NarrativeMode
): PromptCollectionItem[] => {
  const collection: PromptCollectionItem[] = [];
  const labels = UI_TEXT[lang];

  // Common Inputs
  const placeTypeVal = t(config.placeType);
  const civVal = t(config.civilization);
  const styleVal = t(config.artStyle); // RAW STYLE NAME
  
  const userCamera = t(config.camera) || "Cinematic View";
  const userZoom = t(config.zoom) || "Focused view";
  const userAR = config.aspectRatio || '16:9';

  // Pass styleVal explicitly to getVisualDNA
  const visualDNA = getVisualDNA(config.civilization, styleVal, config.placeType, config.time, config.weather, config.customAtmosphere);
  const exclusions = getExclusions(promptType);
  
  // Stronger Header for Midjourney
  const globalHeader = `**Art Style: ${styleVal}** ::`;

  const build = (subject: string, camera: string, focus: string, ar: string = '16:9', extraExcluded: string = ""): string => {
      let finalExclusions = exclusions;
      if (extraExcluded) {
          if (promptType === PromptType.MIDJOURNEY) finalExclusions += `, ${extraExcluded}`;
          else finalExclusions = finalExclusions.replace('.', `, ${extraExcluded}.`);
      }

      // MJ Structure: SUBJECT :: STYLE :: DETAILS --ar
      if (promptType === PromptType.MIDJOURNEY) {
          return `${globalHeader} **${subject}** :: ${visualDNA} :: Focus on ${focus} :: Camera: ${camera} --ar ${ar} --v 6.0 --stylize 250 ${finalExclusions}`;
      } else {
          return `Generate a game asset. **ART STYLE: ${styleVal}**. Subject: ${subject}. Focus on ${focus}. ${visualDNA}. Camera: ${camera}. Aspect Ratio: ${ar}. High resolution. ${finalExclusions}`;
      }
  };

  // ... (Rest of the narrative generation logic remains mostly the same, but uses the new 'build' function which enforces style) ...
  
  // =========================================================================================
  // MODE: WORLD GENERATION
  // =========================================================================================
  if (mode === NarrativeMode.WORLD) {
      let selectedPOIs: string[] = [];
      const validManualPOIs = config.manualPOIs?.filter(p => p.trim().length > 0) || [];
      if (validManualPOIs.length >= 6) {
          selectedPOIs = validManualPOIs.slice(0, 6).map(p => t(p));
      } else {
          let rawPOIs = POI_MAPPING[config.placeType] || POI_MAPPING['DEFAULT'];
          if (rawPOIs.length < 6) rawPOIs = [...new Set([...rawPOIs, ...POI_MAPPING['DEFAULT']])];
          selectedPOIs = shuffleArray(rawPOIs).slice(0, 6).map(p => t(p));
      }

      const mapDesc = `Tactical Battle Map of ${placeTypeVal}, ${civVal} architecture`;
      collection.push({
        title: labels.assetMap,
        type: 'MAP',
        prompt: build(mapDesc, "Top-down Orthographic 90-degree, f/8", `Playable grid layout, visible key locations: ${selectedPOIs.join(', ')}. Clear terrain definition.`)
      });

      const coverDesc = `Epic Game Splash Art for ${placeTypeVal}`;
      collection.push({
        title: labels.assetIso,
        type: 'PERSPECTIVE',
        prompt: build(coverDesc, "Cinematic Wide Angle, Drone Shot", "Blockbuster composition, establishing shot, dramatic lighting, adventure and mystery.")
      });

      collection.push({
        title: labels.assetEntrance,
        type: 'SCENE',
        prompt: build(`Main Entrance to ${placeTypeVal}`, `${userCamera}, ${userZoom}`, "Imposing doorway/gate/path, transitional space, distinct architectural threshold.")
      });

      selectedPOIs.forEach((poiName, idx) => {
          collection.push({
            title: `POI ${idx + 1}: ${poiName}`,
            type: 'SCENE',
            prompt: build(`Interior Scene: ${poiName} inside ${placeTypeVal}`, `${userCamera}, ${userZoom}`, `Detailed environmental storytelling. Specific function: ${poiName}.`, userAR)
          });
      });
  }

  // =========================================================================================
  // MODE: UI GENERATION
  // =========================================================================================
  else if (mode === NarrativeMode.UI) {
      const uiBg = "Isolated on solid black background";
      const noText = "typography, letters, words";
      const uiStyleDesc = `${styleVal} aesthetic`; // Ensure style is passed to UI description

      collection.push({
          title: "UI: ACTION BUTTONS",
          type: 'UI',
          prompt: build(`Game UI Asset Sheet: Action Buttons (${uiStyleDesc})`, "Flat Vector Graphic, Frontal", `Set of 6 distinct buttons (Attack, Defend, Magic, Item, Run). Shapes: Round, Square, Hexagon. States: Normal and Pressed. NO TEXT inside buttons. ${uiBg}`, "16:9", noText)
      });

      collection.push({
          title: "UI: WINDOW FRAMES",
          type: 'UI',
          prompt: build(`Game UI Asset Sheet: Window Frames (${uiStyleDesc})`, "Flat Vector Graphic, Frontal", `3 Ornate Window Frames for inventory or stats. 9-slice scaling ready. Empty centers. Border details matching ${civVal} theme. ${uiBg}`, "16:9", noText)
      });

      collection.push({
          title: "UI: DIALOGS & HUD",
          type: 'UI',
          prompt: build(`Game UI Asset Sheet: HUD Elements (${uiStyleDesc})`, "Flat Vector Graphic, Frontal", `Long horizontal Dialog Box for text. Health Bar (Red) and Mana Bar (Blue) with decorative borders. Experience Bar. ${uiBg}`, "16:9", noText)
      });
  }

  // =========================================================================================
  // MODE: CHARACTER GENERATION
  // =========================================================================================
  else if (mode === NarrativeMode.CHARACTERS) {
      const charBg = "Isolated on neutral studio background";
      const arPortrait = "9:16";

      collection.push({
          title: "CHAR: MALE HERO",
          type: 'CHARACTER',
          prompt: build(`Male Protagonist Concept Art, ${civVal} origin`, "Full shot, eye level", `Heroic pose, distinct silhouette, main weapon drawn. Leadership vibes. ${charBg}`, arPortrait)
      });

      collection.push({
          title: "CHAR: FEMALE HERO",
          type: 'CHARACTER',
          prompt: build(`Female Protagonist Concept Art, ${civVal} origin`, "Full shot, eye level", `Dynamic pose, magic or agile weapon. Determined expression. ${charBg}`, arPortrait)
      });

      collection.push({
          title: "CHAR: VILLAIN/BOSS",
          type: 'BOSS',
          prompt: build(`Main Antagonist / Boss Concept Art`, "Low angle, looking up", `Intimidating, dark aura, heavy armor or corrupt robes. Dominating stance. ${charBg}`, arPortrait)
      });

      collection.push({
          title: "CHAR: MINION",
          type: 'CHARACTER',
          prompt: build(`Standard Enemy Minion`, "Full shot", `Generic soldier/creature, hunchbacked or ready to attack. Uniform equipment. ${charBg}`, arPortrait)
      });

      collection.push({
          title: "CHAR: HONORABLE NPC",
          type: 'CHARACTER',
          prompt: build(`Quest Giver / Elder NPC`, "Medium shot", `Wise, older, wearing ceremonial garb or merchant clothes. Non-combat pose. ${charBg}`, arPortrait)
      });

      const sidekick = getSidekickConfig(config.civilization);
      collection.push({
          title: "CHAR: SIDEKICK",
          type: 'CHARACTER',
          prompt: build(`Companion / Sidekick`, "Full shot", `${sidekick.desc}. Loyal, cute or cool. Standing next to hero scale. ${charBg}`, sidekick.ar)
      });

      collection.push({
          title: "CHAR: BADGE SHEET",
          type: 'BADGE',
          prompt: build("Character Selection Portraits / Token Sheet", "Flat Vector, Frontal", `Grid of 6 circular character portraits (Badges). 3 on top row, 3 on bottom row. Featuring the faces of: Hero Male, Hero Female, Villain, Minion, Elder, Sidekick. Distinct border frames. High contrast. Distance between icons. Isolated on black`, "16:9")
      });
  }

  return collection;
};

// --- GENERIC EXPORT ---
export const generatePrompt = (
  config: MapConfig,
  mediaType: MediaType,
  promptType: PromptType
): string => {
    // 1. GATHER INPUTS
    const scale = t(config.scale);
    const place = t(config.placeType);
    const poi = t(config.poi);
    const civ = t(config.civilization);
    const time = t(config.time);
    const weather = t(config.weather);
    const style = t(config.artStyle); // CRITICAL: This is the visual anchor
    const render = t(config.renderTech);
    const zoom = t(config.zoom);
    const camera = t(config.camera);
    const customScen = config.customScenario || '';
    const customAtm = config.customAtmosphere || '';
    
    // Video params
    const movement = t(config.videoMovement || '');
    const dynamics = t(config.videoDynamics || '');
    const rhythm = t(config.videoRhythm || '');
    const loop = config.videoLoop ? "Seamless Loop" : "";
    
    const arValue = config.aspectRatio || '16:9';
    const ar = `--ar ${arValue}`; 

    // 2. GET REFINED DNA (Style prioritizes Palette/Materials)
    const visualDNA = getVisualDNA(config.civilization, config.artStyle, config.placeType, config.time, config.weather, config.customAtmosphere);

    if (promptType === PromptType.MIDJOURNEY) {
        // MJ STRUCTURE: 
        // [STRONG STYLE HEADER] :: [SUBJECT] :: [VISUAL DNA] :: [CAMERA] --ar
        
        const styleHeader = `**Art Style: ${style}**`;
        
        let subject = `**${place}**`;
        if (scale) subject += `, ${scale} scale`;
        if (poi) subject += `, focusing on ${poi}`;
        if (civ) subject += `, built by ${civ} civilization`; // Civ becomes context, not style
        if (customScen) subject += `, ${customScen}`;

        const cameraBlock = [zoom, camera, movement, dynamics, rhythm, loop].filter(Boolean).join(', ');

        return `${styleHeader} :: ${subject} :: ${visualDNA} :: Camera: ${cameraBlock} :: ${render} ${ar} --v 6.0 --stylize 250`;

    } else {
        // GENERIC AI STRUCTURE
        let text = `Generate a ${mediaType === MediaType.VIDEO ? 'video' : 'image'} in the strict visual style of **${style}**. `;
        
        text += `SUBJECT: A ${place}`;
        if (scale) text += ` (${scale} scale)`;
        if (civ) text += ` created by a ${civ} civilization`;
        text += ". ";

        if (poi) text += `Focus on ${poi}. `;
        if (customScen) text += `${customScen} `;

        text += `\nVISUAL SPECIFICATIONS: ${visualDNA}. `;
        
        if (render) text += `Render Technique: ${render}. `;
        if (camera || zoom) text += `Camera: ${camera}, ${zoom}. `;
        
        if (mediaType === MediaType.VIDEO) {
            text += `Video Dynamics: ${movement}, ${dynamics}, ${rhythm}, ${loop}. `;
        }

        text += `Aspect Ratio: ${arValue}. High quality, detailed.`;
        return text;
    }
}

export const getRandomElement = <T>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)];
};