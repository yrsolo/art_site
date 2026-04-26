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

## Update 2026-03-21 Backend-driven prototype campaigns

- The next pass moves the project from "editable runtime exists" to "all sketches are actually driven by that runtime".
- Immediate focus:
  - seed text CMS entries from current sketch copy;
  - allow saving text versions as numbered copies;
  - connect all variant layouts to the live admin entrypoint;
  - ensure gallery/detail routes render live lot data and photos instead of template-only placeholders where possible;
  - add grouped lot views in admin for large imported collections.

## Update 2026-03-21 Artwork detail pass

- The next concrete step after text seeding and grouped admin lists is the public artwork detail contract.
- Focus for this pass:
  - carry `photos[]` and `primaryPhotoId` from published snapshot into `showcase` artwork types;
  - let detail pages show real lot metadata such as series, status, and price where the variant composition allows it;
  - use additional artwork photos on public detail screens instead of unrelated placeholder shots where possible;
  - keep the variant-specific layouts intact while making the data source genuinely backend-driven.

## Update 2026-03-21 Gallery grouping and ordering

- After the artwork detail contract pass, the next stage moves the public galleries and the admin list from static presentation into controllable browsing surfaces.
- Immediate focus:
  - finish remaining backend-driven detail gaps in `cold-mist` and `copper-glow`;
  - introduce one shared gallery-state model for `all / year / series`, manual collapse state, and progressive reveal;
  - adapt grouping controls and group headers per sketch so they feel native to each variant instead of looking generic;
  - extend the admin grouped list from one global collapse flag to full per-group collapse / expand controls;
  - add a dedicated order-management surface in admin that edits the shared `sortOrder` used by every showcase variant.

## Update 2026-03-21 Prototype CTA cleanup

- After grouped galleries landed, the next small hardening pass is removing leftover fake-looking actions from public variants.
- Focus for this pass:
  - replace decorative `href="#"` footer links with real internal routes;
  - replace pseudo-actions such as `PLAY` and `Скачать спецификацию` with real inquiry/navigation flows where no real download exists yet;
  - keep contact forms as the only intentionally fake workflow.

## Update 2026-03-21 Archive and CMS stabilization

- The next implementation stage moves the catalog from "grouped and reorderable" to "editorially manageable at scale".
- Immediate focus:
  - add an explicit archive flag instead of overloading artwork sale status;
  - normalize summary/public filtering so admin and showcase agree on year, archive state, and gallery visibility;
  - repair the text CMS flow so current sketch texts always appear as the default editable version and save/publish no longer feel lossy;
  - add archive-aware bulk actions, grouped list behavior, and touch-friendly ordering controls.

## Update 2026-03-22 Content storage cleanup

- Runtime content storage was audited after the CMS seed/versioning bug had already created a large number of orphaned JSON objects in Object Storage.
- The cleanup pass is intentionally conservative:
  - first inventory and local backup of live `index.json`, `publication`, and currently referenced content-version files;
  - then delete only unreferenced content-version objects under `private/data/content/`.
- Public site media and artwork data are not part of this cleanup scope.

## Update 2026-03-22 Architecture V2 pivot

- The next implementation stage moves the public site away from build-time embedded content toward a true `static shell + live public data` model.
- Focus for this pass:
  - publish a versioned public snapshot that can be fetched directly by the static showcase at runtime;
  - keep `apps/showcase` static, but stop treating `src/generated/public-site.json` as the primary runtime source of truth;
  - introduce a dedicated `site-assets` domain and thread it through the public publication contract so future editable hero / biography images do not require another model rewrite;
  - start separating editorial write-models from the public read-model more explicitly, even while Object Storage remains the storage backend.

## Update 2026-03-22 Architecture V2 runtime fetch

- `apps/showcase` now uses a client-side public snapshot provider and fetches the published JSON snapshot at runtime instead of relying on a build-time bundled snapshot as its primary source.
- Backend publication now writes a versioned public snapshot to both:
  - private runtime storage;
  - public bucket object `s3://art.solofarm.ru/data/public-site.json`.
- Public bucket CORS was enabled so the static showcase can read the published JSON from the public storage URL without going through the private API runtime.
- `site-assets` has been added as a first-class domain contract in the backend/public snapshot, even though its editor UI is still a later campaign.

## Update 2026-03-22 Runtime shell routing

- `apps/showcase` now ships as a shell-based static app:
  - only `/` and `_not-found` are physically exported;
  - variant and artwork routes are resolved at runtime from `window.location.pathname`.
- Internal showcase navigation no longer depends on `next/link`; a dedicated shell link component updates history and lets the runtime router redraw the correct screen.
- Old physical route objects such as `cold-mist/...` and `*/artwork/*` are no longer required in the public bucket.
- Remaining boundary:
  - the current website-hosting setup still produces one noisy `404` request in the browser console;
  - a cleaner infra-level rewrite/fallback layer is still a future hardening step, but it is no longer required for the shell to function.

## Update 2026-03-22 Public rewrite gateway

- Added a dedicated deploy script for `art.solofarm.ru` that creates or updates a public API Gateway in front of the showcase bucket.
- The gateway uses `object_storage` integration and rewrites unknown app paths back to `index.html` with `200`.
- This keeps the public site static while removing the need to publish a physical page per `variant + artwork slug`.
- The gateway itself is already live and validated on its default `apigw.yandexcloud.net` domain.
- Remaining external tail: the managed certificate for the custom domain `art.solofarm.ru` is still in `VALIDATING`, so the final DNS cutover to the public gateway is waiting on certificate issuance.

## Update 2026-03-22 Site-assets editor foundation

- The next future-proof domain layer after runtime public snapshot is now being implemented as editable `site-assets`.
- This pass adds:
  - backend admin routes for listing, loading, saving, cloning, and publishing slot media versions;
  - a static admin page for page-media slots;
  - first real showcase wiring for published `home.heroImage` and `about.portraitImage` values.
- The goal is not a final media CMS yet; the goal is to make hero/portrait media a clean domain with publishable contracts now, so later UX improvements do not require another storage/model rewrite.

## Update 2026-03-22 Public gateway cutover complete

- The custom certificate for `art.solofarm.ru` is now issued and attached to the public API Gateway.
- `art.solofarm.ru` now resolves to the public gateway rewrite layer instead of the raw bucket website endpoint.
- Deep links on the production domain now return `200` through the shell-routing architecture, so the public site is finally running in the intended `static shell + live data + pretty URLs` mode.

## Update 2026-03-22 Backend deploy path unstuck

- The new `site-assets` routes are now present on the production API runtime.
- Root cause of the earlier rollout issue:
  - the workstation Docker environment was unstable when running `next build` inside `docker build`;
  - serverless revisions kept rolling forward on old tags/images.
- A fallback deployment path now exists:
  - build `apps/web` locally;
  - package a minimal prebuilt runtime image from `.next/standalone`;
  - deploy with `scripts/deploy-yc-web.ps1 -Tag <tag> -SkipBuild`.
- This keeps the backend rollout unblocked even while the local Docker buildx path remains unreliable.

## Update 2026-03-22 Artwork photo upload repair

- Artwork photo upload is now the primary blocking bug in the editorial flow:
  - the admin UI submits `multipart/form-data` correctly;
  - production API receives the request;
  - current upload fails with `500 Internal Server Error`.
- This repair pass focuses on:
  - making the upload route return structured JSON errors instead of an opaque `500`;
  - separating upload pending state from the generic artwork save pending state in the drawer UI;
  - limiting v1 uploads to raster artwork formats (`jpeg/png/webp`);
  - removing per-object `public-read` ACL from media writes so bucket/prefix policy remains the visibility source of truth.

## Update 2026-04-26 Variant-wide content presets

- The current editor pass changes the admin `Тексты` surface from page-by-page editing to variant-wide editing.
- Backend content storage remains page-scoped (`variantId + pageKey`) for compatibility and clean publication, but the admin UI now treats a preset as one named set of versions across all pages of a variant.
- Focus for this pass:
  - show all page text fields for the selected variant on one editor page;
  - make `Сохранить`, `Сохранить как копию`, and `Опубликовать` operate on the whole variant preset;
  - add a sidebar tree under preset selection with collapsible pages and text-field anchors;
  - keep per-variant/per-page schemas flexible so different sketches can continue to have different text structures.

## Update 2026-04-26 Aggregate content publish

- Follow-up focus: remove the temporary client-side loop that published variant-wide presets through five independent page publish calls.
- Target shape:
  - one admin API request publishes the whole variant preset;
  - backend saves/creates the page versions, updates publication state, and exports the public snapshot once;
  - the existing page-scoped content storage remains intact.

## Update 2026-04-26 Content tree and preset deletion

- Follow-up editor UX pass:
  - make the content structure tree look closer to a standard Figma-style sidebar tree;
  - add safe preset deletion for variant-wide text presets;
  - keep deletion server-side so page-level version files and indices stay consistent.
