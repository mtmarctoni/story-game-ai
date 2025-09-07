import { BookOpen, Settings2 } from "lucide-react";
import { useState } from "react";
import type { StorySettings } from "@/types/settings";
import { StoryConfig } from "./story-config";

interface GameSidebarProps {
  settings: StorySettings;
  editable?: boolean;
  isLoading?: boolean;
  onChange?: (settings: StorySettings) => void;
}

export function GameSidebar({
  settings,
  editable = false,
  isLoading = false,
  onChange
}: GameSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  // Mobile top bar layout (< 768px)
  const mobileTopBar = (
    <div
      className={`md:hidden transition-all duration-300 ${
        collapsed ? "h-0 overflow-hidden" : "h-auto"
      } w-full border-b shadow-lg bg-gradient-to-r from-gray-900 to-gray-800 relative`}
    >
      <button
        type="button"
        className="absolute top-2 right-2 z-20 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-full p-2 shadow focus:outline-none transition-all duration-300"
        title={collapsed ? "Show settings" : "Hide settings"}
        onClick={() => setCollapsed((c) => !c)}
      >
        {collapsed ? (
          <BookOpen size={18} />
        ) : (
          <span className="text-sm">&times;</span>
        )}
      </button>

      {!collapsed && (
        <>
          <div className="px-4 py-3 border-b border-gray-800 flex items-center gap-2">
            <BookOpen size={20} className="text-blue-400" />
            <span className="text-base font-bold text-blue-300 tracking-tight">
              Story Settings
            </span>
          </div>
          <div className="px-4 py-3">
            <StoryConfig
              settings={settings}
              editable={editable}
              isLoading={isLoading}
              onChange={onChange}
              isMobileTopBar={true}
            />
            {editable && (
              <div className="flex items-center gap-2 mt-3 text-gray-400 text-xs">
                <Settings2 size={14} />
                <span>Customize your adventure before starting the game.</span>
              </div>
            )}
          </div>
        </>
      )}

      {collapsed && (
        <div className="px-4 py-2 flex items-center gap-2">
          <BookOpen size={18} className="text-blue-400" />
          <span className="text-sm font-medium text-blue-300">
            Story Settings
          </span>
        </div>
      )}
    </div>
  );

  // Desktop/tablet sidebar layout (≥ 768px)
  const desktopSidebar = (
    <aside
      className={`hidden md:flex transition-all duration-300 ${
        collapsed ? "w-12 min-w-[48px] overflow-hidden" : "w-96"
      } px-0 py-4 border-r flex-col h-full shadow-lg bg-gradient-to-b from-gray-900 to-gray-800 relative`}
    >
      <button
        type="button"
        className={`absolute top-4 z-20 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-full p-2 shadow focus:outline-none transition-all duration-300 ${
          collapsed ? "right-2" : "right-2"
        }`}
        title={collapsed ? "Show sidebar" : "Hide sidebar"}
        onClick={() => setCollapsed((c) => !c)}
      >
        {collapsed ? (
          <BookOpen size={20} />
        ) : (
          <span className="text-lg">&laquo;</span>
        )}
      </button>
      <div className="sticky top-0 z-10 bg-gray-900 px-6 pb-2 pt-4 border-b border-gray-800 flex items-center gap-2">
        {!collapsed && <BookOpen size={22} className="text-blue-400" />}
        {!collapsed && (
          <span className="text-lg font-bold text-blue-300 tracking-tight">
            Story Settings
          </span>
        )}
      </div>
      {!collapsed && (
        <div className="flex-1 overflow-y-auto px-4 pt-4">
          <div className="rounded-xl text-sm bg-gray-800 shadow-sm p-3 border border-gray-700">
            <StoryConfig
              settings={settings}
              editable={editable}
              isLoading={isLoading}
              onChange={onChange}
              isMobileTopBar={false}
            />
          </div>
          {editable && (
            <div className="flex items-center gap-2 mt-4 text-gray-400 text-xs">
              <Settings2 size={16} />
              <span>Customize your adventure before starting the game.</span>
            </div>
          )}
        </div>
      )}
    </aside>
  );

  return (
    <>
      {mobileTopBar}
      {desktopSidebar}
    </>
  );
}
