---
version: alpha
name: mirama-theme
description: Mirama's design language - an end-to-end creative-professional platform whose surface pairs a warm-white canvas (#FFFFFF canvas, #F9F7F4 Oat Light) with deep Navy 800 ink (#1B3139) and two chromatic accents; Lava 600 (#FF3621) as the single vivid CTA pop and Mirama Blue (#0075DE) as the structural interactive accent for links, active states, and focus signals. Typography runs DM Sans across all display and body scales, giving the brand a confident, clean, service-professional voice without the cold distance of a pure tech product.

colors:
  primary: "#FF3621"
  on-primary: "#FFFFFF"
  primary-hover: "#FF5F46"
  primary-active: "#BD2B26"
  secondary: "#1B3139"
  on-secondary: "#FFFFFF"
  secondary-elevated: "#143D4A"
  secondary-deep: "#0B2026"
  mirama: "#0075DE"
  on-mirama: "#FFFFFF"
  mirama-active: "#005BAB"
  mirama-deep: "#213183"
  canvas: "#FFFFFF"
  canvas-soft: "#F9F7F4"
  canvas-medium: "#EEEDE9"
  hairline: "#DCE0E2"
  ink: "#1B3139"
  ink-soft: "#303F47"
  body: "#5A6F77"
  mute: "#8DA4AC"
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
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.on-secondary}"
    typography: "{typography.body-md}"
    padding: "{spacing.md} {spacing.xl}"
  app-sidebar:
    backgroundColor: "{colors.canvas-soft}"
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
    textColor: "{colors.secondary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xs} {spacing.lg}"
    height: 44px
  button-mirama:
    backgroundColor: "{colors.mirama}"
    textColor: "{colors.on-mirama}"
    typography: "{typography.button-md}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xs} {spacing.lg}"
    active: "{colors.mirama-active}"
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
    focusBorderColor: "{colors.info-soft}"
    focusRingColor: "{colors.primary}"
    placeholderColor: "{colors.mute}"
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
    iconChipBackground: "{colors.secondary}"
    hover: "-translate-y-0.5 border-ink/20 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.06)]"
  settings-card:
    backgroundColor: "{colors.canvas}"
    headerBackgroundColor: "{colors.secondary}"
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
    backgroundColor: "{colors.secondary}"
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
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.on-secondary}"
    typography: "{typography.body-md}"
    dirtyIndicator: "{colors.primary}"
    savedIndicator: "{colors.success}"
  data-table-header:
    backgroundColor: "{colors.canvas-soft}"
    textColor: "{colors.mute}"
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
  badge-pill-mirama:
    backgroundColor: "{colors.mirama}"
    textColor: "{colors.on-mirama}"
    typography: "{typography.caption}"
    rounded: "{rounded.full}"
    padding: "{spacing.xxs} {spacing.xs}"
  eyebrow:
    textColor: "{colors.ink}"
    typography: "{typography.eyebrow}"
  footer:
    backgroundColor: "{colors.secondary}"
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
    description: "Featured tier - polarity-flipped: Navy surface, Oat text, Lava CTA inside."
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.on-secondary}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
  ex-asset-proof-card:
    description: "Asset review card in the proofing view. Oat-soft frame with Mirama Blue annotation indicators."
    backgroundColor: "{colors.canvas-soft}"
    textColor: "{colors.ink}"
    annotationColor: "{colors.mirama}"
    rounded: "{rounded.lg}"
    padding: "{spacing.lg}"
  ex-client-portal-card:
    description: "Org-chooser card in the client portal. Navy surface, white text."
    backgroundColor: "{colors.secondary}"
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

The surface is structured and calm. Two standout colors drive all brand expression: **Lava 600** (`{colors.primary}` `#FF3621`) for every vivid CTA and interactive pop, and **Navy 800** (`{colors.secondary}` `#1B3139`) as the structural dark anchor for bookend surfaces, sidebars, and save bars. A third accent - **Mirama Blue** (`{colors.mirama}` `#0075DE`) - carries all structural interactive affordances: inline links, active tab indicators, and focus signals. Everything else is neutral. Oat surfaces and White canvas let both standbouts read without noise.

Color emphasis comes from **surface contrast**, not type weight. Headlines never exceed weight 500. Large backgrounds use Navy, Oat, or White. Lava appears as pops: CTAs, active indicators, focused states, and notification dots. Never as a large background fill.

**Key Characteristics:**
- Lava 600 (`{colors.primary}` `#FF3621`) is the single vivid pop - every primary CTA, every active indicator, every notification badge.
- Navy 800 (`{colors.secondary}` `#1B3139`) is the structural anchor - all dark surfaces: nav bars, page bookends, settings card headers, sticky save bars.
- Mirama Blue (`{colors.mirama}` `#0075DE`) is the structural interactive accent - inline links, active tabs, focus rings, and annotation indicators on asset proofing surfaces.
- Page canvas is White (`{colors.canvas}` `#FFFFFF`) or Oat Light (`{colors.canvas-soft}` `#F9F7F4`). Section backgrounds step to Oat Medium (`{colors.canvas-medium}` `#EEEDE9`).
- Form pages use a fixed Navy 800 `sticky-save-bar` at the bottom - never a floating inline save button.
- Border radius is hierarchical: `{rounded.xl}` 16px for full-surface portal cards, `{rounded.lg}` 12px for mixed cards and primary CTAs, `{rounded.sm}` 6px for inputs.

## Colors

### Brand Standbouts
- **Lava 600** (`{colors.primary}` - `#FF3621`): The primary standout. Every primary CTA, every active state indicator, notification badge, focus ring, and interactive accent. Always white text on Lava. Hover: Lava 500 (`{colors.primary-hover}` `#FF5F46`). Active/pressed: Lava 700 (`{colors.primary-active}` `#BD2B26`).
- **Navy 800** (`{colors.secondary}` - `#1B3139`): The secondary standbout and structural anchor. Dark nav bars, page bookend headers and footers, sticky save bars, settings card header bands, sidebar in dark mode. Always Oat Light or white text on Navy. Elevated: Navy 700 (`{colors.secondary-elevated}` `#143D4A`) for popovers and dark-mode cards. Deepest: Navy 900 (`{colors.secondary-deep}` `#0B2026`).

### Mirama Blue
- **Mirama Blue** (`{colors.mirama}` - `#0075DE`): The structural interactive accent. Inline body links, active tab/nav indicator, focus ring variant, annotation indicators on asset proofing surfaces, `button-mirama` constructive secondary actions. Always white text on Mirama Blue. Active/pressed: (`{colors.mirama-active}` `#005BAB`). Deep full-bleed inversion: (`{colors.mirama-deep}` `#213183`).

### Surface
- **White** (`{colors.canvas}` - `#FFFFFF`): Default page canvas. The floor of every editorial body.
- **Oat Light** (`{colors.canvas-soft}` - `#F9F7F4`): Sidebar background, secondary card surfaces, input field backgrounds, auth form cards.
- **Oat Medium** (`{colors.canvas-medium}` - `#EEEDE9`): Section bands, hover backgrounds, secondary portal cards.
- **Gray Lines** (`{colors.hairline}` - `#DCE0E2`): 1px borders for inputs, table dividers, secondary button outlines.

### Text
- **Navy / Ink** (`{colors.ink}` - `#1B3139`): Strongest text. h1/h2 display, primary body. Navy IS the ink color.
- **Gray Navigation** (`{colors.ink-soft}` - `#303F47`): Default running text and nav items.
- **Gray Text** (`{colors.body}` - `#5A6F77`): Captions, breadcrumbs, and meta text.
- **Muted** (`{colors.mute}` - `#8DA4AC`): Lowest-priority text - fine print, placeholder text, column headers.

### Semantic
Use only when semantic clarity requires. Never as decorative surfaces.

- **Success** (`{colors.success}` - `#00A972`): Confirmation indicators, save-state dots. Outline variant: (`{colors.success-soft}` `#42BA91`).
- **Warning** (`{colors.warning}` - `#FFAB00`): Budget burn alerts, deadline warnings.
- **Danger** (`{colors.danger}` - `#98102A`): Destructive actions, error states.
- **Info** (`{colors.info}` - `#2272B4`): Secondary informational badges where Mirama Blue is too prominent. Focus variant: (`{colors.info-soft}` `#4299E0`).

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
- Weight 600 for app page display titles (`h1` on dashboard and content pages). Never use 700+ anywhere in the app.
- DM Sans for everything a user reads. Inter only for data values in tables and numeric readouts.
- Sentence-case for all labels, headings, and buttons. Never uppercase at display or title size.
- Eyebrow labels (`{typography.eyebrow}`) use 0.6px tracking - the system's only positive-tracked style.

## Layout

### Spacing System
- **Base unit:** 4px. All spacing snaps to 4px multiples.
- **Tokens:** `{spacing.xxs}` 4px · `{spacing.xs}` 8px · `{spacing.sm}` 12px · `{spacing.md}` 16px · `{spacing.lg}` 24px · `{spacing.xl}` 32px · `{spacing.2xl}` 48px · `{spacing.3xl}` 64px · `{spacing.section}` 96px.
- **App pages (with sidebar):** `px-10 md:px-16` horizontal, `py-10` vertical. Generous breathing room — ~64px side padding at desktop. No max-width centering; content stretches within the sidebar inset.
- **Portal / standalone full-page:** `px-6 md:px-10` horizontal, `py-16` vertical, `max-w-5xl mx-auto` centered.
- **Card internal padding:** `p-6` standard; `px-6 py-4` for Navy header bands inside settings cards.
- **App page background:** `bg-surface-soft` (Oat Light `#F9F7F4`). White canvas cards float on the oat surface — color contrast replaces shadow as depth signal.
- **Section rhythm (app pages):** Oat Light page bg → white canvas cards/panels. No dark bookends inside the app shell.

### Grid and Container
- **Max content width:** `max-w-5xl` (80rem) centered for portal chooser, settings, and form pages. `max-w-7xl` for full-width data tables and asset galleries. App dashboard pages use no max-width — padding alone governs the side margins.
- **Card grids:** `grid-cols-3` at desktop for org portal cards; `grid-cols-4` for secondary portal cards. Collapses to `grid-cols-2` at tablet, `grid-cols-1` at mobile.
- **Settings sections:** single-column, full-width cards stacked with `space-y-4`.
- **Task boards:** horizontal scroll at `grid-cols-[repeat(auto-fill,minmax(280px,1fr))]`.

### Whitespace Philosophy
Whitespace is the dominant atmospheric tool. Let sections breathe - `{spacing.section}` (96px) between major content bands. The page should feel calm between its Navy surface moments. The White canvas resets are as important as the content itself.

## Elevation and Depth

| Level | Treatment | Use |
|---|---|---|
| Flat | No shadow, no border | Navy surface bands - color provides depth |
| Hairline | 1px `{colors.hairline}` border | Inputs, table dividers, secondary button outlines |
| Soft card | `shadow-sm` + `border border-border/50` | White cards on a white page |
| Hover card | `-translate-y-0.5` + `shadow-[0_2px_12px_-2px_rgba(0,0,0,0.06)]` + `border-ink/20` | Org portal cards, secondary portal cards on hover — diffuse, not heavy |
| Sticky bar | Navy 800, no shadow | Fixed save bars - Navy surface provides contrast against White canvas above |

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

**`page-header`** - Display title block at the top of every app page (inside the sidebar inset). Padding `px-10 md:px-16 pt-8 pb-5`. Icon (18×18, `text-body-text`) + title (`text-[22px] font-semibold text-ink`) in a row; description (`text-sm text-body-text`) on the line below, indented `ml-7` to align with title text. Children slot on the right for action buttons. No bottom border — oat-soft page background provides separation.

**`portal-page`** - Full-page chooser layout. White canvas header (48px) with hairline bottom border, ink Mirama wordmark, ghost sign-out. White canvas content area with `max-w-5xl` centered. White canvas footer with hairline top border. No colored bookends — full white surface with hairline structure, consistent with professional SaaS dashboards (Cloudflare, Linear, Vercel). Auth and onboarding pages may use Navy bookends; the portal chooser does not.

**`sticky-save-bar`** - Fixed Navy 800 bar at the bottom of all multi-field form pages. `sticky bottom-0`, escapes parent padding with negative margin. Left: status indicator (pulsing dot + message) - Lava 600 dot when dirty, Green 600 dot when saved. Right: white bg / Navy text secondary action. Never put a save button floating inside a form's scroll content.

### Buttons

**`button-primary`** - Lava 600 CTA. `bg-lava text-white`, `{rounded.lg}` (12px), `h-11 px-6`. One per viewport. Hover: Lava 500 (`{colors.primary-hover}`). Active: Lava 700 (`{colors.primary-active}`).

**`button-secondary`** - White with Gray Lines outline. `bg-canvas text-ink border border-border`. Used alongside `button-primary` as the less-committed pair. On White canvas backgrounds.

**`button-secondary-dark`** - Same shape as `button-secondary` but used on Navy 800 surfaces (sticky save bars, dark bookends). White bg + Navy ink text - never invert to a translucent on-dark style.

**`button-mirama`** - Mirama Blue fill. `bg-mirama text-white`, `{rounded.lg}` (12px), `h-11 px-6`. For constructive secondary actions (Add, Create, Connect) when a Lava primary CTA is already present. Active: `{colors.mirama-active}`.

**`button-ghost`** - `hover:bg-hover text-ink-soft`. For icon-only or low-priority actions. No border.

### Cards and Containers

**`org-portal-card`** - White canvas card with hairline border in the org portal chooser. `{rounded.xl}` (16px). Split into two zones: top visual zone (`canvas-soft` bg, centered Lava 600 initial chip) and bottom content zone (org name, slug, member/project counts, "Enter workspace →" divider row). Hover: `-translate-y-0.5`, border shifts to `ink/20`, diffuse shadow `0 2px 12px -2px rgba(0,0,0,0.06)` — no harsh lift. All org cards use this consistent white treatment.

**`secondary-portal-card`** - White canvas card with hairline border for non-org portals (tenant portal, billing, settings shortcuts). `{rounded.xl}`. Horizontal layout: Navy 800 icon chip + label/description + arrow. Same hover behavior as org-portal-card. No accent color on the card surface.

**`settings-card`** - White canvas card with Navy 800 full-bleed header band. Parent card: `overflow-hidden {rounded.lg}`. `CardHeader`: Navy 800 bg, Oat Light text, `px-6 py-4`, `{typography.title-sm}`. `CardContent`: white, `pt-5`. All settings section cards use Navy 800 header - consistent structural identity across the platform.

**`card-content`** - Default Oat Light content card. Background `{colors.canvas-soft}`, text `{colors.ink}`, padding `{spacing.lg}`, shape `{rounded.lg}`. Used for feature cards, summary panels, and sub-content containers on White canvas pages.

**`hero-band`** - Full-width White canvas hero. No gradient, no decorative backdrop. Headline (`{typography.display-xl}`) + sub-headline + Lava 600 `button-primary` + `button-secondary` in `{spacing.section}` (96px) of vertical whitespace.

**`hero-band-dark`** - Full-width Navy 800 hero for marketing alternates and landing page dark sections. Same typography scale and button pair; text flips to Oat Light.

**`content-band-soft`** - Oat Light section band following the hero or between Navy moments. Background `{colors.canvas-soft}`, padding `{spacing.section} {spacing.xl}`, section headline in `{typography.display-md}`.

**`content-band-light`** - White canvas section band. Same padding and scale. Alternates with `content-band-soft` to create page rhythm.

### Inputs and Forms

**`text-input`** - `bg-canvas text-ink`, `{rounded.sm}` (6px), `h-10 px-3`, Gray Lines border. Focus: border recolors to `{colors.info-soft}` (Blue 500), ring to `{colors.primary}` (Lava 600). Placeholder text in `{colors.mute}`.

**`form-section`** - Each logical group of fields lives in a `settings-card` with a Navy header. Never put bare fields on the page without a section card container.

### Navigation

**`nav-bar`** - The top nav on marketing and auth surfaces. Navy 800 background, Oat Light / white text. Padding `{spacing.md} {spacing.xl}`.

**`app-sidebar`** - Oat Light bg in light mode. Gray Lines hairline dividers. Lava 600 active indicator: `h-0.5` top bar + `w-0.5` left bar on the active item + `bg-lava/10` background tint. No uppercase on group labels.

**`main-nav-item`** - Active: `bg-lava/10 text-lava` with left `w-0.5 bg-lava` indicator bar. Inactive: `text-ink-soft hover:bg-canvas-medium`.

**`data-table-header`** - `bg-canvas-soft border-b border-hairline`. Column head text: `{typography.caption} text-mute` - no uppercase, no tracking, no weight above 500.

### Signature Components

**`eyebrow`** - Small uppercase label above section headlines. Text `{colors.ink}`, set in `{typography.eyebrow}` (12px / 500 / 0.6px tracking). Used sparingly to mark section type.

**`badge-pill`** - Inline status and metadata pill. Background `{colors.canvas-soft}`, text `{colors.ink}`, `{typography.caption}`, padding `{spacing.xxs} {spacing.xs}`, shape `{rounded.full}`. Lava variant (`badge-pill-primary`) for active status. Mirama Blue variant (`badge-pill-mirama`) for linked/connected states.

**`footer`** - Navy 800 footer. Background `{colors.secondary}`, text `{colors.canvas-soft}`, padding `{spacing.2xl} {spacing.xl}`. Body in `{typography.body-md}`.

### Examples (illustrative)

**`ex-pricing-tier`** - Default pricing tier card. Canvas-soft surface with hairline border.
- Properties: `backgroundColor`, `textColor`, `borderColor`, `rounded`, `padding`

**`ex-pricing-tier-featured`** - Featured/highlighted tier. Polarity-flipped: Navy surface + Oat text + Lava CTA inside.
- Properties: `backgroundColor`, `textColor`, `rounded`, `padding`

**`ex-asset-proof-card`** - Asset review card in the proofing view. Oat-soft frame, Mirama Blue annotation indicators, version badge in bottom corner.
- Properties: `backgroundColor`, `textColor`, `annotationColor`, `rounded`, `padding`

**`ex-client-portal-card`** - Org-chooser card in the client portal. Navy surface, white text, Lava active indicator.
- Properties: `backgroundColor`, `textColor`, `activeIndicator`, `rounded`, `padding`

**`ex-app-shell-row`** - Sidebar nav row. Active state: Lava left-bar indicator + `bg-lava/10` tinted background.
- Properties: `backgroundColor`, `activeIndicator`, `activeBackground`, `rounded`, `padding`

**`ex-data-table-cell`** - Data-table `th` + `td` chrome. Header uses `{typography.caption}` in `{colors.mute}`; body uses `{typography.body-md}`.
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
- **Use Navy 800 as the structural anchor** for auth/onboarding bookends, sticky save bars, icon chips, and `settings-card` header bands. Never as a full app-page surface.
- **Use Lava 600 as the single vivid pop** - primary CTAs, active indicators, focus rings, notification dots, and accent chips. One per viewport maximum for primary CTAs.
- **Use Mirama Blue for all structural interactive affordances** - inline links, active tab indicators, annotation markers on asset proofing surfaces, and `button-mirama` constructive secondary actions.
- **App pages use `bg-surface-soft`** (Oat Light) as the page canvas. White canvas cards (`bg-canvas` + `border-hairline`) float on top — color contrast provides depth without shadows.
- **Portal chooser uses white canvas** header and footer with hairline borders. No Navy bookends on the portal chooser page.
- Use Navy 800 bookend header and footer on **auth and onboarding surfaces only**.
- Use `sticky-save-bar` on all multi-field form pages. Never leave a floating save button inside the form scroll area.
- Keep `button-primary` Lava 600. Mirama's primary CTA is Lava - not Navy, not Mirama Blue.
- Use `overflow-hidden` on any card that has a colored `CardHeader` band so the color clips to the card's border radius.
- Keep `{rounded.xl}` (16px) for portal and content cards. `{rounded.lg}` (12px) for mixed cards (Navy header + white body) and all CTA buttons.
- Hover on white canvas cards: `-translate-y-0.5 border-ink/20 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.06)]` — diffuse, not heavy.

### Don't
- Don't use Lava as a large background surface. It is a pop color - the CTA, the dot, the chip, the active bar. Never a full card or section band.
- Don't cycle multiple colors across repeated items. All org portal cards use Navy 800 - no coral, forest, peach, or mint.
- Don't make Mirama Blue the primary CTA color. It is the structural interactive accent. The primary CTA is always Lava 600.
- Don't add gradients, mesh backgrounds, or aurora effects to page surfaces. Oat-soft and white canvas are intentional.
- Don't bold display-weight type. `display-xl` and `display-lg` are intentionally 400–500 weight. Emphasis comes from size.
- Don't add a save button floating inside a form's scroll content. It belongs in the `sticky-save-bar`.
- Don't use `uppercase` or `tracking-widest` on UI labels, column headers, or card titles. Reserve tracking for `{typography.eyebrow}` only.
- Don't shadow Navy cards. The Navy surface provides all needed depth. `shadow-sm` only on white-bg cards within a white page.
- Don't introduce accent colors beyond Lava 600, Navy 800, and Mirama Blue for branding surfaces. The extended palette is for semantic states only.
- Don't use pure black (`#000000`) anywhere in light mode. Navy 800 (`#1B3139`) is the darkest surface and text color in the light palette.

## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Mobile | < 640px | Single-column card grids; sidebar collapses to icon-only; portal cards stack; sticky save bar spans full width |
| Tablet | 640–1024px | 2-up card grids; secondary portal cards 2-up; sidebar may collapse |
| Desktop | 1024–1440px | 3-up org cards; 4-up secondary portals; full sidebar expanded |
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

Dark mode uses a **pure gray/black palette** — no blue or teal tint. All functional tokens flip via CSS custom properties; brand accent colors (Lava, Mirama Blue) stay unchanged.

### Dark Palette

| Token | Light | Dark | Notes |
|---|---|---|---|
| `bg-background` | `#ffffff` | `#121212` (0 0% 7%) | Page background |
| `bg-canvas` | `#ffffff` | `#1a1a1a` (0 0% 10%) | Card surface |
| `bg-surface-soft` | `#f9f7f4` | `#141414` (0 0% 8%) | Page canvas, sidebar bg |
| `bg-surface-medium` | `#eeede9` | `#242424` (0 0% 14%) | Hover surface, chips |
| `bg-surface-strong` | `#eeede9` | `#2e2e2e` (0 0% 18%) | Elevated surfaces |
| `bg-surface-dark` | `#1b3139` (navy) | `#0f0f0f` (0 0% 6%) | Darkest surface |
| `text-ink` | `#1b3139` | `#f7f7f7` (0 0% 97%) | Primary text |
| `text-body-text` | `#303f47` | `#adadad` (0 0% 68%) | Secondary text |
| `border-hairline` | `#dce0e2` | `#333` (0 0% 20%) | Borders, dividers |
| `sidebar-background` | oat light | `#171717` (0 0% 9%) | Sidebar bg |
| `sidebar-accent` | oat medium | `#242424` (0 0% 14%) | Sidebar hover/active |

### Rules for Dark Mode
- All grays are **neutral** (saturation 0). No blue, teal, or warm tints.
- Lava 600 (`#ff3621`) and Mirama Blue (`#0075de`) are unchanged — they read well on dark surfaces.
- `bg-canvas` in dark is `#1a1a1a` — white cards become dark cards automatically since all cards use `bg-canvas`.
- Navy-surface components (`settings-card` header bands, `sticky-save-bar`, `surface-dark`) collapse to the darkest gray tier (`0 0% 6%`) rather than staying teal-navy.
- Hairline borders shift from `#dce0e2` to `#333` — same visual weight, dark-adapted.

## Iteration Guide

1. Focus on one component at a time. Reference its token key (`org-portal-card`, `settings-card`, `sticky-save-bar`).
2. Every new page color plan: page bg is `bg-surface-soft`, content cards are `bg-canvas`, Lava pops on CTAs and active indicators only.
3. New content cards use white canvas + hairline border. Navy 800 card headers only on `settings-card` pattern (explicitly opted in).
4. New form pages must include `sticky-save-bar`. Never ship a form without it.
5. New section cards follow the `settings-card` pattern: `overflow-hidden` card, Navy 800 header band, white body.
6. Mirama Blue (`{colors.mirama}`) is the correct color for any interactive affordance that is not the primary CTA. Links, active tabs, annotation pins, focus outlines.
7. When in doubt about emphasis: bigger type before bolder type, Navy surface before any other depth treatment.
8. Run `yarn lint` after every change - Biome enforces import order and Tailwind canonical class names.

## Known Gaps

- Animation and transition timings are not yet formalized as tokens. Current convention: `duration-200` for card hover and button state, `duration-300` for sidebar open/close transitions.
- The `sticky-save-bar` pattern is implemented for settings pages. Multi-step forms (onboarding, org creation, client intake wizard) should adopt it when built.
- Asset proofing annotation layer (`ex-asset-proof-card`, Mirama Blue annotation indicators) is designed but not yet implemented - component spec is in place.
- Components previously using a multi-color cycling pattern (coral, forest, peach, mint, yellow, mustard per org card) need migration to the Navy 800 consistent pattern.
- Dark mode is implemented. See the **Dark Mode** section above for the palette. The `.dark` class on `<html>` activates it.
- Logo upload in org settings is currently a placeholder (S3 integration pending). The Dropzone component is in place but the upload handler returns a stub.
