# Contributing to Cosmos Design System

Thank you for your interest in contributing to Cosmos DS! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Creating Components](#creating-components)
- [Testing](#testing)
- [Code Style](#code-style)
- [Pull Request Process](#pull-request-process)
- [Design Tokens](#design-tokens)
- [Accessibility](#accessibility)

## Code of Conduct

Be respectful, inclusive, and constructive. We are committed to providing a welcoming environment for everyone.

## Getting Started

1. Fork the repository at [github.com/specialkartik1993/Cosmosdesignsystem](https://github.com/specialkartik1993/Cosmosdesignsystem)
2. Clone your fork locally
3. Create a feature branch from `main`
4. Make your changes
5. Submit a pull request

## Development Setup

### Prerequisites

- Node.js >= 18.0.0
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/specialkartik1993/Cosmosdesignsystem.git
cd Cosmosdesignsystem

# Install dependencies
pnpm install

# Start the documentation site
pnpm dev

# Run tests
pnpm test

# Build the component library
pnpm lib:build
```

### Available Scripts

| Script | Description |
|---|---|
| `pnpm dev` | Start development server |
| `pnpm build` | Build the documentation site |
| `pnpm test` | Run all tests once |
| `pnpm test:watch` | Run tests in watch mode |
| `pnpm test:coverage` | Run tests with coverage report |
| `pnpm lib:build` | Build the publishable `@cosmos-ds/react` package |

## Project Structure

```
/
├── packages/
│   └── cosmos-react/         # Publishable npm package config
│       ├── package.json       # @cosmos-ds/react manifest
│       ├── tsup.config.ts     # Library build configuration
│       └── tsconfig.json      # TypeScript config for library
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   └── ui/            # All UI components live here
│   │   │       ├── index.ts   # Barrel export (64 components)
│   │   │       ├── button.tsx
│   │   │       ├── badge.tsx
│   │   │       ├── __tests__/ # Component tests
│   │   │       └── ...
│   │   ├── context/           # Theme & design theme providers
│   │   ├── pages/             # Documentation site pages
│   │   ├── routes.ts          # React Router configuration
│   │   └── App.tsx            # Application entry point
│   ├── styles/
│   │   ├── theme.css          # Design tokens (light & dark)
│   │   ├── fonts.css          # Font imports
│   │   └── index.css          # Global styles
│   └── test/
│       └── setup.ts           # Test setup (jsdom, polyfills)
├── supabase/                  # Backend (Edge Functions)
├── vitest.config.ts           # Test configuration
└── vite.config.ts             # Development server config
```

## Creating Components

### Atomic Design Hierarchy

Cosmos follows atomic design methodology. Place your component in the correct tier:

| Tier | Description | Examples |
|---|---|---|
| **Atoms** | Smallest building blocks | Button, Input, Badge, Avatar |
| **Molecules** | Composed from atoms | Card, Dialog, Tabs, Select |
| **Organisms** | Complex compositions | Table, Navigation, Charts |
| **Enterprise** | Data-heavy components | Data Grid, File Upload |
| **Interactions** | Motion/animation | Parallax, Scroll-Triggered |
| **Cosmic AI** | AI-powered interfaces | Chat, Prompt, Copilot |

### Component Checklist

When creating a new component, ensure it meets these criteria:

- [ ] Written in TypeScript with proper type exports
- [ ] Uses `cn()` utility for className merging
- [ ] Includes `data-slot` attributes for CSS targeting
- [ ] Supports `className` and `ref` forwarding
- [ ] Uses CSS custom properties from `theme.css` for theming
- [ ] Works in both light and dark modes
- [ ] Exported from `src/app/components/ui/index.ts`
- [ ] Has unit tests in `__tests__/` directory
- [ ] Has a documentation page in `src/app/pages/components/`
- [ ] Listed in the sidebar navigation (`Layout.tsx`)
- [ ] Added to route configuration (`routes.ts`)
- [ ] Added to API Reference (`ApiReference.tsx`)
- [ ] Showcase code blocks include `@cosmos-ds/react` import path

### Component Template

```tsx
"use client";

import * as React from "react";
import { cn } from "./utils";

// ----------------------------------------------------------------
// Types
// ----------------------------------------------------------------

interface MyComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "outline";
  size?: "sm" | "md" | "lg";
}

// ----------------------------------------------------------------
// Component
// ----------------------------------------------------------------

const MyComponent = React.forwardRef<HTMLDivElement, MyComponentProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="my-component"
        className={cn(
          "base-classes-here",
          variant === "outline" && "border border-border",
          size === "sm" && "text-sm p-2",
          size === "lg" && "text-lg p-4",
          className
        )}
        {...props}
      />
    );
  }
);
MyComponent.displayName = "MyComponent";

export { MyComponent };
export type { MyComponentProps };
```

## Testing

We use [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/) for component testing.

### Writing Tests

Place test files in `src/app/components/ui/__tests__/` with the naming convention `component-name.test.tsx`.

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MyComponent } from '../my-component';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent>Hello</MyComponent>);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('handles user interaction', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<MyComponent onClick={onClick}>Click</MyComponent>);

    await user.click(screen.getByText('Click'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('applies custom className', () => {
    render(<MyComponent className="custom">Test</MyComponent>);
    expect(screen.getByText('Test')).toHaveClass('custom');
  });
});
```

### Test Conventions

- Test rendering, user interactions, accessibility, and edge cases
- Use `screen` queries (prefer `getByRole`, `getByText`, `getByLabelText`)
- Use `userEvent` over `fireEvent` for realistic interactions
- Mock external dependencies with `vi.fn()` and `vi.mock()`
- Aim for 60%+ code coverage on new components

### Running Tests

```bash
# Run all tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage report
pnpm test:coverage
```

## Code Style

### General Rules

- Use TypeScript for all component files (`.tsx`)
- Use `function` declarations for exported components, arrow functions for internal helpers
- Prefer named exports over default exports for components
- Use `React.forwardRef` for all leaf components
- Include `displayName` for components using `forwardRef`

### CSS & Styling

- Use Tailwind CSS v4 utility classes
- Use design tokens from `theme.css` via `var(--token-name)` for theming
- Use the `cn()` utility (from `utils.ts`) for conditional class merging
- Never use inline styles for themeable properties
- Support both light and dark modes

### Naming Conventions

| Item | Convention | Example |
|---|---|---|
| Component files | kebab-case | `date-range-picker.tsx` |
| Component names | PascalCase | `DateRangePicker` |
| CSS tokens | kebab-case with `--` prefix | `--primary-foreground` |
| Test files | `component.test.tsx` | `button.test.tsx` |
| Documentation pages | PascalCase + Page | `ButtonPage.tsx` |

## Pull Request Process

1. **Branch naming**: Use `feat/component-name`, `fix/issue-description`, or `docs/topic`
2. **Commit messages**: Follow [Conventional Commits](https://www.conventionalcommits.org/)
   - `feat: add DateRangePicker component`
   - `fix: resolve Button disabled state styling`
   - `docs: update API reference for Card component`
   - `test: add Separator test coverage`
3. **PR description**: Include a summary, screenshots (for visual changes), and checklist
4. **Tests**: All tests must pass. Add tests for new components
5. **Review**: At least one maintainer must approve before merge

### PR Template

```markdown
## Summary
Brief description of what this PR does.

## Type
- [ ] New component
- [ ] Bug fix
- [ ] Documentation
- [ ] Refactor
- [ ] Tests

## Checklist
- [ ] Component follows atomic design tier placement
- [ ] TypeScript types are exported
- [ ] Works in light and dark modes
- [ ] Unit tests added/updated
- [ ] Documentation page created/updated
- [ ] Barrel export updated (index.ts)
- [ ] API Reference updated
- [ ] Sidebar navigation updated

## Screenshots
(if applicable)
```

## Design Tokens

All design tokens live in `/src/styles/theme.css`. When adding new tokens:

1. Add to both `:root` (light) and `.dark` blocks
2. Follow the existing naming convention (`--category-name`)
3. Update the Theming page's token map
4. Document in the Token Reference page

### Token Categories

- **Color**: `--primary`, `--secondary`, `--muted`, `--accent`, `--destructive`
- **Typography**: `--font-heading`, `--font-body`, `--font-mono`
- **Shadows**: `--shadow-sm`, `--shadow-md`, `--shadow-lg`, `--shadow-xl`
- **Spacing**: `--space-*` scale (1 through 16)
- **Motion**: `--duration-*`, `--ease-*`
- **AI**: `--ai-primary`, `--ai-gradient-*`, `--ai-confidence-*`

## Accessibility

Every component must meet WCAG 2.1 AA standards:

- Use semantic HTML elements
- Include proper ARIA attributes where needed
- Support keyboard navigation (Tab, Enter, Escape, Arrow keys)
- Maintain a minimum 4.5:1 contrast ratio for text
- Provide visible focus indicators
- Include `aria-label` or `aria-labelledby` for icon-only controls
- Test with screen readers (VoiceOver, NVDA)

### Accessibility Testing

- Use the built-in Accessibility Audit page (`/accessibility`) to verify
- Run axe-core or Lighthouse audits on new component pages
- Test keyboard-only navigation through all interactive states

---

Questions? Open an issue or reach out to the maintainers. We appreciate every contribution, whether it's a typo fix or a new component!
