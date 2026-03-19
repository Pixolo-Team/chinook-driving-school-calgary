# AGENTS.md

## Purpose

This file defines **strict coding rules and execution behavior** for AI agents (Codex).

All instructions are **mandatory**.
If any rule is violated, the output is **incorrect even if it works**.

---

## Core Behavior

- Follow existing repository patterns before writing code
- Reuse existing components and services
- Do not introduce new patterns
- Do not guess missing context → ask instead
- Keep changes minimal and consistent

---

## Project Structure

- Follow the existing folder structure strictly
- Do not create new directories unless necessary
- Place files in the same locations as similar features

---

## Imports

- Always use alias: `@/`
- Relative imports are forbidden

```ts
import { getTournamentsRequest } from "@/services/tournament.service";
```

---

## File Naming

- Use kebab-case for all files
- Exception: `.astro` components may use PascalCase

Examples:

- `tournament.service.ts`
- `tournament-card.astro`

---

## Function Naming

- Must start with a verb
- Must use camelCase
- Must clearly describe the action

Examples:

- `getTournamentsRequest()`
- `createTournamentService()`

---

## API / Request Functions

All API / DB / external calls must end with:

```
Request
```

---

## Service Layer

- Business logic must exist only in service files
- Service functions must end with:

```
Service
```

- Services must never interact with UI components

---

## Data Types

All types must end with:

```
Data
```

```ts
interface TournamentData {}
```

---

## JSDoc

All exported functions must include a JSDoc comment.

```ts
/**
 * Fetches tournaments with filters applied.
 */
```

---

## Comments

- Explain WHY, not WHAT
- Do not add redundant comments

---

## Console Logs

- Forbidden in final code
- Remove all console statements before completion

---

## Error Handling

- Never swallow errors
- Always return structured errors or throw

```ts
return { data: null, error };
```

---

## Constants

- Do not hardcode reusable values
- Use:

```
src/constants
src/config
src/globals
```

---

## Astro Rules

### Images

Always use:

```ts
import { Image } from "astro:assets";
```

Never use `<img />`.

---

### Icons

- Use `astro-icon`
- Store icons in `src/icons`
- No inline SVG
- No external icon libraries

---

### Hydration

- Default: server-rendered
- Use hydration only when necessary

```astro
<SearchBar client:load />
```

---

### Data Fetching

Fetch data in frontmatter:

```astro
---
const { data } = await getTournamentsRequest();
---
```

---

## TailwindCSS Rules

- Use Tailwind utility classes only
- Use theme tokens (`bg-blue-500`, `text-n-900`)
- Do not use `var()`
- Avoid arbitrary values
- Use predefined radius (`rounded-lg`, `rounded-xl`)
- Use responsive utilities (`sm`, `md`, `lg`, `xl`)

---

## Figma Implementation Rules

When implementing UI:

- Analyze Figma frames (Desktop, Tablet, Mobile)
- Follow existing layout patterns
- Reuse existing components
- Match spacing, typography, and structure
- Follow Figma layer hierarchy exactly
- Do not introduce new design patterns

---

## Section Integration

After creating a section:

- Place it in the correct folder
- Import it into the correct page
- Follow existing rendering patterns

---

## Required Output (for UI tasks)

Always return:

- section component
- reusable components (if any)
- page integration update

---

## Forbidden

Do NOT:

- add console logs
- leave unused variables
- introduce new architecture
- hardcode reusable values
- use arbitrary Tailwind values unnecessarily
- use inline SVGs
- overuse hydration

---

## Execution Rule

Before writing code:

1. Inspect similar files in the repository
2. Match their structure and patterns
3. Reuse existing logic when possible

---

## Final Rule

If the generated code does not follow these rules, it is **invalid**.
