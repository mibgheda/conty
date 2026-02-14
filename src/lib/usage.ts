import { prisma } from "@/lib/prisma";

const FREE_DAILY_LIMIT = 5;
const AUTH_DAILY_LIMIT = 10;

export interface UsageInfo {
  used: number;
  limit: number;
  remaining: number;
  tier: "free" | "starter" | "pro";
  packRemaining: number;
}

function startOfDay(): Date {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now;
}

export async function getUsageInfo(
  userId: string | null,
  anonymousId: string | null
): Promise<UsageInfo> {
  const dayStart = startOfDay();

  if (userId) {
    const packs = await prisma.purchasedPack.findMany({
      where: { userId },
    });
    const packRemaining = packs.reduce(
      (sum: number, p: { generationsTotal: number; generationsUsed: number }) => sum + Math.max(0, p.generationsTotal - p.generationsUsed),
      0
    );

    const isPro = packRemaining > 0;

    const todayCount = await prisma.generation.count({
      where: { userId, createdAt: { gte: dayStart } },
    });

    if (isPro) {
      const dailyRemaining = Math.max(0, AUTH_DAILY_LIMIT - todayCount);
      const totalRemaining = dailyRemaining + packRemaining;
      return {
        used: todayCount,
        limit: AUTH_DAILY_LIMIT + packRemaining,
        remaining: totalRemaining,
        tier: "pro",
        packRemaining,
      };
    }

    return {
      used: todayCount,
      limit: AUTH_DAILY_LIMIT,
      remaining: Math.max(0, AUTH_DAILY_LIMIT - todayCount),
      tier: "starter",
      packRemaining: 0,
    };
  }

  // Anonymous user
  if (!anonymousId) {
    return {
      used: 0,
      limit: FREE_DAILY_LIMIT,
      remaining: FREE_DAILY_LIMIT,
      tier: "free",
      packRemaining: 0,
    };
  }

  const todayCount = await prisma.generation.count({
    where: { anonymousId, createdAt: { gte: dayStart } },
  });

  return {
    used: todayCount,
    limit: FREE_DAILY_LIMIT,
    remaining: Math.max(0, FREE_DAILY_LIMIT - todayCount),
    tier: "free",
    packRemaining: 0,
  };
}

export async function recordGeneration(
  userId: string | null,
  anonymousId: string | null
): Promise<void> {
  await prisma.generation.create({
    data: {
      userId: userId || undefined,
      anonymousId: userId ? undefined : anonymousId || undefined,
    },
  });

  // If user is pro, decrement from the oldest active pack when daily limit exceeded
  if (userId) {
    const todayCount = await prisma.generation.count({
      where: { userId, createdAt: { gte: startOfDay() } },
    });

    if (todayCount > AUTH_DAILY_LIMIT) {
      const packs = await prisma.purchasedPack.findMany({
        where: { userId },
        orderBy: { createdAt: "asc" },
      });

      const activePack = packs.find(
        (p) => p.generationsUsed < p.generationsTotal
      );

      if (activePack) {
        await prisma.purchasedPack.update({
          where: { id: activePack.id },
          data: { generationsUsed: { increment: 1 } },
        });
      }
    }
  }
}

export async function canGenerate(
  userId: string | null,
  anonymousId: string | null
): Promise<boolean> {
  const usage = await getUsageInfo(userId, anonymousId);
  return usage.remaining > 0;
}
