
import { PoiMapping, Preset, Language } from './types';

export const PROMPT_TRANSLATIONS: Record<string, string> = {
  // SCALES
  'Micro (Bosque, Oasis)': 'Micro Scale (Forest, Oasis)',
  'Meso (Ciudad, Región)': 'Meso Scale (City, Region)',
  'Macro (Continente, Mundo)': 'Macro Scale (Kingdom, World)',
  'Especial (Plano astral)': 'Special Dimension (Astral Plane)',
  'Escena (Detalle)': 'Scene Detail (Close-up)',
  'Región (Medio)': 'Region Overview',

  // FANTASY RACES
  'Altos Elfos': 'High Elves',
  'Elfos Silvanos': 'Wood Elves',
  'Elfos Oscuros (Drow)': 'Dark Elves (Drow)',
  'Humanos': 'Humans',
  'Enanos de Montaña': 'Mountain Dwarves',
  'Enanos de Hierro': 'Iron Dwarves',
  'Orcos': 'Orcs',
  'Goblins': 'Goblins',
  'No-Muertos (Lich)': 'Undead (Lich)',
  'Esqueletos': 'Skeleton Army',
  'Hadas (Fae)': 'Fairies (Fae)',
  'Demonios': 'Demons',
  'Angeles': 'Angels',
  'Hombres Lagarto': 'Lizardmen',
  'Gnomos': 'Gnomes',
  'Halflings': 'Halflings',
  'Vampiros': 'Vampires',
  'Hombres Lobo': 'Werewolves',
  'Elementales de Fuego': 'Fire Elementals',
  'Constructos/Golems': 'Constructs/Golems',

  // HISTORICAL CIVS
  'Antiguo Egipto': 'Ancient Egypt',
  'Imperio Romano': 'Roman Empire',
  'Vikingos': 'Vikings',
  'Grecia Clásica': 'Ancient Greece',
  'Japón Feudal': 'Feudal Japan',
  'Imperio Maya': 'Mayan Empire',
  'Imperio Azteca': 'Aztec Empire',
  'Europa Medieval': 'Medieval Europe',
  'China Dinastía Han': 'Han Dynasty China',
  'Persia': 'Ancient Persia',
  'Londres Victoriano': 'Victorian London',
  'Lejano Oeste (Western)': 'Wild West',

  // ERAS
  'Prehistoria (Jurásico)': 'Prehistoric (Jurassic)',
  'Edad de Piedra': 'Stone Age',
  'Edad de Bronce': 'Bronze Age',
  'Edad Antigua (Clásica)': 'Ancient Era',
  'Edad Antigua': 'Ancient Era',
  'Edad Media (Medieval)': 'Medieval Era',
  'Edad Media': 'Medieval Era',
  'Renacimiento': 'Renaissance',
  'Era Industrial (Vapor)': 'Industrial Era (Steam)',
  'Actualidad (Moderno)': 'Modern Day',
  'Futuro Cercano (Cyberpunk)': 'Near Future (Cyberpunk)',
  'Futuro Lejano (Sci-Fi)': 'Far Future (Sci-Fi)',
  'Año 4000 (Post-Apocalíptico)': 'Year 4000 (Post-Apocalyptic)',

  // LOCATIONS
  'Playa Costera': 'Coastal Beach',
  'Acantilados': 'Cliffside',
  'Cordillera Montañosa': 'Mountain Range',
  'Valle Verde': 'Green Valley',
  'Bosque Denso': 'Dense Forest',
  'Selva Tropical': 'Tropical Jungle',
  'Desierto de Dunas': 'Sand Dunes Desert',
  'Caverna Subterránea': 'Underground Cavern',
  'Tundra Helada': 'Frozen Tundra',
  'Páramo Volcánico': 'Volcanic Wasteland',
  'Pantano/Ciénaga': 'Swamp/Marshland',
  'Llanura Abierta': 'Open Plains',
  'Oasis': 'Desert Oasis',
  'Delta de Río': 'River Delta',
  'Bosque de Bambú': 'Bamboo Forest',
  'Montañas de Niebla': 'Misty Mountains',
  'Mazmorra': 'Dungeon',
  'Valle de Cristal': 'Crystal Valley',

  // BUILDINGS
  'Castillo / Fortaleza': 'Castle / Fortress',
  'Castillo': 'Castle',
  'Aldea / Asentamiento': 'Village / Settlement',
  'Aldea medieval': 'Medieval Village',
  'Gran Ciudad / Capital': 'Grand City / Capital',
  'Templo / Santuario': 'Temple / Shrine',
  'Torre de Vigía': 'Watchtower',
  'Ruinas Antiguas': 'Ancient Ruins',
  'Mercado / Bazar': 'Market / Bazaar',
  'Puerto / Muelle': 'Harbor / Dock',
  'Campamento Militar': 'Military Camp',
  'Cementerio / Cripta': 'Graveyard / Crypt',
  'Mina / Cantera': 'Mine / Quarry',
  'Puente / Puerta': 'Bridge / Gate',
  'Asentamiento Principal': 'Main Settlement',
  'Pirámides y Templos': 'Pyramids and Temples',
  'Aldea arbórea': 'Treehouse Village',
  'Sala del Trono': 'Throne Room',

  // CAMERAS
  'Cenital (Top-Down 90º)': 'Top-Down View (90º)',
  'Cenital (90º)': 'Top-Down View (90º)',
  'Isométrica (45º)': 'Isometric View (45º)',
  'Aérea (Drone Shot)': 'Aerial Drone Shot',
  'A nivel de ojos (Eye Level)': 'Eye Level Shot',
  'Contrapicado (Low Angle)': 'Low Angle Shot',
  'Picado (High Angle)': 'High Angle Shot',
  'Primer Plano (Close Up)': 'Close Up Shot',
  'Plano General (Wide Shot)': 'Wide Shot',
  'Plano Medio (Mid Shot)': 'Mid Shot',
  'Sobre el Hombro (OTS)': 'Over The Shoulder Shot',
  'Plano Holandés (Dutch Angle)': 'Dutch Angle',
  'Ojo de Pez (Fish Eye)': 'Fisheye Lens',
  'Cinematic Frontal View': 'Cinematic Frontal View',

  // TIME & WEATHER
  'Mediodía': 'Noon',
  'Day': 'Day',
  'Night': 'Night',
  'Sunset': 'Sunset',
  'Sunrise': 'Sunrise',
  'Eclipse': 'Eclipse',
  'Soleado': 'Sunny',
  'Clear': 'Clear',
  'Rain': 'Rainy',
  'Fog': 'Foggy',
  'Snow': 'Snowy',
  'Storm': 'Stormy',
  'Sandstorm': 'Sandstorm',

  // STYLE WIZARD CATEGORIES
  'Videojuego': 'Video Game Art',
  'Cine / Series': 'Cinema / TV Series',
  'Ilustración / Dibujo': 'Illustration / Drawing',
  'Animación / Infantil': 'Animation / Kids',
  'Juego de Mesa': 'Board Game Art',

  // STYLE VIBES (ATMOSPHERE)
  'Alegre y colorido': 'Cheerful and colorful',
  'Amable y tranquilo': 'Friendly and calm',
  'Épico y grandioso': 'Epic and grandiose',
  'Oscuro y misterioso': 'Dark and mysterious',
  'Neutro / equilibrado': 'Neutral / balanced',

  // DETAILS
  'Muy simple': 'Very simple, minimalist',
  'Medio': 'Medium detail',
  'Rico': 'Rich, high detail',

  // CLARITY
  'Zonas muy definidas': 'Highly defined zones',
  'Equilibrado': 'Balanced composition',
  'Libre / orgánico': 'Organic / free layout',

  // FINISH
  'Limpio y ordenado': 'Clean and organized',
  'Pintado a mano': 'Hand-painted',
  'Textura suave': 'Soft texture',
  'Aspecto de maqueta': 'Diorama / Miniature look',
  'Cinematográfico': 'Cinematic',

  // VIDEO MOTIONS
  'Cámara fija': 'Static camera',
  'Desplazamiento suave': 'Smooth panning',
  'Acercamiento (Zoom In)': 'Zoom In',
  'Alejamiento (Zoom Out)': 'Zoom Out',
  'Barrido panorámico': 'Panoramic sweep',
  'Movimiento orbital': 'Orbital movement',
};

export const UI_TEXT = {
  [Language.ES]: {
    appTitle: "Atlas_Core",
    subtitle: "SYSTEM MATRIX | By Mr. Cuarter",
    appDescription: "Generador profesional de prompts para mapas de juego. Diseña escenarios para RPG, Estrategia y Worldbuilding con control total sobre estilo, atmósfera y narrativa.",
    
    // NEW MODES
    modeConstructorTitle: "CONSTRUCTOR",
    modeConstructorDesc: "Selección rápida de estilos predefinidos. Ideal para resultados inmediatos.",
    modeArchitectTitle: "ARQUITECTO",
    modeArchitectDesc: "Diseño guiado paso a paso para adaptarse al diseño que tienes en mente.",
    modeStoryTitle: "STORYCRAFTER",
    modeStoryDesc: "Modo avanzado para generar narrativas completas con mapas, escenarios, personajes, insignias, inventario, botones...",

    image: "IMAGEN",
    video: "VÍDEO",
    generic: "GENÉRICO",
    midjourney: "MIDJOURNEY",
    presetsTitle: "GENERADOR DE PROTOTIPOS ALEATORIOS",
    shuffleBtn: "GENERAR NUEVOS PROTOTIPOS",
    reset: "RESET",
    scenario: "NÚCLEO DE ESCENARIO",
    scale: "Escala",
    place: "Geolocalización",
    civilization: "Civilización / Raza",
    atmosphere: "Atmósfera y ADN Visual",
    time: "Hora",
    weather: "Clima",
    style: "Estilo Visual",
    styleArt: "ARTÍSTICO",
    styleGame: "VIDEOJUEGOS",
    styleMedia: "CINE / SERIES",
    format: "Configuración de Salida",
    zoom: "Zoom",
    camera: "Ángulo Visual",
    ratio: "Aspect Ratio",
    copy: "COPIAR PROMPT",
    copied: "COPIADO",
    deriveBtn: "DERIVAR ESCENA (IA)", 
    deriveLoading: "GENERANDO POI...",
    noneOption: "--- Seleccionar ---",
    customPlaceholder: "ADN Visual Adicional (Detalles técnicos...)",
    designedBy: "Diseñado por Norberto Cuartero",
    builtWith: "Creado con Google AI Studio",
    followMe: "Sígueme en",
    stepScale: "1. TIPO DE ASSET",
    stepTheme: "2. TEMÁTICA",
    stepCiv: "3. CIVILIZACIÓN / RAZA",
    stepEra: "3B. ÉPOCA / ERA",
    stepPlace: "4. GEOLOCALIZACIÓN",
    stepBuild: "5. EDIFICACIÓN PRINCIPAL",
    stepStyle: "6. ESTILO VISUAL (ASISTENTE)",
    stepCamera: "7. PERSPECTIVA",
    stepFormat: "8. FORMATO DE SALIDA",
    stepMotion: "9. MOVIMIENTO DE CÁMARA",
    stepPlatform: "10. PLATAFORMA DE DESTINO",
    stepMotionHelp: "Elige cómo se mueve la cámara en la escena.",
    stepPlatformSubtitle: "¿Dónde vas a usar el prompt? Cada IA interpreta los prompts de forma distinta.",
    formatUniversal: "UNIVERSAL",
    formatUniversalDesc: "Funciona en Gemini, DALL-E, Copilot y web.",
    formatMJ: "MIDJOURNEY",
    formatMJDesc: "Optimizado con parámetros --ar y --stylize.",
    formatAdvanced: "TÉCNICO",
    formatAdvancedDesc: "Tokens puros para Stable Diffusion / ComfyUI.",
    storycrafterTitle: "STORYCRAFTER ENGINE",
    themeFantasy: "FANTASÍA",
    themeHistory: "HISTÓRICO",
    labelRace: "1A. RAZA / ESPECIE",
    labelGeo: "1B. GEOLOCALIZACIÓN (NATURAL)",
    labelCiv: "1A. CIVILIZACIÓN",
    labelEra: "1B. ÉPOCA / TIEMPO",
    labelSettlement: "1C. EDIFICACIÓN",
    anachronismTitle: "¡DETECCIÓN DE ANACRONISMO!",
    anachronismDesc: "Has mezclado una civilización antigua con una época futura. ¿Qué quieres priorizar?",
    anachronismStrict: "RIGOR HISTÓRICO",
    anachronismChaos: "CAOS CREATIVO IA",
    worldGenBtn: "GENERAR MUNDO",
    uiGenBtn: "GENERAR INTERFAZ (UI)",
    charGenBtn: "GENERAR PERSONAJES",
    poiTitle: "3. PUNTOS DE INTERÉS NARRATIVO",
    poiBtn: "DETECTAR POIs CON IA",
    copyAll: "COPIAR COLECCIÓN",
    copyInstructionHeader: "### COLECCIÓN DE ASSETS GENERADOS POR ATLAS_CORE ###",
    modeAssistant: "ASISTENTE IA",
    modeManual: "MODO MANUAL",
    navWeb: "WEB MR. CUARTER",
    navLab: "LABORATORIO",
    navNeo: "NEOGÉNESIS",
    navCourses: "CURSOS IA",
    navBlog: "BLOG",
    mediaTypeLabel: "FORMATO DE MEDIO",
    modelLabel: "MOTOR IA",
    videoMoveLabel: "MOVIMIENTO DE CÁMARA",
    videoDynLabel: "DINÁMICA DE ACCIÓN",
    memoryTitle: "MEMORIA DEL SISTEMA",
    memoryEmpty: "No hay registros de diseño.",
    memoryDownload: "DESCARGAR LOG",
    memoryClear: "BORRAR MEMORIA",
    gemini: "GEMINI (IMAGEN)",
    enhanceCollection: "MEJORAR CON IA",
    enhancing: "MEJORANDO...",
  },
  [Language.EN]: {
    appTitle: "Atlas_Core",
    subtitle: "SYSTEM MATRIX | By Mr. Cuarter",
    appDescription: "Professional game map prompt generator. Design RPG, Strategy, and Worldbuilding scenarios with full control over style, atmosphere, and narrative.",
    
    // NEW MODES
    modeConstructorTitle: "CONSTRUCTOR",
    modeConstructorDesc: "Quick selection of predefined styles. Ideal for immediate results.",
    modeArchitectTitle: "ARCHITECT",
    modeArchitectDesc: "Step-by-step guided design to adapt to the vision you have in mind.",
    modeStoryTitle: "STORYCRAFTER",
    modeStoryDesc: "Advanced mode to generate full narratives with maps, scenarios, characters, badges, inventory, buttons...",

    image: "IMAGE",
    video: "VIDEO",
    generic: "GENERIC",
    midjourney: "MIDJOURNEY",
    presetsTitle: "RANDOM PROTOTYPE GENERATOR",
    shuffleBtn: "GENERATE NEW PROTOTYPES",
    reset: "RESET",
    scenario: "SCENARIO CORE",
    scale: "Scale",
    place: "Geolocation",
    civilization: "Civilization / Race",
    atmosphere: "Atmosphere & Visual DNA",
    time: "Time",
    weather: "Weather",
    style: "Visual Style",
    styleArt: "ARTISTIC",
    styleGame: "VIDEO GAMES",
    styleMedia: "MOVIES / TV",
    format: "Output Configuration",
    zoom: "Zoom",
    camera: "Camera Angle",
    ratio: "Aspect Ratio",
    copy: "COPY PROMPT",
    copied: "COPIED",
    deriveBtn: "DERIVE SCENE (AI)",
    deriveLoading: "GENERATING POI...",
    noneOption: "--- Select ---",
    customPlaceholder: "Additional Visual DNA (Technical details...)",
    designedBy: "Designed by Norberto Cuartero",
    builtWith: "Created with Google AI Studio",
    followMe: "Follow me on",
    stepScale: "1. ASSET TYPE",
    stepTheme: "2. THEME",
    stepCiv: "3. CIVILIZATION / RACE",
    stepEra: "3B. ERA / TIME",
    stepPlace: "4. GEOLOCATION",
    stepBuild: "5. MAIN EDIFICATION",
    stepStyle: "6. VISUAL STYLE (WIZARD)",
    stepCamera: "7. PERSPECTIVE",
    stepFormat: "8. OUTPUT FORMAT",
    stepMotion: "9. CAMERA MOTION",
    stepPlatform: "10. TARGET PLATFORM",
    stepMotionHelp: "Choose how the camera moves in the scene.",
    stepPlatformSubtitle: "Where will you use this prompt? Each AI interprets prompts differently.",
    stepRatio: "6. ASPECT RATIO",
    formatUniversal: "UNIVERSAL",
    formatUniversalDesc: "Works on Gemini, DALL-E, Copilot and web.",
    formatMJ: "MIDJOURNEY",
    formatMJDesc: "Optimized with --ar and --stylize parameters.",
    formatAdvanced: "TECHNICAL",
    formatAdvancedDesc: "Pure tokens for Stable Diffusion / ComfyUI.",
    storycrafterTitle: "STORYCRAFTER ENGINE",
    themeFantasy: "FANTASÍA",
    themeHistory: "HISTORICAL",
    labelRace: "1A. RACE / SPECIES",
    labelGeo: "1B. GEOLOCATION (NATURAL)",
    labelCiv: "1A. CIVILIZATION",
    labelEra: "1B. ERA / TIME",
    labelSettlement: "1C. SETTLEMENT TYPE",
    anachronismTitle: "ANACHRONISM DETECTED!",
    anachronismDesc: "You've mixed an ancient civilization with a future era. What do you want to prioritize?",
    anachronismStrict: "HISTORICAL RIGOR",
    anachronismChaos: "IA CREATIVE CHAOS",
    worldGenBtn: "GENERATE WORLD",
    uiGenBtn: "GENERATE UI KIT",
    charGenBtn: "GENERATE CHARACTERS",
    poiTitle: "3. NARRATIVE POINTS OF INTEREST",
    poiBtn: "DETECT POIs WITH AI",
    copyAll: "COPY COLLECTION",
    copyInstructionHeader: "### ATLAS_CORE ASSET COLLECTION ###",
    modeAssistant: "AI ASSISTANT",
    modeManual: "MANUAL MODE",
    navWeb: "WEB MR. CUARTER",
    navLab: "LABORATORIO",
    navNeo: "NEOGENESIS",
    navCourses: "AI COURSES",
    navBlog: "BLOG",
    mediaTypeLabel: "MEDIA FORMAT",
    modelLabel: "AI ENGINE",
    videoMoveLabel: "CAMERA MOVEMENT",
    videoDynLabel: "ACTION DYNAMICS",
    memoryTitle: "SYSTEM MEMORY",
    memoryEmpty: "No design logs found.",
    memoryDownload: "DOWNLOAD LOG",
    memoryClear: "CLEAR MEMORY",
    gemini: "GEMINI (IMAGEN)",
    enhanceCollection: "ENHANCE WITH AI",
    enhancing: "ENHANCING...",
  }
};

// ... Rest of constants (Lists)
export const ASSET_TYPES = ['MAPA TÁCTICO', 'ESCENA / POI'];

export const SCALES = ['Micro', 'Meso', 'Macro'];
export const TIMES = ['Day', 'Night', 'Sunset', 'Sunrise', 'Eclipse'];
export const WEATHERS = ['Clear', 'Rain', 'Fog', 'Snow', 'Storm', 'Sandstorm'];

export const FANTASY_RACES = [
    'Altos Elfos', 'Elfos Silvanos', 'Elfos Oscuros (Drow)', 
    'Humanos', 'Enanos de Montaña', 'Enanos de Hierro',
    'Orcos', 'Goblins', 'No-Muertos (Lich)', 'Esqueletos', 
    'Hadas (Fae)', 'Demonios', 'Angeles', 'Hombres Lagarto',
    'Gnomos', 'Halflings', 'Vampiros', 'Hombres Lobo', 
    'Elementales de Fuego', 'Constructos/Golems'
];

export const HISTORICAL_CIVS = [
    'Antiguo Egipto', 'Imperio Romano', 'Vikingos', 'Grecia Clásica',
    'Japón Feudal', 'Imperio Maya', 'Imperio Azteca', 'Europa Medieval',
    'China Dinastía Han', 'Persia', 'Londres Victoriano', 'Lejano Oeste (Western)'
];

export const HISTORICAL_ERAS = [
    'Prehistoria (Jurásico)',
    'Edad de Piedra',
    'Edad de Bronce',
    'Edad Antigua (Clásica)',
    'Edad Media (Medieval)',
    'Renacimiento',
    'Era Industrial (Vapor)',
    'Actualidad (Moderno)',
    'Futuro Cercano (Cyberpunk)',
    'Futuro Lejano (Sci-Fi)',
    'Año 4000 (Post-Apocalíptico)'
];

const LOCATIONS_CIVILIZED = [
    'Playa Costera', 'Acantilados', 'Cordillera Montañosa', 'Valle Verde',
    'Bosque Denso', 'Selva Tropical', 'Desierto de Dunas', 'Caverna Subterránea',
    'Tundra Helada', 'Páramo Volcánico', 'Pantano/Ciénaga', 'Llanura Abierta'
];
export const LOCATIONS = LOCATIONS_CIVILIZED; 
export const getLocationsByEra = (era: string) => LOCATIONS_CIVILIZED; 

const BUILDINGS_HISTORIC = [
    'Castillo / Fortaleza', 'Aldea / Asentamiento', 'Gran Ciudad / Capital',
    'Templo / Santuario', 'Torre de Vigía', 'Ruinas Antiguas',
    'Mercado / Bazar', 'Puerto / Muelle', 'Campamento Militar',
    'Cementerio / Cripta', 'Mina / Cantera', 'Puente / Puerta'
];
export const BUILDINGS = BUILDINGS_HISTORIC;
export const FANTASY_BUILDINGS = BUILDINGS_HISTORIC; 
export const HISTORICAL_BUILDINGS = BUILDINGS_HISTORIC;
export const getBuildingsByEra = (era: string) => BUILDINGS_HISTORIC;

// PREDEFINED POIS FOR OFFLINE STORYCRAFTER
export const PREDEFINED_POIS: Record<string, string[]> = {
    'DEFAULT': ['Plaza Principal', 'Taberna / Posada', 'Armería', 'Sala del Consejo', 'Murallas', 'Entrada Secreta'],
    
    // FANTASY
    'Altos Elfos': ['Cámara de los Cristales', 'Biblioteca Arcana', 'Observatorio Estelar', 'Jardines Colgantes', 'Sala del Trono', 'Puerto de Navíos Blancos'],
    'Elfos Oscuros (Drow)': ['Templo de la Araña', 'Foso de los Esclavos', 'Sala de las Sombras', 'Mercado Subterráneo', 'Laboratorio de Venenos', 'Torre de Hechicería'],
    'Enanos de Montaña': ['Gran Fragua', 'Sala del Tesoro', 'Mina Profunda', 'Cervecería Real', 'Salón de los Ancestros', 'Puerta de Piedra'],
    'Orcos': ['Foso de Lucha', 'Campamento de Guerra', 'Altar de Huesos', 'Herrería de Sangre', 'Torre de Vigía Tribal', 'Jaulas de Wargs'],
    'No-Muertos (Lich)': ['Cripta Real', 'Laboratorio de Nigromancia', 'Trono de Hueso', 'Foso de Almas', 'Jardín Marchito', 'Torre del Silencio'],
    'Cyberpunk': ['Bar de Neón', 'Clínica de Implantes', 'Callejón Lluvioso', 'Torre Corporativa', 'Mercado Negro de Datos', 'Apartamento Cápsula'],
    
    // HISTORICAL
    'Antiguo Egipto': ['Sala del Faraón', 'Cámara del Sarcófago', 'Templo de Ra', 'Orilla del Nilo', 'Obelisco', 'Cámara del Tesoro'],
    'Vikingos': ['Gran Salón de Hidromiel', 'Muelle de Drakkars', 'Altar de Odín', 'Herrería', 'Casa del Jarl', 'Círculo de Runas'],
    'Imperio Romano': ['Foro Romano', 'Coliseo (Arena)', 'Baños Termales', 'Villa del Senador', 'Templo de Júpiter', 'Barracones de Legión'],
    'Japón Feudal': ['Dojo de Entrenamiento', 'Jardín Zen', 'Castillo del Shogun', 'Casa de Té', 'Torre Pagoda', 'Puerta Torii']
};

export const getPredefinedPOIs = (civ: string): string[] => {
    if (!civ) return PREDEFINED_POIS['DEFAULT'];
    // Try exact match
    if (PREDEFINED_POIS[civ]) return PREDEFINED_POIS[civ];
    
    // Fallback logic
    if (civ.includes('Elfo')) return PREDEFINED_POIS['Altos Elfos'];
    if (civ.includes('Enano')) return PREDEFINED_POIS['Enanos de Montaña'];
    if (civ.includes('Orco') || civ.includes('Goblin')) return PREDEFINED_POIS['Orcos'];
    if (civ.includes('Muerto') || civ.includes('Lich') || civ.includes('Vampiro')) return PREDEFINED_POIS['No-Muertos (Lich)'];
    
    return PREDEFINED_POIS['DEFAULT'];
};

interface StyleWizardData {
    categories: string[];
    references: Record<string, { label: string, desc: string, token: string }[]>;
    vibes: { label: string, token: string }[];
    details: { label: string, token: string }[];
    clarity: { label: string, token: string }[];
    finish: { label: string, token: string }[];
}

export const STYLE_WIZARD_DATA: StyleWizardData = {
    categories: ['Videojuego', 'Cine / Series', 'Ilustración / Dibujo', 'Animación / Infantil', 'Juego de Mesa'],
    
    references: {
        'Videojuego': [
            { label: 'Zelda', desc: 'Fantasía estilizada, luz natural', token: 'Visual Style: Legend of Zelda Breath of the Wild. Cell-shaded, painterly textures, vibrant nature' },
            { label: 'Mario / Pokémon', desc: 'Cartoon, colorido, alegre', token: 'Visual Style: Nintendo Mario/Pokemon. High saturation, rounded shapes, friendly cartoon aesthetic' },
            { label: 'Fortnite', desc: 'Cartoon moderno, limpio', token: 'Visual Style: Fortnite. Stylized realism, clean assets, vibrant colors, slight exaggeration' },
            { label: 'World of Warcraft', desc: 'Fantasía épica, hand-painted', token: 'Visual Style: World of Warcraft. Hand-painted textures, exaggerated proportions, epic fantasy, Blizzard style' },
            { label: 'Age of Empires', desc: 'Histórico estratégico', token: 'Visual Style: Age of Empires IV. Historical realism, strategic isometric view, detailed architecture' },
            { label: 'Civilization', desc: 'Mapa global por regiones', token: 'Visual Style: Civilization VI. Hexagonal map aesthetic, stylized historical, readable terrain' },
            { label: 'Minecraft', desc: 'Bloques / Voxel', token: 'Visual Style: Minecraft. Voxel art, cubic blocks, 8-bit textures, blocky terrain' },
            { label: 'Diablo', desc: 'Oscuro, isométrico', token: 'Visual Style: Diablo IV. Dark gothic, gritty realism, dynamic lighting, isometric dungeon crawler' },
            { label: 'Genshin Impact', desc: 'Anime fantasy, limpio', token: 'Visual Style: Genshin Impact. Anime aesthetic, cel-shaded, bloom lighting, clean fantasy' }
        ],
        'Cine / Series': [
            { label: 'Disney / Pixar', desc: '3D Render perfecto', token: 'Visual Style: Disney/Pixar. 3D Render, subsurface scattering, expressive shapes, cinematic lighting' },
            { label: 'Studio Ghibli', desc: 'Anime tradicional, detallado', token: 'Visual Style: Studio Ghibli. Hand-drawn anime backgrounds, watercolor textures, lush nature, Hayao Miyazaki' },
            { label: 'El Señor de los Anillos', desc: 'Fantasía realista', token: 'Visual Style: Lord of the Rings. Weta Digital realism, gritty fantasy, epic scale, cinematic photography' },
            { label: 'Star Wars', desc: 'Sci-Fi clásico, usado', token: 'Visual Style: Star Wars Original Trilogy. Used future aesthetic, industrial sci-fi, matte painting feel' },
            { label: 'Blade Runner', desc: 'Cyberpunk, neón, lluvia', token: 'Visual Style: Blade Runner 2049. Cyberpunk, neon noir, volumetric fog, high contrast, futuristic' },
            { label: 'Dune', desc: 'Brutalismo, arena, épico', token: 'Visual Style: Dune (Villeneuve). Brutalist architecture, desert atmosphere, monochromatic scale, cinematic' },
            { label: 'Game of Thrones', desc: 'Medieval crudo', token: 'Visual Style: Game of Thrones. Gritty medieval realism, desaturated cold tones, high production value' },
            { label: 'Wes Anderson', desc: 'Simetría, color pastel', token: 'Visual Style: Wes Anderson. Symmetrical composition, pastel color palette, flat lighting, dollhouse aesthetic' },
            { label: 'Arcane', desc: '2D/3D híbrido, texturizado', token: 'Visual Style: Arcane (League of Legends). Painted textures on 3D models, atmospheric lighting, expressive brushstrokes' }
        ],
        'Ilustración / Dibujo': [
            { label: 'Cuento ilustrado', desc: 'Mágico, bordes suaves', token: 'Visual Style: Children\'s book illustration. Soft edges, whimsical atmosphere, magical realism' },
            { label: 'Acuarela suave', desc: 'Difuminado, artístico', token: 'Visual Style: Watercolor painting. Wet-on-wet technique, paper texture, soft gradients, artistic' },
            { label: 'Ilustración editorial', desc: 'Moderno, vectorial, plano', token: 'Visual Style: Modern editorial illustration. Flat vector art, bold colors, geometric shapes, minimal' },
            { label: 'Cómic europeo', desc: 'Línea clara (Tintín/Moebius)', token: 'Visual Style: Ligne Claire (European Comic). Clear outlines, flat colors, Moebius style, detailed line art' },
            { label: 'Cómic americano', desc: 'Tintas fuertes, dinámico', token: 'Visual Style: American Comic Book. Bold ink lines, halftone patterns, dynamic action, Marvel/DC style' },
            { label: 'Manga', desc: 'Blanco y negro, tramado', token: 'Visual Style: Manga. Black and white ink, screentones, dynamic paneling, Japanese comic style' },
            { label: 'Grabado antiguo', desc: 'Medieval, líneas cruzadas', token: 'Visual Style: Woodcut engraving. Cross-hatching, vintage map style, black ink on parchment' },
            { label: 'Boceto a lápiz', desc: 'Grafito, sin acabar', token: 'Visual Style: Pencil Sketch. Graphite texture, rough lines, unfinished look, artistic study' },
            { label: 'Ilustración infantil', desc: 'Crayón, simple', token: 'Visual Style: Crayon/Chalk drawing. Childlike simplicity, texture, naive art' }
        ],
        'Animación / Infantil': [
             { label: 'Pixar-like', desc: '3D amable', token: 'Visual Style: 3D Animation (Pixar style). Soft lighting, rounded shapes, friendly appeal' },
             { label: 'Cartoon clásico', desc: '2D, Looney Tunes', token: 'Visual Style: Classic 2D Cartoon. Hand-drawn animation, cel animation, expressive' },
             { label: 'Mundo de juguete', desc: 'Plástico, brillante', token: 'Visual Style: Toy World. Plastic textures, tilt-shift effect, miniature scale' },
             { label: 'Fantasía amable', desc: 'Colores pastel, seguro', token: 'Visual Style: Cozy Fantasy. Pastel colors, soft shapes, welcoming atmosphere' },
             { label: 'Libro infantil', desc: 'Texturas de papel', token: 'Visual Style: Storybook. Paper cutout look, layered depth, charming' },
             { label: 'Stop-motion', desc: 'Plastilina / Claymation', token: 'Visual Style: Aardman / Laika Stop-motion. Clay textures, fingerprint details, physical lighting' },
             { label: 'Chibi', desc: 'Cabezones, cute', token: 'Visual Style: Chibi Anime. Super deformed, cute, large heads, simple features' },
             { label: 'Low-poly amable', desc: 'Polígonos visibles', token: 'Visual Style: Low Poly Art. Visible polygons, flat shading, vibrant colors, abstract' },
             { label: 'Color pastel', desc: 'Suave, desaturado', token: 'Visual Style: Pastel Palette. Soft desaturated colors, dreamy atmosphere, gentle contrast' }
        ],
        'Juego de Mesa': [
            { label: 'Tablero moderno', desc: 'Limpio, Iconografía', token: 'Visual Style: Modern Board Game. Clean iconography, vector art, high readability, Catan style' },
            { label: 'Fantasy boardgame', desc: 'Rico, detallado', token: 'Visual Style: Fantasy Board Game Map. Detailed illustration, parchment texture, ornate borders' },
            { label: 'Hexágonos', desc: 'Táctico, rejilla', token: 'Visual Style: Hexagonal Grid Map. Tactical overlay, distinct tiles, strategy game aesthetic' },
            { label: 'Casillas', desc: 'Grid clásico', token: 'Visual Style: Square Grid Map. Dungeon crawler mat, clear grid lines, top-down tactical' },
            { label: 'Mapa modular', desc: 'Piezas conectables', token: 'Visual Style: Modular Dungeon Tiles. Puzzle piece aesthetic, distinct room segments' },
            { label: 'Prototipo limpio', desc: 'Minimalista, blanco', token: 'Visual Style: Clean Prototype. Whitebox aesthetic, minimal details, focus on layout' },
            { label: 'Cartón ilustrado', desc: 'Textura de cartón', token: 'Visual Style: Cardboard components. Token aesthetic, die-cut edges, physical game component feel' },
            { label: 'Miniaturas pintadas', desc: 'Diorama físico', token: 'Visual Style: Painted Miniatures Diorama. Tilt-shift, physical textures, flocked grass, realistic paint' },
            { label: 'Mapa abstracto', desc: 'Símbolos, no realista', token: 'Visual Style: Abstract Strategy Map. Symbolic representation, high contrast, minimal art' }
        ]
    },

    vibes: [
        { label: 'Alegre y colorido', token: 'Vibrant, High Saturation, Cheerful, Bright lighting' },
        { label: 'Amable y tranquilo', token: 'Cozy, Peaceful, Soft lighting, Relaxing atmosphere' },
        { label: 'Épico y grandioso', token: 'Epic scale, Dramatic lighting, Grandiose, Cinematic majesty' },
        { label: 'Oscuro y misterioso', token: 'Dark fantasy, Low key lighting, Mysterious, Foggy, Moody' },
        { label: 'Neutro / equilibrado', token: 'Neutral lighting, Balanced contrast, Realistic tones, Standard daylight' }
    ],

    details: [
        { label: 'Muy simple', token: 'Minimalist, Low Detail, Clean lines, No visual noise' },
        { label: 'Medio', token: 'Medium Detail, Balanced composition, Standard game asset fidelity' },
        { label: 'Rico', token: 'High Fidelity, Intricate details, Ornate, Visual clutter, Texture heavy' }
    ],

    clarity: [
        { label: 'Zonas muy definidas', token: 'High readability, Distinct silhouettes, Clear separation of elements' },
        { label: 'Equilibrado', token: 'Balanced composition, Natural blending' },
        { label: 'Libre / orgánico', token: 'Organic layout, Chaotic nature, Blended edges, Wild growth' }
    ],

    finish: [
        { label: 'Limpio y ordenado', token: 'Clean render, Sharp edges, Vector-like precision' },
        { label: 'Pintado a mano', token: 'Hand-painted texture, Visible brush strokes, Artistic touch' },
        { label: 'Textura suave', token: 'Soft gradients, Smooth shading, Velvet texture' },
        { label: 'Aspecto de maqueta', token: 'Tilt-shift photography, Miniature effect, Physical model look' },
        { label: 'Cinematográfico', token: 'Cinematic lighting, Post-processing, Lens flares, Depth of field' }
    ]
};

export const STYLES_ARTISTIC = [
    'Realista (Unreal 5)', 'Óleo Clásico', 'Acuarela Suave', 'Boceto a Lápiz',
    'Tinta China (Sumi-e)', 'Grabado Medieval', 'Art Nouveau', 'Cyberpunk Neon',
    'Steampunk Bronze', 'Gótico Oscuro', 'Low Poly', 'Voxel Art',
    'Pixel Art 16-bit', 'Cel Shaded', 'Noir (Blanco y Negro)'
];

export const STYLES_GAMES = [
    'Elden Ring', 'Zelda: Breath of the Wild', 'World of Warcraft', 'Final Fantasy',
    'Dark Souls', 'Skyrim', 'Diablo IV', 'Hades', 'Overwatch', 
    'Cyberpunk 2077', 'Assassin\'s Creed', 'Genshin Impact', 'Minecraft',
    'Age of Empires', 'Civilization VI'
];

export const STYLES_MEDIA = [
    'Studio Ghibli', 'Disney/Pixar 3D', 'Arcane (League of Legends)', 'Spider-Verse',
    'Lord of the Rings (Cine)', 'Game of Thrones', 'Dune (Villeneuve)', 'Blade Runner',
    'Star Wars', 'Stranger Things', 'Tim Burton', 'Wes Anderson',
    'Anime años 90', 'Comic Americano', 'Manga Blanco y Negro'
];

export const ART_STYLES = [...STYLES_ARTISTIC, ...STYLES_GAMES, ...STYLES_MEDIA];

export const MAP_PERSPECTIVES = [
    'Cenital (Top-Down 90º)', 
    'Isométrica (45º)', 
    'Aérea (Drone Shot)'
];

export const SCENE_PERSPECTIVES = [
    'A nivel de ojos (Eye Level)', 
    'Contrapicado (Low Angle)', 
    'Picado (High Angle)',
    'Primer Plano (Close Up)',
    'Plano General (Wide Shot)',
    'Plano Medio (Mid Shot)',
    'Sobre el Hombro (OTS)',
    'Plano Holandés (Dutch Angle)',
    'Ojo de Pez (Fish Eye)'
];

export const CAMERAS = [...MAP_PERSPECTIVES, ...SCENE_PERSPECTIVES];

export const VIDEO_MOTIONS = [
    { id: 'static', label: 'Cámara fija' },
    { id: 'slow_pan', label: 'Desplazamiento suave' },
    { id: 'zoom_in', label: 'Acercamiento (Zoom In)' },
    { id: 'zoom_out', label: 'Alejamiento (Zoom Out)' },
    { id: 'panoramic', label: 'Barrido panorámico' },
    { id: 'orbit', label: 'Movimiento orbital' }
];

export const VIDEO_DYNAMICS = ['Normal', 'Slow', 'Fast'];
export const PLACES_BY_CIV: Record<string, string[]> = { 'DEFAULT': LOCATIONS_CIVILIZED }; 
export const SETTLEMENT_TYPES = BUILDINGS_HISTORIC;
export const ZOOMS = ['Macro', 'Meso', 'Micro'];
export const RATIOS = ['16:9'];

// --- RANDOM ARCHETYPES FOR DYNAMIC PRESET GENERATION ---
// This ensures that "Random" isn't "Chaos". 
// A "High Fantasy" archetype won't accidentally pick "Cyberpunk" styles.

export const ARCHETYPE_DEFINITIONS = [
    {
        name: "Alta Fantasía",
        civs: ['Altos Elfos', 'Humanos', 'Hadas (Fae)', 'Angeles'],
        places: ['Valle Verde', 'Bosque Denso', 'Llanura Abierta', 'Playa Costera'],
        styles: ['Zelda: Breath of the Wild', 'World of Warcraft', 'Genshin Impact', 'Studio Ghibli', 'Disney/Pixar 3D', 'Acuarela Suave', 'Art Nouveau'],
        era: 'Edad Antigua'
    },
    {
        name: "Fantasía Oscura",
        civs: ['No-Muertos (Lich)', 'Esqueletos', 'Vampiros', 'Hombres Lobo', 'Demonios', 'Orcos'],
        places: ['Pantano/Ciénaga', 'Cementerio / Cripta', 'Páramo Volcánico', 'Caverna Subterránea', 'Ruinas Antiguas'],
        styles: ['Dark Souls', 'Diablo IV', 'Elden Ring', 'Hades', 'Gótico Oscuro', 'Noir (Blanco y Negro)', 'Grabado Medieval'],
        era: 'Edad Media'
    },
    {
        name: "Mundo Antiguo",
        civs: ['Antiguo Egipto', 'Imperio Romano', 'Grecia Clásica', 'Persia', 'Imperio Azteca', 'Imperio Maya'],
        places: ['Desierto de Dunas', 'Playa Costera', 'Oasis', 'Delta de Río', 'Selva Tropical'],
        styles: ['Assassin\'s Creed', 'Civilization VI', 'Age of Empires', 'Realista (Unreal 5)', 'Óleo Clásico'],
        era: 'Edad Antigua (Clásica)'
    },
    {
        name: "Norte Salvaje",
        civs: ['Vikingos', 'Enanos de Montaña', 'Hombres Lobo', 'Humanos'],
        places: ['Tundra Helada', 'Acantilados', 'Cordillera Montañosa', 'Bosque Denso'],
        styles: ['Skyrim', 'Game of Thrones', 'Lord of the Rings (Cine)', 'Realista (Unreal 5)', 'Boceto a Lápiz'],
        era: 'Edad Media (Medieval)'
    },
    {
        name: "Oriente Místico",
        civs: ['Japón Feudal', 'China Dinastía Han'],
        places: ['Bosque de Bambú', 'Montañas de Niebla', 'Valle Verde', 'Aldea / Asentamiento'],
        styles: ['Tinta China (Sumi-e)', 'Manga Blanco y Negro', 'Anime años 90', 'Genshin Impact', 'Studio Ghibli'],
        era: 'Edad Media (Medieval)'
    },
    {
        name: "Futuro & Neón",
        civs: ['Humanos', 'Constructos/Golems'], // Re-using Human for Cyberpunk/Sci-Fi context
        places: ['Gran Ciudad / Capital', 'Puerto / Muelle', 'Mina / Cantera'],
        styles: ['Cyberpunk 2077', 'Blade Runner', 'Star Wars', 'Cyberpunk Neon', 'Arcane (League of Legends)'],
        era: 'Futuro Cercano (Cyberpunk)'
    },
    {
        name: "Retro & Pixel",
        civs: ['Humanos', 'Orcos', 'Esqueletos', 'Héroe 8-bit'],
        places: ['Mazmorra', 'Aldea / Asentamiento', 'Bosque Denso'],
        styles: ['Pixel Art 16-bit', 'Voxel Art', 'Minecraft', 'Pokemon (GameBoy)', 'Zelda (SNES)'],
        era: 'Actualidad (Moderno)'
    }
];
