import { google } from "@ai-sdk/google";
import { generateText } from "ai";

import { type NextRequest, NextResponse } from "next/server";

import { getInitialStoryPrompt, getContinueStoryPrompt } from "@/lib/prompts";
import { GAME_CONFIG } from "@/lib/consts";
import { GenerateStoryRequest } from "@/types/game";

export async function POST(request: NextRequest) {
  try {
    const {
      userMessage,
      conversationHistory,
      isStart,
      storySettings,
    }: GenerateStoryRequest & { storySettings?: any } = await request.json();

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
      prompt,
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
