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

export type Platform = "midjourney" | "stable-diffusion" | "dall-e" | "flux" | "universal";
export type DetailLevel = "short" | "detailed" | "expert";

export interface AnalyzeRequest {
  platform: Platform;
  detailLevel: DetailLevel;
}

export interface AnalyzeResponse {
  blocks: PromptBlock[];
  fullPrompt: string;
}

export const PLATFORMS: { id: Platform; label: { en: string; ru: string }; icon: string }[] = [
  { id: "universal", icon: "🌐", label: { en: "Universal", ru: "Универсальный" } },
  { id: "midjourney", icon: "🎨", label: { en: "Midjourney", ru: "Midjourney" } },
  { id: "stable-diffusion", icon: "🖼️", label: { en: "Stable Diffusion", ru: "Stable Diffusion" } },
  { id: "dall-e", icon: "🤖", label: { en: "DALL-E", ru: "DALL-E" } },
  { id: "flux", icon: "⚡", label: { en: "Flux", ru: "Flux" } },
];

export const DETAIL_LEVELS: { id: DetailLevel; label: { en: string; ru: string } }[] = [
  { id: "short", label: { en: "Short", ru: "Короткий" } },
  { id: "detailed", label: { en: "Detailed", ru: "Детальный" } },
  { id: "expert", label: { en: "Expert", ru: "Экспертный" } },
];

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
  { id: "negative", icon: "🚫", label: { en: "Negative Prompt", ru: "Негативный промт" } },
] as const;
