import { useState } from "react";
import { DEFAULT_STORY_SETTINGS } from "@/lib/prompts";
import type {
  ApiErrorResponse,
  GameError,
  GameMessage,
  GenerateStoryResponse
} from "@/types/game";
import type { StorySettings } from "@/types/settings";

export function useStoryGame(initialSettings?: StorySettings) {
  const [messages, setMessages] = useState<GameMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<GameError | null>(null);
  const [storySettings, setStorySettings] = useState<StorySettings>(
    initialSettings ?? DEFAULT_STORY_SETTINGS
  );

  const clearError = () => setError(null);

  const handleApiError = async (
    response: Response,
    type: "story" | "image"
  ) => {
    try {
      const errorData = (await response.json()) as ApiErrorResponse;
      setError({
        message: errorData.error,
        code: errorData.code,
        retryable: errorData.retryable,
        type
      });
    } catch {
      // If we can't parse the error response, show a generic error
      setError({
        message: `Error ${type === "story" ? "generating story" : "generating image"}`,
        code: "UNKNOWN_ERROR",
        retryable: true,
        type
      });
    }
  };

  const startGame = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/generate-story", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ isStart: true, storySettings })
      });

      if (!response.ok) {
        await handleApiError(response, "story");
        return;
      }

      const data = (await response.json()) as GenerateStoryResponse;
      const messageId = crypto.randomUUID();
      const newMessage: GameMessage = {
        id: messageId,
        role: "assistant",
        content: data.narrative,
        imageLoading: true
      };
      setMessages([newMessage]);
      generateImage(messageId, data.imagePrompt);
    } catch (error) {
      console.error("Error generating story:", error);
      setError({
        message: "Network error. Please check your connection and try again.",
        code: "NETWORK_ERROR",
        retryable: true,
        type: "story"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateImage = async (messageId: string, imagePrompt: string) => {
    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          imagePrompt: imagePrompt
        })
      });

      if (!response.ok) {
        // For image errors, we don't want to block the story flow
        // Just mark the image as failed to load
        setMessages((prevMessages) =>
          prevMessages.map((message) => {
            if (message.id === messageId) {
              return { ...message, imageLoading: false };
            }
            return message;
          })
        );
        return;
      }

      const imageData = await response.json();

      setMessages((prevMessages) =>
        prevMessages.map((message) => {
          if (message.id === messageId) {
            return { ...message, image: imageData.image, imageLoading: false };
          }
          return message;
        })
      );
    } catch (_error) {
      setMessages((prevMessages) =>
        prevMessages.map((message) => {
          if (message.id === messageId) {
            return { ...message, imageLoading: false };
          }
          return message;
        })
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: GameMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: input
    };
    setIsLoading(true);
    setError(null);
    setInput("");
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      const response = await fetch("/api/generate-story", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userMessage: input,
          conversationHistory: messages,
          isStart: false,
          storySettings
        })
      });

      if (!response.ok) {
        await handleApiError(response, "story");
        return;
      }

      const data = (await response.json()) as GenerateStoryResponse;
      const messageId = crypto.randomUUID();
      const assistantMessage: GameMessage = {
        id: messageId,
        role: "assistant",
        content: data.narrative,
        imageLoading: true
      };
      setMessages((prevMessages) => [...prevMessages, assistantMessage]);
      generateImage(messageId, data.imagePrompt);
    } catch (error) {
      console.error("Error generating story:", error);
      setError({
        message: "Network error. Please check your connection and try again.",
        code: "NETWORK_ERROR",
        retryable: true,
        type: "story"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const retryLastAction = () => {
    if (!error) return;

    if (error.type === "story") {
      if (messages.length === 0) {
        // Retry starting the game
        startGame();
      } else {
        // Retry the last user message
        const lastUserMessage = messages.findLast((m) => m.role === "user");
        if (lastUserMessage) {
          setInput(lastUserMessage.content);
          // Remove the last user message since we'll resubmit it
          setMessages((prev) =>
            prev.filter((m) => m.id !== lastUserMessage.id)
          );
        }
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  return {
    messages,
    input,
    isLoading,
    error,
    startGame,
    handleSubmit,
    handleInputChange,
    retryLastAction,
    clearError,
    setStorySettings
  };
}
