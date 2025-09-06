import { useState } from 'react';

import {
  PromptInput,
  PromptInputTextarea,
  PromptInputSubmit,
  PromptInputModelSelect,
  PromptInputModelSelectTrigger,
  PromptInputModelSelectContent,
  PromptInputModelSelectItem,
  PromptInputModelSelectValue
} from '@/components/prompt-input';
import { DEFAULT_STORY_SETTINGS_LIST, UI_MESSAGES } from '@/lib/consts';
import type { StorySettings } from '@/types/settings';
import { StoryConfig } from '@/app/componentes/story-config';

interface GameInputProps {
  input: string;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  storySettings?: StorySettings;
  onStorySettingsChange?: (settings: StorySettings) => void;
  gameStarted?: boolean;
}

export function GameInput({ input, onInputChange, onSubmit, isLoading, storySettings, onStorySettingsChange, gameStarted }: GameInputProps) {
  const inputTrimmed = input.trim();
  const inputSubmitIsDisabled = isLoading || inputTrimmed === '' || !gameStarted;

  const [selectedPreset, setSelectedPreset] = useState(0);
  const [customSettings, setCustomSettings] = useState<StorySettings | null>(null);

  const handlePresetChange = (index: number) => {
    setSelectedPreset(index);
    setCustomSettings(null);
    onStorySettingsChange?.(DEFAULT_STORY_SETTINGS_LIST[index]);
  };

  return (
    <div className="space-y-4">
      {!gameStarted ? (
        <>
          <div className="flex flex-col gap-2 mb-2">
            <label className="font-semibold">Choose a story preset:</label>
            <PromptInputModelSelect
              value={String(selectedPreset)}
              onValueChange={val => handlePresetChange(Number(val))}
            >
              <PromptInputModelSelectTrigger>
                <PromptInputModelSelectValue />
              </PromptInputModelSelectTrigger>
              <PromptInputModelSelectContent>
                {DEFAULT_STORY_SETTINGS_LIST.map((preset, idx) => (
                  <PromptInputModelSelectItem key={idx} value={String(idx)}>
                    {preset.genre}
                  </PromptInputModelSelectItem>
                ))}
              </PromptInputModelSelectContent>
            </PromptInputModelSelect>
            
          </div>
        </>
      ) : (
        <></>
      )}

      <PromptInput onSubmit={onSubmit} className='relative pr-8'>
        <PromptInputTextarea
          placeholder={UI_MESSAGES.PLACEHOLDERS.INPUT}
          value={input}
          onChange={onInputChange}
          disabled={isLoading || !gameStarted}
        />
        <PromptInputSubmit disabled={inputSubmitIsDisabled} className="absolute bottom-2 right-2" />
      </PromptInput>
    </div>
  );
}