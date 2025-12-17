
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

// New Enum for the 3 buttons
export enum NarrativeMode {
  WORLD = 'WORLD',
  UI = 'UI',
  CHARACTERS = 'CHARACTERS'
}

export enum Language {
  ES = 'ES',
  EN = 'EN',
}

export interface MapConfig {
  // Block 1: Scenario
  scale: string;
  placeType: string; 
  placeCategory: string; 
  poi: string;
  civilization: string;
  customScenario: string; 
  
  // Block 2: Atmosphere
  time: string;
  weather: string;
  renderTech: string;
  artStyle: string;
  customAtmosphere: string; 
  
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
  
  // Storycrafter Specific Data
  manualPOIs?: string[]; 
  manualDetails?: string; // Replaces scale in manual mode
}

export interface Preset {
  name: string;
  description: string;
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
  type: 'MAP' | 'PERSPECTIVE' | 'SCENE' | 'VICTORY' | 'BOSS' | 'UI' | 'CHARACTER' | 'BADGE';
  prompt: string;
}