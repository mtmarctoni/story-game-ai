import { XIcon } from "lucide-react";

export interface ErrorNotificationProps {
  message: string;
  retryable?: boolean;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export function ErrorNotification({
  message,
  retryable = false,
  onRetry,
  onDismiss
}: ErrorNotificationProps) {
  return (
    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-4 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          <div className="w-5 h-5 rounded-full bg-destructive/20 flex items-center justify-center">
            <span className="text-destructive text-sm font-bold">!</span>
          </div>
        </div>
        <div className="flex-1">
          <p className="text-destructive text-sm font-medium">{message}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        {retryable && onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="text-xs px-3 py-1 bg-destructive/20 hover:bg-destructive/30 text-destructive rounded-md font-medium transition-colors"
          >
            Retry
          </button>
        )}
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="text-destructive/70 hover:text-destructive p-1"
          >
            <XIcon className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
