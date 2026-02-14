"use client";

import { useState, useCallback } from "react";
import { useI18n } from "@/i18n/context";
import { useSession } from "next-auth/react";
import Header from "@/components/Header";
import PhotoUpload from "@/components/PhotoUpload";
import GenerationSettings from "@/components/GenerationSettings";
import PromptResult from "@/components/PromptResult";
import LoadingSpinner from "@/components/LoadingSpinner";
import LimitBanner from "@/components/LimitBanner";
import type { PromptBlock, Platform, DetailLevel } from "@/lib/types";

type AppState = "upload" | "loading" | "result" | "error" | "limit";

export default function Home() {
  const { t } = useI18n();
  const { data: session } = useSession();
  const [state, setState] = useState<AppState>("upload");
  const [blocks, setBlocks] = useState<PromptBlock[]>([]);
  const [fullPrompt, setFullPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [error, setError] = useState("");
  const [platform, setPlatform] = useState<Platform>("universal");
  const [detailLevel, setDetailLevel] = useState<DetailLevel>("detailed");
  const [lastFile, setLastFile] = useState<File | null>(null);

  const doAnalyze = useCallback(async (file: File, plat: Platform, detail: DetailLevel) => {
    setState("loading");
    setError("");

    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("platform", plat);
      formData.append("detailLevel", detail);

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.status === 429 && data.limitReached) {
        setState("limit");
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || "Analysis failed");
      }

      setBlocks(data.blocks);
      setFullPrompt(data.fullPrompt);
      setNegativePrompt(data.negativePrompt || "");
      setState("result");
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errorGeneric"));
      setState("error");
    }
  }, [t]);

  const handleFileSelected = useCallback(async (file: File) => {
    setLastFile(file);
    doAnalyze(file, platform, detailLevel);
  }, [platform, detailLevel, doAnalyze]);

  const handleRegenerate = useCallback(() => {
    if (lastFile) {
      doAnalyze(lastFile, platform, detailLevel);
    }
  }, [lastFile, platform, detailLevel, doAnalyze]);

  const handleReset = useCallback(() => {
    setState("upload");
    setBlocks([]);
    setFullPrompt("");
    setNegativePrompt("");
    setError("");
    setLastFile(null);
  }, []);

  const handleBlockEdit = useCallback((blockId: string, newContent: string) => {
    setBlocks((prev) => {
      const updated = prev.map((b) =>
        b.id === blockId ? { ...b, content: newContent } : b
      );
      const positive = updated.filter((b) => b.id !== "negative");
      setFullPrompt(positive.map((b) => b.content).filter(Boolean).join(", "));
      const neg = updated.find((b) => b.id === "negative");
      if (neg) setNegativePrompt(neg.content);
      return updated;
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex flex-col items-center px-4 py-8 sm:py-12">
        {/* Hero section */}
        {(state === "upload" || state === "error") && (
          <div className="text-center mb-8 max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white mb-3 tracking-tight">
              {t("heroTitle")}
            </h2>
            <p className="text-neutral-500 dark:text-neutral-400 text-base sm:text-lg leading-relaxed">
              {t("heroDescription")}
            </p>
          </div>
        )}

        {/* Settings + Upload */}
        {(state === "upload" || state === "error") && (
          <>
            <GenerationSettings
              platform={platform}
              detailLevel={detailLevel}
              onPlatformChange={setPlatform}
              onDetailLevelChange={setDetailLevel}
            />
            <PhotoUpload onFileSelected={handleFileSelected} />
            {state === "error" && (
              <div className="mt-4 p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm max-w-xl w-full text-center">
                {error}
              </div>
            )}
          </>
        )}

        {/* Loading */}
        {state === "loading" && <LoadingSpinner />}

        {/* Limit reached */}
        {state === "limit" && (
          <LimitBanner
            isAuthenticated={!!session?.user}
            onReset={handleReset}
          />
        )}

        {/* Result */}
        {state === "result" && (
          <PromptResult
            blocks={blocks}
            fullPrompt={fullPrompt}
            negativePrompt={negativePrompt}
            platform={platform}
            detailLevel={detailLevel}
            onPlatformChange={setPlatform}
            onDetailLevelChange={setDetailLevel}
            onBlockEdit={handleBlockEdit}
            onReset={handleReset}
            onRegenerate={handleRegenerate}
          />
        )}
      </main>

      <footer className="border-t border-neutral-200 dark:border-neutral-800 py-4 text-center text-xs text-neutral-400">
        {t("footer")}
      </footer>
    </div>
  );
}
