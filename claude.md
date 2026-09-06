# CLAUDE.md

# Project Overview
This project is a high-performance Task Management platform specifically designed for creative teams. The core focus is on asset-centric workflows, simplicity, allowing teams to manage rich media attachments, track granular progress on creative iterations, and maintain a seamless bridge between design assets and task completion.

## Tech Stack
- TypeScript: Strict mode; `any` and `unknown` are strictly prohibited.
- Next.js: App Router with Partial Prerendering (PPR) enabled.
- Tailwind CSS: Utility-first styling; no custom CSS.
- Shadcn UI: Base component library for all UI elements.
- Zod: Schema validation for both API inputs and Forms (via `zodResolver`).
- NextAuth.js v5: Server-side identity management (AWS Cognito + Credentials).
- Biome: Formatter and linter (replaces ESLint/Prettier).

## Commands
- `yarn dev` - Start the development server (Turbopack).
- `yarn build` - Compile the production build.
- `yarn lint` - Format and lint with Biome (auto-fix).

## Architecture

### Directory Layout
```
app/              # Next.js App Router pages
  (app)/          # Protected routes (require auth)
  (public)/       # Public-facing pages
  auth/           # Auth flow pages (login, register, verify)
  api/db/         # REST API routes, e.g. /tenant/:tenantId/organization/:orgId/...
src/              # Client-side code
  components/     # React components (UI + domain-shared)
  modules/        # Feature modules (tenant, organization, project, shared)
  lib/            # Client utilities (Axios api.ts instance at /api/db/)
```

### TypeScript Path Aliases
- `@auth` → `server/auth/auth.ts`
- `@api` → `src/lib/api.ts`
- `@hooks` → `src/modules/shared/hooks/index.ts`
- `@ui/*` → `src/components/ui/*`
- `@src/*` → `src/*`

## Coding Rules

**Component Locality:**
- Page-specific components: same folder as `page.tsx` under `/components` (UI) or `/additional` (helpers).
- Domain-shared components: `src/components/[model]/`.
- One component per file. Every file starts with a comment indicating its filepath.

**Patterns:**
- **Forms**: Always use `zodResolver` with a Zod schema.
- **Tables**: Use the `DataTable` component. Extract columns to a separate file using `columnHelper` style, wrapped in `useMemo`.
- **Data fetching**: Maximize Server Components. Use Server Actions for mutations. Access auth IDs server-side.
- **Functional style**: Always use arrow functions for components and logic.

Do NOT add the route of the component at the top or first line of a files, if you see this remove them for me.

## Partial Prerendering (PPR)
- Wrap dynamic components in `<Suspense>` with a meaningful fallback.
- Push dynamic data fetching (`auth()`, Prisma calls) as deep into the component tree as possible - never `await` at page level if it can be scoped to a child component.
- Isolate slow-moving assets or heavy computations in their own `<Suspense>` boundaries.
