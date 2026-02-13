"use client";

import { useI18n } from "@/i18n/context";
import type { Locale } from "@/lib/types";

export default function Header() {
  const { locale, setLocale, t } = useI18n();

  return (
    <header className="w-full border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-sm">
            C
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight">{t("title")}</h1>
            <p className="text-xs text-neutral-500 leading-tight">
              {t("subtitle")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg p-0.5">
          {(["en", "ru"] as Locale[]).map((lang) => (
            <button
              key={lang}
              onClick={() => setLocale(lang)}
              className={`px-3 py-1 text-sm rounded-md transition-all ${
                locale === lang
                  ? "bg-white dark:bg-neutral-700 shadow-sm font-medium"
                  : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
              }`}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
