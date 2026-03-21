# Current Task

## Этап

Static frontend split with backend-only container and bucket-backed content source.

## Цель

Перевести проект из схемы `mixed Next app` в новую архитектуру:
- `apps/showcase` как статическая публичная витрина;
- `apps/admin` как статическая админка;
- `apps/web` как backend-only runtime для auth, API, uploads и публикации данных;
- Object Storage как источник истины для JSON-данных, медиа и published snapshot.

Текущий фокус:
- расширить доменную модель лотов до production-полей;
- завести storage-backed repositories и bootstrap auth settings;
- собрать нейтральную статическую админку с таблицей лотов, редактором карточки и редактором текстовых версий;
- подключить `showcase` к published snapshot вместо жёстко прошитых данных;
- подготовить publish/deploy scripts и docs под новую схему.

## Граница Этапа

В этот этап входит рабочий MVP нового admin/data/runtime-контура.
Не входит: финальная облачная полировка доменов, полное закрытие старых public route слоёв внутри `apps/web`, идеальный production hardening и все будущие role-based расширения.

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

## Update 2026-03-21 Infra rollout

- Public static showcase is already live on `art.solofarm.ru`.
- The next operational step is to bring the separated admin and API contours online without collapsing them back into one mixed runtime.
- Target cloud shape for this rollout:
  - `admin.art.solofarm.ru` -> static admin bucket publication
  - `api.art.solofarm.ru` -> backend-only runtime behind a dedicated gateway/domain
- This pass also includes hardening local deploy scripts so bucket publication and container rollout are reproducible from the repo instead of being one-off console actions.

## Update 2026-03-21 Infra live

- `admin.art.solofarm.ru` is now live as a static admin bucket with HTTPS.
- `api.art.solofarm.ru` is now live through API Gateway -> Serverless Container.
- Cross-subdomain cookie auth between static admin and backend runtime is confirmed working with `Domain=.art.solofarm.ru`.

## Update 2026-03-21 Sketch import wiring

- Static admin is now the real entrypoint for live artwork operations at `https://admin.art.solofarm.ru/login/`.
- Admin navigation was stabilized for the bucket-hosted static build so route transitions no longer look broken because of noisy prefetch failures.
- Added a server-side import path that converts current sketch gallery images into editable runtime lots with stored photos, metadata, and snapshot export.
- Imported sketch galleries are now represented in the runtime artwork repository instead of only existing as template-only media in the public showcase layer.
- Public snapshot was rebuilt from the runtime data bucket after import, so showcase publication can now follow the editable artwork dataset rather than only fallback hardcoded data.

## Update 2026-03-21 Artwork drawer UX

- Artwork creation and opening now use a dedicated overlay drawer instead of rendering the editor deep below the long lots table.
- This keeps the working context near the user even when the repository already contains dozens of imported sketch lots.
- The admin lots list remains the stable base layer, while create/open actions bring the card editor to the foreground as a separate panel.
