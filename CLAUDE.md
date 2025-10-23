# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run dev` - Start development server with Turbo
- `npm run build` - Build production application
- `npm run start` - Start production server

### Code Quality
- `npm run check` - Run all checks (format, types, and lint)
- `npm run check:format` - Check code formatting with Prettier
- `npm run check:types` - Run TypeScript compiler without emitting files
- `npm run check:lint` - Run ESLint

### Code Fixes
- `npm run fix:format` - Format code with Prettier
- `npm run fix:lint` - Run ESLint with auto-fix

## Architecture

This is a **T3 Stack** Next.js application using the App Router with the following key technologies:

### Core Stack
- **Next.js 15** with App Router (`src/app/` directory)
- **TypeScript** with strict configuration
- **tRPC** for type-safe API routes
- **TanStack Query** for data fetching and caching
- **Tailwind CSS** for styling
- **shadcn/ui** components with Radix UI primitives
- **Zod** for schema validation

### Project Structure
```
src/
├── app/                    # Next.js App Router pages and layouts
│   ├── api/trpc/[trpc]/   # tRPC API handler
│   ├── _components/       # App-specific components
│   └── layout.tsx         # Root layout
├── server/api/            # tRPC server configuration
│   ├── routers/           # API route handlers
│   ├── root.ts           # Main router configuration
│   └── trpc.ts           # tRPC setup and context
├── trpc/                  # Client-side tRPC configuration
├── styles/                # Global styles
└── env.js                 # Environment variable validation
```

### Key Architecture Patterns

**tRPC Configuration:**
- Server context created in `src/server/api/trpc.ts`
- Main app router in `src/server/api/root.ts` - add new routers here
- Individual routers in `src/server/api/routers/`
- Client configuration in `src/trpc/`

**Environment Variables:**
- Managed through `@t3-oss/env-nextjs` in `src/env.js`
- Server and client variables with Zod validation
- Add new env vars to the schema before using

**Path Aliases:**
- `~/*` maps to `./src/*` (configured in `tsconfig.json`)

**UI Components:**
- Uses shadcn/ui component system built on Radix UI primitives
- Components use `class-variance-authority` for variant management
- Styling utilities: `clsx`, `tailwind-merge`, and `tw-animate-css`
- Icons provided by `lucide-react`

### Development Notes
- Uses TypeScript with strict mode and `noUncheckedIndexedAccess`
- ESLint configured with Next.js rules
- Prettier with Tailwind CSS plugin for class sorting
- Development includes artificial timing delays in tRPC middleware

# Conventions

## Styles
- Don't use template strings when creating a className, instead prefer the `cn` utility.