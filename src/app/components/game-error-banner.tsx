import { RotateCcw, X } from "lucide-react";
import {
  getErrorDescription,
  getErrorIcon,
  getErrorTitle
} from "@/lib/error-utils";
import type { GameError } from "@/types/game";

export interface GameErrorBannerProps {
  error: GameError;
  type?: "warning" | "error";
  onRetry?: () => void;
  onDismiss?: () => void;
  className?: string;
}

export function GameErrorBanner({
  error,
  type = "warning",
  onRetry,
  onDismiss,
  className = ""
}: GameErrorBannerProps) {
  const isWarning = type === "warning";
  const title = getErrorTitle(error.code, error.type);
  const description = getErrorDescription(error.code, error.type);
  const icon = getErrorIcon(error.code);

  return (
    <div
      className={`
      ${
        isWarning
          ? "bg-yellow-50 border-yellow-200 text-yellow-800"
          : "bg-red-50 border-red-200 text-red-800"
      } 
      border rounded-lg p-3 mb-3 text-sm
      ${className}
    `}
    >
      <div className="flex items-start justify-between space-x-3">
        <div className="flex items-start space-x-2 flex-1 min-w-0">
          <div
            className={`flex-shrink-0 mt-0.5 ${isWarning ? "text-yellow-600" : "text-red-600"}`}
          >
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium mb-1">{title}</div>
            <div className="text-xs opacity-90 leading-relaxed">
              {description}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-1 flex-shrink-0">
          {error.retryable && onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className={`
                ${
                  isWarning
                    ? "text-yellow-700 hover:text-yellow-900 hover:bg-yellow-100"
                    : "text-red-700 hover:text-red-900 hover:bg-red-100"
                }
                p-1 rounded transition-colors
              `}
              title="Retry"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

          {onDismiss && (
            <button
              type="button"
              onClick={onDismiss}
              className={`
                ${
                  isWarning
                    ? "text-yellow-700 hover:text-yellow-900 hover:bg-yellow-100"
                    : "text-red-700 hover:text-red-900 hover:bg-red-100"
                }
                p-1 rounded transition-colors
              `}
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
