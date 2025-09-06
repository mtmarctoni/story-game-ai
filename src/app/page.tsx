"use client";

import { useState } from "react";

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton
} from "@/components/conversation";
import { DEFAULT_STORY_SETTINGS } from "@/lib/prompts";
import type { StorySettings } from "@/types/settings";
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
    startGame,
    handleSubmit,
    handleInputChange,
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

  return (
    <div className="font-sans h-screen mx-auto overflow-hidden ">
      <div className="flex h-full w-full">
        <GameSidebar
          settings={storySettings}
          editable={!gameStarted}
          isLoading={isLoading}
          onChange={handleStorySettingsChange}
        />
        <main className="m-4 flex-1 flex flex-col items-center justify-center">
          {!gameStarted ? (
            <div className="max-w-2xl w-full mx-auto pb-4 space-y-6">
              <h1 className="text-3xl font-bold text-center mb-4">
                Welcome to the Story Game!
              </h1>
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
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg w-full text-xl shadow-lg transition"
                onClick={handleStartClick}
              >
                Start Game
              </button>
              <p className="text-center text-muted-foreground">
                Customize your story in the sidebar, then press Start!
              </p>
            </div>
          ) : (
            <div className="flex flex-col h-full w-full">
              <Conversation>
                <ConversationContent className="max-w-xl mx-auto">
                  {messages.map((message) => (
                    <GameMessage key={message.id} message={message} />
                  ))}
                  {isLoading && <GameLoader />}
                </ConversationContent>
                <ConversationScrollButton />
              </Conversation>
              <div className="max-w-2xl w-full mx-auto pb-4">
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
