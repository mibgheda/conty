"use client";

import { useI18n } from "@/i18n/context";

export default function LoadingSpinner() {
  const { t } = useI18n();

  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative w-16 h-16 mb-4">
        <div className="absolute inset-0 rounded-full border-4 border-neutral-200 dark:border-neutral-800" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-violet-500 animate-spin" />
      </div>
      <p className="text-sm text-neutral-500 animate-pulse">{t("analyzing")}</p>
    </div>
  );
}
