
import { PoiMapping, Preset, Language } from './types';

// --- TRANSLATION MAPS ---

export const UI_TEXT = {
  [Language.ES]: {
    appTitle: "Atlas_Core",
    subtitle: "SYSTEM MATRIX | By Mr. Cuarter",
    appDescription: "Generador profesional de prompts para mapas de juego. Diseña escenarios para RPG, Estrategia y Worldbuilding con control total sobre estilo, atmósfera y narrativa.",
    presets: "PRESETS", // New label
    simple: "CONSTRUCTOR", // Renamed from RÁPIDO implies building
    advanced: "ARQUITECTO", // Renamed from AVANZADO
    narrative: "STORYCRAFTER", // Renamed from NARRATIVA
    image: "IMAGEN",
    video: "VÍDEO",
    generic: "GENÉRICO",
    midjourney: "MIDJOURNEY",
    surpriseTitle: "", 
    surpriseDesc: "", 
    surpriseBtn: "EJECUTAR PROTOCOLO GÉNESIS",
    worldGenBtn: "EJECUTAR WORLD-GEN", // New Epic Button
    generateAssetsBtn: "GENERAR PACK DE ASSETS",
    presetsTitle: "Protocolos Predefinidos",
    scenario: "Núcleo del Escenario",
    scale: "Escala Territorial",
    category: "Categoría",
    place: "Lugar",
    poi: "Punto de Interés",
    civilization: "Civilización",
    customScenarioLabel: "Detalles adicionales del escenario (Input manual)",
    atmosphere: "Atmósfera y Render",
    time: "Hora",
    weather: "Clima",
    tech: "Técnica",
    style: "Estilo",
    customAtmosphereLabel: "Detalles adicionales de atmósfera (Input manual)",
    format: "Formato y Cámara",
    zoom: "Zoom",
    camera: "Ángulo",
    ratio: "Aspect Ratio",
    videoSettings: "Dinámicas de Vídeo",
    movement: "Movimiento",
    dynamics: "Elementos",
    rhythm: "Ritmo",
    loop: "Loop",
    enhance: "Optimizar con IA",
    copy: "COPIAR",
    copyAll: "COPIAR PACK (MODO INSTRUCCIÓN)",
    copied: "COPIADO",
    noneOption: "--- Nada seleccionado ---",
    customPlaceholder: "Escribe aquí detalles extra...",
    designedBy: "Diseñado por",
    followMe: "Sígueme en",
    narrativeIntro: "Diseña una experiencia coherente. Genera 11 assets visuales del mismo mundo para construir tu narrativa.",
    assetMap: "MAPA TÁCTICO",
    assetIso: "PERSPECTIVA AÉREA",
    assetEntrance: "ENTRADA PRINCIPAL",
    assetVictory: "ESCENA DE VICTORIA",
    secretPlaceBtn: "ALEATORIZAR DATOS", // Kept for fallback, unused in main UI now
    stepScale: "1. SELECCIONA ESCALA",
    stepPlace: "2. IDENTIFICA EL LUGAR",
    stepCiv: "3. CIVILIZACIÓN",
    stepStyle: "4. ESTILO VISUAL",
    stepCamera: "5. CÁMARA",
    stepRatio: "6. FORMATO",
    ratioCinema: "Cine (16:9)",
    ratioMobile: "Móvil (9:16)",
    ratioSquare: "Cuadrado (1:1)",
    ratioUltra: "Ultra (21:9)",
    // Instructions for the AI when pasting the full pack
    copyInstructionHeader: "⚠️ **PROTOCOLO DE GENERACIÓN SECUENCIAL**\n\nActúa como un motor de generación de imágenes experto. Tienes una lista de 11 escenas que forman un pack coherente. **NO LAS GENERES TODAS A LA VEZ.**\n\n**TU MISIÓN:**\n1. Lee la descripción del estilo visual (Civilización, Atmósfera, Render).\n2. Genera **SOLO LA IMAGEN Nº 1** de la lista.\n3. **DETENTE** y espera a que yo te diga 'Siguiente' para generar la número 2.\n4. Mantén la coherencia visual estricta en todas ellas.\n\n**LISTA DE ESCENAS:**\n"
  },
  [Language.EN]: {
    appTitle: "Atlas_Core",
    subtitle: "SYSTEM MATRIX | By Mr. Cuarter",
    appDescription: "Professional game map prompt generator. Design RPG, Strategy, and Worldbuilding scenarios with full control over style, atmosphere, and narrative.",
    presets: "PRESETS",
    simple: "BUILDER",
    advanced: "ARCHITECT",
    narrative: "STORYCRAFTER",
    image: "IMAGE",
    video: "VIDEO",
    generic: "GENERIC",
    midjourney: "MIDJOURNEY",
    surpriseTitle: "", 
    surpriseDesc: "", 
    surpriseBtn: "EXECUTE GENESIS PROTOCOL", 
    worldGenBtn: "EXECUTE WORLD-GEN",
    generateAssetsBtn: "GENERATE ASSET PACK",
    presetsTitle: "Predefined Protocols",
    scenario: "Scenario Core",
    scale: "Territorial Scale",
    category: "Category",
    place: "Place",
    poi: "Point of Interest",
    civilization: "Civilization",
    customScenarioLabel: "Additional Scenario Details (Manual Input)",
    atmosphere: "Atmosphere & Render",
    time: "Time",
    weather: "Weather",
    tech: "Technique",
    style: "Style",
    customAtmosphereLabel: "Additional Atmosphere Details (Manual Input)",
    format: "Format & Camera",
    zoom: "Zoom",
    camera: "Angle",
    ratio: "Aspect Ratio",
    videoSettings: "Video Dynamics",
    movement: "Movement",
    dynamics: "Elements",
    rhythm: "Rhythm",
    loop: "Loop",
    enhance: "Optimize with AI",
    copy: "COPY",
    copyAll: "COPY PACK (INSTRUCTION MODE)",
    copied: "COPIED",
    noneOption: "--- Nothing selected ---",
    customPlaceholder: "Type extra details here...",
    designedBy: "Designed by",
    followMe: "Follow me on",
    narrativeIntro: "Design a coherent experience. Generate 11 visual assets from the same world to build your narrative.",
    assetMap: "TACTICAL MAP",
    assetIso: "AERIAL PERSPECTIVE",
    assetEntrance: "MAIN ENTRANCE",
    assetVictory: "VICTORY SCENE",
    secretPlaceBtn: "RANDOMIZE DATA",
    stepScale: "1. SELECT SCALE",
    stepPlace: "2. IDENTIFY PLACE",
    stepCiv: "3. CIVILIZATION",
    stepStyle: "4. VISUAL STYLE",
    stepCamera: "5. CAMERA",
    stepRatio: "6. ASPECT RATIO",
    ratioCinema: "Cinema (16:9)",
    ratioMobile: "Mobile (9:16)",
    ratioSquare: "Square (1:1)",
    ratioUltra: "Ultra (21:9)",
    // Instructions for the AI when pasting the full pack
    copyInstructionHeader: "⚠️ **SEQUENTIAL GENERATION PROTOCOL**\n\nAct as an expert image generation engine. You have a list of 11 scenes that form a coherent pack. **DO NOT GENERATE THEM ALL AT ONCE.**\n\n**YOUR MISSION:**\n1. Analyze the visual style description (Civilization, Atmosphere, Render).\n2. Generate **ONLY IMAGE #1** from the list.\n3. **STOP** and wait for me to say 'Next' before generating number 2.\n4. Maintain strict visual coherence across all of them.\n\n**SCENE LIST:**\n"
  }
};

// Maps Spanish internal values to English for the Prompt output
export const PROMPT_TRANSLATIONS: Record<string, string> = {
  // SCALES
  'Micro (Bosque, Valle, Oasis)': 'Micro',
  'Meso (Isla, Ciudad, Región)': 'Meso',
  'Macro (Reino, Continente, Mundo)': 'Macro',
  'Especial (Dimensión onírica, Plano astral)': 'Special Dimension',
  
  // CATEGORIES
  'Militar / Control': 'Military / Control',
  'Civil': 'Civil',
  'Industrial / Tecnológico': 'Industrial / Technological',
  'Religioso / Mágico': 'Religious / Magical',
  'Especial / Sci-Fi': 'Special / Sci-Fi',
  'Natural': 'Natural',

  // PLACES (NEW & OLD)
  'Prisión': 'Prison', 'Fortaleza': 'Fortress', 'Base militar': 'Military Base', 'Zona en cuarentena': 'Quarantine Zone', 'Muralla defensiva': 'Defensive Wall', 'Puesto avanzado': 'Outpost', 'Búnker Subterráneo': 'Underground Bunker', 'Campo de Entrenamiento': 'Training Camp',
  'Ciudad': 'City', 'Pueblo': 'Village', 'Asentamiento': 'Settlement', 'Puerto': 'Harbor', 'Aeropuerto': 'Airport', 'Mercado': 'Market', 'Distrito urbano': 'Urban District', 'Universidad': 'University', 'Biblioteca': 'Library', 'Casino': 'Casino', 'Estadio': 'Stadium', 'Rascacielos': 'Skyscraper',
  'Mina': 'Mine', 'Fábrica': 'Factory', 'Refinería': 'Refinery', 'Central energética': 'Power Plant', 'Laboratorio': 'Laboratory', 'Complejo científico': 'Science Complex', 'Desguace': 'Junkyard', 'Alcantarillado': 'Sewer System',
  'Templo': 'Temple', 'Santuario': 'Sanctuary', 'Catedral': 'Cathedral', 'Monasterio': 'Monastery', 'Ziggurat': 'Ziggurat', 'Cementerio': 'Graveyard', 'Oráculo': 'Oracle', 'Academia de Magia': 'Magic Academy', 'Torre de Mago': 'Wizard Tower',
  'Base espacial': 'Space Base', 'Construcciones alienígenas': 'Alien Construction', 'Ruinas antiguas': 'Ancient Ruins', 'Ciudad flotante': 'Floating City', 'Colmena orgánica': 'Organic Hive', 'Estructura viva': 'Living Structure', 'Nave Espacial (Interior)': 'Spaceship Interior', 'Base Lunar': 'Moon Base', 'Mazmorra': 'Dungeon', 'Guarida de Dragón': 'Dragon Lair',
  'Bosque ancestral': 'Ancient Forest', 'Desierto abierto': 'Open Desert', 'Selva': 'Jungle', 'Cordillera': 'Mountain Range', 'Océano': 'Ocean', 'Entorno abierto': 'Open Environment', 'Volcán': 'Volcano', 'Cañón': 'Canyon', 'Pantano': 'Swamp', 'Cueva de Hielo': 'Ice Cave', 'Arrecife de Coral': 'Coral Reef',
  'Cyberpunk Megacity': 'Cyberpunk Megacity',

  // POIs (Generic & Specific translations)
  'Celda de máxima seguridad': 'Maximum security cell', 'Bloque de celdas comunes': 'Common cell block', 'Pabellón central': 'Central pavilion', 'Perímetro de seguridad': 'Security perimeter', 'Torres de vigilancia': 'Watchtowers', 'Zona de recreo': 'Recreation area', 'Centro de control': 'Control center',
  'Murallas': 'Walls', 'Puerta principal': 'Main gate', 'Plaza interior': 'Inner square', 'Barracones': 'Barracks', 'Armería': 'Armory', 'Casa del gobernador': 'Governor house', 'Torre de vigilancia': 'Watchtower', 'Mazmorras': 'Dungeons',
  'Plaza mayor': 'Main square', 'Distrito noble': 'Noble district', 'Barrio pobre': 'Slums', 'Mercado central': 'Central market', 'Distrito comercial': 'Commercial district', 'Zona industrial': 'Industrial zone', 'Palacio': 'Palace',
  'Plaza central': 'Central plaza', 'Zona de viviendas': 'Housing area', 'Granero': 'Barn', 'Taberna': 'Tavern', 'Zona de ganado': 'Livestock area', 'Templo pequeño': 'Small temple', 'Muralla rudimentaria': 'Rudimentary wall',
  'Zona de tiendas': 'Tent area', 'Hogueras comunales': 'Communal bonfires', 'Defensas improvisadas': 'Improvised defenses',
  'Cuartel general': 'Headquarters', 'Pistas / hangares': 'Runways/Hangars', 'Zona de entrenamiento': 'Training zone', 'Almacenes': 'Warehouses', 'Centro de mando': 'Command center', 'Defensas perimetrales': 'Perimeter defenses',
  'Punto de acceso controlado': 'Controlled access point', 'Hospital abandonado': 'Abandoned hospital', 'Zona cero': 'Ground zero', 'Campamento militar': 'Military camp', 'Calles bloqueadas': 'Blocked streets', 'Centro de investigación': 'Research center',
  'Hangar': 'Hangar', 'Zona residencial': 'Residential zone', 'Laboratorios': 'Laboratories', 'Núcleo energético': 'Energy core', 'Muelles exteriores': 'Exterior docks',
  'Núcleo orgánico': 'Organic core', 'Torre biomecánica': 'Biomechanical tower', 'Cámara de gestación': 'Gestation chamber', 'Pasillos vivos': 'Living corridors', 'Centro de colmena': 'Hive center',
  'Entrada monumental': 'Monumental entrance', 'Sala principal': 'Main hall', 'Altar': 'Altar', 'Cámara secreta': 'Secret chamber', 'Criptas': 'Crypts', 'Patio ceremonial': 'Ceremonial courtyard',
  'Palacio derruido': 'Ruined palace', 'Plaza colapsada': 'Collapsed square', 'Templo en ruinas': 'Ruined temple', 'Túneles subterráneos': 'Underground tunnels', 'Estatuas caídas': 'Fallen statues',
  'Claro sagrado': 'Sacred glade', 'Árbol milenario': 'Millennial tree', 'Cueva': 'Cave', 'Cascada': 'Waterfall', 'Formación rocosa': 'Rock formation', 'Nido / guarida': 'Nest/Lair', 'Estructura central': 'Central structure', 'Zona periférica': 'Peripheral zone', 'Punto de observación': 'Observation point', 'Ruinas': 'Ruins', 'Sin POI específico': 'No specific POI', 'Torre de comunicaciones': 'Comms tower', 'Murallas principales': 'Main walls', 'Hangar central': 'Central Hangar',
  'Entrada principal': 'Main Entrance',
  // New POI Translations
  'Sala de conferencias': 'Lecture Hall', 'Biblioteca magna': 'Grand Library', 'Dormitorios': 'Dormitories', 'Jardines del campus': 'Campus Gardens', 'Sala de máquinas': 'Engine Room', 'Puente de mando': 'Bridge', 'Esclusa de aire': 'Airfock', 'Invernadero': 'Greenhouse', 'Cráter': 'Crater', 'Lago de lava': 'Lava Lake', 'Trono': 'Throne', 'Tesoro': 'Treasure Hoard', 'Sala de los espejos': 'Hall of Mirrors', 'Cementerio de barcos': 'Ship Graveyard', 'Sala de operaciones': 'Operating Theater', 'Morgue': 'Morgue', 'Ruleta': 'Roulette Area', 'Bóveda': 'Vault', 'Gradas': 'Bleachers', 'Vestuarios': 'Locker Room', 'Campo de juego': 'Playing Field', 'Compactadora': 'Compactor', 'Tubería principal': 'Main Pipe', 'Altar de sacrificios': 'Sacrificial Altar', 'Sala de pociones': 'Potions Classroom', 'Observatorio': 'Observatory',
  'Entrada blindada': 'Armored Entrance', 'Sala de filtros de aire': 'Air Filter Room', 'Dormitorios comunes': 'Common Dorms', 'Almacén de víveres': 'Food Storage', 'Sala de generadores': 'Generator Room', 'Centro de comunicaciones': 'Comms Center',
  'Pista de obstáculos': 'Obstacle Course', 'Campo de tiro': 'Shooting Range', 'Barracones de reclutas': 'Recruit Barracks', 'Torre de instrucción': 'Instruction Tower', 'Comedor': 'Mess Hall',
  'Edificio principal': 'Main Building', 'Laboratorios de prácticas': 'Practice Labs',
  'Sala de lectura principal': 'Main Reading Room', 'Sección prohibida': 'Restricted Section', 'Estanterías infinitas': 'Infinite Shelves', 'Escritorios antiguos': 'Ancient Desks', 'Cúpula de cristal': 'Glass Dome',
  'Sala de tragaperras': 'Slot Machine Room', 'Mesas de juego': 'Gambling Tables', 'Bar de lujo': 'Luxury Bar', 'Caja fuerte': 'Safe Deposit', 'Despacho del dueño': 'Owner Office', 'Escenario de espectáculos': 'Performance Stage',
  'Palco VIP': 'VIP Box', 'Túnel de entrada': 'Entrance Tunnel', 'Marcador gigante': 'Giant Scoreboard',
  'Lobby lujoso': 'Luxury Lobby', 'Oficinas': 'Offices', 'Ático ejecutivo': 'Executive Penthouse', 'Helipuerto': 'Helipad', 'Sala de servidores': 'Server Room', 'Hueco del ascensor': 'Elevator Shaft',
  'Prensa hidráulica': 'Hydraulic Press', 'Montañas de chatarra': 'Scrap Mountains', 'Grúa magnética': 'Magnetic Crane', 'Caseta del guardia': 'Guard Booth', 'Coches apilados': 'Stacked Cars',
  'Cruce de túneles': 'Tunnel Junction', 'Sala de válvulas': 'Valve Room', 'Guarida secreta': 'Secret Lair', 'Desagüe al río': 'River Outlet',
  'Mausoleo central': 'Central Mausoleum', 'Tumbas antiguas': 'Ancient Graves', 'Capilla funeraria': 'Funeral Chapel', 'Entrada de hierro': 'Iron Gate', 'Zona de fosas comunes': 'Mass Graves',
  'Fuente de visiones': 'Fountain of Visions', 'Sala de vapores': 'Steam Room', 'Trono de la vidente': 'Seer Throne', 'Estatuas de dioses': 'God Statues', 'Jardín sagrado': 'Sacred Garden',
  'Aula de hechizos': 'Spell Classroom', 'Torre de astronomía': 'Astronomy Tower', 'Invernadero mágico': 'Magical Greenhouse', 'Comedor flotante': 'Floating Dining Hall', 'Biblioteca de grimorios': 'Grimoire Library',
  'Laboratorio de alquimia': 'Alchemy Lab', 'Sala de invocación': 'Summoning Room', 'Biblioteca espiral': 'Spiral Library', 'Sótano de experimentos': 'Experiment Basement',
  'Comedor de la tripulación': 'Crew Mess Hall', 'Cápsulas de escape': 'Escape Pods',
  'Cúpula habitacional': 'Habitation Dome', 'Muelle de rovers': 'Rover Dock', 'Invernadero hidropónico': 'Hydroponic Greenhouse', 'Paneles solares': 'Solar Panels', 'Mina de hielo': 'Ice Mine',
  'Celdas': 'Cells', 'Sala de tortura': 'Torture Room', 'Foso de trampa': 'Trap Pit', 'Sala del tesoro': 'Treasure Room', 'Entrada secreta': 'Secret Entrance',
  'Montaña de oro': 'Mountain of Gold', 'Huesos de aventureros': 'Adventurer Bones', 'Plataforma de roca': 'Rock Platform', 'Entrada de la cueva': 'Cave Entrance',
  'Cráter activo': 'Active Crater', 'Ríos de lava': 'Lava Rivers', 'Puente de roca negra': 'Black Rock Bridge', 'Templo del fuego': 'Fire Temple', 'Geiseres': 'Geysers',
  'Puente colgante': 'Suspension Bridge', 'Río en el fondo': 'River at Bottom', 'Cueva en el acantilado': 'Cliff Cave', 'Formaciones rocosas': 'Rock Formations', 'Nido de águilas': 'Eagle Nest',
  'Choza de bruja': 'Witch Hut', 'Árboles podridos': 'Rotten Trees', 'Aguas estancadas': 'Stagnant Waters', 'Ruinas hundidas': 'Sunken Ruins', 'Luces fatuas': 'Will-o-wisps',
  'Estalactitas gigantes': 'Giant Stalactites', 'Lago congelado': 'Frozen Lake', 'Cristales azules': 'Blue Crystals', 'Restos congelados': 'Frozen Remains', 'Túnel de viento': 'Wind Tunnel',
  'Barco hundido': 'Sunken Ship', 'Coral cerebro gigante': 'Giant Brain Coral', 'Cueva submarina': 'Underwater Cave', 'Banco de peces': 'School of Fish', 'Acantilado submarino': 'Underwater Cliff',

  // CIVILIZATIONS
  'Humana genérica': 'Generic Human', 'Imperial': 'Imperial', 'Medieval': 'Medieval', 'Árabe': 'Arabian', 'Renacentista': 'Renaissance',
  'Elfos': 'Elven', 'Orcos': 'Orc', 'Goblins': 'Goblin', 'Enanos': 'Dwarven', 'No-muertos': 'Undead', 'Demoníaca': 'Demonic',
  'Futurista': 'Futuristic', 'Cyberpunk': 'Cyberpunk', 'Steampunk': 'Steampunk', 'Postindustrial': 'Post-industrial',
  'Alienígena Orgánica': 'Organic Alien', 'Alienígena Biomecánica': 'Biomechanical Alien', 'Alienígena Cristalina': 'Crystalline Alien',
  'Prehistórica': 'Prehistoric', 'Tribal': 'Tribal', 'Antigua desaparecida': 'Ancient Vanished', 'Piratas': 'Pirate', 'Guerreros': 'Warrior', 'Supervivientes': 'Survivor', 'Antigua': 'Ancient', 'Alienígena': 'Alien', 'Ninguna': 'None', 'Irreal': 'Unreal', 'Edad Media': 'Middle Ages', 'Tecnológica': 'Technological', 'Fantasía': 'Fantasy', 'Fantasía avanzada': 'High Fantasy', 'Nómadas': 'Nomadic',

  // TIME
  'Amanecer': 'Sunrise', 'Mediodía': 'Noon', 'Atardecer': 'Sunset', 'Noche': 'Night', 'Noche profunda': 'Deep night', 'Crepúsculo': 'Twilight', 'Eclipse': 'Eclipse', 'Tiempo indefinido': 'Indefinite time',

  // WEATHER
  'Soleado': 'Sunny', 'Nublado': 'Cloudy', 'Lluvia': 'Rain', 'Niebla': 'Fog', 'Nevando': 'Snowing', 'Tormenta eléctrica': 'Thunderstorm', 'Viento fuerte': 'Strong wind', 'Ceniza / arena': 'Ash/Sand', 'Mágico': 'Magical weather', 'Clima seco': 'Dry climate', 'Bruma': 'Mist', 'Cielo gris': 'Grey sky', 'Oscura': 'Dark', 'Silenciosa': 'Silent', 'Humo': 'Smoke', 'Lava': 'Lava', 'Cielo despejado': 'Clear sky', 'Colores cambiantes': 'Shifting colors', 'Polvo': 'Dust', 'Cielo apagado': 'Dull sky', 'Luz suave': 'Soft light', 'Tormentas de arena': 'Sandstorms', 'Variable': 'Variable', 'Tormenta de nieve': 'Snowstorm',

  // RENDER
  'Pixel art': 'Pixel art', 'Dibujado a mano': 'Hand-drawn map', 'Ilustración': 'Illustration', '3D render': '3D render', 'Low poly': 'Low poly', 'Blueprint': 'Blueprint', 'Isométrico': 'Isometric', 'Tabletop map': 'Tabletop map', 'Fantástica': 'Fantasy', 'Sci-Fi realista': 'Realistic Sci-Fi', 'Sci-Fi cinematográfico': 'Cinematic Sci-Fi', 'Fantasía épica': 'Epic Fantasy', 'Fantasía ilustrada': 'Illustrated Fantasy', 'Histórico épico': 'Epic Historical', 'Aventuras clásicas': 'Classic Adventure', 'Sci-Fi épico': 'Epic Sci-Fi', 'Mapa ilustrado': 'Illustrated Map',

  // STYLE
  'Realista cinematográfico': 'Cinematic Realistic', 'Cartoon estilizado': 'Stylized Cartoon', 'Dark fantasy': 'Dark Fantasy', 'Fantasía realista': 'Realistic Fantasy', 'Surrealista': 'Surrealist', 'Postapocalíptico': 'Post-apocalyptic',
  'Age of Empires': 'Age of Empires style', 'Civilization': 'Civilization style', 'D&D': 'Dungeons and Dragons style', 'World of Warcraft': 'World of Warcraft style', 'Starcraft': 'Starcraft style', 'Star Wars': 'Star Wars style', 'Fortnite': 'Fortnite style', 'Sims': 'The Sims style', 'Studio Ghibli': 'Studio Ghibli style',

  // ZOOM
  'Vista épica global': 'Global epic view', 'Vista regional': 'Regional view', 'Vista urbana': 'City view', 'Vista distrital': 'District view', 'Vista focalizada': 'Focused view', 'Vista táctica': 'Tactical view', 'Vista global': 'Global view',

  // CAMERA
  'Cenital pura (top-down)': 'Top-down', 'Isométrica clásica': 'Isometric', 'Isométrica inclinada': 'Tilted isometric', 'Aérea ligeramente inclinada': 'Slightly tilted aerial', 'Perspectiva oblicua': 'Oblique perspective', 'Vista frontal diorama': 'Frontal diorama view', 'Cámara libre': 'Free camera', 'Aérea cinematográfica': 'Cinematic aerial', 'Isométrica': 'Isometric', 'Aérea': 'Aerial', 'Frontal oblicua': 'Oblique frontal', 'Aérea amplia': 'Wide aerial', 'Aérea suave': 'Soft aerial', 'Cenital': 'Top-down',

  // VIDEO
  'Zoom in': 'Zoom in', 'Zoom out': 'Zoom out', 'Paneo lateral': 'Lateral pan', 'Orbitar': 'Orbit', 'Descenso': 'Descent', 'Sobrevuelo': 'Flyover', 'Recorrido guiado': 'Guided tour',
  'Nubes en movimiento': 'Moving clouds', 'Agua animada': 'Animated water', 'Humo / vapor': 'Smoke/Steam', 'Luces dinámicas': 'Dynamic lights', 'Criaturas lejanas': 'Distant creatures', 'Tráfico': 'Traffic',
  'Lento': 'Slow', 'Constante': 'Constant', 'Épico': 'Epic', 'Cinematográfico': 'Cinematic'
};

// --- BLOCK 1: SCENARIO ---

export const SCALES = [
  'Micro (Bosque, Valle, Oasis)',
  'Meso (Isla, Ciudad, Región)',
  'Macro (Reino, Continente, Mundo)',
  'Especial (Dimensión onírica, Plano astral)'
];

export const PLACE_CATEGORIES = [
  'Militar / Control',
  'Civil',
  'Industrial / Tecnológico',
  'Religioso / Mágico', // Renamed
  'Especial / Sci-Fi',
  'Natural'
];

export const PLACES_BY_CATEGORY: Record<string, string[]> = {
  'Militar / Control': ['Prisión', 'Fortaleza', 'Base militar', 'Zona en cuarentena', 'Muralla defensiva', 'Puesto avanzado', 'Búnker Subterráneo', 'Campo de Entrenamiento'],
  'Civil': ['Ciudad', 'Pueblo', 'Asentamiento', 'Puerto', 'Aeropuerto', 'Mercado', 'Distrito urbano', 'Universidad', 'Biblioteca', 'Casino', 'Estadio', 'Rascacielos'],
  'Industrial / Tecnológico': ['Mina', 'Fábrica', 'Refinería', 'Central energética', 'Laboratorio', 'Complejo científico', 'Desguace', 'Alcantarillado'],
  'Religioso / Mágico': ['Templo', 'Santuario', 'Catedral', 'Monasterio', 'Ziggurat', 'Cementerio', 'Oráculo', 'Academia de Magia', 'Torre de Mago'],
  'Especial / Sci-Fi': ['Base espacial', 'Construcciones alienígenas', 'Ruinas antiguas', 'Ciudad flotante', 'Colmena orgánica', 'Estructura viva', 'Nave Espacial (Interior)', 'Base Lunar', 'Mazmorra', 'Guarida de Dragón'],
  'Natural': ['Bosque ancestral', 'Desierto abierto', 'Selva', 'Cordillera', 'Océano', 'Entorno abierto', 'Volcán', 'Cañón', 'Pantano', 'Cueva de Hielo', 'Arrecife de Coral']
};

export const POI_MAPPING: PoiMapping = {
  // --- EXISTING ---
  'Prisión': ['Celda de máxima seguridad', 'Bloque de celdas comunes', 'Pabellón central', 'Perímetro de seguridad', 'Torres de vigilancia', 'Zona de recreo', 'Centro de control'],
  'Fortaleza': ['Murallas', 'Puerta principal', 'Plaza interior', 'Barracones', 'Armería', 'Casa del gobernador', 'Torre de vigilancia', 'Mazmorras'],
  'Ciudad': ['Plaza mayor', 'Distrito noble', 'Barrio pobre', 'Puerto', 'Mercado central', 'Distrito comercial', 'Zona industrial', 'Palacio'],
  'Pueblo': ['Plaza central', 'Zona de viviendas', 'Granero', 'Taberna', 'Zona de ganado', 'Templo pequeño', 'Muralla rudimentaria'],
  'Asentamiento': ['Plaza central', 'Zona de tiendas', 'Hogueras comunales', 'Zona de ganado', 'Defensas improvisadas'],
  'Base militar': ['Cuartel general', 'Pistas / hangares', 'Zona de entrenamiento', 'Almacenes', 'Centro de mando', 'Defensas perimetrales'],
  'Zona en cuarentena': ['Punto de acceso controlado', 'Hospital abandonado', 'Zona cero', 'Campamento militar', 'Calles bloqueadas', 'Centro de investigación'],
  'Base espacial': ['Hangar', 'Centro de control', 'Zona residencial', 'Laboratorios', 'Núcleo energético', 'Muelles exteriores'],
  'Construcciones alienígenas': ['Núcleo orgánico', 'Torre biomecánica', 'Cámara de gestación', 'Pasillos vivos', 'Centro de colmena'],
  'Templo': ['Entrada monumental', 'Sala principal', 'Altar', 'Cámara secreta', 'Criptas', 'Patio ceremonial'],
  'Ruinas antiguas': ['Palacio derruido', 'Plaza colapsada', 'Templo en ruinas', 'Túneles subterráneos', 'Estatuas caídas'],
  'Entorno natural': ['Claro sagrado', 'Árbol milenario', 'Cueva', 'Cascada', 'Formación rocosa', 'Nido / guarida'],
  
  // --- NEW ADDITIONS ---
  'Búnker Subterráneo': ['Entrada blindada', 'Sala de filtros de aire', 'Dormitorios comunes', 'Almacén de víveres', 'Sala de generadores', 'Centro de comunicaciones'],
  'Campo de Entrenamiento': ['Pista de obstáculos', 'Campo de tiro', 'Barracones de reclutas', 'Torre de instrucción', 'Comedor'],
  'Universidad': ['Edificio principal', 'Sala de conferencias', 'Biblioteca magna', 'Dormitorios', 'Jardines del campus', 'Laboratorios de prácticas'],
  'Biblioteca': ['Sala de lectura principal', 'Sección prohibida', 'Estanterías infinitas', 'Escritorios antiguos', 'Cúpula de cristal'],
  'Casino': ['Sala de tragaperras', 'Mesas de juego', 'Bar de lujo', 'Caja fuerte', 'Despacho del dueño', 'Escenario de espectáculos'],
  'Estadio': ['Campo de juego', 'Gradas', 'Palco VIP', 'Vestuarios', 'Túnel de entrada', 'Marcador gigante'],
  'Rascacielos': ['Lobby lujoso', 'Oficinas', 'Ático ejecutivo', 'Helipuerto', 'Sala de servidores', 'Hueco del ascensor'],
  'Desguace': ['Prensa hidráulica', 'Montañas de chatarra', 'Grúa magnética', 'Caseta del guardia', 'Coches apilados'],
  'Alcantarillado': ['Tubería principal', 'Cruce de túneles', 'Sala de válvulas', 'Guarida secreta', 'Desagüe al río'],
  'Cementerio': ['Mausoleo central', 'Tumbas antiguas', 'Capilla funeraria', 'Entrada de hierro', 'Zona de fosas comunes'],
  'Oráculo': ['Fuente de visiones', 'Sala de vapores', 'Trono de la vidente', 'Estatuas de dioses', 'Jardín sagrado'],
  'Academia de Magia': ['Aula de hechizos', 'Torre de astronomía', 'Invernadero mágico', 'Comedor flotante', 'Biblioteca de grimorios'],
  'Torre de Mago': ['Laboratorio de alquimia', 'Observatorio', 'Sala de invocación', 'Biblioteca espiral', 'Sótano de experimentos'],
  'Nave Espacial (Interior)': ['Puente de mando', 'Sala de máquinas', 'Enfermería', 'Comedor de la tripulación', 'Cápsulas de escape', 'Esclusa de aire'],
  'Base Lunar': ['Cúpula habitacional', 'Muelle de rovers', 'Invernadero hidropónico', 'Paneles solares', 'Mina de hielo'],
  'Mazmorra': ['Celdas', 'Sala de tortura', 'Foso de trampa', 'Sala del tesoro', 'Entrada secreta'],
  'Guarida de Dragón': ['Montaña de oro', 'Huesos de aventureros', 'Plataforma de roca', 'Lago de lava', 'Entrada de la cueva'],
  'Volcán': ['Cráter activo', 'Ríos de lava', 'Puente de roca negra', 'Templo del fuego', 'Geiseres'],
  'Cañón': ['Puente colgante', 'Río en el fondo', 'Cueva en el acantilado', 'Formaciones rocosas', 'Nido de águilas'],
  'Pantano': ['Choza de bruja', 'Árboles podridos', 'Aguas estancadas', 'Ruinas hundidas', 'Luces fatuas'],
  'Cueva de Hielo': ['Estalactitas gigantes', 'Lago congelado', 'Cristales azules', 'Restos congelados', 'Túnel de viento'],
  'Arrecife de Coral': ['Barco hundido', 'Coral cerebro gigante', 'Cueva submarina', 'Banco de peces', 'Acantilado submarino'],

  // Fallbacks for others
  'DEFAULT': ['Estructura central', 'Entrada principal', 'Zona periférica', 'Punto de observación', 'Ruinas', 'Sin POI específico']
};

export const CIVILIZATIONS = [
  'Humana genérica', 'Imperial', 'Medieval', 'Árabe', 'Renacentista',
  'Elfos', 'Orcos', 'Goblins', 'Enanos', 'No-muertos', 'Demoníaca',
  'Futurista', 'Cyberpunk', 'Steampunk', 'Postindustrial',
  'Alienígena Orgánica', 'Alienígena Biomecánica', 'Alienígena Cristalina',
  'Prehistórica', 'Tribal', 'Antigua desaparecida', 'Piratas'
];

// --- BLOCK 2: ATMOSPHERE ---

export const TIMES = ['Amanecer', 'Mediodía', 'Atardecer', 'Noche', 'Noche profunda', 'Crepúsculo', 'Eclipse', 'Tiempo indefinido'];
export const WEATHERS = ['Soleado', 'Nublado', 'Lluvia', 'Niebla', 'Nevando', 'Tormenta eléctrica', 'Viento fuerte', 'Ceniza / arena', 'Mágico'];
export const RENDER_TECHS = ['Pixel art', 'Dibujado a mano', 'Ilustración', '3D render', 'Low poly', 'Blueprint', 'Isométrico', 'Tabletop map'];
export const ART_STYLES = ['Age of Empires', 'Civilization', 'D&D', 'World of Warcraft', 'Starcraft', 'Star Wars', 'Fortnite', 'Sims', 'Studio Ghibli', 'Dark fantasy', 'Realista cinematográfico', 'Cartoon estilizado'];

// --- BLOCK 3: FORMAT ---

export const ZOOMS = ['Vista épica global', 'Vista regional', 'Vista urbana', 'Vista distrital', 'Vista focalizada', 'Vista táctica'];
export const CAMERAS = ['Cenital pura (top-down)', 'Isométrica clásica', 'Isométrica inclinada', 'Aérea ligeramente inclinada', 'Perspectiva oblicua', 'Vista frontal diorama', 'Cámara libre'];
export const RATIOS = ['16:9', '1:1', '9:16', '21:9 (Ultra wide)', 'Sin bordes'];

// --- BLOCK 4: VIDEO ---
export const VIDEO_MOVEMENTS = ['Zoom in', 'Zoom out', 'Paneo lateral', 'Orbitar', 'Descenso', 'Sobrevuelo', 'Recorrido guiado'];
export const VIDEO_DYNAMICS = ['Nubes en movimiento', 'Agua animada', 'Humo / vapor', 'Luces dinámicas', 'Criaturas lejanas', 'Tráfico'];
export const VIDEO_RHYTHMS = ['Lento', 'Constante', 'Épico', 'Cinematográfico'];

// --- PRESETS ---

export const PRESETS: Preset[] = [
  {
    name: "Asentamiento nómada",
    description: "A orillas de un oasis al atardecer.",
    tags: ["RPG", "Exploración", "Narrativa"],
    config: { scale: "Micro (Bosque, Valle, Oasis)", placeType: "Asentamiento", poi: "Zona de tiendas", civilization: "Tribal", time: "Atardecer", weather: "Soleado", artStyle: "Realista cinematográfico", zoom: "Vista distrital", camera: "Aérea ligeramente inclinada" }
  },
  {
    name: "Prisión de máxima seguridad",
    description: "Zona desértica, muros altos y vigilancia.",
    tags: ["Estrategia", "Sci-Fi", "Táctico"],
    config: { scale: "Meso (Isla, Ciudad, Región)", placeType: "Prisión", poi: "Perímetro de seguridad", civilization: "Futurista", time: "Mediodía", weather: "Soleado", artStyle: "Realista cinematográfico", zoom: "Vista focalizada", camera: "Isométrica inclinada" }
  },
  {
    name: "Mundo salvaje",
    description: "Naturaleza indómita, bosques y niebla.",
    tags: ["Worldbuilding", "Fantasía"],
    config: { scale: "Macro (Reino, Continente, Mundo)", placeType: "Entorno natural", poi: "Sin POI específico", civilization: "Elfos", time: "Amanecer", weather: "Niebla", artStyle: "Studio Ghibli", zoom: "Vista épica global", camera: "Cámara libre" }
  },
  {
    name: "Ciudad Alienígena Gélida",
    description: "Planeta exterior bajo tormenta de nieve.",
    tags: ["Sci-Fi", "Exploración"],
    config: { scale: "Meso (Isla, Ciudad, Región)", placeType: "Construcciones alienígenas", poi: "Núcleo energético", civilization: "Alienígena Cristalina", time: "Noche", weather: "Nevando", artStyle: "Starcraft", zoom: "Vista urbana", camera: "Isométrica clásica" }
  },
  {
    name: "Fortaleza de Montaña",
    description: "Murallas medievales en picos altos.",
    tags: ["Estrategia", "Fantasía"],
    config: { scale: "Meso (Isla, Ciudad, Región)", placeType: "Fortaleza", poi: "Murallas", civilization: "Medieval", time: "Mediodía", weather: "Nublado", artStyle: "Age of Empires", zoom: "Vista focalizada", camera: "Aérea ligeramente inclinada" }
  },
  {
    name: "Puerto Pirata",
    description: "Tabernas, barcos y bruma marina.",
    tags: ["RPG", "Narrativa"],
    config: { scale: "Meso (Isla, Ciudad, Región)", placeType: "Puerto", poi: "Mercado central", civilization: "Humana genérica", time: "Atardecer", weather: "Niebla", artStyle: "Cartoon estilizado", zoom: "Vista urbana", camera: "Isométrica clásica" }
  },
  {
    name: "Reino en Ruinas",
    description: "Capital destruida tras una gran guerra.",
    tags: ["Narrativa", "Dark Fantasy"],
    config: { scale: "Macro (Reino, Continente, Mundo)", placeType: "Ruinas antiguas", poi: "Palacio derruido", civilization: "Humana genérica", time: "Crepúsculo", weather: "Ceniza / arena", artStyle: "Dark fantasy", zoom: "Vista regional", camera: "Aérea ligeramente inclinada" }
  },
  {
    name: "Base Espacial Abandonada",
    description: "Oscuridad, silencio y tecnología muerta.",
    tags: ["Sci-Fi", "Exploración"],
    config: { scale: "Micro (Bosque, Valle, Oasis)", placeType: "Base espacial", poi: "Hangar", civilization: "Postindustrial", time: "Noche profunda", weather: "Mágico", artStyle: "Realista cinematográfico", zoom: "Vista focalizada", camera: "Perspectiva oblicua" }
  },
  {
    name: "Archipiélago Volcánico",
    description: "Tribus guerreras entre lava y humo.",
    tags: ["RPG", "Estrategia"],
    config: { scale: "Meso (Isla, Ciudad, Región)", placeType: "Asentamiento", poi: "Hogueras comunales", civilization: "Orcos", time: "Noche", weather: "Ceniza / arena", artStyle: "World of Warcraft", zoom: "Vista regional", camera: "Cenital pura (top-down)" }
  },
  {
    name: "Cyberpunk Megacity",
    description: "Luces de neón, lluvia y cúpulas.",
    tags: ["Sci-Fi", "Narrativa"],
    config: { scale: "Meso (Isla, Ciudad, Región)", placeType: "Ciudad", poi: "Distrito comercial", civilization: "Cyberpunk", time: "Noche", weather: "Lluvia", artStyle: "Realista cinematográfico", zoom: "Vista urbana", camera: "Aérea ligeramente inclinada" }
  },
  {
    name: "Bosque Mágico",
    description: "Criaturas, luces suaves y árboles milenarios.",
    tags: ["Fantasía", "RPG"],
    config: { scale: "Micro (Bosque, Valle, Oasis)", placeType: "Bosque ancestral", poi: "Árbol milenario", civilization: "Elfos", time: "Amanecer", weather: "Niebla", artStyle: "Ilustración", zoom: "Vista focalizada", camera: "Isométrica clásica" }
  },
  {
    name: "Mina de los Goblins",
    description: "Túneles oscuros, antorchas y maquinaria.",
    tags: ["Táctico", "RPG"],
    config: { scale: "Micro (Bosque, Valle, Oasis)", placeType: "Mina", poi: "Cámara secreta", civilization: "Goblins", time: "Noche profunda", weather: "Mágico", artStyle: "Dark fantasy", zoom: "Vista táctica", camera: "Cenital pura (top-down)" }
  },
  {
    name: "Zona de Cuarentena",
    description: "Post-desastre biológico, lluvia ácida.",
    tags: ["Narrativa", "Postapocalíptico"],
    config: { scale: "Meso (Isla, Ciudad, Región)", placeType: "Zona en cuarentena", poi: "Hospital abandonado", civilization: "Humana genérica", time: "Atardecer", weather: "Lluvia", artStyle: "Realista cinematográfico", zoom: "Vista distrital", camera: "Aérea ligeramente inclinada" }
  },
  {
    name: "Ciudad Flotante",
    description: "Sobre un mar infinito, cielo despejado.",
    tags: ["Worldbuilding", "Fantasía"],
    config: { scale: "Meso (Isla, Ciudad, Región)", placeType: "Ciudad flotante", poi: "Plaza mayor", civilization: "Imperial", time: "Mediodía", weather: "Soleado", artStyle: "D&D", zoom: "Vista urbana", camera: "Aérea ligeramente inclinada" }
  },
  {
    name: "Dimensión Onírica",
    description: "Formas imposibles, colores cambiantes.",
    tags: ["Creatividad", "Experimental"],
    config: { scale: "Especial (Dimensión onírica, Plano astral)", placeType: "Entorno abierto", poi: "Sin POI específico", civilization: "Antigua desaparecida", time: "Tiempo indefinido", weather: "Mágico", artStyle: "D&D", zoom: "Vista épica global", camera: "Cámara libre" }
  },
  {
    name: "Capital Imperial",
    description: "Murallas colosales, orden y poder.",
    tags: ["Estrategia", "Narrativa"],
    config: { scale: "Macro (Reino, Continente, Mundo)", placeType: "Ciudad", poi: "Palacio", civilization: "Imperial", time: "Mediodía", weather: "Soleado", artStyle: "Civilization", zoom: "Vista urbana", camera: "Isométrica clásica" }
  },
  {
    name: "Ruinas Tecnológicas",
    description: "Asentamiento superviviente entre chatarra.",
    tags: ["RPG", "Narrativa"],
    config: { scale: "Micro (Bosque, Valle, Oasis)", placeType: "Asentamiento", poi: "Defensas improvisadas", civilization: "Postindustrial", time: "Atardecer", weather: "Viento fuerte", artStyle: "Realista cinematográfico", zoom: "Vista distrital", camera: "Isométrica inclinada" }
  },
  {
    name: "Templo Perdido",
    description: "Oculto en la selva, niebla y misterio.",
    tags: ["Exploración", "RPG"],
    config: { scale: "Micro (Bosque, Valle, Oasis)", placeType: "Templo", poi: "Entrada monumental", civilization: "Antigua desaparecida", time: "Amanecer", weather: "Niebla", artStyle: "Dibujado a mano", zoom: "Vista focalizada", camera: "Aérea ligeramente inclinada" }
  },
  {
    name: "Planeta Desértico",
    description: "Ciudades subterráneas y tormentas de arena.",
    tags: ["Sci-Fi", "Estrategia"],
    config: { scale: "Macro (Reino, Continente, Mundo)", placeType: "Desierto abierto", poi: "Entrada principal", civilization: "Alienígena Orgánica", time: "Mediodía", weather: "Tormenta eléctrica", artStyle: "Star Wars", zoom: "Vista regional", camera: "Aérea ligeramente inclinada" }
  },
  {
    name: "Terra Incognita",
    description: "Continente desconocido, mapa virgen.",
    tags: ["Worldbuilding", "Exploración"],
    config: { scale: "Macro (Reino, Continente, Mundo)", placeType: "Entorno abierto", poi: "Sin POI específico", civilization: "Prehistórica", time: "Tiempo indefinido", weather: "Soleado", artStyle: "Tabletop map", zoom: "Vista épica global", camera: "Cenital pura (top-down)" }
  }
];
