"use client";

import { useState, useCallback } from "react";
import { useI18n } from "@/i18n/context";
import { useSession } from "next-auth/react";
import Header from "@/components/Header";
import PhotoUpload from "@/components/PhotoUpload";
import PromptResult from "@/components/PromptResult";
import LoadingSpinner from "@/components/LoadingSpinner";
import LimitBanner from "@/components/LimitBanner";
import type { PromptBlock } from "@/lib/types";

type AppState = "upload" | "loading" | "result" | "error" | "limit";

export default function Home() {
  const { t } = useI18n();
  const { data: session } = useSession();
  const [state, setState] = useState<AppState>("upload");
  const [blocks, setBlocks] = useState<PromptBlock[]>([]);
  const [fullPrompt, setFullPrompt] = useState("");
  const [error, setError] = useState("");

  const handleFileSelected = useCallback(async (file: File) => {
    setState("loading");
    setError("");

    try {
      const formData = new FormData();
      formData.append("image", file);

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
      setState("result");
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errorGeneric"));
      setState("error");
    }
  }, [t]);

  const handleReset = useCallback(() => {
    setState("upload");
    setBlocks([]);
    setFullPrompt("");
    setError("");
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

        {/* Upload */}
        {(state === "upload" || state === "error") && (
          <>
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
            onReset={handleReset}
          />
        )}
      </main>

      <footer className="border-t border-neutral-200 dark:border-neutral-800 py-4 text-center text-xs text-neutral-400">
        {t("footer")}
      </footer>
    </div>
  );
}
