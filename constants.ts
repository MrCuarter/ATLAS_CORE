import { PoiMapping, Preset, Language } from './types';

export const PROMPT_TRANSLATIONS: Record<string, string> = {
  // SCALES
  'Micro (Bosque, Oasis)': 'Micro Scale (Forest, Oasis)',
  'Meso (Ciudad, Región)': 'Meso Scale (City, Region)',
  'Macro (Continente, Mundo)': 'Macro Scale (Kingdom, World)',
  'Especial (Plano astral)': 'Special Dimension (Astral Plane)',
};

export const UI_TEXT = {
  [Language.ES]: {
    appTitle: "Atlas_Core",
    subtitle: "SYSTEM MATRIX | By Mr. Cuarter",
    appDescription: "Generador profesional de prompts para mapas de juego. Diseña escenarios para RPG, Estrategia y Worldbuilding con control total sobre estilo, atmósfera y narrativa.",
    presets: "CARTÓGRAFO", 
    simple: "CONSTRUCTOR", 
    advanced: "ARQUITECTO", 
    narrative: "STORYCRAFTER", 
    image: "IMAGEN",
    video: "VÍDEO",
    generic: "GENÉRICO",
    midjourney: "MIDJOURNEY",
    presetsTitle: "INTELIGENCIA CARTOGRÁFICA (9 PLANOS)",
    shuffleBtn: "REMEZCLAR DATOS",
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
    camera: "Ángulo",
    ratio: "Aspect Ratio",
    copy: "COPIAR PROMPT",
    copied: "COPIADO",
    noneOption: "--- Seleccionar ---",
    customPlaceholder: "ADN Visual Adicional (Detalles técnicos...)",
    designedBy: "Diseñado por",
    followMe: "Sígueme en",
    stepScale: "1. SELECCIONA ESCALA",
    stepCiv: "2. CIVILIZACIÓN / RAZA",
    stepPlace: "3. EL LUGAR",
    stepStyle: "4. ESTILO VISUAL",
    stepCamera: "5. CÁMARA",
    stepRatio: "6. FORMATO",
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
    worldGenBtn: "EJECUTAR ATLAS_CORE",
    worldGenDesc: "Generar Mundo Completo",
    modeAssistant: "ASISTENTE IA",
    modeManual: "MODO MANUAL"
  },
  [Language.EN]: {
    appTitle: "Atlas_Core",
    subtitle: "SYSTEM MATRIX | By Mr. Cuarter",
    appDescription: "Professional game map prompt generator. Design RPG, Strategy, and Worldbuilding scenarios with full control over style, atmosphere, and narrative.",
    presets: "CARTOGRAPHER",
    simple: "BUILDER",
    advanced: "ARCHITECT",
    narrative: "STORYCRAFTER",
    image: "IMAGE",
    video: "VIDEO",
    generic: "GENERIC",
    midjourney: "MIDJOURNEY",
    presetsTitle: "CARTOGRAPHIC INTELLIGENCE (9 PLANS)",
    shuffleBtn: "RESHUFFLE DATA",
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
    camera: "Angle",
    ratio: "Aspect Ratio",
    copy: "COPY PROMPT",
    copied: "COPIED",
    noneOption: "--- Select ---",
    customPlaceholder: "Additional Visual DNA (Technical details...)",
    designedBy: "Designed by",
    followMe: "Follow me on",
    stepScale: "1. SELECT SCALE",
    stepCiv: "2. CIVILIZATION / RACE",
    stepPlace: "3. PLACE",
    stepStyle: "4. VISUAL STYLE",
    stepCamera: "5. CAMERA",
    stepRatio: "6. ASPECT RATIO",
    storycrafterTitle: "STORYCRAFTER ENGINE",
    themeFantasy: "FANTASY",
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
    worldGenBtn: "EXECUTE ATLAS_CORE",
    worldGenDesc: "Generate Full World",
    modeAssistant: "AI ASSISTANT",
    modeManual: "MANUAL MODE"
  }
};

export const SCALES = ['Micro (Bosque, Oasis)', 'Meso (Ciudad, Región)', 'Macro (Continente, Mundo)', 'Especial (Plano astral)'];
export const TIMES = ['Amanecer', 'Mediodía', 'Atardecer', 'Noche', 'Eclipse', 'Aurora Boreal', 'Crepúsculo Eterno'];
export const WEATHERS = ['Soleado', 'Tormenta eléctrica', 'Niebla densa', 'Nevando', 'Mágico/Bioluminiscente', 'Lluvia Ácida', 'Viento Huracanado'];

export const HISTORICAL_ERAS = [
  'Dinosaurios (Jurásico)', 'Prehistoria', 'Edad de Piedra', 'Edad de los Metales', 'Edad del Bronce',
  'Edad Antigua (Grecia/Roma)', 'Edad Media (Feudalismo)', 'Renacimiento', 'Siglo de Oro (Piratería)', 'Revolución Industrial', 
  'Guerra Mundial (1940s)', 'Guerra Fría (1980s)', 'Año 2050 (Cyberpunk)', 'Año 3000 (Futuro Espacial)', 'Año 4000 (Transhumanismo)', 'Post-Apocalíptico'
];

export const FANTASY_RACES = [
  'Humanos', 'Elfos Nobles', 'Elfos del Bosque', 'Elfos Oscuros (Drow)', 'Orcos', 'Goblins', 
  'Enanos de Montaña', 'Enanos de Profundidad', 'Gnomos', 'Halflings', 
  'Dracónidos', 'Tieflings (Demoníacos)', 'Aasimar (Celestiales)', 'No-Muertos', 
  'Vampiros', 'Hombres Bestia', 'Constructos / Golems', 'Hadas / Feéricos', 
  'Alienígenas Insectoides', 'Alienígenas Acuáticos', 'Cyborgs Mágicos'
];

export const HISTORICAL_CIVS = [
  'Humana (Genérica)', 'Inuit / Esquimales', 'Romana', 'Egipcia', 'Griega', 'Espartana', 
  'Vikinga / Nórdica', 'Celta', 'Japonesa Feudal', 'China Imperial', 'Mongola', 
  'Azteca', 'Maya', 'Inca', 'Persa', 'Zulú', 'India Antigua', 'Amerindia'
];

export const FANTASY_BUILDINGS = [
  'Sin edificación (Entorno salvaje)', 'Campamento de viaje', 'Asentamiento primitivo', 'Aldea pequeña',
  'Pueblo comercial', 'Ciudad amurallada', 'Gran Capital', 'Fortaleza militar',
  'Torre solitaria', 'Templo / Santuario', 'Ruinas antiguas', 'Base secreta subterránea',
  'Puesto de avanzada', 'Mercado itinerante', 'Puerto / Muelle'
];

export const HISTORICAL_BUILDINGS = [
  'Sin edificación', 'Campamento nómada', 'Asentamiento rural', 'Villa fortificada',
  'Ciudad estado', 'Metrópolis', 'Castillo / Palacio', 'Zona Industrial',
  'Lugar de Culto (Catedral/Templo)', 'Campo de batalla', 'Puerto comercial', 'Complejo minero'
];

export const SETTLEMENT_TYPES = [...FANTASY_BUILDINGS, ...HISTORICAL_BUILDINGS];

export const PLACES_BY_CIV: Record<string, string[]> = {
  'Elfos Nobles': ['Valle de Cristal', 'Isla Flotante', 'Acantilados Blancos', 'Jardines Colgantes', 'Lago Espejo'],
  'Elfos del Bosque': ['Bosque Ancestral', 'Claro Sagrado', 'Copa de los Árboles', 'Río Serpenteante', 'Cascadas Ocultas'],
  'Elfos Oscuros (Drow)': ['Caverna de Hongos', 'Abismo Sin Fondo', 'Bosque Petrificado', 'Cueva de Cristal Negro', 'Lago Subterráneo'],
  'Orcos': ['Estepa Árida', 'Cañón Rojo', 'Cráter Volcánico', 'Páramo de Ceniza', 'Acantilado Rocoso'],
  'Goblins': ['Pantano Burbujeante', 'Cueva Húmeda', 'Vertedero Natural', 'Bosque de Espinas', 'Barranco'],
  'Enanos de Montaña': ['Pico Nevado', 'Paso de Montaña', 'Entrada de Cueva', 'Valle Rocoso', 'Geiser Termal'],
  'Enanos de Profundidad': ['Cámara de Magma', 'Túnel de Cristal', 'Gruta de Piedra', 'Río de Lava', 'Abismo'],
  'Humanos': ['Llanura Fértil', 'Delta de Río', 'Costa Rocosa', 'Colinas Verdes', 'Bosque Templado'],
  'No-Muertos': ['Cementerio Antiguo', 'Campo de Batalla', 'Páramo Muerto', 'Bosque Marchito', 'Pantano de Niebla'],
  'Vampiros': ['Montaña Nublada', 'Bosque de Sangre', 'Acantilado Gótico', 'Valle de Sombras', 'Cueva de Murciélagos'],
  'Dracónidos': ['Pico de Dragón', 'Volcán Activo', 'Isla Rocosa', 'Cueva de Tesoros', 'Desierto de Obsidiana'],
  'Hadas / Feéricos': ['Bosque Encantado', 'Claro de Setas', 'Lago Luminoso', 'Pradera de Flores', 'Arcoiris Eterno'],
  'Alienígenas Insectoides': ['Colmena Orgánica', 'Desierto de Ácido', 'Bosque de Esporas', 'Cráter de Impacto', 'Túneles de Mucosa'],
  'Alienígenas Acuáticos': ['Arrecife de Coral', 'Fosa Abisal', 'Ciudad Sumergida', 'Bosque de Algas', 'Playa de Cristal'],
  'DEFAULT': ['Bosque Denso', 'Montaña Alta', 'Desierto Árido', 'Isla Tropical', 'Cueva Profunda', 'Llanura Abierta', 'Costa', 'Pantano']
};

export const STYLES_ARTISTIC = [
    'Realista cinematográfico', 'Ilustración Digital', 'Óleo Clásico', 'Acuarela', 'Boceto a Lápiz', 
    'Anime / Manga', 'Cómic Americano', 'Low Poly', 'Voxel Art', 'Pixel Art', 
    'Isométrico', 'Blueprint', 'Cyberpunk', 'Steampunk', 'Solarpunk', 
    'Noir / B&W', 'Psicodélico', 'Surrealismo', 'Art Nouveau', 'Ukiyo-e', 'Grabado Medieval', 'Minimalista Vectorial'
];

export const STYLES_GAMES = [
    'Elden Ring', 'Dark Souls', 'Bloodborne', 'Cyberpunk 2077', 'The Witcher 3', 
    'Skyrim', 'Fallout', 'BioShock', 'Mass Effect', 'Halo', 
    'Destiny', 'Overwatch', 'Fortnite', 'World of Warcraft', 'Zelda: BOTW', 
    'Mario Odyssey', 'Minecraft', 'Terraria', 'Stardew Valley', 'Hollow Knight',
    'Final Fantasy VII', 'Dishonored', 'Assassin\'s Creed', 'God of War', 'League of Legends'
];

export const STYLES_MEDIA = [
    'Arcane (LoL)', 'Spider-Verse', 'Pixar 3D', 'Disney Classic (2D)', 'Studio Ghibli', 
    'Stranger Things', 'Game of Thrones', 'Lord of the Rings', 'Harry Potter', 'Star Wars', 
    'Dune', 'Blade Runner', 'The Matrix', 'Mad Max', 'Wes Anderson', 
    'Tim Burton', 'The Simpsons', 'Rick and Morty', 'Futurama', 'Adventure Time',
    'Akira', 'Ghost in the Shell', 'Moebius', 'Love, Death & Robots'
];

export const ART_STYLES = [...STYLES_ARTISTIC, ...STYLES_GAMES, ...STYLES_MEDIA];

export const ZOOMS = ['Mundo (Macro)', 'Región (Medio)', 'Distrito (Cerca)', 'Escena (Detalle)'];
export const CAMERAS = ['Cenital (90º)', 'Isométrica (45º)', 'Perspectiva Heroica', 'Ojo de Pez'];
export const RATIOS = ['16:9 (Panorámico)', '9:16 (Móvil)', '1:1 (Cuadrado)', '21:9 (Cine)'];

// =================================================================
// CARTOGRAPHER PRESETS (9 BUCKETS x 15 ITEMS)
// =================================================================

// 1) PUEBLO / ASENTAMIENTO HUMANO
const BUCKET_1 = [
  "Villa de Solsticio", "Aldea de Valderroble", "Puerto del Rey", "Ciudadela de Piedra", "Asentamiento de la Colina",
  "Refugio de Pastores", "Mercado de Cruce de Caminos", "Fuerte de la Frontera", "Pueblo de Pescadores", "Aldea del Valle",
  "Villa de los Artesanos", "Burgo Medieval", "Torre del Vigía", "Granja Fortificada", "Asentamiento Fluvial"
].map(name => ({
  name,
  description: "Asentamiento humano próspero y lleno de vida.",
  tags: ["Humano", "Ciudad", "Vida"],
  config: { placeType: "Llanura Fértil", civilization: "Humana (Genérica)", buildingType: "Aldea pequeña", artStyle: "The Witcher 3", camera: "Cenital (90º)", aspectRatio: "16:9" }
}));

// 2) RUINAS / DESIERTO / ORCOS
const BUCKET_2 = [
  "Cráter de la Desolación", "Fuerte de Huesos", "Ruinas de Karak", "Campamento de Saqueadores", "Templo de Arena",
  "Oasis Maldito", "Cañón de Sangre", "Estepa de Hierro", "Mina de Azufre", "Altar de Guerra",
  "Cementerio de Gigantes", "Puesto de Avanzada Orco", "Ciudad Enterrada", "Dunas de Fuego", "Acantilado de la Horda"
].map(name => ({
  name,
  description: "Territorio hostil, ruinas y civilización agresiva.",
  tags: ["Desierto", "Orcos", "Ruinas"],
  config: { placeType: "Desierto Árido", civilization: "Orcos", buildingType: "Ruinas antiguas", artStyle: "Mad Max", camera: "Cenital (90º)", aspectRatio: "16:9" }
}));

// 3) COSTA / PUERTO / MARINO
const BUCKET_3 = [
  "Bahía de los Corsarios", "Puerto de la Serpiente", "Costa de los Nómadas", "Acantilados de Sal", "Playa de los Naufragios",
  "Mercado Flotante", "Delta de los Contrabandistas", "Isla de los Ladrones", "Cala Escondida", "Puerto de Guerra",
  "Asentamiento Costero", "Campamento de Playa", "Astillero Clandestino", "Faro Abandonado", "Ruta de las Mareas"
].map(name => ({
  name,
  description: "Zonas costeras, puertos peligrosos y rutas marítimas.",
  tags: ["Mar", "Costa", "Nómada"],
  config: { placeType: "Costa", civilization: "Humana (Genérica)", buildingType: "Puerto / Muelle", artStyle: "Assassin's Creed", camera: "Cenital (90º)", aspectRatio: "16:9" }
}));

// 4) SUBTERRÁNEO / MINA ENANA
const BUCKET_4 = [
  "Abismo de Hierro", "Forja de las Profundidades", "Túneles de Cristal", "Ciudad de Piedra", "Mina de Mithril",
  "Cámara del Rey Bajo la Montaña", "Puente de Khazad", "Grieta de Magma", "Bóveda del Tesoro", "Salones de los Ancestros",
  "Galería de los Mineros", "Fundición Subterránea", "Cueva de los Ecos", "Santuario de la Roca", "Prisión de la Profundidad"
].map(name => ({
  name,
  description: "Arquitectura masiva subterránea y minería.",
  tags: ["Mina", "Enanos", "Subsuelo"],
  config: { placeType: "Cueva Profunda", civilization: "Enanos de Montaña", buildingType: "Base secreta subterránea", artStyle: "Lord of the Rings", camera: "Cenital (90º)", aspectRatio: "16:9" }
}));

// 5) FORTALEZA / MILITAR
const BUCKET_5 = [
  "Bastión del Norte", "Castillo de la Tormenta", "Muro de los Lamentos", "Fortaleza Imperial", "Torre del Hechicero",
  "Cuartel General", "Puesto de Defensa", "Muralla Infinita", "Ciudadela de Acero", "Fuerte de la Legión",
  "Batería Costera", "Castillo en la Roca", "Puerta Negra", "Torre de Vigilancia", "Palacio de Invierno"
].map(name => ({
  name,
  description: "Estructuras defensivas masivas y bases militares.",
  tags: ["Militar", "Castillo", "Defensa"],
  config: { placeType: "Montaña Alta", civilization: "Humana (Genérica)", buildingType: "Fortaleza militar", artStyle: "Game of Thrones", camera: "Cenital (90º)", aspectRatio: "16:9" }
}));

// 6) ELFO / NATURALEZA / CIUDAD
const BUCKET_6 = [
  "Santuario del Bosque", "Ciudad de las Copas", "Claro de Luna", "Valle de los Espíritus", "Jardines Colgantes",
  "Templo del Agua", "Árbol Madre", "Aldea Fluvial", "Bosque Encantado", "Cascadas de Cristal",
  "Refugio Druídico", "Camino de las Flores", "Círculo de Piedras", "Puente de Raíces", "Palacio de Hojas"
].map(name => ({
  name,
  description: "Alta fantasía, naturaleza integrada y magia.",
  tags: ["Elfos", "Naturaleza", "Magia"],
  config: { placeType: "Bosque Ancestral", civilization: "Elfos Nobles", buildingType: "Templo / Santuario", artStyle: "Zelda: BOTW", camera: "Cenital (90º)", aspectRatio: "16:9" }
}));

// 7) ALIEN / SCI-FI
const BUCKET_7 = [
  "Nexo Biomecánico", "Colmena Zerg", "Ruinas Protheanas", "Base Lunar Alpha", "Planeta X",
  "Laboratorio de Clonación", "Refinería de Especia", "Ciudad Cyberpunk", "Estación Espacial", "Cráter de Impacto",
  "Pantano Alienígena", "Bosque de Hongos Gigantes", "Estructura Monolítica", "Portal Dimensional", "Zona de Cuarentena"
].map(name => ({
  name,
  description: "Entornos extraterrestres y tecnología avanzada.",
  tags: ["Alien", "Sci-Fi", "Espacio"],
  config: { placeType: "Colmena Orgánica", civilization: "Alienígenas Insectoides", buildingType: "Base secreta subterránea", artStyle: "Starcraft II", camera: "Cenital (90º)", aspectRatio: "16:9" }
}));

// 8) MAPA DEL TESORO / MANO ALZADA
const BUCKET_8 = [
  "Mapa de la Isla Calavera", "Ruta del Contrabandista", "Pergamino Antiguo", "Mapa del Tesoro Enterrado", "Carta de Navegación",
  "Croquis de la Mazmorra", "Plano de la Ciudad Perdida", "Mapa de Piel de Dragón", "Ruta de la Seda", "Mapa de las Tierras Salvajes",
  "Carta Astral", "Mapa de Invasión", "Reliquia Cartográfica", "Mapa Quemado", "Guía del Explorador"
].map(name => ({
  name,
  description: "Estilo pergamino, tinta y dibujo a mano.",
  tags: ["Mapa", "Pergamino", "Pirata"],
  config: { placeType: "Isla Tropical", civilization: "Humana (Genérica)", buildingType: "Sin edificación", artStyle: "Acuarela", camera: "Cenital (90º)", aspectRatio: "16:9" }
}));

// 9) BLUEPRINT / TÉCNICO
const BUCKET_9 = [
  "Plano del Búnker", "Esquema del Laboratorio", "Blueprint de la Nave", "Plano de Seguridad", "Mapa Táctico Holográfico",
  "Diseño del Reactor", "Plano del Metro", "Esquema de la Base", "Mapa de Sensores", "Grid de Combate",
  "Plano de Evacuación", "Arquitectura de la Torre", "Diagrama de Flujo", "Plano de la Prisión", "Esquema del Complejo"
].map(name => ({
  name,
  description: "Planos técnicos, blueprints y diagramas.",
  tags: ["Técnico", "Blueprint", "Moderno"],
  config: { placeType: "Base secreta subterránea", civilization: "Humana (Genérica)", buildingType: "Zona Industrial", artStyle: "Blueprint", camera: "Cenital (90º)", aspectRatio: "16:9" }
}));

export const PRESET_BUCKETS: Record<number, Preset[]> = {
  1: BUCKET_1,
  2: BUCKET_2,
  3: BUCKET_3,
  4: BUCKET_4,
  5: BUCKET_5,
  6: BUCKET_6,
  7: BUCKET_7,
  8: BUCKET_8,
  9: BUCKET_9
};