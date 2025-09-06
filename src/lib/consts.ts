import type { StorySettings } from "@/types/settings";

export const DEFAULT_STORY_SETTINGS_LIST: StorySettings[] = [
  {
    genre: "Pandemic Survival-Horror",
    style: "Pixel Art",
    language: "en",
    tone: "gritty, somber, desperate",
    narratorRole: "solemn guide chronicling the fall of humanity",
    initialSituation:
      "The player is a virologist who has just discovered the true nature of the 'COVID-24' virus—it doesn't just kill, it reanimates. The world has fallen, and they find themselves isolated in their ruined lab, surrounded by the infected.",
    invitePhrases: [
      "What do you test?",
      "Where do you seek refuge?",
      "How do you prepare for the horde?"
    ],
    imageStyle:
      "pixel art, 16:9 aspect ratio, 8-bit retro gaming aesthetics, limited dark color palette, landscape format, clear definition, depicting a ruined city or lab"
  },
  {
    genre: "Epic Fantasy Adventure",
    style: "Digital Painting",
    language: "en",
    tone: "epic, grand, adventurous",
    narratorRole: "ancient sage narrating a legend",
    initialSituation:
      "The player awakens in the enchanted realm of Eldoria, their memories gone. They are found by a young sorceress who reveals that the legendary 'Crimson Dragon' has returned, corrupting the land and threatening to consume all magic.",
    invitePhrases: [
      "What ancient artifact do you seek?",
      "Where do you journey to gather allies?",
      "What forgotten spell do you try to remember?"
    ],
    imageStyle:
      "digital painting style, vibrant and luminous colors, fantasy landscape with mountains and dragons, magical elements like glowing runes or spells, 16:9 aspect ratio"
  },
  {
    genre: "Cyberpunk Mystery",
    style: "Neon Noir",
    language: "en",
    tone: "noir, tense, high-tech",
    narratorRole: "hardboiled detective recounting a case",
    initialSituation:
      "The player is a disgraced cyber-detective in Neo-Kyoto, a city where humanity is ruled by rogue AIs. A new series of murders has begun, each victim a prominent tech executive, and the only clues are strange, encrypted data streams that lead to the city's deepest secrets.",
    invitePhrases: [
      "What system do you hack for clues?",
      "Which neon-lit alley do you investigate?",
      "What informant do you trust to help you?"
    ],
    imageStyle:
      "cyberpunk pixel art, 16:9 ratio, dark and moody neon colors, rainy streets, futuristic cityscapes, androids, and complex data visuals"
  }
];

export const UI_MESSAGES = {
  LOADING: {
    STORY: "Generating story...",
    IMAGE: "Generating image..."
  },
  ERROR: {
    STORY_GENERATION: "Error generating story",
    IMAGE_GENERATION: "Error generating image",
    MISSING_PROMPT: "Missing prompt to generate story",
    QUOTA_EXHAUSTED:
      "Free quota limit reached. Please try again later or upgrade your plan.",
    TOKEN_LIMIT: "Your message is too long. Please try a shorter message.",
    NETWORK_ERROR:
      "Connection error. Please check your internet and try again.",
    AUTH_ERROR: "API configuration issue. Please contact support.",
    RATE_LIMITED: "Too many requests. Please wait a moment and try again.",
    GENERIC: "Something went wrong. Please try again."
  },
  PLACEHOLDERS: {
    INPUT:
      "Describe what you want to do, where to go, what to examine, or how to react..."
  }
};

export const GAME_CONFIG = {
  IMAGE: {
    SEPARATOR: "IMAGE: "
  }
};
