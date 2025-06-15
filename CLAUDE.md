# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Project Overview

Readest is a cross-platform ebook reader built with Next.js 15 (React 19) for
the frontend and Tauri v2 (Rust) for desktop/mobile. It supports macOS,
Windows, Linux, Android, iOS, and Web platforms.

## Essential Commands

### Development

```bash
# Install dependencies (from root)
pnpm install
pnpm --filter @readest/readest-app setup-pdfjs

# Run desktop app in development
pnpm tauri dev

# Run web-only development
pnpm dev-web

# Build for production
pnpm tauri build           # Desktop
pnpm tauri android build   # Android
pnpm tauri ios build       # iOS
```

### Platform-Specific Builds

```bash
pnpm build-win-x64         # Windows x64
pnpm build-win-arm64       # Windows ARM64
pnpm build-linux-x64       # Linux x64
pnpm build-macos-universal # macOS Universal
```

## Architecture

### Repository Structure

- **Monorepo** using pnpm workspaces
- `/apps/readest-app/` - Main application
- `/packages/foliate-js/` - Ebook parsing library (git submodule)
- `/packages/tauri/` - Custom Tauri fork (git submodule)

### Key Technologies

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS + DaisyUI
- **State Management**: Zustand stores in `/src/store/`
- **Desktop/Mobile**: Tauri v2 with custom plugins in `/src-tauri/plugins/`
- **Auth/Storage**: Supabase Auth, AWS S3/Cloudflare R2

### Code Organization

- Routes: `/src/app/` (Next.js app directory)
- Components: `/src/components/`
- Services: `/src/services/`
- Utilities: `/src/utils/`
- Stores: `/src/store/` (Zustand)
- Tauri Plugins: `/src-tauri/plugins/`

### Important Patterns

1. **Static Export** for desktop apps, server-side for web
2. **Unified Codebase** - single codebase for all platforms
3. **Path Aliases** - Use `@/*` for imports from src directory
4. **Platform Detection** - Use utilities in `/src/services/platform.ts`
5. **Custom Tauri Plugins** - Native functionality implemented as Rust plugins

### Key Features to Understand

- Multi-format ebook support (EPUB, MOBI, PDF, etc.)
- Cross-platform synchronization via Supabase
- Text-to-Speech with multiple providers
- Translation services integration
- Annotations and highlights system
- Library management with virtual scrolling

## Development Notes

- Node.js v22+ required (use nvm)
- Git submodules must be initialized
- No test framework currently configured
- ESLint and TypeScript strict mode enforced
- Custom CSP implementation for security
