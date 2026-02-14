"use client";

import { useI18n } from "@/i18n/context";
import { PLATFORMS, DETAIL_LEVELS } from "@/lib/types";
import type { Platform, DetailLevel } from "@/lib/types";

interface GenerationSettingsProps {
  platform: Platform;
  detailLevel: DetailLevel;
  onPlatformChange: (p: Platform) => void;
  onDetailLevelChange: (d: DetailLevel) => void;
  compact?: boolean;
}

export default function GenerationSettings({
  platform,
  detailLevel,
  onPlatformChange,
  onDetailLevelChange,
  compact,
}: GenerationSettingsProps) {
  const { locale, t } = useI18n();

  return (
    <div className={`w-full max-w-xl mx-auto ${compact ? "mb-4" : "mb-6"}`}>
      {/* Platform selector */}
      <div className={compact ? "mb-3" : "mb-4"}>
        <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-2 uppercase tracking-wide">
          {t("settingsPlatform")}
        </label>
        <div className="flex flex-wrap gap-1.5">
          {PLATFORMS.map((p) => (
            <button
              key={p.id}
              onClick={() => onPlatformChange(p.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all ${
                platform === p.id
                  ? "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 border border-violet-300 dark:border-violet-700 font-medium"
                  : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-transparent hover:border-neutral-300 dark:hover:border-neutral-600"
              }`}
            >
              <span className="text-base">{p.icon}</span>
              {p.label[locale]}
            </button>
          ))}
        </div>
      </div>

      {/* Detail level selector */}
      <div>
        <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-2 uppercase tracking-wide">
          {t("settingsDetail")}
        </label>
        <div className="flex gap-1.5">
          {DETAIL_LEVELS.map((d) => (
            <button
              key={d.id}
              onClick={() => onDetailLevelChange(d.id)}
              className={`flex-1 py-1.5 px-3 rounded-lg text-sm transition-all ${
                detailLevel === d.id
                  ? "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 border border-violet-300 dark:border-violet-700 font-medium"
                  : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-transparent hover:border-neutral-300 dark:hover:border-neutral-600"
              }`}
            >
              {d.label[locale]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
