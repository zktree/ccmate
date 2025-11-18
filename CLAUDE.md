# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CC Mate is a utools plugin for managing Claude Code configuration files. It provides a UI to view, edit, and backup various Claude Code configuration files, manage MCP servers, track usage statistics, and edit memory files.

**Core Features:**
- Multi-configuration management and switching
- MCP (Model Context Protocol) server management
- Claude Code Agents and Commands management
- CLAUDE.md memory file editing
- Usage statistics analysis with charts
- Cross-platform support (macOS, Windows, Linux)

## Tech Stack

- **Frontend**: React 19 with TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS v3 with PostCSS
- **UI Components**: shadcn/ui components (Radix UI based)
- **Data Fetching**: @tanstack/react-query v5
- **Forms**: react-hook-form with zod validation
- **Routing**: react-router-dom v7
- **Code Editor**: CodeMirror 4
- **Charts**: recharts, @tremor/react
- **i18n**: i18next (en, zh, ja, fr)
- **Package Manager**: pnpm (required)

## Development Commands

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Build and pack utools plugin
pnpm build:utools

# Pack utools plugin only (after build)
pnpm pack

# Check TypeScript errors
pnpm tsc --noEmit
```

## Architecture

### Frontend Structure
```
src/
├── main.tsx              # App entry with QueryClient, theme, i18n setup
├── router.tsx            # React Router route definitions
├── tw.css                # Tailwind CSS global styles
├── components/
│   ├── Layout.tsx        # Main layout (sidebar + content)
│   ├── UtoolsLifecycle.tsx  # utools plugin lifecycle management
│   └── ui/               # shadcn/ui components
├── pages/                # Page components
├── lib/
│   ├── query.ts          # React Query hooks and API calls
│   ├── utools-adapter.ts # Bridge from Tauri invoke to window.services
│   ├── utools-dialog.ts  # Dialog and URL opener utilities
│   └── utils.ts          # Utility functions
└── i18n/locales/         # Translation files (en, zh, ja, fr)
```

### Backend Structure (Node.js Preload)
```
public/
├── plugin.json           # utools plugin manifest
├── preload/
│   ├── services.js       # Node.js services exposed via window.services
│   └── package.json      # CommonJS declaration for preload
└── logo.png              # Plugin icon
```

### Key Configuration Types
- `user` - `~/.claude/settings.json`
- `enterprise_macos/linux/windows` - System-wide managed settings
- `mcp_macos/linux/windows` - System-wide MCP configurations

### Data Flow
1. React Query hooks in `src/lib/query.ts` call `invoke()` from `utools-adapter.ts`
2. `utools-adapter.ts` translates Tauri-style snake_case commands to camelCase
3. `window.services` (preload) handles file I/O via Node.js APIs
4. Frontend displays data with React Query caching and mutations

### Plugin Features (plugin.json)
- `ccmate` - Main entry, opens config switcher
- `ccmate_configs` - Quick config switch
- `ccmate_mcp` - MCP server management
- `ccmate_usage` - Usage statistics
- `ccmate_memory` - Memory file editing

## Code Principles

- Use functional components and hooks
- Do not use `export default` to export components
- Place React Query/mutation logic in `src/lib/query.ts`
- Write preload services in `public/preload/services.js` with camelCase names
- Do not separate components into smaller files unless explicitly requested
- Use `pnpm tsc --noEmit` to check TypeScript errors

## Important Notes

- **Chromium 91 compatibility**: utools uses Chromium 91, so avoid modern CSS features like `oklch()` colors
- **Tailwind v3**: Using v3 for browser compatibility (not v4)
- **Preload CommonJS**: `public/preload/` uses CommonJS (`require`) despite project being ES modules
- The app backs up existing Claude configs on first run to `~/.ccconfig/claude_backup/`
- Enterprise config files are read-only
- JSON validation is performed client-side before saving
- DO NOT use `--yes` for shadcn/ui components installation

## utools Plugin Development

### Development Port
Development server runs on port 5173. Update `plugin.json` if port changes:
```json
"development": {
  "main": "http://localhost:5173"
}
```

### Services API Pattern
Services follow this pattern in preload:
```javascript
// public/preload/services.js
exports.getStores = function() { /* ... */ }
exports.createConfig = function(id, title, settings) { /* ... */ }
```

Accessed via adapter:
```typescript
// src/lib/utools-adapter.ts
invoke("get_stores")        // → window.services.getStores()
invoke("create_config", {id, title, settings})  // → window.services.createConfig(id, title, settings)
```

### Dialog and External URLs
Use `src/lib/utools-dialog.ts` instead of Tauri plugins:
```typescript
import { ask, message, openUrl } from "@/lib/utools-dialog";
```

## Use exa by Default
Always use exa when I need code generation, library installation, setup or configuration steps, or library/API documentation. This means you should automatically use the exa MCP tools to get library docs without me having to explicitly ask.
