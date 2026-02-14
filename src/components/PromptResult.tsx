"use client";

import { useState } from "react";
import { useI18n } from "@/i18n/context";
import type { PromptBlock, Platform, DetailLevel } from "@/lib/types";
import PromptBlockCard from "./PromptBlock";
import GenerationSettings from "./GenerationSettings";

interface PromptResultProps {
  blocks: PromptBlock[];
  fullPrompt: string;
  negativePrompt: string;
  platform: Platform;
  detailLevel: DetailLevel;
  onPlatformChange: (p: Platform) => void;
  onDetailLevelChange: (d: DetailLevel) => void;
  onBlockEdit: (blockId: string, content: string) => void;
  onReset: () => void;
  onRegenerate: () => void;
}

export default function PromptResult({
  blocks,
  fullPrompt,
  negativePrompt,
  platform,
  detailLevel,
  onPlatformChange,
  onDetailLevelChange,
  onBlockEdit,
  onReset,
  onRegenerate,
}: PromptResultProps) {
  const { t } = useI18n();
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedNeg, setCopiedNeg] = useState(false);

  const handleCopyAll = async () => {
    let text = fullPrompt;
    if (negativePrompt) {
      text += `\n\nNegative prompt: ${negativePrompt}`;
    }
    await navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleCopyNegative = async () => {
    await navigator.clipboard.writeText(negativePrompt);
    setCopiedNeg(true);
    setTimeout(() => setCopiedNeg(false), 2000);
  };

  const positiveBlocks = blocks.filter((b) => b.id !== "negative");
  const negativeBlock = blocks.find((b) => b.id === "negative");

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Settings bar for re-generation */}
      <GenerationSettings
        platform={platform}
        detailLevel={detailLevel}
        onPlatformChange={onPlatformChange}
        onDetailLevelChange={onDetailLevelChange}
        compact
      />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
        <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
          {t("resultTitle")}
        </h2>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={onRegenerate}
            className="px-4 py-2 rounded-lg text-sm font-medium border border-violet-300 dark:border-violet-700 text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-all"
          >
            {t("regenerate")}
          </button>
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

      {/* Positive blocks grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {positiveBlocks.map((block) => (
          <PromptBlockCard
            key={block.id}
            block={block}
            onEdit={(content) => onBlockEdit(block.id, content)}
          />
        ))}
      </div>

      {/* Negative prompt section */}
      {negativeBlock && negativeBlock.content && (
        <div className="rounded-xl border border-red-200 dark:border-red-800/50 bg-red-50/50 dark:bg-red-950/10 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">{negativeBlock.icon}</span>
              <h3 className="text-sm font-semibold text-red-700 dark:text-red-400 uppercase tracking-wide">
                {t("negativePrompt")}
              </h3>
            </div>
            <button
              onClick={handleCopyNegative}
              className={`text-xs px-2.5 py-1 rounded-md transition-all ${
                copiedNeg
                  ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                  : "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/30"
              }`}
            >
              {copiedNeg ? t("copied") : t("copyBlock")}
            </button>
          </div>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
            {negativeBlock.content}
          </p>
        </div>
      )}
    </div>
  );
}
