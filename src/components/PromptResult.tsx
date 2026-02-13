"use client";

import { useState } from "react";
import { useI18n } from "@/i18n/context";
import type { PromptBlock } from "@/lib/types";
import PromptBlockCard from "./PromptBlock";

interface PromptResultProps {
  blocks: PromptBlock[];
  fullPrompt: string;
  onReset: () => void;
}

export default function PromptResult({
  blocks,
  fullPrompt,
  onReset,
}: PromptResultProps) {
  const { t } = useI18n();
  const [copiedAll, setCopiedAll] = useState(false);

  const handleCopyAll = async () => {
    await navigator.clipboard.writeText(fullPrompt);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
        <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
          {t("resultTitle")}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={handleCopyAll}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              copiedAll
                ? "bg-green-500 text-white"
                : "bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white hover:from-violet-600 hover:to-fuchsia-600 shadow-lg shadow-violet-500/25"
            }`}
          >
            {copiedAll ? t("copied") : t("copyAll")}
          </button>
          <button
            onClick={onReset}
            className="px-4 py-2 rounded-lg text-sm font-medium border border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
          >
            {t("tryAnother")}
          </button>
        </div>
      </div>

      {/* Full prompt preview */}
      <div className="mb-6 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800">
        <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed line-clamp-3">
          {fullPrompt}
        </p>
      </div>

      {/* Blocks grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {blocks.map((block) => (
          <PromptBlockCard key={block.id} block={block} />
        ))}
      </div>
    </div>
  );
}
