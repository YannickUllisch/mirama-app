// src/modules/tenant/organization/slug.ts

// Mirrors the backend's slug shape (see CreateOrganization.Validation.cs): lowercase
// letters, numbers and hyphens only, no leading/trailing/doubled hyphens.
export const ORG_SLUG_REGEX = /^[a-z0-9]+(-[a-z0-9]+)*$/

// Best-effort suggestion only - the user can freely edit it before submitting, and the
// backend is the actual source of truth for validity + uniqueness.
export const slugify = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 63)
