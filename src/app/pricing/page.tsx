"use client";

import { useI18n } from "@/i18n/context";
import Header from "@/components/Header";
import Link from "next/link";

const CHECK = (
  <svg className="w-5 h-5 text-violet-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

export default function PricingPage() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 px-4 py-12 sm:py-16">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white mb-3 tracking-tight">
              {t("pricingTitle")}
            </h2>
            <p className="text-neutral-500 dark:text-neutral-400 text-base sm:text-lg max-w-xl mx-auto">
              {t("pricingDescription")}
            </p>
          </div>

          {/* Tiers grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {/* Free */}
            <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-6 flex flex-col">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                {t("freeTier")}
              </h3>
              <div className="mt-4 mb-6">
                <span className="text-4xl font-bold text-neutral-900 dark:text-white">{t("freePrice")}</span>
                <span className="text-neutral-500 ml-2 text-sm">/ {t("freePeriod")}</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {(["freeFeature1", "freeFeature2", "freeFeature3", "freeFeature4"] as const).map((key) => (
                  <li key={key} className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
                    {CHECK}
                    {t(key)}
                  </li>
                ))}
              </ul>
              <Link
                href="/"
                className="block w-full text-center py-2.5 px-4 rounded-xl border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors text-sm font-medium"
              >
                {t("freeCta")}
              </Link>
            </div>

            {/* Starter */}
            <div className="rounded-2xl border-2 border-violet-500 bg-white dark:bg-neutral-950 p-6 flex flex-col relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-violet-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                {t("packPopular")}
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                {t("starterTier")}
              </h3>
              <div className="mt-4 mb-6">
                <span className="text-4xl font-bold text-neutral-900 dark:text-white">{t("starterPrice")}</span>
                <span className="text-neutral-500 ml-2 text-sm">/ {t("starterPeriod")}</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {(["starterFeature1", "starterFeature2", "starterFeature3", "starterFeature4"] as const).map((key) => (
                  <li key={key} className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
                    {CHECK}
                    {t(key)}
                  </li>
                ))}
              </ul>
              <Link
                href="/auth/signin"
                className="block w-full text-center py-2.5 px-4 rounded-xl bg-violet-500 hover:bg-violet-600 text-white transition-colors text-sm font-medium"
              >
                {t("starterCta")}
              </Link>
            </div>

            {/* Pro */}
            <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-6 flex flex-col">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                {t("proTier")}
              </h3>
              <p className="text-neutral-500 text-sm mt-1 mb-4">
                {t("proDescription")}
              </p>
              <ul className="space-y-3 mb-8 flex-1">
                {(["proFeature1", "proFeature2", "proFeature3", "proFeature4"] as const).map((key) => (
                  <li key={key} className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
                    {CHECK}
                    {t(key)}
                  </li>
                ))}
              </ul>

              {/* Pack options */}
              <div className="space-y-2 mb-4">
                <PackOption label={t("packSmall")} price={t("packSmallPrice")} />
                <PackOption label={t("packMedium")} price={t("packMediumPrice")} popular={t("packPopular")} />
                <PackOption label={t("packLarge")} price={t("packLargePrice")} />
              </div>

              <button
                disabled
                className="block w-full text-center py-2.5 px-4 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-500 text-sm font-medium cursor-not-allowed"
              >
                {t("comingSoon")}
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-neutral-200 dark:border-neutral-800 py-4 text-center text-xs text-neutral-400">
        {t("footer")}
      </footer>
    </div>
  );
}

function PackOption({
  label,
  price,
  popular,
}: {
  label: string;
  price: string;
  popular?: string;
}) {
  return (
    <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
      <div className="flex items-center gap-2">
        <span className="text-sm text-neutral-700 dark:text-neutral-300">{label}</span>
        {popular && (
          <span className="text-[10px] bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 px-1.5 py-0.5 rounded-full font-medium">
            {popular}
          </span>
        )}
      </div>
      <span className="text-sm font-semibold text-neutral-900 dark:text-white">{price}</span>
    </div>
  );
}
