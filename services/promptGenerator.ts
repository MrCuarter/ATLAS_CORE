import { MapConfig, MediaType, PromptType, PromptCollectionItem, Language, NarrativeMode } from '../types';
import { PROMPT_TRANSLATIONS, POI_MAPPING, UI_TEXT } from '../constants';

// Helper to translate values
const t = (val: string): string => {
  if (!val) return '';
  if (PROMPT_TRANSLATIONS[val]) return PROMPT_TRANSLATIONS[val];
  return val; 
};

// 1. VISUAL DNA CONSTRUCTOR
const getVisualDNA = (civ: string, placeType: string, time: string, weather: string, customAtm?: string): string => {
    let palette = "Neutral grey, earthy tones";
    let materials = "Standard construction materials";
    let tech = "Low tech";

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

    let wear = "Moderate wear";
    if (has(placeType, "Ruins") || has(placeType, "Dungeon") || has(placeType, "Desguace")) {
        wear = "Heavy weathering, cracks, moss, decay, dust";
    } else if (has(placeType, "Palace") || has(placeType, "Lab") || has(placeType, "Temple")) {
        wear = "Pristine condition, polished surfaces, clean";
    }

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
    
    let finalDNA = `VISUAL DNA: [Palette: ${palette}] [Materials: ${materials}] [Lighting: ${light}] [Wear: ${wear}] [Tech: ${tech}]`;
    if (customAtm) finalDNA += ` [Custom Details: ${customAtm}]`;

    return finalDNA;
};

// 2. EXCLUSIONS
const getExclusions = (promptType: PromptType): string => {
    const base = "text, watermark, ui elements, hud, blur, distortion, low quality, pixelated, cartoon, anime";
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
    // Default Humanoid sidekicks
    return { desc: "Loyal Squire or Apprentice carrying supplies", ar: "9:16" };
}

/**
 * STORYCRAFTER COLLECTION GENERATOR (Refactored)
 */
export const generateNarrativeCollection = (
  config: MapConfig,
  promptType: PromptType,
  lang: Language,
  mode: NarrativeMode // NEW PARAMETER
): PromptCollectionItem[] => {
  const collection: PromptCollectionItem[] = [];
  const labels = UI_TEXT[lang];

  // Common Inputs
  const placeTypeVal = t(config.placeType);
  const civVal = t(config.civilization);
  const styleVal = t(config.artStyle);
  const renderVal = t(config.renderTech);
  const scaleOrDetails = config.manualDetails ? `Context details: ${config.manualDetails}` : t(config.scale);
  
  const userCamera = t(config.camera) || "Cinematic View";
  const userZoom = t(config.zoom) || "Focused view";
  const userAR = config.aspectRatio || '16:9';

  const visualDNA = getVisualDNA(config.civilization, config.placeType, config.time, config.weather, config.customAtmosphere);
  const exclusions = getExclusions(promptType);
  const globalStyle = `${renderVal}, ${styleVal} style, high fidelity game asset`;

  const build = (subject: string, camera: string, focus: string, ar: string = '16:9', extraExcluded: string = ""): string => {
      let finalExclusions = exclusions;
      if (extraExcluded) {
          if (promptType === PromptType.MIDJOURNEY) finalExclusions += `, ${extraExcluded}`;
          else finalExclusions = finalExclusions.replace('.', `, ${extraExcluded}.`);
      }

      if (promptType === PromptType.MIDJOURNEY) {
          return `**${subject}** :: ${focus} :: ${visualDNA} :: Camera: ${camera} :: Global Style: ${globalStyle} --ar ${ar} --v 6.0 --stylize 250 ${finalExclusions}`;
      } else {
          return `Generate a game asset of **${subject}**. Focus on ${focus}. ${visualDNA}. Camera Settings: ${camera}. Visual Style: ${globalStyle}. Aspect Ratio: ${ar}. High resolution. ${finalExclusions}`;
      }
  };

  // =========================================================================================
  // MODE: WORLD GENERATION (Map, Cover, Entrance, 6 POIs)
  // =========================================================================================
  if (mode === NarrativeMode.WORLD) {
      
      // Select POIs (User manual input takes precedence)
      let selectedPOIs: string[] = [];
      const validManualPOIs = config.manualPOIs?.filter(p => p.trim().length > 0) || [];
      if (validManualPOIs.length >= 6) {
          selectedPOIs = validManualPOIs.slice(0, 6).map(p => t(p));
      } else {
          // Fallback logic inside generator just in case UI didn't catch it
          let rawPOIs = POI_MAPPING[config.placeType] || POI_MAPPING['DEFAULT'];
          if (rawPOIs.length < 6) rawPOIs = [...new Set([...rawPOIs, ...POI_MAPPING['DEFAULT']])];
          selectedPOIs = shuffleArray(rawPOIs).slice(0, 6).map(p => t(p));
      }

      // 1. TACTICAL MAP
      const mapDesc = `Tactical Battle Map of ${placeTypeVal}`;
      const mapContext = `Features key locations visible on the terrain: ${selectedPOIs.join(', ')}. ${scaleOrDetails}. Clear grid layout possibility, high contrast, playable terrain, VTT optimized.`;
      collection.push({
        title: labels.assetMap,
        type: 'MAP',
        prompt: build(mapDesc, "Top-down Orthographic 90-degree, f/8", mapContext)
      });

      // 2. EPIC COVER ART
      const coverDesc = `Epic Game Box Art / Title Screen for ${placeTypeVal}`;
      const coverFocus = `Blockbuster composition, breathtaking scale, establishing shot. Hero location ${selectedPOIs[0]} visible. Dramatic lighting, adventure and mystery.`;
      collection.push({
        title: labels.assetIso,
        type: 'PERSPECTIVE',
        prompt: build(coverDesc, "Cinematic Wide Angle, Drone Shot", coverFocus)
      });

      // 3. MAIN ENTRANCE
      collection.push({
        title: labels.assetEntrance,
        type: 'SCENE',
        prompt: build(
            `Main Entrance to ${placeTypeVal}`, 
            `${userCamera}, ${userZoom}`, 
            "Imposing doorway/gate/path, transitional space, distinct architectural threshold"
        )
      });

      // 4-9. POIs
      selectedPOIs.forEach((poiName, idx) => {
          collection.push({
            title: `POI ${idx + 1}: ${poiName}`,
            type: 'SCENE',
            prompt: build(
                `Interior Scene: ${poiName} inside ${placeTypeVal}`, 
                `${userCamera}, ${userZoom}`, 
                `Detailed environmental storytelling. Specific function: ${poiName}`,
                userAR
            )
          });
      });
  }

  // =========================================================================================
  // MODE: UI GENERATION (Buttons, Windows, Dialogs)
  // =========================================================================================
  else if (mode === NarrativeMode.UI) {
      // Common UI settings
      const uiBase = `Game UI Asset Sheet for ${civVal} setting`;
      const uiBg = "Isolated on solid white background";
      const noText = "typography, letters, words";

      // 1. BUTTONS (Clean)
      collection.push({
          title: "UI: ACTION BUTTONS",
          type: 'UI',
          prompt: build(
              `${uiBase} - Action Buttons`,
              "Flat Vector Graphic, Frontal",
              `Set of 6 distinct buttons (Attack, Defend, Magic, Item, Run). Shapes: Round, Square, Hexagon. States: Normal and Pressed. NO TEXT inside buttons. ${uiBg}`,
              "16:9",
              noText
          )
      });

      // 2. WINDOW FRAMES
      collection.push({
          title: "UI: WINDOW FRAMES",
          type: 'UI',
          prompt: build(
              `${uiBase} - Container Frames`,
              "Flat Vector Graphic, Frontal",
              `3 Ornate Window Frames for inventory or stats. 9-slice scaling ready. Empty centers. Border details matching ${civVal} aesthetics. ${uiBg}`,
              "16:9",
              noText
          )
      });

      // 3. DIALOGS & HUD
      collection.push({
          title: "UI: DIALOGS & HUD",
          type: 'UI',
          prompt: build(
              `${uiBase} - Dialog Box & Bars`,
              "Flat Vector Graphic, Frontal",
              `Long horizontal Dialog Box for text. Health Bar (Red) and Mana Bar (Blue) with decorative borders. Experience Bar. ${uiBg}`,
              "16:9",
              noText
          )
      });
  }

  // =========================================================================================
  // MODE: CHARACTER GENERATION (Heroes, Villains, Badges)
  // =========================================================================================
  else if (mode === NarrativeMode.CHARACTERS) {
      const charBase = `Full body Character Concept Art, ${civVal} style`;
      const charBg = "Isolated on neutral studio background";
      const arPortrait = "9:16";

      // 1. MALE PROTAGONIST
      collection.push({
          title: "CHAR: MALE HERO",
          type: 'CHARACTER',
          prompt: build(
              `${charBase} - Male Protagonist`,
              "Full shot, eye level",
              `Heroic pose, distinct silhouette, main weapon drawn. Leadership vibes. ${charBg}`,
              arPortrait
          )
      });

      // 2. FEMALE PROTAGONIST
      collection.push({
          title: "CHAR: FEMALE HERO",
          type: 'CHARACTER',
          prompt: build(
              `${charBase} - Female Protagonist`,
              "Full shot, eye level",
              `Dynamic pose, magic or agile weapon. Determined expression. ${charBg}`,
              arPortrait
          )
      });

      // 3. VILLAIN / BOSS
      collection.push({
          title: "CHAR: VILLAIN/BOSS",
          type: 'BOSS',
          prompt: build(
              `${charBase} - Main Antagonist`,
              "Low angle, looking up",
              `Intimidating, dark aura, heavy armor or corrupt robes. Dominating stance. ${charBg}`,
              arPortrait
          )
      });

      // 4. MINION
      collection.push({
          title: "CHAR: MINION",
          type: 'CHARACTER',
          prompt: build(
              `${charBase} - Standard Enemy Minion`,
              "Full shot",
              `Generic soldier/creature, hunchbacked or ready to attack. Uniform equipment. ${charBg}`,
              arPortrait
          )
      });

      // 5. HONORABLE NPC
      collection.push({
          title: "CHAR: HONORABLE NPC",
          type: 'CHARACTER',
          prompt: build(
              `${charBase} - Quest Giver / Elder`,
              "Medium shot",
              `Wise, older, wearing ceremonial garb or merchant clothes. Non-combat pose. ${charBg}`,
              arPortrait
          )
      });

      // 6. SIDEKICK (Dynamic)
      const sidekick = getSidekickConfig(config.civilization);
      collection.push({
          title: "CHAR: SIDEKICK",
          type: 'CHARACTER',
          prompt: build(
              `${charBase} - Companion`,
              "Full shot",
              `${sidekick.desc}. Loyal, cute or cool. Standing next to hero scale. ${charBg}`,
              sidekick.ar
          )
      });

      // 7. BADGE SHEET
      collection.push({
          title: "CHAR: BADGE SHEET",
          type: 'BADGE',
          prompt: build(
              "Character Selection Portraits / Token Sheet",
              "Flat Vector, Frontal",
              `Grid of 6 circular character portraits (Badges). 3 on top row, 3 on bottom row. Featuring the faces of: Hero Male, Hero Female, Villain, Minion, Elder, Sidekick. Distinct border frames. High contrast. Distance between icons. Isolated on black`,
              "16:9"
          )
      });
  }

  return collection;
};

// --- GENERIC EXPORT (Unchanged)
export const generatePrompt = (
  config: MapConfig,
  mediaType: MediaType,
  promptType: PromptType
): string => {
    // Keep existing single prompt logic...
    // Reuse previous implementation to ensure non-breaking change for simple/advanced modes
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
}

export const getRandomElement = <T>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)];
};