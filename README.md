<p align="center">
  <img src="public/globe.svg" alt="Story Game AI Logo" width="120" />
</p>

# 🧙‍♂️ Story Game AI

<p align="center">
  <b>Interactive AI-powered storytelling game</b><br>
  <i>Generate stories and images, make choices, and shape your adventure!</i>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-13+-blue?logo=nextdotjs" />
  <img src="https://img.shields.io/badge/TypeScript-4+-blue?logo=typescript" />
  <img src="https://img.shields.io/badge/pnpm-workspace-yellow?logo=pnpm" />
  <img src="https://img.shields.io/badge/License-MIT-green" />
</p>

---

Story Game AI is an interactive web application that generates stories and images using AI. Built with Next.js and TypeScript, it features a modular component structure for easy extension and customization.

## ✨ Features

| Feature                                  | Description                                                          |
| ---------------------------------------- | -------------------------------------------------------------------- |
| 📝 **AI Story Generation**               | Create dynamic stories based on user input using advanced AI models  |
| 🖼️ **AI Image Generation**               | Generate images to accompany stories                                 |
| 🎮 **Game-like Interaction**             | Make choices and interact with the story as it unfolds               |
| 🧩 **Component-Based Architecture**      | Modular React components for UI, game logic, and story configuration |
| ⚙️ **Customizable Story Configurations** | Easily adjust story settings and parameters                          |
| 💎 **Modern UI**                         | Clean, responsive design with reusable UI elements                   |

## 🗂️ Project Structure

```text
biome.json                # Biome configuration
components.json           # Component registry/config
next-env.d.ts             # Next.js environment types
next.config.ts            # Next.js configuration
package.json              # Project dependencies and scripts
pnpm-lock.yaml            # pnpm lock file
pnpm-workspace.yaml       # pnpm workspace config
postcss.config.mjs        # PostCSS configuration
tsconfig.json             # TypeScript configuration
public/                   # Static assets (SVGs, icons)
src/
  app/
    favicon.ico           # App icon
    globals.css           # Global styles
    layout.tsx            # Main layout
    page.tsx              # Main page
    api/
      generate-image/     # API route for image generation
      generate-story/     # API route for story generation
    components/           # App-specific components
    hooks/                # Custom React hooks
  components/             # Shared UI and logic components
    ui/                   # Reusable UI elements
  lib/                    # Utility functions and constants
  types/                  # TypeScript type definitions
```

## 🧩 Key Components

- **src/app/components/**: Game-specific components (input, loader, message, sidebar, story config)
- **src/components/**: Shared components (actions, branch, code-block, conversation, image, loader, message, prompt-input, reasoning, response, sources, suggestion, task, tool, web-preview)
- **src/components/ui/**: UI primitives (avatar, badge, button, carousel, collapsible, hover-card, input, scroll-area, select, textarea, tooltip)
- **src/lib/**: Utility functions, constants, and prompts
- **src/types/**: Type definitions for game and settings

## 🔌 API Routes

- **/api/generate-story/**: Handles story generation requests
- **/api/generate-image/**: Handles image generation requests

## 🚀 Getting Started

### Prerequisites

- Node.js (18+ recommended)
- pnpm (preferred package manager)

### Installation

```bash
pnpm install
```

### Running the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

### Building for Production

```bash
pnpm build
```

### Linting & Formatting

```bash
pnpm lint
pnpm format
```

## 🛠️ Customization

- Modify story/game logic in `src/app/components/` and `src/lib/`
- Add new UI elements in `src/components/ui/`
- Update API logic in `src/app/api/`

## 🤝 Contributing

Contributions are welcome! Please open issues or submit pull requests for improvements and new features.

## 📄 License

This project is licensed under the MIT License.
