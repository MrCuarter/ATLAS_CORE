export enum MediaType {
  IMAGE = 'Imagen',
  VIDEO = 'Vídeo',
}

export enum PromptType {
  GENERIC = 'Genérico',
  MIDJOURNEY = 'Midjourney',
}

export enum AppMode {
  PRESETS = 'Presets', 
  SIMPLE = 'Simple',   
  ADVANCED = 'Avanzado',
  NARRATIVE = 'Narrativa',
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