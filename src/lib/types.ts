export interface PromptBlock {
  id: string;
  label: {
    en: string;
    ru: string;
  };
  icon: string;
  content: string;
}

export type Locale = "en" | "ru";

export interface AnalyzeResponse {
  blocks: PromptBlock[];
  fullPrompt: string;
}

export const PROMPT_CATEGORIES = [
  { id: "subject", icon: "👤", label: { en: "Subject", ru: "Субъект" } },
  { id: "composition", icon: "📐", label: { en: "Composition", ru: "Композиция" } },
  { id: "lighting", icon: "💡", label: { en: "Lighting", ru: "Освещение" } },
  { id: "color_palette", icon: "🎨", label: { en: "Color Palette", ru: "Цветовая палитра" } },
  { id: "style_medium", icon: "🖌️", label: { en: "Style & Medium", ru: "Стиль и медиум" } },
  { id: "mood", icon: "✨", label: { en: "Mood & Atmosphere", ru: "Настроение" } },
  { id: "background", icon: "🏞️", label: { en: "Background", ru: "Фон и окружение" } },
  { id: "textures", icon: "🧶", label: { en: "Textures & Details", ru: "Текстуры и детали" } },
  { id: "technical", icon: "⚙️", label: { en: "Technical Quality", ru: "Качество" } },
] as const;
