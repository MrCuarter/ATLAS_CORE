
export enum MediaType {
  IMAGE = 'Imagen',
  VIDEO = 'Vídeo',
}

export enum PromptType {
  GENERIC = 'Genérico',
  MIDJOURNEY = 'Midjourney',
}

export enum AppMode {
  PRESETS = 'Presets', // New Mode
  SIMPLE = 'Simple',   // Now the Wizard Mode
  ADVANCED = 'Avanzado',
  NARRATIVE = 'Narrativa',
}

export enum Language {
  ES = 'ES',
  EN = 'EN',
}

export interface MapConfig {
  // Block 1: Scenario
  scale: string;
  placeType: string; // The specific place (e.g., Prison, Forest)
  placeCategory: string; // The category (Military, Nature, etc) - helper
  poi: string;
  civilization: string;
  customScenario: string; // New custom input
  
  // Block 2: Atmosphere
  time: string;
  weather: string;
  renderTech: string;
  artStyle: string;
  customAtmosphere: string; // New custom input
  
  // Block 3: Format
  zoom: string;
  camera: string;
  aspectRatio: string;
  
  // Block 4: Video (Optional)
  videoMovement?: string;
  videoDynamics?: string;
  videoRhythm?: string;
  videoLoop?: boolean;

  // Metadata for display
  presetName?: string;
  tags?: string[];
}

export interface Preset {
  name: string;
  description: string; // derived from summary
  config: Partial<MapConfig>;
  tags: string[];
}

export interface CategoryData {
  id: string;
  label: string;
  options: string[];
}

export interface PoiMapping {
  [key: string]: string[];
}

export interface PromptCollectionItem {
  title: string;
  type: 'MAP' | 'PERSPECTIVE' | 'SCENE' | 'VICTORY';
  prompt: string;
}