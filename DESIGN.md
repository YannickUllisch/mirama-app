---
version: beta
name: mirama-theme
description: Mirama's design language - an end-to-end creative-professional platform whose surface pairs a light-mode-first warm-white canvas (#FFFFFF canvas, #FAF8F5 Oat Light) with deep Navy ink (#1A3037) and two chromatic accents; Lava 600 (#FF3621) as the single vivid CTA pop and a new Lavender-Blue (#5D61EF) as the structural interactive accent for links, active states, and focus signals. Dark mode is a fully supported second surface (pure neutral grays, no blue/teal tint), never the default. Typography runs DM Sans across all display and body scales, giving the brand a confident, clean, service-professional voice without the cold distance of a pure tech product.

colors:
  primary: "#FF3621"
  on-primary: "#FFFFFF"
  primary-hover: "#FF5F46"
  primary-active: "#BD2B26"
  secondary: "#5D61EF"
  on-secondary: "#FFFFFF"
  secondary-hover: "#7A7EF5"
  secondary-active: "#4547C4"
  navy: "#1B3139"
  navy-deep: "#0B2026"
  canvas: "#FFFFFF"
  canvas-soft: "#FAF8F5"
  canvas-medium: "#EDECE9"
  hairline: "#DDDEDF"
  border-strong: "#617B89"
  ink: "#1A3037"
  ink-soft: "#313E45"
  body: "#5A6F77"
  success: "#00A972"
  success-soft: "#42BA91"
  warning: "#FFAB00"
  danger: "#98102A"
  info: "#2272B4"
  info-soft: "#4299E0"

typography:
  display-xl:
    fontFamily: DM Sans, -apple-system, BlinkMacSystemFont, sans-serif
    fontSize: 48px
    fontWeight: 500
    lineHeight: 52px
  display-lg:
    fontFamily: DM Sans, -apple-system, BlinkMacSystemFont, sans-serif
    fontSize: 40px
    fontWeight: 400
    lineHeight: 44px
  display-md:
    fontFamily: DM Sans, -apple-system, BlinkMacSystemFont, sans-serif
    fontSize: 32px
    fontWeight: 400
    lineHeight: 36px
  title-lg:
    fontFamily: DM Sans, -apple-system, BlinkMacSystemFont, sans-serif
    fontSize: 24px
    fontWeight: 400
    lineHeight: 30px
  title-md:
    fontFamily: DM Sans, -apple-system, BlinkMacSystemFont, sans-serif
    fontSize: 20px
    fontWeight: 400
    lineHeight: 26px
  title-sm:
    fontFamily: DM Sans, -apple-system, BlinkMacSystemFont, sans-serif
    fontSize: 18px
    fontWeight: 500
    lineHeight: 24px
  label-md:
    fontFamily: DM Sans, -apple-system, BlinkMacSystemFont, sans-serif
    fontSize: 16px
    fontWeight: 500
    lineHeight: 20px
  body-md:
    fontFamily: DM Sans, -apple-system, BlinkMacSystemFont, sans-serif
    fontSize: 14px
    fontWeight: 400
    lineHeight: 21px
  body-sm:
    fontFamily: DM Sans, -apple-system, BlinkMacSystemFont, sans-serif
    fontSize: 13px
    fontWeight: 400
    lineHeight: 19px
  caption:
    fontFamily: DM Sans, -apple-system, BlinkMacSystemFont, sans-serif
    fontSize: 12px
    fontWeight: 400
    lineHeight: 18px
  legal:
    fontFamily: DM Sans, -apple-system, BlinkMacSystemFont, sans-serif
    fontSize: 11px
    fontWeight: 600
    lineHeight: 16px
  button-md:
    fontFamily: DM Sans, -apple-system, BlinkMacSystemFont, sans-serif
    fontSize: 14px
    fontWeight: 500
    lineHeight: 20px
  data-mono:
    fontFamily: Inter, system-ui, sans-serif
    fontSize: 14px
    fontWeight: 400
    lineHeight: 21px
  eyebrow:
    fontFamily: DM Sans, -apple-system, BlinkMacSystemFont, sans-serif
    fontSize: 12px
    fontWeight: 500
    lineHeight: 12px
    letterSpacing: 0.6px

rounded:
  none: 0px
  xs: 2px
  sm: 6px
  md: 10px
  lg: 12px
  xl: 16px
  full: 9999px

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  3xl: 64px
  section: 96px

components:
  page-header:
    backgroundColor: "{colors.canvas}"
    borderColor: "{colors.hairline}"
    textColor: "{colors.ink}"
    typography: "{typography.label-md}"
    height: 64px
    padding: "0 {spacing.lg}"
  nav-bar:
    backgroundColor: "{colors.navy}"
    textColor: "{colors.on-secondary}"
    typography: "{typography.body-md}"
    padding: "{spacing.md} {spacing.xl}"
  app-sidebar:
    backgroundColor: "{colors.canvas}"
    hoverBackground: "{colors.canvas-medium}"
    textColor: "{colors.ink-soft}"
    typography: "{typography.body-md}"
    activeColor: "{colors.primary}"
    activeBackground: "{colors.primary}/10"
    activeBorder: "{colors.primary}"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xs} {spacing.lg}"
    hover: "{colors.primary-hover}"
    active: "{colors.primary-active}"
    height: 44px
  button-secondary:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    typography: "{typography.button-md}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xs} {spacing.lg}"
    height: 44px
  button-secondary-dark:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.navy}"
    typography: "{typography.button-md}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xs} {spacing.lg}"
    height: 44px
  button-lavender:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.on-secondary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xs} {spacing.lg}"
    hover: "{colors.secondary-hover}"
    active: "{colors.secondary-active}"
    height: 44px
  button-ghost:
    backgroundColor: transparent
    textColor: "{colors.ink-soft}"
    typography: "{typography.button-md}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xs} {spacing.lg}"
    height: 44px
  text-input:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    focusBorderColor: "{colors.secondary}"
    focusRingColor: "{colors.primary}"
    placeholderColor: "{colors.body}"
    typography: "{typography.body-md}"
    rounded: "{rounded.sm}"
    padding: "{spacing.xs} {spacing.sm}"
    height: 40px
  org-portal-card:
    backgroundColor: "{colors.canvas}"
    borderColor: "{colors.hairline}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
    visualZoneBackground: "{colors.canvas-soft}"
    initialChipBackground: "{colors.primary}"
    hover: "-translate-y-0.5 border-ink/20 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.06)]"
  secondary-portal-card:
    backgroundColor: "{colors.canvas}"
    borderColor: "{colors.hairline}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
    iconChipBackground: "{colors.navy}"
    hover: "-translate-y-0.5 border-ink/20 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.06)]"
  settings-card:
    backgroundColor: "{colors.canvas}"
    headerBackgroundColor: "{colors.navy}"
    headerTextColor: "{colors.on-secondary}"
    rounded: "{rounded.lg}"
    headerPadding: "{spacing.md} {spacing.lg}"
    bodyPadding: "{spacing.lg}"
  card-content:
    backgroundColor: "{colors.canvas-soft}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "{spacing.lg}"
  hero-band:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.display-xl}"
    padding: "{spacing.section} {spacing.xl}"
  hero-band-dark:
    backgroundColor: "{colors.navy}"
    textColor: "{colors.on-secondary}"
    typography: "{typography.display-xl}"
    padding: "{spacing.section} {spacing.xl}"
  content-band-soft:
    backgroundColor: "{colors.canvas-soft}"
    textColor: "{colors.ink}"
    typography: "{typography.display-md}"
    padding: "{spacing.section} {spacing.xl}"
  content-band-light:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.display-md}"
    padding: "{spacing.section} {spacing.xl}"
  portal-page:
    headerBackgroundColor: "{colors.canvas}"
    headerBorderColor: "{colors.hairline}"
    headerHeight: 48px
    headerTextColor: "{colors.ink}"
    canvasBackgroundColor: "{colors.canvas}"
    footerBackgroundColor: "{colors.canvas}"
    footerBorderColor: "{colors.hairline}"
    footerTextColor: "{colors.body}"
  sticky-save-bar:
    backgroundColor: "{colors.navy}"
    textColor: "{colors.on-secondary}"
    typography: "{typography.body-md}"
    dirtyIndicator: "{colors.primary}"
    savedIndicator: "{colors.success}"
  data-table-header:
    backgroundColor: "{colors.canvas-soft}"
    textColor: "{colors.body}"
    borderColor: "{colors.hairline}"
    typography: "{typography.caption}"
  badge-pill:
    backgroundColor: "{colors.canvas-soft}"
    textColor: "{colors.ink}"
    typography: "{typography.caption}"
    rounded: "{rounded.full}"
    padding: "{spacing.xxs} {spacing.xs}"
  badge-pill-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.caption}"
    rounded: "{rounded.full}"
    padding: "{spacing.xxs} {spacing.xs}"
  badge-pill-lavender:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.on-secondary}"
    typography: "{typography.caption}"
    rounded: "{rounded.full}"
    padding: "{spacing.xxs} {spacing.xs}"
  eyebrow:
    textColor: "{colors.ink}"
    typography: "{typography.eyebrow}"
  footer:
    backgroundColor: "{colors.navy}"
    textColor: "{colors.canvas-soft}"
    typography: "{typography.body-md}"
    padding: "{spacing.2xl} {spacing.xl}"

  # ─── Examples (illustrative) ───
  ex-pricing-tier:
    description: "Default pricing tier card. Canvas-soft surface with hairline border."
    backgroundColor: "{colors.canvas-soft}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
  ex-pricing-tier-featured:
    description: "Featured tier - polarity-flipped: Navy surface, white text, Lava CTA inside."
    backgroundColor: "{colors.navy}"
    textColor: "{colors.on-secondary}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
  ex-asset-proof-card:
    description: "Asset review card in the proofing view. Oat-soft frame with Lavender-Blue annotation indicators."
    backgroundColor: "{colors.canvas-soft}"
    textColor: "{colors.ink}"
    annotationColor: "{colors.secondary}"
    rounded: "{rounded.lg}"
    padding: "{spacing.lg}"
  ex-client-portal-card:
    description: "Org-chooser card in the client portal. Navy surface, white text."
    backgroundColor: "{colors.navy}"
    textColor: "{colors.on-secondary}"
    activeIndicator: "{colors.primary}"
    rounded: "{rounded.xl}"
    padding: "{spacing.xl}"
  ex-app-shell-row:
    description: "Sidebar nav row. Active state uses Lava as left-bar indicator and tinted background."
    backgroundColor: "{colors.canvas}"
    activeIndicator: "{colors.primary}"
    activeBackground: "{colors.primary}/10"
    rounded: "{rounded.sm}"
    padding: "{spacing.xs} {spacing.md}"
  ex-data-table-cell:
    description: "Data-table th + td. Header uses caption typography; body uses body-md."
    headerBackground: "{colors.canvas-soft}"
    headerTypography: "{typography.caption}"
    bodyTypography: "{typography.body-md}"
    cellPadding: "{spacing.xs} {spacing.md}"
    rowBorder: "{colors.hairline}"
  ex-auth-form-card:
    description: "Sign-in / sign-up card. Canvas-soft surface with text-input primitives inside."
    backgroundColor: "{colors.canvas-soft}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
  ex-modal-card:
    description: "Modal dialog surface. Canvas with elevated shadow."
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
  ex-empty-state-card:
    description: "Empty-state frame for boards, lists, and asset galleries."
    backgroundColor: "{colors.canvas-soft}"
    rounded: "{rounded.lg}"
    padding: "{spacing.2xl}"
    captionTypography: "{typography.body-md}"
  ex-toast:
    description: "Toast notification. Canvas surface with medium shadow."
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xs} {spacing.md}"
    typography: "{typography.body-md}"

---


## Overview

Mirama is an end-to-end client and project operating system for freelancers and service-based creative teams - design studios, agencies, video production companies, photography studios, and architecture firms. The platform covers the full engagement lifecycle in one place: client intake, visual project execution, asset proofing, client collaboration, and Stripe-connected billing. The design language reflects that operational seriousness.

Mirama is **light-mode-first**. The default surface is `{colors.canvas}` (#FFFFFF) with Oat Light `{colors.canvas-soft}` (#FAF8F5) as the app-page ground. A full, equally-supported dark theme exists (pure neutral grays, toggled via the `.dark` class on `<html>`) - see [Dark Mode](#dark-mode) - but every color decision in this document is authored for light mode first and adapted to dark second, never the reverse.

Two standout colors drive all brand expression: **Lava 600** (`{colors.primary}` `#FF3621`) for every vivid CTA and interactive pop, and a new **Lavender-Blue** (`{colors.secondary}` `#5D61EF`) as the structural interactive accent - inline links, active tab indicators, focus signals, and constructive secondary actions. **Navy** (`{colors.navy}` `#1B3139`) remains the neutral structural anchor for dark bookend surfaces (nav bars, sticky save bars, settings card headers) - it is depth/structure, not a chromatic brand accent. Everything else is neutral. Oat surfaces and white canvas let both standouts read without noise.

Color emphasis comes from **surface contrast**, not type weight. Headlines never exceed weight 500. Large backgrounds use White, Oat, or Navy. Lava appears as pops: CTAs, active indicators, focused states, and notification dots. Never as a large background fill.

**Key Characteristics:**
- **Light-mode-first system.** `{colors.canvas}` (#FFFFFF) and Oat Light (#FAF8F5) are the default ground; dark mode is a fully supported alternate theme, not the base design.
- Lava 600 (`{colors.primary}` `#FF3621`) is the single vivid pop - every primary CTA, every active indicator, every notification badge. Unchanged across this revision.
- **Lavender-Blue** (`{colors.secondary}` `#5D61EF`) is the new structural interactive accent - replaces the prior blue accent for inline links, active tabs, focus rings, and constructive secondary actions.
- Navy (`{colors.navy}` `#1B3139`) is the structural anchor for dark surfaces: nav bars, page bookends, settings card headers, sticky save bars. A neutral-depth role, not a chromatic accent - it collapses to pure gray in dark mode (see Dark Mode).
- Form pages use a fixed Navy `sticky-save-bar` at the bottom - never a floating inline save button.
- Border radius is hierarchical: `{rounded.xl}` 16px for full-surface portal cards, `{rounded.lg}` 12px for mixed cards and primary CTAs, `{rounded.sm}` 6px for inputs.

## Colors

> Ground truth for canvas, card, border/hairline, and sidebar values is `app/globals.css` (`--background`, `--card`, `--border`, `--hairline`, `--sidebar-*` custom properties). Brand accents (`primary`, `secondary`) are authored values, independently maintained.

### Brand Standouts
- **Lava 600** (`{colors.primary}` - `#FF3621`): The primary standout. Every primary CTA, every active state indicator, notification badge, focus ring, and interactive accent. Always white text on Lava. Hover: Lava 500 (`{colors.primary-hover}` `#FF5F46`). Active/pressed: Lava 700 (`{colors.primary-active}` `#BD2B26`). Unchanged - stays the system's one vivid pop.
- **Lavender-Blue** (`{colors.secondary}` - `#5D61EF`): The new secondary standout and structural interactive accent. Inline body links, active tab/nav indicator, focus ring variant, annotation indicators on asset proofing surfaces, `button-lavender` constructive secondary actions. Always white text on Lavender-Blue. Hover: (`{colors.secondary-hover}` `#7A7EF5`). Active/pressed: (`{colors.secondary-active}` `#4547C4`).
- **Navy** (`{colors.navy}` - `#1B3139`): The structural anchor, not a chromatic brand color. Dark nav bars, page bookend headers and footers, sticky save bars, settings card header bands. Always white text on Navy. Deepest: Navy Deep (`{colors.navy-deep}` `#0B2026`).

### Surface
- **White** (`{colors.canvas}` - `#FFFFFF`): Default page canvas. The floor of every editorial body. Matches `--background` / `--card` in light mode.
- **Oat Light** (`{colors.canvas-soft}` - `#FAF8F5`): App-page background, secondary card surfaces, input field backgrounds, auth form cards. Matches `--surface-soft` / `--muted`.
- **Oat Medium** (`{colors.canvas-medium}` - `#EDECE9`): Section bands, hover backgrounds, secondary portal cards. Matches `--surface-medium` / `--accent`.
- **Gray Lines** (`{colors.hairline}` - `#DDDEDF`): 1px borders for inputs, table dividers, secondary button outlines. Matches `--border` / `--hairline` exactly - these are the same value in `globals.css`.
- **Border Strong** (`{colors.border-strong}` - `#617B89`): Emphasized dividers and card outlines that need more contrast than the default hairline.

> Note: the sidebar surface (`--sidebar-background`, #F7F7F7 in light mode) is a **neutral gray**, not Oat Light - it is a distinct token from `{colors.canvas-soft}` in `globals.css`, even though earlier drafts of this document conflated the two. `app-sidebar` is documented against its real token below.

### Text
- **Navy / Ink** (`{colors.ink}` - `#1A3037`): Strongest text. h1/h2 display, primary body. Matches `--foreground` / `--ink`.
- **Ink Soft** (`{colors.ink-soft}` - `#313E45`): Default running text and nav items. Matches `--text-secondary`.
- **Body** (`{colors.body}` - `#5A6F77`): Captions, breadcrumbs, meta text, placeholder text, column headers. Matches `--muted-foreground` / `--body-text`.

### Semantic
Use only when semantic clarity requires. Never as decorative surfaces.

- **Success** (`{colors.success}` - `#00A972`): Confirmation indicators, save-state dots. Outline variant: (`{colors.success-soft}` `#42BA91`).
- **Warning** (`{colors.warning}` - `#FFAB00`): Budget burn alerts, deadline warnings.
- **Danger** (`{colors.danger}` - `#98102A`): Destructive actions, error states.
- **Info** (`{colors.info}` - `#2272B4`): Secondary informational badges where Lavender-Blue is too prominent. Focus variant: (`{colors.info-soft}` `#4299E0`). Kept as its own hue, distinct from the brand secondary, for pure semantic clarity.

## Typography

### Font Family
The system runs **DM Sans** for all UI text - display, body, buttons, labels, eyebrows - and falls back to `-apple-system, BlinkMacSystemFont, sans-serif`. **Inter** is reserved for data-dense surfaces only: table cell values, monospaced numeric readouts, and code-adjacent content.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-xl}` | 48px | 500 | 52px | 0 | Page hero h1 - marketing and landing surfaces. |
| `{typography.display-lg}` | 40px | 400 | 44px | 0 | Section h1 - major content headers. |
| `{typography.display-md}` | 32px | 400 | 36px | 0 | Feature section h2. |
| `{typography.title-lg}` | 24px | 400 | 30px | 0 | Portal greeting headline, modal title. |
| `{typography.title-md}` | 20px | 400 | 26px | 0 | Sub-section titles, card section headers. |
| `{typography.title-sm}` | 18px | 500 | 24px | 0 | Card titles, dialog section labels. |
| `{typography.label-md}` | 16px | 500 | 20px | 0 | Page header title, list labels, table column actions. |
| `{typography.body-md}` | 14px | 400 | 21px | 0 | Body copy, form fields, nav items, default UI text. |
| `{typography.body-sm}` | 13px | 400 | 19px | 0 | Secondary UI text, input helper text. |
| `{typography.caption}` | 12px | 400 | 18px | 0 | Meta text, badge text, timestamps, table headers. |
| `{typography.legal}` | 11px | 600 | 16px | 0 | Legal and system-required surfaces only. |
| `{typography.button-md}` | 14px | 500 | 20px | 0 | All button labels. |
| `{typography.data-mono}` | 14px | 400 | 21px | 0 | Table cell values, numeric readouts (Inter). |
| `{typography.eyebrow}` | 12px | 500 | 12px | 0.6px | Uppercase eyebrow labels above section heads. |

### Principles
- Weight 400 for display sizes - a 40px heading is intentionally not bold. Emphasis comes from size, color contrast, and surface depth.
- Weight 500 for sub-titles, buttons, card titles, and page header labels. The minimum "assertive" weight in the system.
- Never use 700+ anywhere in the app.
- DM Sans for everything a user reads. Inter only for data values in tables and numeric readouts.
- Sentence-case for all labels, headings, and buttons. Never uppercase at display or title size.
- Eyebrow labels (`{typography.eyebrow}`) use 0.6px tracking - the system's only positive-tracked style.

## Layout

### Spacing System
- **Base unit:** 4px. All spacing snaps to 4px multiples.
- **Tokens:** `{spacing.xxs}` 4px · `{spacing.xs}` 8px · `{spacing.sm}` 12px · `{spacing.md}` 16px · `{spacing.lg}` 24px · `{spacing.xl}` 32px · `{spacing.2xl}` 48px · `{spacing.3xl}` 64px · `{spacing.section}` 96px.
- **App pages (with sidebar):** `px-10 md:px-16` horizontal, `py-10` vertical. Generous breathing room - ~64px side padding at desktop. No max-width centering; content stretches within the sidebar inset.
- **Portal / standalone full-page:** `px-6 md:px-10` horizontal, `py-16` vertical, `max-w-5xl mx-auto` centered.
- **Card internal padding:** `p-6` standard; `px-6 py-4` for Navy header bands inside settings cards.
- **App page background:** `bg-surface-soft` (Oat Light `#FAF8F5`). White canvas cards float on the oat surface - color contrast replaces shadow as depth signal.
- **Section rhythm (app pages):** Oat Light page bg → white canvas cards/panels. No dark bookends inside the app shell.

### Grid and Container
- **Max content width:** `max-w-5xl` (80rem) centered for portal chooser, settings, and form pages. `max-w-7xl` for full-width data tables and asset galleries. App dashboard pages use no max-width - padding alone governs the side margins.
- **Card grids:** `grid-cols-3` at desktop for org portal cards; `grid-cols-4` for secondary portal cards. Collapses to `grid-cols-2` at tablet, `grid-cols-1` at mobile.
- **Settings sections:** single-column, full-width cards stacked with `space-y-4`.
- **Task boards:** horizontal scroll at `grid-cols-[repeat(auto-fill,minmax(280px,1fr))]`.

### Whitespace Philosophy
Whitespace is the dominant atmospheric tool. Let sections breathe - `{spacing.section}` (96px) between major content bands. The page should feel calm between its Navy surface moments. The white canvas resets are as important as the content itself.

## Elevation and Depth

| Level | Treatment | Use |
|---|---|---|
| Flat | No shadow, no border | Navy surface bands - color provides depth |
| Hairline | 1px `{colors.hairline}` border | Inputs, table dividers, secondary button outlines |
| Soft card | `shadow-sm` + `border border-border/50` | White cards on a white or Oat page |
| Hover card | `-translate-y-0.5` + `shadow-[0_2px_12px_-2px_rgba(0,0,0,0.06)]` + `border-ink/20` | Org portal cards, secondary portal cards on hover - diffuse, not heavy |
| Sticky bar | Navy, no shadow | Fixed save bars - Navy surface provides contrast against white canvas above |

**Depth philosophy:** Color-block first, shadow second. Navy surface cards carry depth through color contrast alone - add no shadow to Navy cards. White-on-white cards use `shadow-sm` + `border`. On hover, white cards lift with `-translate-y-1 shadow-lg`. Navy cards lift with `-translate-y-1 shadow-xl`.

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | Full-bleed bands, inset edge-to-edge surfaces |
| `{rounded.xs}` | 2px | Legal/system-only CTAs, micro-badges |
| `{rounded.sm}` | 6px | Text inputs, small inline badges, eyebrow chips |
| `{rounded.md}` | 10px | Secondary content cards, data table cells |
| `{rounded.lg}` | 12px | Primary cards, settings cards, all CTA buttons |
| `{rounded.xl}` | 16px | Full-surface portal cards (org cards, secondary portal cards) |
| `{rounded.full}` | 9999px | Avatars, circular icon buttons, status pills |

## Components

### Page Structure

**`page-header`** - Display title block at the top of every app page (inside the sidebar inset). Padding `px-10 md:px-16 pt-8 pb-5`. Icon (18×18, `text-body-text`) + title (`text-[22px] font-semibold text-ink`) in a row; description (`text-sm text-body-text`) on the line below, indented `ml-7` to align with title text. Children slot on the right for action buttons. No bottom border - Oat Light page background provides separation.

**`portal-page`** - Full-page chooser layout. White canvas header (48px) with hairline bottom border, ink Mirama wordmark, ghost sign-out. White canvas content area with `max-w-5xl` centered. White canvas footer with hairline top border. No colored bookends - full white surface with hairline structure, consistent with professional SaaS dashboards (Cloudflare, Linear, Vercel). Auth and onboarding pages may use Navy bookends; the portal chooser does not.

**`sticky-save-bar`** - Fixed Navy bar at the bottom of all multi-field form pages. `sticky bottom-0`, escapes parent padding with negative margin. Left: status indicator (pulsing dot + message) - Lava 600 dot when dirty, Green 600 dot when saved. Right: white bg / Navy text secondary action. Never put a save button floating inside a form's scroll content.

### Buttons

**`button-primary`** - Lava 600 CTA. `bg-lava text-white`, `{rounded.lg}` (12px), `h-11 px-6`. One per viewport. Hover: Lava 500 (`{colors.primary-hover}`). Active: Lava 700 (`{colors.primary-active}`).

**`button-secondary`** - White with Gray Lines outline. `bg-canvas text-ink border border-border`. Used alongside `button-primary` as the less-committed pair. On white canvas backgrounds.

**`button-secondary-dark`** - Same shape as `button-secondary` but used on Navy surfaces (sticky save bars, dark bookends). White bg + Navy ink text - never invert to a translucent on-dark style.

**`button-lavender`** - Lavender-Blue fill. `bg-mirama text-white` (underlying token retained from the prior implementation, now carrying the Lavender-Blue value), `{rounded.lg}` (12px), `h-11 px-6`. For constructive secondary actions (Add, Create, Connect) when a Lava primary CTA is already present. Active: `{colors.secondary-active}`.

**`button-ghost`** - `hover:bg-hover text-ink-soft`. For icon-only or low-priority actions. No border.

### Cards and Containers

**`org-portal-card`** - White canvas card with hairline border in the org portal chooser. `{rounded.xl}` (16px). Split into two zones: top visual zone (`canvas-soft` bg, centered Lava 600 initial chip) and bottom content zone (org name, slug, member/project counts, "Enter workspace →" divider row). Hover: `-translate-y-0.5`, border shifts to `ink/20`, diffuse shadow `0 2px 12px -2px rgba(0,0,0,0.06)` - no harsh lift. All org cards use this consistent white treatment.

**`secondary-portal-card`** - White canvas card with hairline border for non-org portals (tenant portal, billing, settings shortcuts). `{rounded.xl}`. Horizontal layout: Navy icon chip + label/description + arrow. Same hover behavior as org-portal-card. No accent color on the card surface.

**`settings-card`** - White canvas card with Navy full-bleed header band. Parent card: `overflow-hidden {rounded.lg}`. `CardHeader`: Navy bg, white text, `px-6 py-4`, `{typography.title-sm}`. `CardContent`: white, `pt-5`. All settings section cards use the Navy header - consistent structural identity across the platform.

**`card-content`** - Default Oat Light content card. Background `{colors.canvas-soft}`, text `{colors.ink}`, padding `{spacing.lg}`, shape `{rounded.lg}`. Used for feature cards, summary panels, and sub-content containers on white canvas pages.

**`hero-band`** - Full-width white canvas hero. No gradient, no decorative backdrop. Headline (`{typography.display-xl}`) + sub-headline + Lava 600 `button-primary` + `button-secondary` in `{spacing.section}` (96px) of vertical whitespace.

**`hero-band-dark`** - Full-width Navy hero for marketing alternates and landing page dark sections. Same typography scale and button pair; text flips to white.

**`content-band-soft`** - Oat Light section band following the hero or between Navy moments. Background `{colors.canvas-soft}`, padding `{spacing.section} {spacing.xl}`, section headline in `{typography.display-md}`.

**`content-band-light`** - White canvas section band. Same padding and scale. Alternates with `content-band-soft` to create page rhythm.

### Inputs and Forms

**`text-input`** - `bg-canvas text-ink`, `{rounded.sm}` (6px), `h-10 px-3`, Gray Lines border. Focus: border recolors to Lavender-Blue (`{colors.secondary}`), ring to `{colors.primary}` (Lava 600). Placeholder text in `{colors.body}`.

**`form-section`** - Each logical group of fields lives in a `settings-card` with a Navy header. Never put bare fields on the page without a section card container.

### Navigation

**`nav-bar`** - The top nav on marketing and auth surfaces. Navy background, white text. Padding `{spacing.md} {spacing.xl}`.

**`app-sidebar`** - Neutral light-gray bg (`bg-sidebar`, `--sidebar-background`) in light mode - a distinct token from Oat Light. Hover/active row background uses `--sidebar-accent` (near Oat Medium). Gray Lines hairline dividers. Lava 600 active indicator: `h-0.5` top bar + `w-0.5` left bar on the active item + `bg-lava/10` background tint. No uppercase on group labels.

**`main-nav-item`** - Active: `bg-lava/10 text-lava` with left `w-0.5 bg-lava` indicator bar (matches `data-[active=true]:border-l-lava` in the real sidebar implementation). Inactive: `text-ink-soft hover:bg-sidebar-accent`.

**`data-table-header`** - `bg-canvas-soft border-b border-hairline`. Column head text: `{typography.caption} text-body` - no uppercase, no tracking, no weight above 500.

### Signature Components

**`eyebrow`** - Small uppercase label above section headlines. Text `{colors.ink}`, set in `{typography.eyebrow}` (12px / 500 / 0.6px tracking). Used sparingly to mark section type.

**`badge-pill`** - Inline status and metadata pill. Background `{colors.canvas-soft}`, text `{colors.ink}`, `{typography.caption}`, padding `{spacing.xxs} {spacing.xs}`, shape `{rounded.full}`. Lava variant (`badge-pill-primary`) for active status. Lavender-Blue variant (`badge-pill-lavender`) for linked/connected states.

**`footer`** - Navy footer. Background `{colors.navy}`, text `{colors.canvas-soft}`, padding `{spacing.2xl} {spacing.xl}`. Body in `{typography.body-md}`.

### Examples (illustrative)

**`ex-pricing-tier`** - Default pricing tier card. Canvas-soft surface with hairline border.
- Properties: `backgroundColor`, `textColor`, `borderColor`, `rounded`, `padding`

**`ex-pricing-tier-featured`** - Featured/highlighted tier. Polarity-flipped: Navy surface + white text + Lava CTA inside.
- Properties: `backgroundColor`, `textColor`, `rounded`, `padding`

**`ex-asset-proof-card`** - Asset review card in the proofing view. Oat-soft frame, Lavender-Blue annotation indicators, version badge in bottom corner.
- Properties: `backgroundColor`, `textColor`, `annotationColor`, `rounded`, `padding`

**`ex-client-portal-card`** - Org-chooser card in the client portal. Navy surface, white text, Lava active indicator.
- Properties: `backgroundColor`, `textColor`, `activeIndicator`, `rounded`, `padding`

**`ex-app-shell-row`** - Sidebar nav row. Active state: Lava left-bar indicator + `bg-lava/10` tinted background.
- Properties: `backgroundColor`, `activeIndicator`, `activeBackground`, `rounded`, `padding`

**`ex-data-table-cell`** - Data-table `th` + `td` chrome. Header uses `{typography.caption}` in `{colors.body}`; body uses `{typography.body-md}`.
- Properties: `headerBackground`, `headerTypography`, `bodyTypography`, `cellPadding`, `rowBorder`

**`ex-auth-form-card`** - Sign-in / sign-up card. Canvas-soft surface with text-input primitives inside.
- Properties: `backgroundColor`, `rounded`, `padding`

**`ex-modal-card`** - Modal dialog surface. Canvas with elevated shadow.
- Properties: `backgroundColor`, `rounded`, `padding`

**`ex-empty-state-card`** - Empty-state frame for task boards, asset galleries, and client lists.
- Properties: `backgroundColor`, `rounded`, `padding`, `captionTypography`

**`ex-toast`** - Toast notification. Canvas surface with medium shadow.
- Properties: `backgroundColor`, `rounded`, `padding`, `typography`


## Do's and Don'ts

### Do
- **Design light mode first.** Every new component gets its light-mode treatment specified before its dark-mode equivalent.
- **Use Navy as the structural anchor** for auth/onboarding bookends, sticky save bars, icon chips, and `settings-card` header bands. Never as a full app-page surface.
- **Use Lava 600 as the single vivid pop** - primary CTAs, active indicators, focus rings, notification dots, and accent chips. One per viewport maximum for primary CTAs.
- **Use Lavender-Blue for all structural interactive affordances** - inline links, active tab indicators, annotation markers on asset proofing surfaces, and `button-lavender` constructive secondary actions.
- **App pages use `bg-surface-soft`** (Oat Light) as the page canvas. White canvas cards (`bg-canvas` + `border-hairline`) float on top - color contrast provides depth without shadows.
- **Portal chooser uses white canvas** header and footer with hairline borders. No Navy bookends on the portal chooser page.
- Use Navy bookend header and footer on **auth and onboarding surfaces only**.
- Use `sticky-save-bar` on all multi-field form pages. Never leave a floating save button inside the form scroll area.
- Keep `button-primary` Lava 600. Mirama's primary CTA is Lava - not Navy, not Lavender-Blue.
- Use `overflow-hidden` on any card that has a colored `CardHeader` band so the color clips to the card's border radius.
- Keep `{rounded.xl}` (16px) for portal and content cards. `{rounded.lg}` (12px) for mixed cards (Navy header + white body) and all CTA buttons.
- Hover on white canvas cards: `-translate-y-0.5 border-ink/20 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.06)]` - diffuse, not heavy.

### Don't
- Don't design or ship a component that only has a dark-mode spec. Dark mode is a derived theme, never the primary design surface.
- Don't use Lava as a large background surface. It is a pop color - the CTA, the dot, the chip, the active bar. Never a full card or section band.
- Don't cycle multiple colors across repeated items. All org portal cards use Navy - no coral, forest, peach, or mint.
- Don't make Lavender-Blue the primary CTA color. It is the structural interactive accent. The primary CTA is always Lava 600.
- Don't add gradients, mesh backgrounds, or aurora effects to page surfaces. Oat-soft and white canvas are intentional.
- Don't bold display-weight type. `display-xl` and `display-lg` are intentionally 400-500 weight. Emphasis comes from size.
- Don't add a save button floating inside a form's scroll content. It belongs in the `sticky-save-bar`.
- Don't use `uppercase` or `tracking-widest` on UI labels, column headers, or card titles. Reserve tracking for `{typography.eyebrow}` only.
- Don't shadow Navy cards. The Navy surface provides all needed depth. `shadow-sm` only on white-bg cards within a white page.
- Don't introduce accent colors beyond Lava 600 and Lavender-Blue for branding surfaces. Navy is structural, not chromatic. The extended palette is for semantic states only.
- Don't use pure black (`#000000`) anywhere in light mode. Navy (`#1B3139`) is the darkest surface and text color in the light palette.
- Don't conflate `{colors.canvas-soft}` (Oat Light, `#FAF8F5`) with the sidebar surface (`--sidebar-background`, neutral gray `#F7F7F7`) - they are separate tokens in `globals.css`, even though they read as visually close.

## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Mobile | < 640px | Single-column card grids; sidebar collapses to icon-only; portal cards stack; sticky save bar spans full width |
| Tablet | 640-1024px | 2-up card grids; secondary portal cards 2-up; sidebar may collapse |
| Desktop | 1024-1440px | 3-up org cards; 4-up secondary portals; full sidebar expanded |
| Wide | > 1440px | Same as Desktop; content max-width caps at `max-w-5xl`; outer margins grow |

### Touch Targets
- `button-primary` and all button siblings: 44px minimum height (`h-11`).
- `button-ghost` icon-only: 40px × 40px (`h-10 w-10`).
- `text-input` height: 40px (`h-10`).
- Sidebar nav items: 40px minimum height.

### Collapsing Strategy
- Sidebar collapses to icon-only at smaller breakpoints - content area expands fully.
- Card grids reduce columns rather than scaling cards down.
- Sticky save bar always spans the full content area width (sidebar excluded) using negative margin to escape parent padding.
- Asset proof cards collapse to single-column with full-width annotation panel below the preview.

## Dark Mode

Dark mode uses a **pure gray/black palette** - no blue or teal tint. All functional tokens flip via CSS custom properties in `app/globals.css`; brand accent colors (Lava, Lavender-Blue) stay unchanged. Dark mode is activated by the `.dark` class on `<html>` and is a fully supported secondary theme - not the design baseline.

### Dark Palette

Values below are read directly from `app/globals.css` custom properties (the ground truth) - several differ from earlier drafts of this document, which had drifted from the actual token values.

| Token (CSS var) | Light | Dark | Notes |
|---|---|---|---|
| `--background` | `#FFFFFF` | `#171717` (0 0% 9%) | Page background |
| `--card` | `#FFFFFF` | `#121212` (0 0% 7%) | Card surface - slightly darker than the page background, not lighter; depth reads via hairline border, not fill contrast |
| `--canvas` | `#FFFFFF` | `#1A1A1A` (0 0% 10%) | Design-token canvas surface |
| `--popover` | `#FAF8F5` | `#1F1F1F` (0 0% 12%) | Popovers, dropdowns |
| `--surface-soft` | `#FAF8F5` | `#141414` (0 0% 8%) | App page canvas, sidebar-adjacent surfaces |
| `--surface-medium` | `#EDECE9` | `#242424` (0 0% 14%) | Hover surface, chips |
| `--surface-strong` | `#EDECE9` | `#2E2E2E` (0 0% 18%) | Elevated surfaces |
| `--surface-dark` | `#1A3037` (navy-hued) | `#0F0F0F` (0 0% 6%) | Darkest structural surface - navy-tinted in light mode, pure neutral in dark |
| `--ink` / `--foreground` | `#1A3037` | `#F7F7F7` (0 0% 97%) | Primary text |
| `--body-text` / `--muted-foreground` | `#5A6F77` | `#ADADAD` (0 0% 68%) | Secondary text |
| `--border` / `--hairline` | `#DDDEDF` | `#383838` (0 0% 22%) | Borders, dividers |
| `--sidebar-background` | `#F7F7F7` | `#121212` (0 0% 7%) | Sidebar bg - neutral gray in both modes |
| `--sidebar-accent` | `#EDECE9` | `#242424` (0 0% 14%) | Sidebar hover/active row |
| `--tertiary` (Lavender-Blue) | `#5D61EF` | `#7A7EF5` | Lightens for contrast against dark surfaces |

### Rules for Dark Mode
- All grays are **neutral** (saturation 0). No blue, teal, or warm tints.
- Lava 600 (`#FF3621`) is unchanged - it reads well on dark surfaces at the same value in both modes.
- Lavender-Blue lightens from `#5D61EF` to `#7A7EF5` in dark mode for legibility against dark surfaces - the only brand accent that shifts value between themes.
- `--card` in dark is `#121212` - notably darker, not lighter, than `--background` (`#171717`). Elevation in dark mode is carried by the hairline border, not by a lighter fill.
- Navy-surface components (`settings-card` header bands, `sticky-save-bar`, `surface-dark`) collapse to the darkest neutral gray tier (`0 0% 6%`) rather than staying navy-tinted.
- Hairline borders shift from `#DDDEDF` to `#383838` - same visual weight, dark-adapted.

## Iteration Guide

1. Focus on one component at a time. Reference its token key (`org-portal-card`, `settings-card`, `sticky-save-bar`).
2. Design and verify every component in light mode first; port to dark mode second using the CSS custom-property flips in `globals.css`.
3. Every new page color plan: page bg is `bg-surface-soft`, content cards are `bg-canvas`, Lava pops on CTAs and active indicators only.
4. New content cards use white canvas + hairline border. Navy card headers only on `settings-card` pattern (explicitly opted in).
5. New form pages must include `sticky-save-bar`. Never ship a form without it.
6. New section cards follow the `settings-card` pattern: `overflow-hidden` card, Navy header band, white body.
7. Lavender-Blue (`{colors.secondary}`) is the correct color for any interactive affordance that is not the primary CTA. Links, active tabs, annotation pins, focus outlines.
8. When in doubt about emphasis: bigger type before bolder type, Navy surface before any other depth treatment.
9. Run `yarn lint` after every change - Biome enforces import order and Tailwind canonical class names.

## Known Gaps

- **Lavender-Blue migration is a CSS-value swap, not a rename.** The underlying `--color-mirama` / `--tertiary` custom properties were recolored from the old blue (`#0075DE` / `#2272B4`) to Lavender-Blue - component class names (`bg-mirama`, `text-mirama`, `bg-tertiary`, the `mirama`/`tertiary`/`info` Button variants) were left unchanged to avoid a multi-file rename. Treat `mirama`/`tertiary` as legacy identifiers for the Lavender-Blue token going forward; a follow-up rename pass to `lavender` naming across components is still open.
- The Button `info` variant currently shares the same `bg-tertiary` (now Lavender-Blue) token as the `tertiary` variant, while the separate semantic `{colors.info}` (`#2272B4`, used in `select.tsx`) stays its own distinct blue. This is a pre-existing inconsistency, not introduced by this revision - flagged for a future semantic-color cleanup.
- Animation and transition timings are not yet formalized as tokens. Current convention: `duration-200` for card hover and button state, `duration-300` for sidebar open/close transitions.
- The `sticky-save-bar` pattern is implemented for settings pages. Multi-step forms (onboarding, org creation, client intake wizard) should adopt it when built.
- Asset proofing annotation layer (`ex-asset-proof-card`, Lavender-Blue annotation indicators) is designed but not yet implemented - component spec is in place.
- Components previously using a multi-color cycling pattern (coral, forest, peach, mint, yellow, mustard per org card) need migration to the Navy consistent pattern.
- Dark mode is implemented. See the **Dark Mode** section above for the corrected palette (several values had drifted from `globals.css` in earlier drafts of this document). The `.dark` class on `<html>` activates it.
- Logo upload in org settings is currently a placeholder (S3 integration pending). The Dropzone component is in place but the upload handler returns a stub.
