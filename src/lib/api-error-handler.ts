import { NextResponse } from "next/server";

export interface ApiError {
  code: string;
  message: string;
  userMessage: string;
  httpStatus: number;
  retryable: boolean;
}

export const ERROR_CODES = {
  QUOTA_EXHAUSTED: "QUOTA_EXHAUSTED",
  TOKEN_LIMIT_EXCEEDED: "TOKEN_LIMIT_EXCEEDED",
  AUTHENTICATION_ERROR: "AUTHENTICATION_ERROR",
  RATE_LIMITED: "RATE_LIMITED",
  NETWORK_ERROR: "NETWORK_ERROR",
  INVALID_REQUEST: "INVALID_REQUEST",
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
} as const;

export const ERROR_MESSAGES = {
  [ERROR_CODES.QUOTA_EXHAUSTED]: {
    userMessage:
      "You've reached the free quota limit for AI generation. Please try again later or upgrade your plan.",
    httpStatus: 429,
    retryable: false,
  },
  [ERROR_CODES.TOKEN_LIMIT_EXCEEDED]: {
    userMessage:
      "Your request is too long. Please try a shorter message or reduce your conversation history.",
    httpStatus: 400,
    retryable: false,
  },
  [ERROR_CODES.AUTHENTICATION_ERROR]: {
    userMessage:
      "There's an issue with the API configuration. Please contact support.",
    httpStatus: 401,
    retryable: false,
  },
  [ERROR_CODES.RATE_LIMITED]: {
    userMessage: "Too many requests. Please wait a moment and try again.",
    httpStatus: 429,
    retryable: true,
  },
  [ERROR_CODES.NETWORK_ERROR]: {
    userMessage:
      "Network connection error. Please check your connection and try again.",
    httpStatus: 503,
    retryable: true,
  },
  [ERROR_CODES.INVALID_REQUEST]: {
    userMessage: "Invalid request. Please try again with different input.",
    httpStatus: 400,
    retryable: false,
  },
  [ERROR_CODES.UNKNOWN_ERROR]: {
    userMessage: "An unexpected error occurred. Please try again.",
    httpStatus: 500,
    retryable: true,
  },
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
    retryable: errorConfig.retryable,
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
    originalError: error,
  });

  return NextResponse.json(
    {
      error: apiError.userMessage,
      code: apiError.code,
      retryable: apiError.retryable,
    },
    { status: apiError.httpStatus }
  );
}
