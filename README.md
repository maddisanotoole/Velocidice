# VelociDice

[Play Farkle in your browser](https://velocidice.vercel.app/)

VelociDice is a browser-based Farkle-style dice game built with React, TypeScript, Vite, and Tailwind CSS. Players take turns selecting scoring dice, holding points, risking rerolls, and banking their round score before a Farkle wipes out the unbanked points.

For scoring combinations and turn rules, see [RULES.md](src/docs/RULES.md).

## Getting Started

Install dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

## Test

Run the Vitest test suite in watch mode:

```bash
npm run test
```

Run tests once:

```bash
npm run test -- --run
```

## Lint

```bash
npm run lint
```

## Build

Create a production build:

```bash
npm run build
```

## Preview Build

Preview the production build locally:

```bash
npm run preview
```

## Roadmap

Phase 3:

- Mobile responsiveness (Done)
- Computer turn ai
- Animations

Phase 4:

- Sound effects
- Statistics
- Local save data
- Difficulty settings
