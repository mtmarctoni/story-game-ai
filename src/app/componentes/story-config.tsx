import React from 'react';
import type { StorySettings } from '@/types/settings';

interface StoryConfigProps {
  settings: StorySettings;
  editable?: boolean;
  isLoading?: boolean;
  onChange?: (settings: StorySettings) => void;
}

export function StoryConfig({ settings, editable = false, isLoading = false, onChange }: StoryConfigProps) {
  const handleChange = (field: keyof StorySettings, value: string | string[]) => {
    if (!onChange) return;
    onChange({ ...settings, [field]: value });
  };

  if (!editable) {
    return (
      <div className="mb-2 p-4 border border-gray-700 rounded-xl bg-gray-900">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <span className="block text-xs font-semibold text-gray-400 mb-1">Genre</span>
            <span className="block text-sm text-gray-100">{settings.genre}</span>
          </div>
          <div>
            <span className="block text-xs font-semibold text-gray-400 mb-1">Style</span>
            <span className="block text-sm text-gray-100">{settings.style}</span>
          </div>
          <div>
            <span className="block text-xs font-semibold text-gray-400 mb-1">Narrator Role</span>
            <span className="block text-sm text-gray-100">{settings.narratorRole}</span>
          </div>
          <div className="md:col-span-2">
            <span className="block text-xs font-semibold text-gray-400 mb-1">Initial Situation</span>
            <span className="block text-sm text-gray-100">{settings.initialSituation}</span>
          </div>
          <div className="md:col-span-2">
            <span className="block text-xs font-semibold text-gray-400 mb-1">Invite Phrases</span>
            <span className="block text-sm text-gray-100">{settings.invitePhrases?.join(', ')}</span>
          </div>
          <div className="md:col-span-2">
            <span className="block text-xs font-semibold text-gray-400 mb-1">Image Style</span>
            <span className="block text-sm text-gray-100">{settings.imageStyle}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2 p-3 border border-gray-700 rounded-xl bg-gray-900">
      <div>
        <label className="block text-xs font-semibold text-gray-400 mb-1">Genre</label>
        <input
          className="w-full border border-gray-700 rounded-lg p-2 bg-gray-800 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
          value={settings.genre}
          onChange={e => handleChange('genre', e.target.value)}
          disabled={isLoading}
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-400 mb-1">Style</label>
        <input
          className="w-full border border-gray-700 rounded-lg p-2 bg-gray-800 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
          value={settings.style}
          onChange={e => handleChange('style', e.target.value)}
          disabled={isLoading}
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-400 mb-1">Narrator Role</label>
        <input
          className="w-full border border-gray-700 rounded-lg p-2 bg-gray-800 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
          value={settings.narratorRole}
          onChange={e => handleChange('narratorRole', e.target.value)}
          disabled={isLoading}
        />
      </div>
      <div className="md:col-span-2">
        <label className="block text-xs font-semibold text-gray-400 mb-1">Initial Situation</label>
        <textarea
          className="w-full min-h-[48px] max-h-[180px] resize-y border border-gray-700 rounded-lg p-2 bg-gray-800 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
          value={settings.initialSituation}
          onChange={e => handleChange('initialSituation', e.target.value)}
          disabled={isLoading}
          rows={Math.max(2, Math.min(8, settings.initialSituation?.length ? Math.ceil(settings.initialSituation.length / 60) : 2))}
        />
      </div>
      <div className="md:col-span-2">
        <label className="block text-xs font-semibold text-gray-400 mb-1">Invite Phrases (comma separated)</label>
        <textarea
          className="w-full min-h-[32px] max-h-[120px] resize-y border border-gray-700 rounded-lg p-2 bg-gray-800 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
          value={settings.invitePhrases?.join(', ')}
          onChange={e => handleChange('invitePhrases', e.target.value.split(','))}
          disabled={isLoading}
          rows={Math.max(1, Math.min(5, settings.invitePhrases?.join(', ').length ? Math.ceil(settings.invitePhrases.join(', ').length / 60) : 1))}
        />
      </div>
      <div className="md:col-span-2">
        <label className="block text-xs font-semibold text-gray-400 mb-1">Image Style</label>
        <textarea
          className="w-full min-h-[32px] max-h-[120px] resize-y border border-gray-700 rounded-lg p-2 bg-gray-800 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
          value={settings.imageStyle}
          onChange={e => handleChange('imageStyle', e.target.value)}
          disabled={isLoading}
          rows={Math.max(1, Math.min(5, settings.imageStyle?.length ? Math.ceil(settings.imageStyle.length / 60) : 1))}
        />
      </div>
    </div>
  );
}
