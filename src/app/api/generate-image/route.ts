import { google } from "@ai-sdk/google";
import { generateText } from "ai";

import { type NextRequest, NextResponse } from "next/server";
import { createErrorResponse } from "@/lib/api-error-handler";
import { DEFAULT_STORY_SETTINGS, getImagePrompt } from "@/lib/prompts";
import type { GenerateImageRequest } from "@/types/game";
import type { StorySettings } from "@/types/settings";

export async function POST(request: NextRequest) {
  try {
    const {
      imagePrompt,
      storySettings
    }: GenerateImageRequest & { storySettings?: StorySettings } =
      await request.json();

    const prompt = getImagePrompt(
      storySettings ?? DEFAULT_STORY_SETTINGS,
      imagePrompt
    );

    const { files } = await generateText({
      model: google("gemini-2.5-flash-image-preview"),
      prompt,
      providerOptions: {
        google: {
          responseModalities: ["IMAGE"]
        }
      }
    });

    console.log("Generated images: ", files);
    return NextResponse.json({ image: files[0] || null });
  } catch (error) {
    return createErrorResponse(error, "generate-image");
  }
}
