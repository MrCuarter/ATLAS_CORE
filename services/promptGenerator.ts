import { MapConfig, MediaType, PromptType, PromptCollectionItem, Language } from '../types';
import { PROMPT_TRANSLATIONS, POI_MAPPING, UI_TEXT } from '../constants';

// Helper to translate values
const t = (val: string): string => {
  if (!val) return '';
  return PROMPT_TRANSLATIONS[val] || val;
};

// Internal dictionary for material/texture coherence based on Civilization
const getCivMaterials = (civ: string): string => {
  const map: Record<string, string> = {
    'Generic Human': 'stone, wood, simple masonry, utilitarian design',
    'Imperial': 'white marble, gold accents, colossal statues, orderly stone bricks, red banners',
    'Medieval': 'rough stone, dark oak wood, iron fittings, cobblestone, thatched or slate roofs',
    'Arabian': 'sandstone, mosaic tiles, dome structures, intricate geometric patterns, warm lighting',
    'Renaissance': 'smooth plaster, terracotta roofs, symmetry, columns, artistic frescoes',
    'Elven': 'living wood, bioluminescent plants, white stone with organic curves, silver filigree, seamless integration with nature',
    'Orc': 'crude iron, spikes, raw lumber, animal skins, tribal war paint, aggressive shapes',
    'Goblin': 'rusted scrap metal, precarious wooden platforms, gears, mud, chaotic construction',
    'Dwarven': 'carved granite, geometric runes, molten gold lighting, heavy geometric pillars, underground architecture',
    'Undead': 'weathered grey stone, bone decorations, green necromantic fog, cobwebs, decay',
    'Demonic': 'obsidian, lava veins, dark red glowing runes, sharp spikes, gothic horror architecture',
    'Futuristic': 'sleek white panels, blue hologram lights, glass, chrome, clean curved lines',
    'Cyberpunk': 'dark wet concrete, neon signs (pink/blue), exposed cables, metal gratings, high contrast lighting',
    'Steampunk': 'brass, copper pipes, gears, steam vents, mahogany wood, glass bulbs, victorian industrial',
    'Post-industrial': 'decaying concrete, rust, overgrown vegetation, broken glass, scavenged materials',
    'Organic Alien': 'fleshy textures, purple and green hues, mucus membranes, bone-like structures, pulsating surfaces',
    'Biomechanical Alien': 'black metal fused with flesh, tubes, HR Giger style, industrial horror',
    'Crystalline Alien': 'translucent crystals, sharp facets, glowing internal light, floating structures',
    'Prehistoric': 'raw animal skins, mammoth bones, cave paintings, simple campfires, rough stone tools',
    'Tribal': 'bamboo, palm leaves, totem poles, mud bricks, vibrant natural paints',
    'Ancient Vanished': 'moss-covered mysterious monoliths, floating rocks, glowing glyphs, unknown impossible geometry',
    'Pirate': 'weathered ship wood, ropes, cannons, skulls, lanterns, improvised wooden structures',
    'Warrior': 'stone fortifications, weapon racks, banners, simple functional strongholds',
    'Survivor': 'scavenged tires, corrugated metal sheets, reinforced fences, barricades, survivalist gear',
    'Ancient': 'weathered limestone, hieroglyphs, crumbling pillars, sand-swept stone',
    'Alien': 'unearthly metals, defying gravity, strange lighting spectrums',
    'None': 'natural landscape textures, raw geological features',
    'Unreal': 'impossible geometry, floating islands, dreamlike clouds, non-euclidean shapes',
    'Middle Ages': 'stone castles, dirt roads, wooden carts, iron blacksmith tools',
    'Technological': 'server racks, metal flooring, LED status lights, clean laboratory surfaces',
    'Fantasy': 'magical crystals, vibrant colors, floating elements, enchanted architecture',
    'High Fantasy': 'soaring white towers, magical auras, perfect pristine masonry, epic scale',
    'Nomadic': 'tents, rugs, campfires, pack animals, temporary wooden structures'
  };
  return map[civ] || 'consistent high-quality textures, matching architectural style';
};

export const generatePrompt = (
  config: MapConfig,
  mediaType: MediaType,
  promptType: PromptType
): string => {
  const {
    scale,
    placeType,
    poi,
    civilization,
    customScenario,
    time,
    weather,
    renderTech,
    artStyle,
    customAtmosphere,
    zoom,
    camera,
    aspectRatio,
    videoMovement,
    videoDynamics,
    videoRhythm
  } = config;

  // 1. Translate all inputs to English, handle empty values
  const scaleVal = t(scale); 
  const placeTypeVal = t(placeType);
  const poiVal = t(poi);
  const civVal = t(civilization);
  const timeVal = t(time);
  const weatherVal = t(weather);
  const renderVal = t(renderTech);
  const styleVal = t(artStyle);
  const zoomVal = t(zoom);
  const cameraVal = t(camera);
  
  const videoMoveVal = t(videoMovement || '');
  const videoDynVal = t(videoDynamics || '');
  const videoRhythmVal = t(videoRhythm || '');

  const ratio = aspectRatio.includes(':') ? aspectRatio.split(' ')[0] : aspectRatio;

  if (promptType === PromptType.MIDJOURNEY) {
    // Build parts only if values exist
    const part1 = [];
    if (placeTypeVal) part1.push(`**${placeTypeVal}**`);
    if (poiVal) part1.push(poiVal);
    if (scaleVal) part1.push(`${scaleVal} scale`);
    if (customScenario) part1.push(customScenario);

    const part2 = [];
    if (civVal) part2.push(`${civVal} style architecture`);
    
    const part3 = [];
    if (timeVal) part3.push(timeVal);
    if (weatherVal) part3.push(weatherVal);
    if (renderVal) part3.push(renderVal);
    if (styleVal) part3.push(`${styleVal} style`);
    if (customAtmosphere) part3.push(customAtmosphere);

    const part4 = [];
    if (zoomVal) part4.push(zoomVal);
    if (cameraVal) part4.push(`${cameraVal} view`);

    let parts = [];
    if (part1.length > 0) parts.push(part1.join(', '));
    if (part2.length > 0) parts.push(part2.join(', '));
    if (part3.length > 0) parts.push(part3.join(', '));
    if (part4.length > 0) parts.push(part4.join(', '));

    if (mediaType === MediaType.VIDEO) {
      const vidParts = [];
      if (videoMoveVal) vidParts.push(`Camera: ${videoMoveVal}`);
      if (videoDynVal) vidParts.push(`Dynamics: ${videoDynVal}`);
      if (videoRhythmVal) vidParts.push(`Rhythm: ${videoRhythmVal}`);
      if (config.videoLoop) vidParts.push('Seamless Loop');
      if (vidParts.length > 0) parts.push(vidParts.join(', '));
    }

    // Midjourney parameters
    let params = `--ar ${ratio} --v 6.0`;
    if (mediaType === MediaType.VIDEO) {
      if (ratio === '16:9') params = '--ar 16:9'; 
      if (ratio === '9:16') params = '--ar 9:16';
    }

    return `${parts.join(' :: ')} ${params}`;
  } else {
    // Generic Natural Language (Pure English)
    const mediaTypeEn = mediaType === MediaType.IMAGE ? 'image' : 'video';
    
    let text = `A high quality ${mediaTypeEn}`;
    if (scaleVal) text += ` of a ${scaleVal.toLowerCase()} game map`;
    text += `. `;

    if (placeTypeVal) text += `The scene depicts a ${placeTypeVal}`;
    if (poiVal) text += ` featuring ${poiVal}`;
    text += `. `;
    
    if (customScenario) text += `${customScenario}. `;

    if (civVal) text += `The architecture reflects a ${civVal} civilization. `;
    
    let atmParts = [];
    if (timeVal) atmParts.push(timeVal);
    if (weatherVal) atmParts.push(`${weatherVal} weather`);
    if (atmParts.length > 0) text += `Atmosphere: ${atmParts.join(' with ')}. `;
    
    if (renderVal || styleVal) {
        text += `Visual Style: `;
        if (renderVal) text += `${renderVal} `;
        if (styleVal) text += `in the style of ${styleVal}`;
        text += `. `;
    }

    if (customAtmosphere) text += `${customAtmosphere}. `;
    
    if (zoomVal || cameraVal) {
        text += `Composition: `;
        if (zoomVal) text += `${zoomVal} `;
        if (cameraVal) text += `with a ${cameraVal} camera angle`;
        text += `. `;
    }

    if (mediaType === MediaType.VIDEO) {
      if (videoMoveVal) text += `Video Direction: ${videoMoveVal} camera movement. `;
      if (videoDynVal) text += `Scene includes ${videoDynVal}. `;
      if (videoRhythmVal) text += `Pacing is ${videoRhythmVal}. `;
      if (config.videoLoop) text += `The video should loop seamlessly.`;
    }

    return text.replace(/\.\s*\./g, '.').replace(/\s+/g, ' '); // Cleanup
  }
};

export const getRandomElement = <T>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)];
};

export const generateNarrativeCollection = (
  config: MapConfig,
  promptType: PromptType,
  lang: Language
): PromptCollectionItem[] => {
  const collection: PromptCollectionItem[] = [];
  const labels = UI_TEXT[lang];

  // Base constants (Frozen DNA)
  const placeTypeVal = t(config.placeType);
  const civVal = t(config.civilization);
  const timeVal = t(config.time);
  const weatherVal = t(config.weather);
  const styleVal = t(config.artStyle);
  const renderVal = t(config.renderTech);

  // Get specific visual descriptors for the civilization to ensure coherence
  const materials = getCivMaterials(civVal);

  // Construct the Master Context String
  // This string enforces the same look and feel across all prompts.
  const masterContextMidjourney = `Architecture: ${civVal} style using ${materials} :: Environment: ${placeTypeVal} :: Atmosphere: ${timeVal}, ${weatherVal} :: Style: ${renderVal}, ${styleVal} --ar 16:9 --v 6.0 --stylize 250`;
  
  const masterContextGeneric = `The architectural style is ${civVal}, featuring ${materials}. The environment is a ${placeTypeVal}. Lighting is ${timeVal} with ${weatherVal} weather. Visual style: ${renderVal} in the style of ${styleVal}. High resolution, game asset quality, cohesive visual identity.`;

  // Helper to build single item
  const buildItem = (subject: string, camera: string, specifics: string): string => {
    if (promptType === PromptType.MIDJOURNEY) {
      return `**${subject}** :: ${specifics} :: Camera: ${camera} :: ${masterContextMidjourney}`;
    } else {
      return `Image of ${subject}. ${specifics}. Camera Angle: ${camera}. ${masterContextGeneric}`;
    }
  };

  // 1. MAP VIEW
  collection.push({
    title: labels.assetMap,
    type: 'MAP',
    prompt: buildItem(
      `Tactical Battle Map of ${placeTypeVal}`, 
      'Top-down Orthographic (90 degree)', 
      'Grid layout optimized for VTT, clear terrain distinction, playable area, high contrast for visibility'
    )
  });

  // 2. PERSPECTIVE VIEW
  collection.push({
    title: labels.assetIso,
    type: 'PERSPECTIVE',
    prompt: buildItem(
      `Establishing shot of ${placeTypeVal}`, 
      'Isometric Diagonal (45 degree)', 
      'Wide regional overview, showcasing the scale and layout of the structures, seamless edges'
    )
  });

  // 3. ENTRANCE
  collection.push({
    title: labels.assetEntrance,
    type: 'SCENE',
    prompt: buildItem(
      `The Main Entrance Gate to the ${placeTypeVal}`, 
      'Eye-level Frontal', 
      `Imposing doorway, ${civVal} architectural details, inviting or guarding the path, highly detailed texture`
    )
  });

  // 4-10. POIs (7 items)
  const availablePOIs = POI_MAPPING[config.placeType] || POI_MAPPING['DEFAULT'];
  // Loop 7 times, cycling through available POIs if necessary
  for (let i = 0; i < 7; i++) {
    const poiName = t(availablePOIs[i % availablePOIs.length]);
    collection.push({
      title: `${labels.poi} ${i + 1}: ${poiName}`,
      type: 'SCENE',
      prompt: buildItem(
        `${poiName} located inside the ${placeTypeVal}`, 
        'Cinematic perspective', 
        `Interior/Exterior detailed shot, focus on ${poiName} specific function, matching materials and lighting`
      )
    });
  }

  // 11. UI KIT (New)
  const uiPrompt = promptType === PromptType.MIDJOURNEY 
    ? `**Game User Interface Asset Sheet for ${civVal} Game** :: Modular empty window frames, blank dialogue boxes, rectangular buttons, round buttons, health bars. Style: ${materials} textures, ornate borders. Isolated on black background. Game Asset Sprite Sheet. --no text`
    : `A Game User Interface (UI) asset sheet for a ${civVal} style game. Includes modular empty window frames, blank dialogue boxes, rectangular and round buttons, and health bars. The texture resembles ${materials} with ornate borders. Isolated on a black background, high resolution game sprites. No text on buttons.`;

  collection.push({
    title: labels.assetUI,
    type: 'SCENE',
    prompt: uiPrompt
  });

  // 12. ITEM ICONS (New)
  const itemPrompt = promptType === PromptType.MIDJOURNEY
    ? `**RPG Item Icon Set found in ${placeTypeVal}** :: 6 distinct game icons, grid layout. Items: Key, Potion, Weapon, Relic, Map, Tool. Style: ${renderVal}, ${styleVal}, vector quality. Isolated on black background. --no text`
    : `A set of 6 RPG Item Icons found in a ${placeTypeVal}. The grid includes: a Key, a Potion, a Weapon, a Relic, a Map, and a Tool. Visual style is ${renderVal} and ${styleVal}. High contrast, isolated on black background, vector quality game assets.`;

  collection.push({
    title: labels.assetItems,
    type: 'SCENE',
    prompt: itemPrompt
  });

  // 13. VICTORY
  const victorySubject = promptType === PromptType.MIDJOURNEY
    ? `**Victory Scene inside ${placeTypeVal}**`
    : `A Victory scene inside ${placeTypeVal}`;
  
  const victoryDetails = promptType === PromptType.MIDJOURNEY
    ? `Treasure chest, golden god rays, loot, reward, success, sparkling particles, epic feeling`
    : `Featuring a treasure chest and golden lighting (god rays) symbolizing reward and success. Sparkling particles in the air.`;

  collection.push({
    title: labels.assetVictory,
    type: 'VICTORY',
    prompt: buildItem(
      victorySubject, 
      'Cinematic Low Angle (Heroic)', 
      victoryDetails
    )
  });

  return collection;
};