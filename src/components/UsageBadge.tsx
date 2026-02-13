"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/i18n/context";

interface UsageData {
  used: number;
  limit: number;
  remaining: number;
  tier: "free" | "starter" | "pro";
}

export default function UsageBadge() {
  const { t } = useI18n();
  const [usage, setUsage] = useState<UsageData | null>(null);

  useEffect(() => {
    fetch("/api/usage")
      .then((res) => res.json())
      .then(setUsage)
      .catch(() => {});
  }, []);

  if (!usage) return null;

  const pct = usage.limit > 0 ? (usage.used / usage.limit) * 100 : 0;
  const isLow = usage.remaining <= 1;

  return (
    <div className="flex items-center gap-1.5 text-xs text-neutral-500">
      <div className="w-16 h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${
            isLow
              ? "bg-red-500"
              : pct > 60
              ? "bg-amber-500"
              : "bg-violet-500"
          }`}
          style={{ width: `${Math.min(100, pct)}%` }}
        />
      </div>
      <span>
        {usage.used}/{usage.limit} {t("usageToday")}
      </span>
    </div>
  );
}
