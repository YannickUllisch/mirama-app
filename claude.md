# Project Overview
This project is a high-performance Task Management platform specifically designed for creative teams. The core focus is on asset-centric workflows, allowing teams to manage rich media attachments, track granular progress on creative iterations, and maintain a seamless bridge between design assets and task completion.

## Tech Stack
- TypeScript: Strict mode; any and unknown are strictly prohibited.
- Next.js: App Router with Partial Prerendering (PPR) enabled.
- Tailwind CSS: Utility-first styling; no custom CSS.
- Shadcn UI: Base component library for all UI elements.
- Prisma & PostgreSQL: Type-safe ORM and relational database.
- Zod: Schema validation for both API inputs and Forms (via zodResolver).
- NextAuth.js: Server-side identity management and session handling.

## Architecture
We utilize a Domain-Driven Clean Architecture to keep the codebase maintainable:

- Server Folder: Contains the core business logic, API handlers, and Prisma queries following clean architecture principles.
- Component Locality:
  - Page-Specific: Located within the same folder as the page.tsx for locality. If it is a UI components put it under /components or of it is a page specific helper put it under /additional
  - Domain-Shared: Located in src/components/[model]/ (e.g., src/components/organization/).
- Single Responsibility: Strictly one component per file. Every file must start with a comment indicating its filepath.
- Data Fetching: Maximize Server Components (RSC). Use Server Actions for mutations. Access Auth IDs server-side whenever possible.

## Coding Rules
Functional Style: Always use arrow functions for components and logic.

- Form Pattern: Every form must use zodResolver and Zod validation.
- Table Pattern: Use the DataTable component. Columns must use the columnHelper style, be extracted to a separate file, and wrapped in useMemo.
- Type Safety: Never use any or unknown.
- Client vs. Server: Prefer Server Components (SST). Use 'use client' only when strictly necessary for interactivity.

## Partial Prerendering (PPR) & Efficiency
To achieve effective PPR and maximum performance, follow these strict implementation rules:

- Suspense Wrapping: Always wrap dynamic components (e.g., Task Lists, Asset Grids) in a <Suspense> boundary with a meaningful fallback. This allows the static shell to be served instantly while dynamic data streams in.
- Granular Deferral: Move dynamic data fetching (like auth() or Prisma calls) as deep into the component tree as possible. Do not await data at the page level if it can be awaited inside a scoped component.
- Streaming Boundaries: Ensure that slow-moving creative assets or heavy progress calculations are isolated in their own Suspense boundaries to prevent blocking the rest of the UI.
- Preconnect & Preload: Use Next.js metadata and image priority tags for primary creative assets to optimize the Largest Contentful Paint (LCP).

## Design System
- Shadcn Patterns: Follow standard Shadcn UI patterns.
- Consistency: Use professional, clear text and avoid emojis to maintain a fast-to-read UI.
- Asset Focus: Implementation of progress bars or asset previews must be modularized under the specific domain folder.

Commands
* yarn dev - Start the development server.
* yarn build — Compile the production build.
* yarn prisma generate — Update the Prisma client.
* yarn prisma db push — Sync the database schema.

## Security Checklist

- Tenant isolation: `ScopedDb` injects `tenantId` and `organizationId` if in scope on all queries. Never bypass it.
- IDOR: `withAuth` compares URL path params (`:tenantId`, `:organizationId`) to session values.
- Role enforcement: Set `allowedTenantRoles`/`allowedOrgRoles` explicitly in every `createRoute` call.
- IAM: Fine-grained permissions use `Role` -> `Policy` -> `PolicyStatement`. Check in the features layer for resource-level access.
- Input validation: All external input goes through Zod before reaching any handler.
- No raw SQL: All DB access via Prisma with `ScopedDb`.