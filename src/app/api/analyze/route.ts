import { NextRequest, NextResponse } from "next/server";
import { getOpenAIClient } from "@/lib/openai";
import { buildSystemPrompt } from "@/lib/prompt-system";
import { PROMPT_CATEGORIES, PromptBlock } from "@/lib/types";
import type { Platform, DetailLevel } from "@/lib/types";
import { auth } from "@/lib/auth";
import { canGenerate, recordGeneration } from "@/lib/usage";
import { randomUUID } from "crypto";

export const maxDuration = 60;

const VALID_PLATFORMS = new Set(["universal", "midjourney", "stable-diffusion", "dall-e", "flux"]);
const VALID_DETAILS = new Set(["short", "detailed", "expert"]);

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id ?? null;

    let anonymousId = request.cookies.get("anon_id")?.value ?? null;
    if (!userId && !anonymousId) {
      anonymousId = randomUUID();
    }

    // Check usage limits
    const allowed = await canGenerate(userId, anonymousId);
    if (!allowed) {
      const message = userId
        ? "Daily limit reached. Purchase a generation pack for more."
        : "Daily limit reached. Sign in for more free generations.";
      const res = NextResponse.json(
        { error: message, limitReached: true, isAuthenticated: !!userId },
        { status: 429 }
      );
      if (!userId && anonymousId) {
        res.cookies.set("anon_id", anonymousId, {
          httpOnly: true,
          sameSite: "lax",
          maxAge: 60 * 60 * 24,
          path: "/",
        });
      }
      return res;
    }

    const formData = await request.formData();
    const file = formData.get("image") as File | null;
    const platformRaw = (formData.get("platform") as string) || "universal";
    const detailRaw = (formData.get("detailLevel") as string) || "detailed";

    const platform: Platform = VALID_PLATFORMS.has(platformRaw)
      ? (platformRaw as Platform)
      : "universal";
    const detailLevel: DetailLevel = VALID_DETAILS.has(detailRaw)
      ? (detailRaw as DetailLevel)
      : "detailed";

    if (!file) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large. Maximum 10MB." },
        { status: 400 }
      );
    }

    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Use JPG, PNG, or WebP." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");
    const dataUrl = `data:${file.type};base64,${base64}`;

    const openai = getOpenAIClient();
    const systemPrompt = buildSystemPrompt(platform, detailLevel);

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      max_tokens: detailLevel === "expert" ? 5000 : detailLevel === "detailed" ? 4000 : 2000,
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: { url: dataUrl, detail: "high" },
            },
            {
              type: "text",
              text: "Analyze this image and return the structured prompt JSON.",
            },
          ],
        },
      ],
    });

    const raw = response.choices[0]?.message?.content?.trim() || "";

    let parsed: Record<string, string>;
    try {
      const jsonStr = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "");
      parsed = JSON.parse(jsonStr);
    } catch {
      return NextResponse.json(
        { error: "Failed to parse AI response." },
        { status: 500 }
      );
    }

    const blocks: PromptBlock[] = PROMPT_CATEGORIES.map((cat) => ({
      id: cat.id,
      label: cat.label,
      icon: cat.icon,
      content: parsed[cat.id] || "",
    }));

    // Build full prompt: positive blocks only (exclude negative)
    const positiveBlocks = blocks.filter((b) => b.id !== "negative");
    const fullPrompt = positiveBlocks.map((b) => b.content).filter(Boolean).join(", ");
    const negativePrompt = parsed["negative"] || "";

    // Record successful generation
    await recordGeneration(userId, anonymousId);

    const res = NextResponse.json({
      blocks,
      fullPrompt,
      negativePrompt,
      platform,
      detailLevel,
    });

    // Set anonymous ID cookie if needed
    if (!userId && anonymousId) {
      res.cookies.set("anon_id", anonymousId, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24,
        path: "/",
      });
    }

    return res;
  } catch (error: unknown) {
    console.error("Analyze error:", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
