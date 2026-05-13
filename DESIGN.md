## Overview

Mirama's design language is quietly editorial but deliberately colorful. The base atmosphere is white canvas, dark ink type, generous whitespace — but brand voltage appears frequently through **signature color surfaces** used as full-bleed card headers, section bands, page bookends, and portal cards. The signature palette is not an accent system; it is a primary expressive tool used throughout both marketing and app surfaces.

Color emphasis comes from **surface contrast**, not type weight. Headlines never exceed weight 500. The near-black primary (`{colors.primary}` — `#181d26`) anchors CTAs, headings, and dark surface bands. Between dark and signature bands, the page reads clean: white canvas, restrained type, breathing room.

**Key Characteristics:**
- Primary CTA is `{colors.primary}` (near-black ink) with white text and `{rounded.lg}` (12px) corners — confident and final.
- Secondary CTA on dark surfaces is `{colors.canvas}` with `{colors.ink}` text — the signature button pair for dark backgrounds.
- Page headers and footers use `{colors.surface-dark}` as bookend surfaces. This creates a dark→white→dark rhythm on key pages (portal chooser, auth pages).
- **Signature colors are mandatory, not decorative.** Every major section card, portal card, or settings section must carry a signature surface. Never leave a page all-neutral.
- Signature colors cycle across repeated items (org cards, section headers, portal cards): coral → forest → peach → mint → yellow → mustard, then loop.
- Card section headers use full-bleed signature color bands clipped by `overflow-hidden` on the parent card. The card body stays white canvas.
- Form pages use a fixed/sticky dark save bar (`{colors.surface-dark}`) at the bottom of the scroll area — never a floating inline save button.
- Border radius is hierarchical: `{rounded.lg}` (12px) for cards and primary CTAs, `{rounded.md}` (10px) for secondary content, `{rounded.sm}` (6px) for inputs.

## Colors

### Brand & Accent
- **Primary** (`{colors.primary}` — #181d26): The dominant brand color. Used for primary CTA background, h1/h2 display type, and `{colors.surface-dark}` bands. Near-black IS the primary — not blue.
- **Primary Active** (`{colors.primary-active}` — #0d1218): Press state on primary buttons.

### Surface
- **Canvas** (`{colors.canvas}` — #ffffff): Default page surface. The floor of every editorial body.
- **Surface Soft** (`{colors.surface-soft}` — #f8fafc): Sidebar background, secondary card surfaces.
- **Surface Strong** (`{colors.surface-strong}` — #e0e2e6): Hover backgrounds, light CTA bands.
- **Surface Dark** (`{colors.surface-dark}` — #181d26): Dark nav bars, page bookend headers/footers, sticky save bars, portal headers. Same hex as `{colors.primary}` — they are the same role at surface vs. type layer.
- **Surface Dark Elevated** (`{colors.surface-dark-elevated}` — #1d1f25): Sidebar background in dark mode, elevated panels within dark surfaces.
- **Hairline** (`{colors.hairline}` — #dddddd): 1px border tone for inputs, table dividers, secondary button outlines.

### Text
- **Ink** (`{colors.ink}` — #181d26): Strongest text. h1/h2 display and primary button text-on-light. Same hex as `{colors.primary}`.
- **Body** (`{colors.body-text}` — #333840): Default running-text color.
- **Muted** (`{colors.muted-foreground}` — #41454d): Captions, breadcrumbs, meta text.
- **Border Strong** (`{colors.border-strong}` — #9297a0): Disabled secondary button outlines.
- **On Primary / On Dark** (`{colors.on-primary}` — #ffffff): Text on primary buttons and all dark surfaces.

### Signature Card Surfaces
These are Mirama's primary brand expression tools. They appear as **full-bleed card header bands, full-surface portal cards, and section intro strips** — not as small accents. Every page should contain at least two signature surfaces.

- **Coral** (`{colors.signature-coral}` — #aa2d00): Dark oxide-red. Used for the first/primary section header and primary org portal cards. White type on coral.
- **Forest** (`{colors.signature-forest}` — #0a2e0e): Deep green. Second section header, second org portal card. White type on forest.
- **Cream** (`{colors.signature-cream}` — #f5e9d4): Warm beige. Third position in cycles. Branding section headers. Ink type on cream.
- **Peach** (`{colors.signature-peach}` — #fcab79): Warm orange. Fourth position. Coming-soon portal cards. Ink type on peach.
- **Mint** (`{colors.signature-mint}` — #a8d8c4): Cool green. Fifth position. Notifications section headers, finance portal. Ink type on mint.
- **Yellow** (`{colors.signature-yellow}` — #f4d35e): Bright warm. Sixth position. Ink type on yellow.
- **Mustard** (`{colors.signature-mustard}` — #d9a441): Rich amber. Seventh position. HR portal. Ink type on mustard.

**Cycle rule:** When rendering a repeated set of colored items (org cards, portal cards, settings sections), assign colors in this order: coral → forest → cream → peach → mint → yellow → mustard → loop. Never render two adjacent items in the same color.

**Text-on-surface rule:**
- Dark surfaces (coral, forest, surface-dark): white text, white/70 subtext, white/20 dividers, white/15 icon bg.
- Light surfaces (cream, peach, mint, yellow, mustard): `{colors.ink}` text, ink/60 subtext, ink/15 dividers, ink/10 icon bg.

### Semantic
- **Link** (`{colors.link}` — #1b61c9): Inline body links. Darker on press to `{colors.link-active}` (#1a3866).
- **Info** (`{colors.info}` — #254fad) and **Info Border** (`{colors.info-border}` — #458fff): Info badges, focused input outlines.
- **Success** (`{colors.success}` — #006400) and **Success Border** (`{colors.success-border}` — #39bf45): Confirmation indicators, save-state dot in sticky bars.

## Typography

### Font Family
The system runs **DM Sans** for UI text (app surfaces) and falls back to `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif`. Inter is used for data-dense surfaces (tables, monospace values).

### Hierarchy

| Token | Size | Weight | Use |
|---|---|---|---|
| `{typography.display-xl}` | 48px | 500 | Page hero h1 — landing/marketing |
| `{typography.display-lg}` | 40px | 400 | Section h1 |
| `{typography.display-md}` | 32px | 400 | Feature section h2 |
| `{typography.title-lg}` | 24px | 400 | Portal greeting headline |
| `{typography.title-md}` | 20px | 400 | Sub-section titles |
| `{typography.title-sm}` | 18px | 500 | Card titles |
| `{typography.label-md}` | 16px | 500 | List labels, button text |
| `{typography.body-md}` | 14px | 400 | Body copy, form fields, nav items |
| `{typography.caption}` | 12px | 400–500 | Meta text, badge text, timestamps |
| `{typography.legal}` | 11px | 600 | Legal/system-required surfaces only |

### Principles
Weight 400 for display sizes — a 40px heading is **not bold**. Emphasis comes from size, color contrast, and signature surfaces. Where weight is needed, use 500 (sub-titles, buttons, card titles). Weight 600 only on legal/system surfaces. Never use 700+ in the editorial or app body.

## Layout

### Spacing System
- **Base unit:** 4px. All spacing snaps to 4-multiples.
- **Tokens:** `{spacing.xxs}` 4px · `{spacing.xs}` 8px · `{spacing.sm}` 12px · `{spacing.md}` 16px · `{spacing.lg}` 24px · `{spacing.xl}` 32px · `{spacing.xxl}` 48px · `{spacing.section}` 96px.
- **App pages:** `px-6 md:px-10` horizontal, `py-14` vertical for main content areas.
- **Card internal padding:** `p-6` standard, `px-6 py-4` for colored card header bands.
- **Section rhythm:** dark bookend → white canvas content → signature card clusters → white → dark bookend.

### Grid & Container
- **Max content width:** `max-w-5xl` (80rem) centered for portal/settings pages. `max-w-7xl` for full-width data tables.
- **Card grids:** `grid-cols-3` at desktop for org portal cards, `grid-cols-4` for secondary portal cards. Collapse to `grid-cols-2` at tablet, `grid-cols-1` at mobile.
- **Settings sections:** single-column, full-width cards stacked with `space-y-4`.

### Whitespace Philosophy
Whitespace is the dominant atmospheric tool. Let sections breathe — `py-14` between content areas. The page should feel calm between its signature surface moments.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| Flat | No shadow, no border | Dark surface bands, signature card headers (color IS the depth) |
| Soft hairline | 1px `{colors.hairline}` border | Inputs, table dividers, secondary buttons |
| Card resting | `shadow-sm` + `border border-border/50` | White canvas cards in a white page context |
| Card hover | `shadow-lg` + `-translate-y-1` | Org portal cards, secondary portal cards on hover |
| Sticky bar | `bg-surface-dark` no shadow | Fixed save bars — dark surface provides contrast against white canvas above |

**Depth philosophy:** Color-block first, shadow second. Signature surface cards carry depth through color contrast alone — add no shadow to colored cards. White-on-white cards use `shadow-sm` + `border`. On hover, white cards lift with `-translate-y-1 shadow-lg`.

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.xs}` | 2px | Legal/system-required CTAs |
| `{rounded.sm}` | 6px | Text inputs, small inline badges |
| `{rounded.md}` | 10px | Secondary content cards, article cards |
| `{rounded.lg}` | 12px | Primary cards, portal cards, settings cards, primary CTAs |
| `{rounded.xl}` | 16px | Org portal cards (signature surface, full card) |
| `{rounded.full}` | 9999px | Avatars, circular icon buttons |

## Components

### Page Structure

**`page-header`** — A 64px-tall bar pinned to the top of every app page (inside the sidebar inset). Icon + title + optional description. Uses `border-b border-border/50`. No uppercase, no heavy weight — title is `text-base font-medium`. Children slot on the right for action buttons.

**`portal-page`** — Full-page chooser layout. `bg-surface-dark` header (64px) with white Mirama wordmark + sign-out. White canvas content area with `max-w-5xl` centered. `bg-surface-dark` footer. This dark→white→dark bookend rhythm is mandatory for standalone full-page surfaces (auth, portal, onboarding).

**`sticky-save-bar`** — Fixed dark bar at the bottom of form pages. `bg-surface-dark`, `sticky bottom-0`, escapes parent padding with negative margin. Left: status indicator (pulsing dot + message). Right: `{component.button-secondary-on-dark}` (white bg, ink text). Status uses `{colors.success-border}` dot when saved, `{colors.signature-peach}` dot when dirty.

### Buttons

**`button-primary`** — `bg-primary text-white`, `{rounded.lg}` (12px), `h-11 px-6 text-sm`. The near-black action button. One per viewport. Active: darkens to `{colors.primary-active}`.

**`button-secondary`** — White with hairline outline. `bg-canvas text-ink border border-border`. Used next to `{component.button-primary}` as the "less-committed" pair. On dark surfaces, white bg reads as the intentional light element.

**`button-secondary-on-dark`** — Same as `{component.button-secondary}` but used on `{colors.surface-dark}` surfaces (sticky save bars, dark bookends). White bg + ink text is correct — never invert to a translucent on-dark style.

**`button-tertiary`** — `bg-tertiary text-white` (link blue). Used for constructive secondary actions (Create, Add) where the primary is already used.

**`button-ghost`** — `hover:bg-hover text-text-secondary`. For icon-only or low-priority actions.

### Cards & Containers

**`org-portal-card`** — Full-surface signature color card in the portal chooser. `{rounded.xl}` (16px). No border, no shadow (color IS the depth). Hover: `-translate-y-1 shadow-xl`. Contains: initial letter chip (white/20 bg on dark, ink/12 on light), org name (`text-base font-medium`), slug (mono), footer divider with member/project counts. Colors cycle coral → forest → peach → mint → yellow → mustard per index.

**`secondary-portal-card`** — Full-surface signature color card for non-org portals. `{rounded.xl}`. Same hover behavior. Contains: icon chip, label, description, arrow (active) or lock + Soon badge (coming soon). Color assignment: Tenant Admin → `{colors.surface-dark}`, Client → `{colors.signature-cream}`, Finance → `{colors.signature-mint}`, HR → `{colors.signature-mustard}`.

**`settings-card`** — White canvas card with full-bleed colored header band. Parent card: `overflow-hidden {rounded.lg}`. `CardHeader`: `px-6 py-4` + signature bg. `CardContent`: white, `pt-5`. Color assignment cycles per section: General → coral, Branding → cream, Notifications → mint. Add new sections continuing the cycle.

**`hero-band`** — Full-page-width white-canvas hero. No gradient, no decorative backdrop. Headline + sub-headline + button pair in `{spacing.section}` (96px) of whitespace.

**`signature-coral-card`** — Full-bleed coral surface. `{colors.signature-coral}` bg, white type, `{rounded.lg}`, `{spacing.xxl}` (48px) internal padding. Used for primary feature callouts.

**`signature-forest-card`** — Deep green surface. `{colors.signature-forest}` bg, white type. Secondary feature callouts.

**`cream-callout-card`** — `{colors.signature-cream}` bg, ink type, `{rounded.md}`, `{spacing.lg}` padding. Softer callouts, stats, supplementary info.

**`demo-grid-card`** — `{rounded.md}`, `{spacing.md}` padding. Background rotates through signature-peach, signature-mint, signature-cream, signature-yellow. Card heights vary deliberately — never uniform.

### Inputs & Forms

**`text-input`** — `bg-canvas text-ink`, `{rounded.sm}` (6px), `h-10 px-3`, hairline border. Focus: border recolors to `{colors.info-border}`.

**`form-section`** — Each logical group of fields lives in a `{component.settings-card}` with a colored header. Never put bare fields on the page without a section card container.

### Navigation

**`app-sidebar`** — `bg-surface-soft` sidebar, `{colors.sidebar-border}` hairline dividers at 40% opacity. Brand accent bar: `h-0.5 bg-sidebar-primary` at very top. Collapse toggle uses text-align icons. Footer: Settings link.

**`sidebar-group-label`** — `text-xs font-medium text-sidebar-foreground/70`. No uppercase.

**`main-nav-item`** — Active: `bg-sidebar-primary/10 text-sidebar-primary` with left `w-0.5` indicator bar. Inactive: `text-sidebar-foreground`.

**`page-header`** — `h-16 border-b border-border/50`. Icon (muted) + title (`text-base font-medium text-foreground`) inline. Description after hairline separator, hidden on small screens.

**`data-table-header`** — `bg-muted/60 border-b border-border/60`. Column head text: `text-xs font-medium text-muted-foreground` — no uppercase, no tracking.

## Do's and Don'ts

### Do
- **Use signature colors on every page.** Every route should carry at least two signature surfaces — a page with zero colored surfaces is an incomplete design.
- Cycle signature colors in order (coral → forest → cream → peach → mint → yellow → mustard) across repeated items. Never random assignment.
- Use `{colors.surface-dark}` as bookend header and footer on standalone pages (portal, auth, onboarding). This is the page's structural anchor.
- Use sticky `{colors.surface-dark}` save bars on all multi-field form pages. Never leave a floating save button inside the form scroll area.
- Keep `{component.button-primary}` near-black. Mirama's primary CTA is `{colors.primary}`, not link blue.
- Trust whitespace between signature surface moments. Canvas resets are mandatory between colored bands.
- Mark text-on-surface explicitly: white text on dark/coral/forest, ink text on cream/peach/mint/yellow/mustard.
- Use `overflow-hidden` on any card that has a colored `CardHeader` band so the color clips to the card's border radius.
- Keep `{rounded.xl}` (16px) for full-surface signature cards (org portal, secondary portal), `{rounded.lg}` (12px) for mixed cards (settings-card with colored header + white body).
- Hover on signature cards: `-translate-y-1 shadow-xl`. No hover state on flat full-surface dark cards within a dark background.

### Don't
- Don't use signature colors as small accents (icon background, badge outline, border tint). They are surface-level — the entire card face or the entire card header band.
- Don't make link blue (#1b61c9) the primary CTA color. It is the link color only.
- Don't add gradients, mesh backgrounds, or aurora effects to page heroes. White canvas is intentional.
- Don't bold display-weight type. `{typography.display-xl}` and above are intentionally 400–500 weight.
- Don't repeat the same signature color in two adjacent positions. The cycle exists to prevent this.
- Don't add a save button floating inside a form's scroll content. It belongs in the `{component.sticky-save-bar}`.
- Don't use `uppercase` or `tracking-widest` on UI labels, column headers, or card titles. These are reserved for legal/system surfaces only.
- Don't leave section cards un-colored. A white card with a white header is an incomplete component — apply the signature cycle.
- Don't shadow colored cards. The signature surface color provides all needed depth. `shadow-sm` only on white-bg cards within a white page.
- Don't introduce accent colors outside the documented signature palette. The system has coral, forest, cream, peach, mint, yellow, mustard — these seven are sufficient.

## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Mobile | < 640px | Single-column card grids; sidebar collapses to icon-only; portal cards stack; sticky save bar spans full width |
| Tablet | 640–1024px | 2-up card grids; secondary portal cards 2-up; sidebar may collapse |
| Desktop | 1024–1440px | 3-up org cards, 4-up secondary portals; full sidebar |
| Wide | > 1440px | Same as Desktop, content max-width caps at `max-w-5xl`, outer margins grow |

### Touch Targets
- `{component.button-primary}` and siblings: 44px minimum height (h-11 = 44px).
- `{component.button-ghost}` icon-only: h-10 w-10 (40px).
- `{component.text-input}` height: h-10 (40px).

### Collapsing Strategy
- Sidebar collapses to icon-only at smaller breakpoints — content area expands fully.
- Card grids reduce columns rather than scaling cards down.
- Sticky save bar always spans the full content area width (sidebar excluded) using negative margin to escape parent padding.

## Iteration Guide

1. Focus on ONE component at a time. Reference its token key (`{component.org-portal-card}`, `{component.settings-card}`).
2. Every new page needs a color plan before implementation: identify which sections carry which signature colors, and where the dark bookends are.
3. New repeated components (lists, grids, cards) must implement the color cycle. Document the starting color and cycle direction.
4. New form pages must include `{component.sticky-save-bar}`. Never ship a form without it.
5. New section cards follow the `{component.settings-card}` pattern: `overflow-hidden` card, colored header band, white body.
6. When in doubt about emphasis: bigger type before bolder type, signature surface card before solid accent.
7. Run `yarn lint` after every change — Biome enforces import order and Tailwind canonical class names.

## Known Gaps

- Animation and transition timings are not yet formalized as tokens — current convention is `duration-200` for card hover, `duration-300` for sidebar transitions.
- Dark mode signature color equivalents are not yet specified. Current dark mode uses surface-dark-elevated for card backgrounds without signature cycling.
- The sticky save bar pattern is implemented for settings pages; other multi-step forms (onboarding, org creation) should adopt it when built.
- Logo upload in settings is currently a placeholder (S3 integration pending). The Dropzone component is in place but upload handler returns a stub.
