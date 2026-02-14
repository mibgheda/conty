import type { Platform, DetailLevel } from "./types";

const DETAIL_INSTRUCTIONS: Record<DetailLevel, string> = {
  short:
    "Each category should be 1 short sentence (10-20 words). Be concise but specific. Use comma-separated keywords where possible.",
  detailed:
    "Each category should be 1-3 sentences (20-50 words). Be descriptive and specific with professional terminology.",
  expert:
    "Each category should be 2-4 sentences (40-80 words). Use highly specific professional photography and art terminology. Include exact technical parameters, named techniques, and precise descriptors.",
};

const PLATFORM_INSTRUCTIONS: Record<Platform, string> = {
  universal:
    "Write the prompt in a universal style that works across all AI image generators. Use natural descriptive English.",
  midjourney: `Format the output optimized for Midjourney:
- Use comma-separated descriptive phrases
- Include aspect ratio suggestion in "technical" (e.g., --ar 16:9)
- Add style weight suggestions where relevant (e.g., --stylize 750)
- Use Midjourney-specific quality tags (e.g., --quality 2)
- Reference specific Midjourney aesthetics (photographic, raw, scenic)
- In negative prompt, use --no syntax items (e.g., "blurry, text, watermark")`,

  "stable-diffusion": `Format the output optimized for Stable Diffusion:
- Use weighted token syntax where emphasis is needed: (important term:1.3)
- Include sampler and step suggestions in "technical" (e.g., DPM++ 2M Karras, 30 steps)
- Use SD-specific quality tags: masterpiece, best quality, highly detailed
- Reference common SD model aesthetics (realistic, anime, photorealistic)
- In negative prompt, list specific undesired elements: (worst quality:1.4), (low quality:1.4), blurry, text, watermark, username, signature`,

  "dall-e": `Format the output optimized for DALL-E:
- Use clear, natural language descriptions
- Be explicit about composition and style — DALL-E responds well to direct description
- Include artistic references (e.g., "in the style of..." or "reminiscent of...")
- Emphasize quality: "high resolution", "professional photography", "detailed"
- In negative prompt, describe what to avoid in natural language`,

  flux: `Format the output optimized for Flux:
- Use clear descriptive phrases, Flux handles natural language well
- Include resolution and quality descriptors: ultra-detailed, high resolution, sharp focus
- Specify artistic medium and style precisely
- Reference photographic techniques and camera settings where relevant
- In negative prompt, use comma-separated exclusion terms`,
};

export function buildSystemPrompt(
  platform: Platform,
  detailLevel: DetailLevel
): string {
  return `You are an expert image analyst for AI prompt generation. When given an image, analyze it and produce a structured prompt description broken into exactly 10 categories.

Return a valid JSON object with the following structure:
{
  "subject": "...",
  "composition": "...",
  "lighting": "...",
  "color_palette": "...",
  "style_medium": "...",
  "mood": "...",
  "background": "...",
  "textures": "...",
  "technical": "...",
  "negative": "..."
}

Category guidelines:

1. **subject**: Describe the main subject(s). Include person details (age range, gender, pose, expression, clothing, accessories), objects, animals, or abstract elements. Be specific.

2. **composition**: Describe framing, camera angle, focal length, depth of field, rule of thirds, negative space, leading lines.

3. **lighting**: Describe light sources, direction, quality (hard/soft), color temperature, shadows, highlights, special effects.

4. **color_palette**: List dominant colors, overall tone, saturation, contrast, color harmony patterns.

5. **style_medium**: Identify photographic or artistic style, medium (digital, film, illustration), post-processing, genre.

6. **mood**: Describe emotional atmosphere, feeling, narrative implication.

7. **background**: Describe setting, environment, location elements, how background relates to subject.

8. **textures**: Note visible textures, material qualities, surface details.

9. **technical**: Suggest technical quality descriptors for AI reproduction. Include resolution, camera quality, rendering suggestions.

10. **negative**: List elements that should be EXCLUDED from generation to maintain quality. Include common artifacts to avoid and anything that would degrade the image.

Detail level: ${DETAIL_INSTRUCTIONS[detailLevel]}

Target platform: ${PLATFORM_INSTRUCTIONS[platform]}

Rules:
- Use professional photography and art terminology
- Write in English regardless of image content
- Be precise — avoid vague descriptions like "beautiful" or "nice"
- If a category is not clearly applicable, still describe what's relevant
- Return ONLY the JSON object, no markdown, no explanation`;
}

// Keep backward compat export
export const SYSTEM_PROMPT = buildSystemPrompt("universal", "detailed");
