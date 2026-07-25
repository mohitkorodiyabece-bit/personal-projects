export const DEFAULT_CONFIG = {
  deskMaterial: 'darkWood',
  deskColor: '#4a2f20',

  monitorColor: '#111111',
  monitorGlow: '#7c3aed',

  keyboardColor: '#111111',
  keyboardRGB: 'purple',

  mouseColor: '#111111',
  mouseRGB: true,

  lampColor: '#222222',
  lampOn: true,
  lampIntensity: 1.5,

  plantVisible: true,
  potColor: '#8b5cf6',

  speakerColor: '#111111',
  speakerRGB: false,

  environment: 'studio',
};

export const DESK_MATERIALS = {
  darkWood:   { label: 'Dark Wood',   color: '#4a2f20', roughness: 0.7, metalness: 0.05 },
  lightWood:  { label: 'Light Wood',  color: '#c9a978', roughness: 0.65, metalness: 0.05 },
  matteBlack: { label: 'Matte Black', color: '#111114', roughness: 0.9, metalness: 0.1 },
  white:      { label: 'White',       color: '#eef0f3', roughness: 0.5, metalness: 0.1 },
  carbon:     { label: 'Carbon',      color: '#1a1a20', roughness: 0.35, metalness: 0.6 },
};

export const RGB_MODES = ['off', 'purple', 'blue', 'cyan', 'rainbow'];

export const RGB_COLORS = {
  off: '#000000',
  purple: '#8b5cf6',
  blue: '#3b82f6',
  cyan: '#22d3ee',
  rainbow: '#8b5cf6',
};

export const SWATCHES = [
  '#0a0a0f', '#ffffff', '#8b5cf6', '#3b82f6', '#22d3ee', '#ef4444',
  '#f59e0b', '#10b981', '#ec4899', '#4a2f20',
];

export const COMPONENT_LIST = [
  { id: 'desk',     label: 'Desk' },
  { id: 'monitor',  label: 'Monitor' },
  { id: 'keyboard', label: 'Keyboard' },
  { id: 'mouse',    label: 'Mouse' },
  { id: 'lamp',     label: 'Lamp' },
  { id: 'plant',    label: 'Plant' },
  { id: 'speakers', label: 'Speakers' },
];

export const ENVIRONMENTS = [
  { id: 'studio', label: 'Studio' },
  { id: 'night',  label: 'Night' },
  { id: 'sunset', label: 'Sunset' },
];
