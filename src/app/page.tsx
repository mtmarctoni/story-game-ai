"use client";

import { useState } from "react";

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton
} from "@/components/conversation";
import { ErrorNotification } from "@/components/error-notification";
import { DEFAULT_STORY_SETTINGS } from "@/lib/prompts";
import type { StorySettings } from "@/types/settings";
import { GameErrorStatus } from "./components/game-error-status";
import { GameInput } from "./components/game-input";
import { GameLoader } from "./components/game-loader";
import { GameMessage } from "./components/game-message";
import { GameSidebar } from "./components/game-sidebar";
import { useStoryGame } from "./hooks/use-story-game";

export default function Home() {
  const [storySettings, setStorySettings] = useState<StorySettings>(
    DEFAULT_STORY_SETTINGS
  );
  const [gameStarted, setGameStarted] = useState(false);
  const {
    messages,
    input,
    isLoading,
    error,
    startGame,
    handleSubmit,
    handleInputChange,
    retryLastAction,
    retryImageGeneration,
    dismissImageError,
    clearError,
    setStorySettings: setGameStorySettings
  } = useStoryGame(storySettings);

  // Sync UI story settings with game logic
  const handleStorySettingsChange = (settings: StorySettings) => {
    setStorySettings(settings);
    setGameStorySettings?.(settings);
  };

  const handleStartClick = () => {
    setGameStarted(true);
    startGame();
  };

  const handleRetry = () => {
    retryLastAction();
  };

  return (
    <div className="font-sans h-screen mx-auto md:overflow-hidden">
      <div className="flex flex-col md:flex-row h-full w-full">
        <GameSidebar
          settings={storySettings}
          editable={!gameStarted}
          isLoading={isLoading}
          onChange={handleStorySettingsChange}
        />
        <main className="flex-1 flex flex-col items-center justify-center md:m-4 min-h-0">
          {!gameStarted ? (
            <div className="max-w-2xl w-full mx-auto p-4 space-y-6">
              <h1 className="text-3xl font-bold text-center mb-4">
                Welcome to the Story Game!
              </h1>

              {/* Error notification for pre-game errors */}
              {error && error.type === "story" ? (
                <GameErrorStatus
                  error={error}
                  onRetry={error.retryable ? handleRetry : undefined}
                  onDismiss={clearError}
                />
              ) : error ? (
                <ErrorNotification
                  message={error.message}
                  retryable={error.retryable}
                  onRetry={error.retryable ? handleRetry : undefined}
                  onDismiss={clearError}
                />
              ) : null}

              <div className="mb-4">
                <GameInput
                  input={input}
                  onInputChange={handleInputChange}
                  onSubmit={(e) => e.preventDefault()}
                  isLoading={true} // disables input before game starts
                  storySettings={storySettings}
                  onStorySettingsChange={handleStorySettingsChange}
                  gameStarted={false}
                />
              </div>
              <button
                type="button"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg w-full text-xl shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleStartClick}
                disabled={isLoading}
              >
                {isLoading ? "Starting Game..." : "Start Game"}
              </button>
              <p className="text-center text-muted-foreground md:block hidden">
                Customize your story in the sidebar, then press Start!
              </p>
              <p className="text-center text-muted-foreground md:hidden">
                Customize your story in the settings above, then press Start!
              </p>
            </div>
          ) : (
            <div className="flex flex-col h-full w-full min-h-0">
              <Conversation>
                <ConversationContent className="max-w-xl mx-auto px-2 md:px-4">
                  {messages.map((message) => (
                    <GameMessage
                      key={message.id}
                      message={message}
                      onRetryImage={retryImageGeneration}
                      onDismissImageError={dismissImageError}
                    />
                  ))}
                  {isLoading && <GameLoader />}
                </ConversationContent>
                <ConversationScrollButton />
              </Conversation>

              <div className="w-full mx-auto pb-4 px-4 flex-shrink-0">
                {/* Error notification for in-game errors */}
                {error && error.type === "story" ? (
                  <GameErrorStatus
                    error={error}
                    onRetry={error.retryable ? handleRetry : undefined}
                    onDismiss={clearError}
                  />
                ) : error ? (
                  <ErrorNotification
                    message={error.message}
                    retryable={error.retryable}
                    onRetry={error.retryable ? handleRetry : undefined}
                    onDismiss={clearError}
                  />
                ) : null}

                <GameInput
                  input={input}
                  onInputChange={handleInputChange}
                  onSubmit={handleSubmit}
                  isLoading={isLoading}
                  storySettings={storySettings}
                  onStorySettingsChange={handleStorySettingsChange}
                  gameStarted={true}
                />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
