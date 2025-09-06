import { google } from "@ai-sdk/google";
import { generateText } from "ai";

import { type NextRequest, NextResponse } from "next/server";

import { getImagePrompt } from "@/lib/prompts";
import { DEFAULT_STORY_SETTINGS } from "@/lib/prompts";
import { GenerateImageRequest, GenerateStoryRequest } from "@/types/game";

export async function POST(request: NextRequest) {
  try {
    const {
      imagePrompt,
      storySettings,
    }: GenerateImageRequest & { storySettings?: any } = await request.json();

    const prompt = getImagePrompt(
      storySettings ?? DEFAULT_STORY_SETTINGS,
      imagePrompt
    );

    const { files } = await generateText({
      model: google("gemini-2.5-flash-image-preview"),
      prompt,
      providerOptions: {
        google: {
          responseModalities: ["IMAGE"],
        },
      },
    });

    console.log("Generated images: ", files);
    return NextResponse.json({ image: files[0] || null });
  } catch (error) {
    console.error("Error generating image:", error);
    return NextResponse.json(
      { error: "Error generating image" },
      { status: 500 }
    );
  }
}
