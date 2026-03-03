# Headless Primitives

A headless TypeScript library providing UI primitives with full modern accessibility support (WCAG 2.2 AA).

## Overview

This library delivers unstyled, accessible building blocks that follow Radix UI's API conventions. Primitives handle semantics, keyboard interaction, focus management, and ARIA—consumers provide all styling.

## Quick Start

```bash
pnpm install
pnpm build
pnpm test
pnpm dev  # Start docs app
```

## Project Structure

- `packages/headless-primitives` — Core library (`@headless-primitives/core`)
- `apps/docs` — Fumadocs documentation site

## Workspace Rules

See `.cursor/rules/` for:

- **headless-primitive-props.mdc** — Props API (Radix-style, no React Aria naming)
- **headless-a11y-primitives.mdc** — WCAG 2.2 AA, WAI-ARIA patterns
- **fumadocs.mdc** — Documentation standards

## License

MIT
