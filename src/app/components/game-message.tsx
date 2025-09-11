import { Image } from "@/components/image";
import { Loader } from "@/components/loader";
import { Message, MessageContent } from "@/components/message";
import { Response } from "@/components/response";
import { UI_MESSAGES } from "@/lib/consts";
import type { GameMessage as GameMessageType } from "@/types/game";
import { GameErrorBanner } from "./game-error-banner";

export function GameMessage({ 
  message, 
  onRetryImage,
  onDismissImageError
}: { 
  message: GameMessageType;
  onRetryImage?: (messageId: string) => void;
  onDismissImageError?: (messageId: string) => void;
}) {
  const { role, content, image, imageLoading, imageError } = message;

  return (
    <Message from={role}>
      <MessageContent className="space-y-2 mx-auto">
        {role === "assistant" && (
          <>
            <picture className="w-full max-w-2xl aspect-video overflow-hidden rounded-md">
              {imageLoading && (
                <div className="w-full h-full flex items-center justify-center bg-black/10">
                  <div className="flex mb-4 space-x-2">
                    <Loader />
                    <span>{UI_MESSAGES.LOADING.IMAGE}</span>
                  </div>
                </div>
              )}

              {image ? (
                <Image
                  base64={image.base64Data}
                  mediaType={image.mediaType}
                  uint8Array={new Uint8Array()}
                  alt="ai generated image for custom story game"
                  className="w-full h-full object-cover object-center"
                />
              ) : imageError && (
              <GameErrorBanner
                error={imageError}
                type="warning"
                onRetry={imageError.retryable ? () => onRetryImage?.(message.id) : undefined}
                onDismiss={() => onDismissImageError?.(message.id)}
              />
            )}
            </picture>
          </>
        )}

        <Response>{content}</Response>
      </MessageContent>
    </Message>
  );
}
