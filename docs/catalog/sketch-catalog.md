# Sketch Catalog

## Purpose

This document is the canonical catalog of frontend variants for the artist portfolio.

The project does **not** treat these references as interchangeable color themes. They are separate frontend faces over one shared backend.

## Current Variant Inventory

### 1. `deep-immersion`

- Family: `dark_atmosphere`
- North star: `The Abyss Reader`
- Source pages:
  - `home`
  - `gallery`
  - `artwork_detail`
  - `about`
  - `contact`
- Core characteristics:
  - deep abyss background with blue accent
  - sharp 40/60 hero split
  - simple masonry archive with hover glow
  - Russian collector-facing copy
  - no-radius structure and clean editorial restraint
- Mandatory fidelity points:
  - keep the blue accent and do not neutralize it
  - keep the split hero instead of converting it into cards
  - keep this distinct from `cold-mist` fog language and `etheric-pulse` glow language

### 2. `cold-mist`

- Family: `dark_atmosphere`
- North star: `The Ethereal Monolith`
- Source pages:
  - `home_mist`
  - `gallery_mist`
  - `detail_mist`
  - `about`
  - `contact`
- Core characteristics:
  - zero-radius geometry
  - tonal layering instead of lines
  - cold slate palette
  - tight editorial typography
  - fog / frosted depth
- Mandatory fidelity points:
  - no rounded corners
  - no visible section borders
  - no warm copper lighting drift

### 3. `copper-glow`

- Family: `dark_atmosphere`
- North star: `The Cinematic Alchemist`
- Source pages:
  - `home_copper`
  - `gallery_copper`
  - `detail_copper`
  - `about`
  - `contact`
- Core characteristics:
  - abyss-like dark surfaces
  - copper radial glows
  - brutalist sharp corners
  - cinematic editorial asymmetry
- Mandatory fidelity points:
  - keep warm spotlight logic
  - keep 0px corner system
  - do not flatten into generic dark gallery UI

### 4. `etheric-pulse`

- Family: `dark_atmosphere`
- North star: `The Ethereal Curator`
- Source pages:
  - `home_energy_flows`
  - `gallery_energy_flows`
  - `artwork_detail`
  - `about_energy_flows`
  - `contact`
- Core characteristics:
  - void background with violet/teal/rose energy accents
  - glassmorphism surfaces
  - softer geometry and glow-led hierarchy
  - breathing motion and fluid behavior
- Mandatory fidelity points:
  - keep glow as structural logic
  - keep rounded interactive feeling
  - do not harden into brutalist dark mode

### 5. `mint-rose`

- Family: `organic_flow`
- North star: `Cozy fluid immersion`
- Source pages:
  - `home_1`
  - `gallery_1`
  - `artwork_detail_1`
  - `contact`
- Core characteristics:
  - mint and powder-rose palette
  - soft liquid masks
  - glass surfaces and blur
  - delicate emotional tone
- Mandatory fidelity points:
  - preserve blob masking and softness
  - keep tender copy tone
  - do not inject hard rectangles or severe hierarchy

### 6. `olive-cream`

- Family: `organic_flow`
- North star: `Earthy tactile catalog`
- Source pages:
  - `home_2`
  - `gallery_2`
  - `artwork_detail_2`
  - `contact`
- Core characteristics:
  - olive and cream tactile palette
  - literary serif rhythm
  - heavier editorial feel than mint-rose
  - soft olive-tinted shadowing
- Mandatory fidelity points:
  - preserve tactile weight
  - preserve literary pacing
  - do not brighten into airy pastel softness

### 7. `sage-sand`

- Family: `organic_flow`
- North star: `Calm intimate discovery`
- Source pages:
  - `home_3`
  - `gallery_index`
  - `about`
  - `contact`
- Detail source currently inferred from family-compatible organic detail references
- Core characteristics:
  - sage and sand base
  - soft clay accenting
  - personal narrative emphasis
  - intimate, non-corporate rhythm
- Mandatory fidelity points:
  - preserve personal warmth
  - preserve soft asymmetry
  - do not import heavier olive density or dark editorial severity

## Coverage Matrix

| Variant | Home | Gallery | Detail | About | Contact |
| --- | --- | --- | --- | --- | --- |
| `deep-immersion` | yes | yes | yes | yes | yes |
| `cold-mist` | yes | yes | yes | yes | yes |
| `copper-glow` | yes | yes | yes | yes | yes |
| `etheric-pulse` | yes | yes | yes | yes | yes |
| `mint-rose` | yes | yes | yes | no dedicated source | yes |
| `olive-cream` | yes | yes | yes | no dedicated source | yes |
| `sage-sand` | yes | yes | family-derived detail strategy | yes | yes |

## Strategy For Missing Screens

- Missing screens must be completed within the same variant family.
- Do not borrow UI primitives from another family to fill gaps.
- If a variant lacks a dedicated source page:
  - use its own family rules
  - use its own typography/palette/shape language
  - record the extrapolation explicitly in implementation docs

## Pipeline For Exact Transfer

1. Catalog entry
2. Screen inventory
3. Invariant extraction
4. Component breakdown
5. Text capture
6. Fidelity checklist

## Literal Transfer Method

- Start from the original `code.html`, not from the current React implementation.
- Transfer page structure block-by-block in the same order as the source.
- Keep the original typography pair, icon set, spacing rhythm, and surface hierarchy unless a technical constraint makes that impossible.
- Preserve the original copy for the source screen; only substitute dynamic artwork fields where the source clearly expects content slots.
- If a React abstraction makes the page less exact, prefer a more literal component over a more elegant abstraction.
- Treat screenshots as fidelity checks, not mood references.

## Do Not Dilute Rule

When implementing a variant:

- do not average multiple variants into one compromise
- do not treat palettes as the primary difference
- do not share visual components unless they are truly backend-driven and visually invisible
- do not use one family to “repair” another family’s missing edge cases
