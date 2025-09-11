import { NextResponse } from "next/server";

export interface ApiError {
  code: string;
  message: string;
  userMessage: string;
  httpStatus: number;
  retryable: boolean;
}

export interface ErrorUIConfig {
  userMessage: string;
  httpStatus: number;
  retryable: boolean;
  title: string;
  description: (type: "story" | "image") => string;
  suggestions: (type: "story" | "image") => string[];
  iconType: "quota" | "network" | "auth" | "invalid" | "unknown";
}

export const ERROR_CODES = {
  QUOTA_EXHAUSTED: "QUOTA_EXHAUSTED",
  TOKEN_LIMIT_EXCEEDED: "TOKEN_LIMIT_EXCEEDED",
  AUTHENTICATION_ERROR: "AUTHENTICATION_ERROR",
  RATE_LIMITED: "RATE_LIMITED",
  NETWORK_ERROR: "NETWORK_ERROR",
  INVALID_REQUEST: "INVALID_REQUEST",
  UNKNOWN_ERROR: "UNKNOWN_ERROR"
} as const;

export const ERROR_MESSAGES = {
  [ERROR_CODES.QUOTA_EXHAUSTED]: {
    userMessage:
      "You've reached the free quota limit for AI generation. Please try again later or upgrade your plan.",
    httpStatus: 429,
    retryable: false,
    title: "Daily Limit Reached",
    description: (type: "story" | "image") =>
      `The AI service has reached its daily usage limit for ${
        type === "story" ? "story generation" : "image generation"
      }. This typically resets in 24 hours.`,
    suggestions: (type: "story" | "image") => [
      "Wait 24 hours for the quota to reset",
      "Check back tomorrow to continue playing",
      type === "story"
        ? "The game requires story generation to function"
        : "Images enhance the experience but aren't required"
    ],
    iconType: "quota" as const
  },
  [ERROR_CODES.TOKEN_LIMIT_EXCEEDED]: {
    userMessage:
      "Your request is too long. Please try a shorter message or reduce your conversation history.",
    httpStatus: 400,
    retryable: false,
    title: "Content Too Long",
    description: (_type: "story" | "image") =>
      `Your request or conversation history is too long. Try a shorter message or start a new game.`,
    suggestions: (_type: "story" | "image") => [
      "Start a new game to reset the conversation",
      "Use shorter messages",
      "The conversation history may be too long"
    ],
    iconType: "invalid" as const
  },
  [ERROR_CODES.AUTHENTICATION_ERROR]: {
    userMessage:
      "There's an issue with the API configuration. Please contact support.",
    httpStatus: 401,
    retryable: false,
    title: "Service Configuration Issue",
    description: (_type: "story" | "image") =>
      `There's an issue with the AI service configuration. Please contact support if this persists.`,
    suggestions: (_type: "story" | "image") => [
      "This is likely a temporary service issue",
      "Contact support if the problem persists",
      "Try again in a few minutes"
    ],
    iconType: "auth" as const
  },
  [ERROR_CODES.RATE_LIMITED]: {
    userMessage: "Too many requests. Please wait a moment and try again.",
    httpStatus: 429,
    retryable: true,
    title: "Too Many Requests",
    description: (_type: "story" | "image") =>
      `Too many requests have been made recently. Please wait a moment before trying again.`,
    suggestions: (_type: "story" | "image") => [
      "Wait 1-2 minutes before retrying",
      "Avoid rapid successive requests",
      "The service will become available again shortly"
    ],
    iconType: "quota" as const
  },
  [ERROR_CODES.NETWORK_ERROR]: {
    userMessage:
      "Network connection error. Please check your connection and try again.",
    httpStatus: 503,
    retryable: true,
    title: "Connection Problem",
    description: (_type: "story" | "image") =>
      `There's a problem with your internet connection or the AI service is temporarily unavailable.`,
    suggestions: (_type: "story" | "image") => [
      "Check your internet connection",
      "Try refreshing the page",
      "The service might be temporarily down"
    ],
    iconType: "network" as const
  },
  [ERROR_CODES.INVALID_REQUEST]: {
    userMessage: "Invalid request. Please try again with different input.",
    httpStatus: 400,
    retryable: false,
    title: "Invalid Request",
    description: (_type: "story" | "image") =>
      `The request format is invalid. This might be a temporary issue - please try again.`,
    suggestions: (_type: "story" | "image") => [
      "Try rephrasing your message",
      "Start a new game if the issue persists",
      "This is usually a temporary problem"
    ],
    iconType: "invalid" as const
  },
  [ERROR_CODES.UNKNOWN_ERROR]: {
    userMessage: "An unexpected error occurred. Please try again.",
    httpStatus: 500,
    retryable: true,
    title: "Unexpected Error",
    description: (type: "story" | "image") =>
      `An unexpected error occurred with ${
        type === "story" ? "story generation" : "image generation"
      }. This is usually temporary.`,
    suggestions: (_type: "story" | "image") => [
      "Try again in a few moments",
      "Refresh the page if problems continue",
      "This is usually a temporary issue"
    ],
    iconType: "unknown" as const
  }
} as const;

type CodeError = keyof typeof ERROR_CODES;

/**
 * Parses Gemini API errors and categorizes them
 */
export function parseGeminiError(error: unknown): ApiError {
  console.error("Gemini API Error:", error);

  let code: CodeError = ERROR_CODES.UNKNOWN_ERROR;
  let message = "Unknown error occurred";

  if (error && typeof error === "object") {
    const errorObj = error as Record<string, unknown>;
    const errorMessage = errorObj.message || errorObj.error || String(error);
    const errorStr = String(errorMessage).toLowerCase();

    // Check for quota exhaustion
    if (
      errorStr.includes("quota") &&
      (errorStr.includes("exhausted") || errorStr.includes("exceeded"))
    ) {
      code = ERROR_CODES.QUOTA_EXHAUSTED;
      message = "API quota exhausted";
    }
    // Check for token limit issues
    else if (
      errorStr.includes("token") &&
      (errorStr.includes("limit") ||
        errorStr.includes("too long") ||
        errorStr.includes("exceed"))
    ) {
      code = ERROR_CODES.TOKEN_LIMIT_EXCEEDED;
      message = "Token limit exceeded";
    }
    // Check for authentication errors
    else if (
      errorStr.includes("auth") ||
      errorStr.includes("unauthorized") ||
      errorStr.includes("api key") ||
      errorStr.includes("permission")
    ) {
      code = ERROR_CODES.AUTHENTICATION_ERROR;
      message = "Authentication error";
    }
    // Check for rate limiting
    else if (errorStr.includes("rate") && errorStr.includes("limit")) {
      code = ERROR_CODES.RATE_LIMITED;
      message = "Rate limited";
    }
    // Check for network errors
    else if (
      errorStr.includes("network") ||
      errorStr.includes("connection") ||
      errorStr.includes("timeout") ||
      errorStr.includes("fetch")
    ) {
      code = ERROR_CODES.NETWORK_ERROR;
      message = "Network error";
    }
    // Check for invalid request errors
    else if (
      errorStr.includes("invalid") ||
      errorStr.includes("bad request") ||
      errorStr.includes("malformed")
    ) {
      code = ERROR_CODES.INVALID_REQUEST;
      message = "Invalid request";
    }

    // If we have a more specific message, use it
    if (errorMessage && typeof errorMessage === "string") {
      message = errorMessage;
    }
  }

  const errorConfig = ERROR_MESSAGES[code];

  return {
    code,
    message,
    userMessage: errorConfig.userMessage,
    httpStatus: errorConfig.httpStatus,
    retryable: errorConfig.retryable
  };
}

/**
 * Creates a standardized error response for API routes
 */
export function createErrorResponse(error: unknown, context?: string) {
  const apiError = parseGeminiError(error);

  // Log the full error for debugging
  console.error(`API Error in ${context || "unknown context"}:`, {
    code: apiError.code,
    message: apiError.message,
    userMessage: apiError.userMessage,
    originalError: error
  });

  return NextResponse.json(
    {
      error: apiError.userMessage,
      code: apiError.code,
      retryable: apiError.retryable
    },
    { status: apiError.httpStatus }
  );
}
