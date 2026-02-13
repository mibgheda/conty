"use client";

import { useI18n } from "@/i18n/context";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import type { Locale } from "@/lib/types";
import UsageBadge from "@/components/UsageBadge";

export default function Header() {
  const { locale, setLocale, t } = useI18n();
  const { data: session } = useSession();

  return (
    <header className="w-full border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-sm">
              C
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight">{t("title")}</h1>
              <p className="text-xs text-neutral-500 leading-tight">
                {t("subtitle")}
              </p>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <UsageBadge />

          <Link
            href="/pricing"
            className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            {t("pricing")}
          </Link>

          <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg p-0.5">
            {(["en", "ru"] as Locale[]).map((lang) => (
              <button
                key={lang}
                onClick={() => setLocale(lang)}
                className={`px-2.5 py-1 text-sm rounded-md transition-all ${
                  locale === lang
                    ? "bg-white dark:bg-neutral-700 shadow-sm font-medium"
                    : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                }`}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>

          {session?.user ? (
            <div className="flex items-center gap-2">
              {session.user.image && (
                <img
                  src={session.user.image}
                  alt=""
                  className="w-7 h-7 rounded-full"
                />
              )}
              <button
                onClick={() => signOut()}
                className="text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
              >
                {t("signOut")}
              </button>
            </div>
          ) : (
            <Link
              href="/auth/signin"
              className="text-sm py-1.5 px-3 rounded-lg bg-violet-500 hover:bg-violet-600 text-white transition-colors font-medium"
            >
              {t("signIn")}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
