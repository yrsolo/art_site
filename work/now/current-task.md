# Current Task

## Этап

Literal transfer of public variant screens from source templates.

## Цель

Сохранить уже выделенную variant-архитектуру, но перестать делать "похожие" витрины.
Текущий фокус:
- переносить `cold-mist`, `copper-glow`, `mint-rose` от исходных `code.html`, а не от усреднённых React-компонентов;
- использовать оригинальные template media, тексты, типографику и композицию там, где это возможно;
- держать общими только backend/data/admin слои;
- не смешивать визуальные решения разных витрин.

## Граница Этапа

В этот этап не входит админская инфраструктура, Docker и production backend-публикация.
Публичная витрина продолжает жить как статический showcase.

## Update 2026-03-20

- Right-side variant rail is now rendered consistently outside internal variant headers.
- Root catalog `/` is now treated as a minimalist chooser instead of a themed landing page.
- Public coverage now includes dedicated implementations for `etheric-pulse`, `olive-cream`, and `sage-sand`.
- Dark variants also received dedicated `about` / `contacts` surfaces where generic fallback was still visible.

## Update 2026-03-20 Deep Immersion

- Added missing base dark-atmosphere variant from `stitch_dark_atmosphere_portfolio_prd/home` and `gallery` as separate public face: `deep-immersion`.
- Variant is now wired through manifest, content, route branches, template media, root catalog, and right-side variant rail.
- Public preview is published and reachable on `art.solofarm.ru/deep-immersion/...`.

## Update 2026-03-20 Localization pass

- `etheric-pulse` received a finished lower page structure instead of abruptly truncated endings.
- `copper-glow` public layout is now centered and constrained instead of stretching elastically across the whole viewport.
- `cold-mist` hero heading spacing was relaxed so the large Russian lines no longer collapse into each other.
- Public copy is being moved to Russian not only inside literal screens, but also in shared variant content used by the showcase catalog and organic variants.
