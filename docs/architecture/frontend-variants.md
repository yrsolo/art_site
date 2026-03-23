# Frontend Variants

## Principle

The project uses one shared backend and multiple independent frontend faces.

These faces are not themes layered on top of one universal UI. They are separate variants with their own:

- page composition
- shell and navigation rhythm
- typography
- spacing system
- shape language
- hover and motion behavior
- content tone and CTA wording where required

## Shared Layer

The following remain shared:

- auth/admin
- API layer
- `Artwork` model
- repository contract
- media/storage contract
- public data access

## Variant Layer

Each variant owns:

- route namespace
- manifest
- content bundle
- page rendering
- design invariants

## Route Strategy

Public variants live under explicit namespaces:

- `/<variant>`
- `/<variant>/gallery`
- `/<variant>/artwork/[slug]`
- `/<variant>/about`
- `/<variant>/contacts`

The root route `/` is a catalog for comparing variants.

Legacy top-level public routes may redirect to the default variant, but they are not the primary architecture.

## Implementation Rule

Never solve a fidelity problem in one variant by borrowing visual structure from another variant.

If a screen is missing:

- derive it from the same variant or at minimum the same family
- record the extrapolation
- preserve the original design language
