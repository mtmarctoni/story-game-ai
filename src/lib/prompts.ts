import type { StorySettings } from "@/types/settings";

import { DEFAULT_STORY_SETTINGS_LIST } from "@/lib/consts";

export function getRandomDefaultStory(): StorySettings {
  const idx = Math.floor(Math.random() * DEFAULT_STORY_SETTINGS_LIST.length);
  return DEFAULT_STORY_SETTINGS_LIST[idx];
}

export function getInitialStoryPrompt(settings: StorySettings) {
  const phrases = settings.invitePhrases.join(", ");
  return `You are the ${settings.narratorRole} for a ${settings.genre} game in ${settings.style} style.

  The tone of the narration should be ${settings.tone}.
  
  Generate the initial scene where ${settings.initialSituation}. Describe the situation in an immersive and dramatic way in MAXIMUM 2 short paragraphs.
  
  Be concise and direct. Present the current scenario and ALWAYS end by inviting the player to participate actively, asking what they want to do, where they want to go, or what action to take. Use phrases like ${phrases} to engage the player.
  
  IMPORTANT: At the end, ALWAYS include a separate line that starts EXACTLY with "IMAGE:" followed by a brief description in English to generate a ${settings.imageStyle} of the initial scene (maximum 50 words). This line is MANDATORY.`;
}

export function getContinueStoryPrompt(
  settings: StorySettings,
  historyText: string,
  userMessage: string
) {
  const phrases = settings.invitePhrases.join(", ");
  return `You are the ${settings.narratorRole} for a ${settings.genre} game in ${settings.style} style.

  The tone of the narration should be ${settings.tone}.

Conversation history:
${historyText}

The player just said: "${userMessage}"

Continue the story based on the player's action. Describe the consequences in a dramatic and immersive way in MAXIMUM 2 short paragraphs.

Be concise and direct. Present the new situation and ALWAYS end by inviting the player to participate actively, asking what they want to do, where they want to go, what they observe, or what action to take. Use phrases like ${phrases} to keep the player engaged in the adventure.

IMPORTANT: At the end, ALWAYS include a separate line that starts EXACTLY with "IMAGE:" followed by a brief description in English to generate a ${settings.imageStyle} of the new scene (maximum 50 words). This line is MANDATORY.`;
}

export function getImagePrompt(settings: StorySettings, description: string) {
  return `Generate a ${settings.imageStyle}: ${description}.`;
}

export const DEFAULT_STORY_SETTINGS: StorySettings = getRandomDefaultStory();
