
export enum MediaType {
  IMAGE = 'Imagen',
  VIDEO = 'Vídeo',
}

export enum PromptType {
  UNIVERSAL = 'Universal (DALL-E / Gemini)',
  MIDJOURNEY = 'Midjourney',
  ADVANCED = 'Técnico (SD / ComfyUI)',
}

export enum AppMode {
  CONSTRUCTOR = 'Constructor', // Formerly Presets
  ARCHITECT = 'Architect',     // Formerly Simple
  STORYCRAFTER = 'Storycrafter' // Formerly Narrative
}

export enum NarrativeMode {
  WORLD = 'WORLD',
  UI = 'UI',
  CHARACTERS = 'CHARACTERS'
}

export enum ThemeMode {
  FANTASY = 'FANTASY',
  HISTORICAL = 'HISTORICAL'
}

export enum Language {
  ES = 'ES',
  EN = 'EN',
}

export interface MapConfig {
  assetType?: 'MAP' | 'SCENE';
  scale: string;
  placeType: string; 
  placeCategory: string; 
  poi: string;
  civilization: string;
  customScenario: string; 
  time: string;
  weather: string;
  renderTech: string;
  artStyle: string; 
  
  // WIZARD FIELDS
  styleCategory?: string;
  styleReference?: string;
  styleVibe?: string;
  styleDetail?: string;
  styleClarity?: string;
  styleFinish?: string;

  // IMAGE REFERENCE FIELDS (NEW)
  extractedStyle?: string; // Text description of the style extracted from image
  referenceImageBase64?: string; // For UI preview only

  customAtmosphere: string; 
  zoom: string;
  camera: string;
  aspectRatio: string;
  era: string;
  buildingType: string;
  themeMode?: ThemeMode;
  anachronismPolicy?: 'STRICT' | 'CHAOS';
  videoMovement?: string;
  videoDynamics?: string;
  videoRhythm?: string;
  videoLoop?: boolean;
  presetName?: string;
  tags?: string[];
  manualPOIs?: string[]; 
  manualDetails?: string; 
}

export interface Preset {
  name: string;
  description: string;
  config: Partial<MapConfig>;
  tags: string[];
}

export interface PoiMapping {
  [key: string]: string[];
}

export interface PromptCollectionItem {
  title: string;
  type: 'MAP' | 'PERSPECTIVE' | 'SCENE' | 'VICTORY' | 'BOSS' | 'UI' | 'CHARACTER' | 'BADGE';
  prompt: string;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  prompt: string;
  type: PromptType;
  tags: string[];
}
