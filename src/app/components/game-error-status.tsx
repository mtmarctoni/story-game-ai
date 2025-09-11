import { RefreshCw } from "lucide-react";
import {
  getErrorDescription,
  getErrorIcon,
  getErrorSuggestions,
  getErrorTitle
} from "@/lib/error-utils";
import type { GameError } from "@/types/game";

export interface GameErrorStatusProps {
  error: GameError;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export function GameErrorStatus({
  error,
  onRetry,
  onDismiss
}: GameErrorStatusProps) {
  const title = getErrorTitle(error.code, error.type);
  const description = getErrorDescription(error.code, error.type);
  const suggestions = getErrorSuggestions(error.code, error.type);
  const icon = getErrorIcon(error.code);

  // Scale up the icon for the detailed error status
  const scaledIcon = icon ? (
    <div className="w-8 h-8 rounded-full bg-destructive/20 flex items-center justify-center text-destructive">
      <div className="scale-125">{icon}</div>
    </div>
  ) : null;

  return (
    <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-6 mb-4 space-y-4">
      {/* Header */}
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-0.5">{scaledIcon}</div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-destructive mb-1">
            {title}
          </h3>
          <p className="text-destructive/80 text-sm leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      {/* Suggestions */}
      <div className="ml-11 space-y-2">
        <h4 className="text-sm font-medium text-muted-foreground">
          What you can do:
        </h4>
        <ul className="space-y-1">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion}
              className="text-sm text-muted-foreground flex items-start"
            >
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-muted-foreground/40 mt-2 mr-2 flex-shrink-0" />
              {suggestion}
            </li>
          ))}
        </ul>
      </div>

      {/* Actions */}
      <div className="ml-11 flex items-center space-x-3 pt-2">
        {error.retryable && onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-md text-sm font-medium transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
        )}
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="px-4 py-2 text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
          >
            Dismiss
          </button>
        )}
      </div>

      {/* Additional context for non-retryable errors */}
      {!error.retryable && (
        <div className="ml-11 mt-3 p-3 bg-muted/30 rounded-md">
          <p className="text-xs text-muted-foreground">
            <strong>Note:</strong> This error cannot be automatically retried.
            {error.code === "QUOTA_EXHAUSTED"
              ? " You'll need to wait for the quota to reset."
              : " Please follow the suggestions above or contact support if the issue persists."}
          </p>
        </div>
      )}
    </div>
  );
}
