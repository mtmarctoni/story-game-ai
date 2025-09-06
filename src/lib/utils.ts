import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { GAME_CONFIG } from "@/lib/consts";

// Utility to merge class names
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Utility to split story and image prompt from AI response
export function splitStoryAndImage(text: string) {
  const imageSeparator = GAME_CONFIG.IMAGE.SEPARATOR;
  const idx = text.indexOf(imageSeparator);
  if (idx === -1) {
    return { story: text, imagePrompt: "" };
  }
  const story = text.slice(0, idx).trim();
  const imagePrompt = text.slice(idx + imageSeparator.length).trim();
  return { story, imagePrompt };
}
