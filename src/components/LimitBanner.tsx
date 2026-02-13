"use client";

import { useI18n } from "@/i18n/context";
import Link from "next/link";

interface LimitBannerProps {
  isAuthenticated: boolean;
  onReset: () => void;
}

export default function LimitBanner({ isAuthenticated, onReset }: LimitBannerProps) {
  const { t } = useI18n();

  return (
    <div className="max-w-xl w-full mx-auto text-center">
      <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20 p-8">
        <div className="w-14 h-14 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>

        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
          {t("limitReached")}
        </h3>

        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
          {isAuthenticated ? t("limitReachedStarter") : t("limitReachedFree")}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {!isAuthenticated && (
            <Link
              href="/auth/signin"
              className="py-2.5 px-5 rounded-xl bg-violet-500 hover:bg-violet-600 text-white text-sm font-medium transition-colors"
            >
              {t("signIn")}
            </Link>
          )}
          <Link
            href="/pricing"
            className="py-2.5 px-5 rounded-xl border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-sm font-medium transition-colors"
          >
            {t("pricing")}
          </Link>
          <button
            onClick={onReset}
            className="py-2.5 px-5 rounded-xl text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 text-sm transition-colors"
          >
            {t("backToHome")}
          </button>
        </div>
      </div>
    </div>
  );
}
