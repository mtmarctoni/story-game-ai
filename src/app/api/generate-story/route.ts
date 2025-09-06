import { google } from "@ai-sdk/google";
import { generateText } from "ai";

import { type NextRequest, NextResponse } from "next/server";
import { GAME_CONFIG } from "@/lib/consts";
import { getContinueStoryPrompt, getInitialStoryPrompt } from "@/lib/prompts";
import type { GenerateStoryRequest } from "@/types/game";
import type { StorySettings } from "@/types/settings";

export async function POST(request: NextRequest) {
  try {
    const {
      userMessage,
      conversationHistory,
      isStart,
      storySettings
    }: GenerateStoryRequest & { storySettings: StorySettings } =
      await request.json();

    let prompt: string;
    if (isStart) {
      prompt = getInitialStoryPrompt(storySettings);
    } else {
      const historyText = conversationHistory
        .map((message) => `${message.role}: ${message.content}`)
        .join("\n");
      prompt = getContinueStoryPrompt(storySettings, historyText, userMessage);
    }

    const { text } = await generateText({
      model: google("gemini-2.5-flash-lite"),
      prompt
    });

    const [narrative, imagePrompt] = text.split(GAME_CONFIG.IMAGE.SEPARATOR);
    return NextResponse.json({ narrative, imagePrompt });
  } catch (error) {
    console.error("Error generating story:", error);
    return NextResponse.json(
      { error: "Error generating story" },
      { status: 500 }
    );
  }
}
