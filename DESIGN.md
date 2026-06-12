## Overview

Mirama's design language is quietly editorial and deliberately focused. Two standout colors drive all brand expression: **Lava 600** (`#FF3621`) for vibrant interactive pops and primary CTAs, and **Navy 800** (`#1B3139`) for structural dark surfaces. Everything else is neutral — Oat surfaces and White canvas let both standbouts read without noise.

Color emphasis comes from **surface contrast**, not type weight. Headlines never exceed weight 500. Large backgrounds use Navy, Oat, or White. Lava appears as pops: CTAs, active indicators, focused inputs, accent chips. Never as a large background fill.

**Key Characteristics:**
- Primary CTA is Lava 600 (`#FF3621`) with white text — bold, warm, and final.
- Dark surfaces (nav, headers, footers, save bars) use Navy 800 (`#1B3139`) as the structural anchor.
- Page canvas is White (`#ffffff`) or Oat Light (`#F9F7F4`). Section backgrounds step to Oat Medium (`#EEEDE9`).
- Lava creates pops, not fills. Never use Lava as a large background surface.
- Form pages use a fixed/sticky Navy 800 save bar at the bottom — never a floating inline save button.
- Border radius is hierarchical: 12px for cards and primary CTAs, 10px for secondary content, 6px for inputs.

## Colors

### Brand Standbouts
- **Lava 600** (`--color-lava` — `#FF3621`): Primary standout. CTAs, active state indicators, notification badges, focus rings, interactive accents. Always white text on Lava.
- **Navy 800** (`--color-navy` — `#1B3139`): Secondary standout and structural anchor. Dark nav bars, page bookend headers/footers, sticky save bars, card header bands, sidebar. Always Oat Light or white text on Navy.

### Surface
- **White** (`--color-canvas` — `#ffffff`): Default page canvas. The floor of every editorial body.
- **Oat Light** (`--color-surface-soft` — `#F9F7F4`): Sidebar background, secondary card surfaces, input fields.
- **Oat Medium** (`--color-surface-medium` — `#EEEDE9`): Section bands, hover backgrounds, muted card surfaces.
- **Gray Lines** (`--color-hairline` — `#DCE0E2`): 1px borders for inputs, table dividers, secondary button outlines.

### Text
- **Navy / Ink** (`--color-ink` — `#1B3139`): Strongest text. h1/h2 display, primary body. Navy IS the ink color.
- **Gray Navigation** (`--color-body-text` — `#303F47`): Default running-text and nav items.
- **Gray Text** (`--color-muted-foreground` — `#5A6F77`): Captions, breadcrumbs, meta text.
- **On Lava / On Navy** (`--color-on-primary` — `#ffffff`): Text on Lava CTAs and all Navy surfaces.

### Extended Palette (Functional Use Only)
Use only when semantic clarity requires — status states, data visualization, contextual badges. Never as decorative surfaces.

- **Lava 500** (`#FF5F46`): Hover state on Lava 600.
- **Lava 700** (`#BD2B26`): Active/pressed state on Lava 600.
- **Navy 700** (`#143D4A`): Elevated panel within Navy surfaces (dark mode cards, popovers).
- **Navy 900** (`#0B2026`): Deepest dark background (dark mode page background).
- **Green 600** (`#00A972`): Success indicators, save-state dots.
- **Green 500** (`#42BA91`): Success border/outline variant.
- **Yellow 600** (`#FFAB00`): Warning indicators.
- **Blue 600** (`#2272B4`): Info badges, inline body links.
- **Blue 500** (`#4299E0`): Focus ring variant, info border.
- **Maroon 600** (`#98102A`): Destructive actions.

### Semantic
- **Link** (`--color-link` — `#2272B4`): Inline body links. Blue 600. Darkens to Blue 700 (`#0E538B`) on press.
- **Success** (`--color-success` — `#00A972`): Confirmation indicators. Green 600.
- **Info Border** (`--color-info-border` — `#4299E0`): Focused input outlines. Blue 500.
- **Destructive**: Maroon 600 (`#98102A`).

## Typography

### Font Family
The system runs **DM Sans** for UI text (app surfaces) and falls back to `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif`. Inter is used for data-dense surfaces (tables, monospace values).

### Hierarchy

| Token | Size | Weight | Use |
|---|---|---|---|
| `display-xl` | 48px | 500 | Page hero h1 — landing/marketing |
| `display-lg` | 40px | 400 | Section h1 |
| `display-md` | 32px | 400 | Feature section h2 |
| `title-lg` | 24px | 400 | Portal greeting headline |
| `title-md` | 20px | 400 | Sub-section titles |
| `title-sm` | 18px | 500 | Card titles |
| `label-md` | 16px | 500 | List labels, button text |
| `body-md` | 14px | 400 | Body copy, form fields, nav items |
| `caption` | 12px | 400–500 | Meta text, badge text, timestamps |
| `legal` | 11px | 600 | Legal/system-required surfaces only |

### Principles
Weight 400 for display sizes — a 40px heading is **not bold**. Emphasis comes from size, color contrast, and surface depth. Where weight is needed, use 500 (sub-titles, buttons, card titles). Weight 600 only on legal/system surfaces. Never use 700+ in the editorial or app body.

## Layout

### Spacing System
- **Base unit:** 4px. All spacing snaps to 4-multiples.
- **Tokens:** `xxs` 4px · `xs` 8px · `sm` 12px · `md` 16px · `lg` 24px · `xl` 32px · `xxl` 48px · `section` 96px.
- **App pages:** `px-6 md:px-10` horizontal, `py-14` vertical for main content areas.
- **Card internal padding:** `p-6` standard, `px-6 py-4` for Navy card header bands.
- **Section rhythm:** Navy bookend → White canvas content → card clusters → White → Navy bookend.

### Grid & Container
- **Max content width:** `max-w-5xl` (80rem) centered for portal/settings pages. `max-w-7xl` for full-width data tables.
- **Card grids:** `grid-cols-3` at desktop for org portal cards, `grid-cols-4` for secondary portal cards. Collapse to `grid-cols-2` at tablet, `grid-cols-1` at mobile.
- **Settings sections:** single-column, full-width cards stacked with `space-y-4`.

### Whitespace Philosophy
Whitespace is the dominant atmospheric tool. Let sections breathe — `py-14` between content areas. The page should feel calm between its Navy surface moments.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| Flat | No shadow, no border | Navy surface bands (color IS the depth) |
| Soft hairline | 1px `--color-hairline` border | Inputs, table dividers, secondary buttons |
| Card resting | `shadow-sm` + `border border-border/50` | White canvas cards in a white page context |
| Card hover | `shadow-lg` + `-translate-y-1` | Org portal cards, secondary portal cards on hover |
| Sticky bar | Navy 800, no shadow | Fixed save bars — Navy surface provides contrast against White canvas above |

**Depth philosophy:** Color-block first, shadow second. Navy surface cards carry depth through color contrast alone — add no shadow to Navy cards. White-on-white cards use `shadow-sm` + `border`. On hover, white cards lift with `-translate-y-1 shadow-lg`.

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `rounded-xs` | 2px | Legal/system-required CTAs |
| `rounded-sm` | 6px | Text inputs, small inline badges |
| `rounded-md` | 10px | Secondary content cards, article cards |
| `rounded-lg` | 12px | Primary cards, portal cards, settings cards, primary CTAs |
| `rounded-xl` | 16px | Full-surface portal cards |
| `rounded-full` | 9999px | Avatars, circular icon buttons |

## Components

### Page Structure

**`page-header`** — A 64px-tall bar pinned to the top of every app page (inside the sidebar inset). Icon + title + optional description. Uses `border-b border-border/50`. No uppercase, no heavy weight — title is `text-base font-medium`. Children slot on the right for action buttons.

**`portal-page`** — Full-page chooser layout. Navy 800 header (64px) with white Mirama wordmark + sign-out. White canvas content area with `max-w-5xl` centered. Navy 800 footer. This dark→white→dark bookend rhythm is mandatory for standalone full-page surfaces (auth, portal, onboarding).

**`sticky-save-bar`** — Fixed Navy 800 bar at the bottom of form pages. `sticky bottom-0`, escapes parent padding with negative margin. Left: status indicator (pulsing dot + message) — Lava 600 dot when dirty, Green 600 dot when saved. Right: white bg / Navy text button.

### Buttons

**`button-primary`** — `bg-lava text-white`, `rounded-lg` (12px), `h-11 px-6 text-sm`. The Lava 600 action button. One per viewport. Hover: Lava 500 (`#FF5F46`). Active: Lava 700 (`#BD2B26`).

**`button-secondary`** — White with Gray Lines outline. `bg-canvas text-ink border border-border`. Used alongside `button-primary` as the less-committed pair. On Navy surfaces, white bg + Navy text is correct.

**`button-secondary-on-dark`** — Same as `button-secondary` but used on Navy 800 surfaces (sticky save bars, dark bookends). White bg + Navy ink text — never invert to a translucent on-dark style.

**`button-tertiary`** — Blue 600 (`#2272B4`) bg, white text. For constructive secondary actions (Create, Add) where the primary Lava CTA is already used.

**`button-ghost`** — `hover:bg-hover text-text-secondary`. For icon-only or low-priority actions.

### Cards & Containers

**`org-portal-card`** — Navy 800 full-surface card in the portal chooser. `rounded-xl` (16px). No border, no shadow (color IS the depth). Hover: `-translate-y-1 shadow-xl`. Contains: initial letter chip (Lava 600 bg, white text), org name (`text-base font-medium text-white`), slug (mono, Oat Light/60), footer divider with member/project counts. All org cards use Navy 800 — consistency over cycling.

**`secondary-portal-card`** — Oat Medium full-surface card for non-org portals. `rounded-xl`. Same hover behavior. Contains: icon chip (Navy 800 bg, white icon), label (Navy 800 text), description (Gray Text), arrow (active) or lock + Soon badge (coming soon). All secondary portal cards use Oat Medium — differentiated from Navy org cards.

**`settings-card`** — White canvas card with Navy 800 full-bleed header band. Parent card: `overflow-hidden rounded-lg`. `CardHeader`: Navy 800 bg, Oat Light text, `px-6 py-4`. `CardContent`: white, `pt-5`. All settings section cards use Navy 800 header — consistent structural identity.

**`hero-band`** — Full-page-width white-canvas hero. No gradient, no decorative backdrop. Headline + sub-headline + Lava 600 primary CTA + secondary button in `section` (96px) of whitespace.

### Inputs & Forms

**`text-input`** — `bg-canvas text-ink`, `rounded-sm` (6px), `h-10 px-3`, Gray Lines border. Focus: border recolors to Blue 500 (`#4299E0`), ring to Lava 600.

**`form-section`** — Each logical group of fields lives in a `settings-card` with a Navy header. Never put bare fields on the page without a section card container.

### Navigation

**`app-sidebar`** — Oat Light bg in light mode, Navy 700 bg in dark mode. Gray Lines hairline dividers. Lava 600 active indicator: `h-0.5` top bar + `w-0.5` left bar on active item + Lava/10 background tint.

**`sidebar-group-label`** — `text-xs font-medium text-sidebar-foreground/70`. No uppercase.

**`main-nav-item`** — Active: `bg-lava/10 text-lava` with left `w-0.5 bg-lava` indicator bar. Inactive: `text-sidebar-foreground`.

**`data-table-header`** — `bg-muted/60 border-b border-border/60`. Column head text: `text-xs font-medium text-muted-foreground` — no uppercase, no tracking.

## Do's and Don'ts

### Do
- **Use Navy 800 as the structural anchor** for all dark surfaces — bookend headers/footers, sidebars, save bars, settings card headers. Consistent, not varied.
- **Use Lava 600 as the single vibrant pop** — CTAs, active indicators, focus rings, notification dots, accent chips within cards.
- Use Oat Light and Oat Medium for soft surfaces — sidebar bg, section bands, hover states.
- Use `--color-surface-dark` (Navy 800) as bookend header and footer on standalone pages (portal, auth, onboarding). This is the page's structural anchor.
- Use sticky Navy 800 save bars on all multi-field form pages. Never leave a floating save button inside the form scroll area.
- Keep `button-primary` Lava 600. Mirama's primary CTA is Lava, not Navy or link-blue.
- Trust whitespace between Navy surface moments. White canvas resets are mandatory between dark bands.
- Use `overflow-hidden` on any card that has a colored `CardHeader` band so the color clips to the card's border radius.
- Keep `rounded-xl` (16px) for full-surface portal cards, `rounded-lg` (12px) for mixed cards (Navy header + white body).
- Hover on Navy cards: `-translate-y-1 shadow-xl`.

### Don't
- Don't use Lava as a large background surface. It is a pop color — the CTA, the dot, the chip, the active bar. Never a full card or section band.
- Don't cycle multiple colors across repeated items (no coral/forest/peach/mint pattern). Consistency over variety.
- Don't make link Blue 600 the primary CTA color. It is the link and tertiary action color only.
- Don't add gradients, mesh backgrounds, or aurora effects to page heroes. White canvas is intentional.
- Don't bold display-weight type. `display-xl` and above are intentionally 400–500 weight.
- Don't add a save button floating inside a form's scroll content. It belongs in the `sticky-save-bar`.
- Don't use `uppercase` or `tracking-widest` on UI labels, column headers, or card titles.
- Don't shadow Navy cards. The Navy surface color provides all needed depth. `shadow-sm` only on white-bg cards within a white page.
- Don't introduce accent colors outside Lava 600 and Navy 800 for branding surfaces. Extended palette is for semantic states only.

## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Mobile | < 640px | Single-column card grids; sidebar collapses to icon-only; portal cards stack; sticky save bar spans full width |
| Tablet | 640–1024px | 2-up card grids; secondary portal cards 2-up; sidebar may collapse |
| Desktop | 1024–1440px | 3-up org cards, 4-up secondary portals; full sidebar |
| Wide | > 1440px | Same as Desktop, content max-width caps at `max-w-5xl`, outer margins grow |

### Touch Targets
- `button-primary` and siblings: 44px minimum height (h-11 = 44px).
- `button-ghost` icon-only: h-10 w-10 (40px).
- `text-input` height: h-10 (40px).

### Collapsing Strategy
- Sidebar collapses to icon-only at smaller breakpoints — content area expands fully.
- Card grids reduce columns rather than scaling cards down.
- Sticky save bar always spans the full content area width (sidebar excluded) using negative margin to escape parent padding.

## Iteration Guide

1. Focus on ONE component at a time. Reference its key (`org-portal-card`, `settings-card`).
2. Every new page needs a color plan before implementation: identify which sections are Navy bookends, which are White canvas, and where Lava pops appear.
3. New portal or settings cards use Navy 800 header — no new colors introduced.
4. New form pages must include `sticky-save-bar`. Never ship a form without it.
5. New section cards follow the `settings-card` pattern: `overflow-hidden` card, Navy 800 header band, white body.
6. When in doubt about emphasis: bigger type before bolder type, Navy surface before any other depth treatment.
7. Run `yarn lint` after every change — Biome enforces import order and Tailwind canonical class names.

## Known Gaps

- Animation and transition timings are not yet formalized as tokens — current convention is `duration-200` for card hover, `duration-300` for sidebar transitions.
- The sticky save bar pattern is implemented for settings pages; other multi-step forms (onboarding, org creation) should adopt it when built.
- Logo upload in settings is currently a placeholder (S3 integration pending). The Dropzone component is in place but upload handler returns a stub.
- Components previously using the multi-color signature cycle (coral, forest, peach, mint, yellow, mustard) need migration to the Navy 800 header pattern.
