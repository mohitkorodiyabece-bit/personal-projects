// Central static data used across the app:
// default configuration state, color swatches, material options,
// environment presets and component metadata.

export const STORAGE_KEY = "nexusDeskSetup";

// The single source of truth for the shape of the app's configuration.
// Every field here maps 1:1 to something the user can customize.
export const DEFAULT_CONFIG = {
  deskMaterial: "darkWood",
  deskColor: "#4a2f20",

  monitorColor: "#111111",
  monitorGlow: "#7c3aed",

  keyboardColor: "#111111",
  keyboardRGB: "purple",

  mouseColor: "#111111",
  mouseRGB: true,

  lampColor: "#222222",
  lampOn: true,
  lampIntensity: 1.5,

  plantVisible: true,
  potColor: "#8b5cf6",

  speakerColor: "#111111",
  speakerRGB: false,

  environment: "studio"
};

// Desk material presets. Each maps to a color + a roughness/metalness
// pairing so switching materials visibly changes surface response to light.
export const DESK_MATERIALS = [
  { id: "darkWood", label: "Dark Wood", color: "#4a2f20", roughness: 0.75, metalness: 0.05 },
  { id: "lightWood", label: "Light Wood", color: "#c9a06e", roughness: 0.7, metalness: 0.05 },
  { id: "matteBlack", label: "Matte Black", color: "#111114", roughness: 0.9, metalness: 0.1 },
  { id: "white", label: "White", color: "#f1f1f4", roughness: 0.55, metalness: 0.05 },
  { id: "carbon", label: "Carbon", color: "#1c1c22", roughness: 0.35, metalness: 0.6 }
];

// Reusable color swatch palette for the ColorPicker component.
export const COLOR_SWATCHES = [
  { id: "black", label: "Black", value: "#111111" },
  { id: "white", label: "White", value: "#f1f1f4" },
  { id: "purple", label: "Purple", value: "#8b5cf6" },
  { id: "blue", label: "Blue", value: "#3b82f6" },
  { id: "cyan", label: "Cyan", value: "#22d3ee" },
  { id: "red", label: "Red", value: "#ef4444" }
];

// RGB lighting mode presets shared by keyboard / mouse / speakers.
export const RGB_MODES = [
  { id: "off", label: "Off", color: null },
  { id: "purple", label: "Purple", color: "#8b5cf6" },
  { id: "blue", label: "Blue", color: "#3b82f6" },
  { id: "cyan", label: "Cyan", color: "#22d3ee" },
  { id: "rainbow", label: "Rainbow", color: "rainbow" }
];

// Environment presets. Each drives ambient/directional light color +
// intensity, background color, and an atmosphere accent tint.
export const ENVIRONMENTS = {
  studio: {
    label: "Studio",
    background: "#050507",
    ambientIntensity: 0.55,
    ambientColor: "#ffffff",
    dirIntensity: 1.1,
    dirColor: "#ffffff",
    accent: "#8b5cf6",
    fogColor: "#050507",
    fogNear: 8,
    fogFar: 22
  },
  night: {
    label: "Night",
    background: "#020203",
    ambientIntensity: 0.25,
    ambientColor: "#3b82f6",
    dirIntensity: 0.4,
    dirColor: "#3b82f6",
    accent: "#22d3ee",
    fogColor: "#020203",
    fogNear: 6,
    fogFar: 18
  },
  sunset: {
    label: "Sunset",
    background: "#0d0608",
    ambientIntensity: 0.5,
    ambientColor: "#ff8a5b",
    dirIntensity: 0.9,
    dirColor: "#ff7a45",
    accent: "#f97316",
    fogColor: "#170a08",
    fogNear: 8,
    fogFar: 24
  }
};

// Component metadata for the left sidebar (icon name resolved in Sidebar.jsx).
export const COMPONENTS_LIST = [
  { id: "desk", label: "Desk", icon: "Table2" },
  { id: "monitor", label: "Monitor", icon: "Monitor" },
  { id: "keyboard", label: "Keyboard", icon: "Keyboard" },
  { id: "mouse", label: "Mouse", icon: "Mouse" },
  { id: "lamp", label: "Lamp", icon: "Lamp" },
  { id: "plant", label: "Plant", icon: "Flower2" },
  { id: "speakers", label: "Speakers", icon: "Speaker" }
];

export const ENVIRONMENT_LIST = [
  { id: "studio", label: "Studio" },
  { id: "night", label: "Night" },
  { id: "sunset", label: "Sunset" }
];