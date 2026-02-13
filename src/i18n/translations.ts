export const translations = {
  en: {
    title: "Conty",
    subtitle: "AI-powered content assistant",
    heroTitle: "Turn any photo into a structured prompt",
    heroDescription:
      "Upload a photo and get a detailed, structured prompt broken into 9 categories. Copy the whole prompt or just the parts you need.",
    uploadTitle: "Upload your photo",
    uploadHint: "Drag & drop or click to select",
    uploadFormats: "JPG, PNG, WebP up to 10MB",
    analyzing: "Analyzing your image...",
    resultTitle: "Your structured prompt",
    copyAll: "Copy full prompt",
    copyBlock: "Copy",
    copied: "Copied!",
    tryAnother: "Try another photo",
    footer: "Conty — AI content assistant",
    errorGeneric: "Something went wrong. Please try again.",
    errorFileSize: "File is too large. Maximum size is 10MB.",
    errorFileType: "Unsupported file type. Use JPG, PNG, or WebP.",
  },
  ru: {
    title: "Conty",
    subtitle: "AI-помощник с контентом",
    heroTitle: "Превратите любое фото в структурированный промт",
    heroDescription:
      "Загрузите фото и получите детальный промт, разбитый на 9 категорий. Копируйте весь промт или только нужные части.",
    uploadTitle: "Загрузите фото",
    uploadHint: "Перетащите или нажмите для выбора",
    uploadFormats: "JPG, PNG, WebP до 10МБ",
    analyzing: "Анализируем изображение...",
    resultTitle: "Ваш структурированный промт",
    copyAll: "Копировать весь промт",
    copyBlock: "Копировать",
    copied: "Скопировано!",
    tryAnother: "Попробовать другое фото",
    footer: "Conty — AI-помощник с контентом",
    errorGeneric: "Что-то пошло не так. Попробуйте ещё раз.",
    errorFileSize: "Файл слишком большой. Максимум 10МБ.",
    errorFileType: "Неподдерживаемый формат. Используйте JPG, PNG или WebP.",
  },
} as const;

export type TranslationKey = keyof (typeof translations)["en"];
