import { AlertTriangle, Clock, Settings, Wifi } from "lucide-react";
import { ERROR_MESSAGES } from "./api-error-handler";

export function getErrorIcon(errorCode: string) {
  const errorConfig = ERROR_MESSAGES[errorCode as keyof typeof ERROR_MESSAGES];
  if (!errorConfig) {
    return <AlertTriangle className="w-4 h-4" />;
  }

  switch (errorConfig.iconType) {
    case "quota":
      return <Clock className="w-4 h-4" />;
    case "network":
      return <Wifi className="w-4 h-4" />;
    case "auth":
      return <Settings className="w-4 h-4" />;
    default:
      return <AlertTriangle className="w-4 h-4" />;
  }
}

export function getErrorTitle(errorCode: string, type: "story" | "image") {
  const errorConfig = ERROR_MESSAGES[errorCode as keyof typeof ERROR_MESSAGES];
  if (!errorConfig) {
    return `${type === "story" ? "Story Generation" : "Image Generation"} Error`;
  }
  return errorConfig.title;
}

export function getErrorDescription(
  errorCode: string,
  type: "story" | "image"
) {
  const errorConfig = ERROR_MESSAGES[errorCode as keyof typeof ERROR_MESSAGES];
  if (!errorConfig) {
    return `An unexpected error occurred with ${type === "story" ? "story generation" : "image generation"}. This is usually temporary.`;
  }
  return errorConfig.description(type);
}

export function getErrorSuggestions(
  errorCode: string,
  type: "story" | "image"
) {
  const errorConfig = ERROR_MESSAGES[errorCode as keyof typeof ERROR_MESSAGES];
  if (!errorConfig) {
    return [
      "Try again in a few moments",
      "Refresh the page if problems continue",
      "This is usually a temporary issue"
    ];
  }
  return errorConfig.suggestions(type);
}
