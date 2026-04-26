# Evidence

## Подтверждено По Репозиторию

- в `brif/brif.md` зафиксирован стек `Next.js + TypeScript + Tailwind CSS`;
- в брифе предусмотрены публичный сайт и закрытая админка;
- в `ref/template/` находятся не только 2 family-направления, но как минимум 6 самостоятельных frontend-вариантов;
- часть variant differences затрагивает не только цвета, но page sets, copy tone, geometry, typography, interaction logic and layout rhythm.

## Сделано На Этом Этапе

- создан постоянный каталог эскизов в `docs/catalog/sketch-catalog.md`;
- добавлен архитектурный документ про независимые frontend-витрины;
- заведены `VariantManifest` и per-variant content layer;
- public routing переведён на `/<variant>/...`;
- корневой `/` превращён в каталог сравнения вариантов;
- старые top-level public routes переведены на redirect в default variant;
- backend/admin/data layer оставлены общими.
- для `cold-mist` выполнен literal-style перенос `home`, `gallery` и `detail` с использованием template media;
- для `copper-glow` и `mint-rose` усилена близость к исходникам по media, типографике и композиции;
- панель переключения вариантов вынесена в отдельный вертикальный rail на правом краю экрана;
- статический showcase опубликован в bucket-hosted preview на `art.solofarm.ru`.

## Локальные И Публичные Проверки

- `npm run build:showcase` проходит успешно;
- `bash scripts/docs-check.sh` проходит успешно;
- публикация через `scripts/publish-showcase.ps1` выполнена успешно;
- `http://art.solofarm.ru/cold-mist/` отвечает `200`;
- `http://art.solofarm.ru/cold-mist/gallery/` отвечает `200`;
- `http://art.solofarm.ru/copper-glow/gallery/` отвечает `200`;
- `http://art.solofarm.ru/mint-rose/gallery/` отвечает `200`.

## Не Подтверждено Кодом Пока Что

- точный 1:1 перенос каждого `code.html` и `screen.png` в production-grade React implementation;
- полнота page coverage для missing screens внутри отдельных organic variants;
- финальная облачная публикация статической админки на отдельный bucket/domain;
- production-поддомены `admin.art.solofarm.ru` и `api.art.solofarm.ru`;
- финальная контейнерная публикация API runtime.

Эти пункты остаются следующими этапами после стабилизации variant architecture и последовательного faithful transfer каждого эскиза.

## Update 2026-03-20

- Added dedicated showcase components for `etheric-pulse`, `olive-cream`, and `sage-sand`.
- Added dedicated `about` / `contacts` treatments for `cold-mist` and `copper-glow`, and dedicated `contacts` for organic variants where needed.
- Moved the variant rail outside internal variant headers so it stays visually stable at the right center.
- Reworked `/` into a simpler square-preview catalog.
- `npm run lint` passed.
- `npm run build:showcase` passed.
- `bash scripts/docs-check.sh` passed.
- `scripts/publish-showcase.ps1` completed successfully.
- Live checks returned `200` for `/`, `/etheric-pulse/`, `/olive-cream/gallery/`, `/sage-sand/about/`, and `/cold-mist/contacts/`.

## 2026-03-20 - Deep Immersion added

- Implemented new variant `deep-immersion` as the missing seventh dark-atmosphere face.
- Sources used: `home`, `gallery`, `artwork_detail`, `about`, `contact` from `ref/template/stitch_dark_atmosphere_portfolio_prd/`.
- Validation: `npm run build:showcase`, `npm run lint`, `bash scripts/docs-check.sh`.
- Published to bucket and verified with `curl.exe -I`:
  - `http://art.solofarm.ru/deep-immersion/` -> 200
  - `http://art.solofarm.ru/deep-immersion/gallery/` -> 200
  - `http://art.solofarm.ru/deep-immersion/about/` -> 200
  - `http://art.solofarm.ru/deep-immersion/contacts/` -> 200
  - `http://art.solofarm.ru/deep-immersion/artwork/silent-void-study/` -> 200

## 2026-03-20 - Russian copy and dark-variant cleanup

- Updated `etheric-pulse` home/gallery/about endings so the variant no longer stops on unfinished lower-page sections.
- Constrained `copper-glow` to a centered content column instead of a fully elastic full-width composition.
- Increased `cold-mist` hero line-height for the oversized Russian headline block.
- Moved shared showcase copy for `mint-rose`, `olive-cream`, and `sage-sand` to Russian in `apps/showcase/src/features/variants/content.ts`.
- Validation:
  - `npm run build:showcase`
  - `npm run lint`
  - `bash scripts/docs-check.sh`
  - `powershell -ExecutionPolicy Bypass -File scripts/publish-showcase.ps1`
- Live GET checks after publish:
  - `http://art.solofarm.ru/etheric-pulse/` -> 200
  - `http://art.solofarm.ru/etheric-pulse/gallery/` -> 200
  - `http://art.solofarm.ru/etheric-pulse/about/` -> 200
- `http://art.solofarm.ru/copper-glow/` -> 200
- `http://art.solofarm.ru/cold-mist/` -> 200

## 2026-03-21 - Static admin + backend-only runtime architecture

- Добавлен новый workspace `apps/admin` как статический frontend для админки.
- `apps/web` очищен от публичного route layer и теперь собирается как backend-only runtime с API для:
  - auth/session/change-password
  - artwork CRUD
  - photo upload/delete/set primary
  - content version CRUD + publish
  - public snapshot export
- Источник истины для runtime данных переведён на Object Storage-backed JSON layer с локальным fallback-режимом.
- Расширена доменная модель лота:
  - multiple photos
  - series
  - materials
  - price/currency
  - `showInGallery`
  - `primaryPhotoId`
  - новые статусы `for_sale | sold | off_market | in_progress`
- Добавлен bootstrap auth settings flow с паролем `333` и флагом `passwordIsDefault`.
- `apps/showcase` теперь умеет читать published snapshot из generated JSON input и использовать fallback только если snapshot ещё не выгружен.
- Добавлены/обновлены operational files:
  - `.env.example`
  - `scripts/publish-showcase.ps1`
  - `scripts/publish-admin.ps1`
  - `scripts/test.sh`
  - docs по backend/env/commands/deploy

### Проверки

- `npm install`
- `npm run lint --workspace web`
- `npm run lint --workspace admin`
- `npm run build --workspace web`
- `npm run build --workspace admin`
- `npm run build --workspace showcase`
- `bash scripts/docs-check.sh`

### Осталось

- отдельная облачная публикация static admin на bucket/domain;
- подключение реального bucket-backed snapshot к `publish-showcase` на постоянной основе в production;
- live-проверка полного auth/upload/content flow против облачного backend runtime;
- дальнейшее добивание literal-transfer эскизов после стабилизации нового admin/data контура.

## 2026-03-21 - Infra rollout for admin/art/api split

- Added application-side cross-subdomain support in `apps/web`:
  - CORS headers for allowed admin origins
  - configurable `COOKIE_DOMAIN`
  - updated env contract for `ADMIN_ALLOWED_ORIGINS`
- Rebuilt and validated the backend runtime after these changes:
  - `npm run lint --workspace web`
  - `npm run build --workspace web`
  - `docker build -t art-site-api-test .`
  - local smoke via container:
    - `http://127.0.0.1:3300/api/health` -> `200`
    - preflight `OPTIONS /api/auth/session` with origin `http://localhost:3001` -> `204` with `Access-Control-Allow-Origin`
- Created and published the static admin bucket:
  - bucket `admin.art.solofarm.ru`
  - website settings `index.html` / `404.html`
  - DNS record `admin.art.solofarm.ru -> admin.art.solofarm.ru.website.yandexcloud.net.`
  - managed certificate `art-site-admin` issued and attached to the bucket
- Live checks after publish:
  - `http://admin.art.solofarm.ru/` -> `200`
  - `https://admin.art.solofarm.ru/` -> `200`
- Built and pushed backend image:
  - `cr.yandex/crp5tssh5qkdk7mgcilj/art-site/api:20260321-1`
- Created backend container `art-site-api`
- Deployed active revision for that container with production env pointing to Object Storage-backed JSON data
- Created API Gateway `art-site-api`
- Requested and issued managed certificate `art-site-api` for `api.art.solofarm.ru`
- Added DNS record:
  - `api.art.solofarm.ru -> d5d2ud8npokvtedl4fnl.aqkd4clz.apigw.yandexcloud.net.`

### Unresolved blocker

- Initially the API contour was blocked by missing invoke/IAM rights and then by a runtime port mismatch.
- Both are now resolved:
  - folder role `serverless-containers.admin` became visible for service account `aje1kqd422vq2vefkbbl`
  - unauthenticated invoke for container `art-site-api` was enabled
  - backend image was rebuilt with serverless-compatible port expectations and redeployed as revision `bbaoekfagfupm5ggbp8e`

### Live verification

- `https://admin.art.solofarm.ru/` -> `200`
- `https://api.art.solofarm.ru/api/health` -> `200`
- `OPTIONS https://api.art.solofarm.ru/api/auth/session` with origin `https://admin.art.solofarm.ru` -> `204`
- `GET https://api.art.solofarm.ru/api/auth/session` with origin `https://admin.art.solofarm.ru` -> `200`, unauthenticated payload
- `POST https://api.art.solofarm.ru/api/auth/login` with `admin / 333` -> `200`
- response includes `Set-Cookie` with:
  - `Domain=.art.solofarm.ru`
  - `Secure`
  - `HttpOnly`
  - `SameSite=Lax`
- subsequent `GET /api/auth/session` with the issued cookie returns:
  - `authenticated: true`
  - `username: admin`
  - `passwordIsDefault: true`

### Remaining follow-up

- Rotate the default admin password away from `333` through the settings flow.
- Decide whether to keep `art-site` as the runtime cookie name or rename it back to a more specific value.
- Continue from infra rollout into actual admin CRUD/content workflows and then the remaining public/content integration passes.

## 2026-03-21 - Live admin access and sketch artwork import

- Verified that the static admin opens at `https://admin.art.solofarm.ru/login/` and authenticates against the live API contour.
- Confirmed live login flow with:
  - `admin / 333`
  - redirect to `/artworks/`
  - working authenticated artwork table and detail view
- Reduced bucket-hosted admin navigation noise by disabling prefetch on sidebar links in the static admin shell.
- Added a protected admin API route:
  - `POST /api/admin/import/sketch-artworks`
- Added runtime import service that:
  - downloads current sketch gallery images from template sources
  - stores them through the same media pipeline used for regular artwork uploads
  - creates editable artwork records with metadata and primary photos
  - triggers `exportPublicSiteSnapshot()` after import
- Added an admin settings action for:
  - importing sketch lots
  - rebuilding the public snapshot
- Live import execution completed successfully against production API:
  - imported total source entries: `43`
  - created editable lots: `43`
  - skipped: `0`
  - runtime artwork repository final count: `43`
- Live admin table now shows imported records such as:
  - `Эхо безмолвия`
  - `Туманная плоскость`
  - `Пустота алхимика`
  - `Фиолетовый поток`
- `scripts/publish-showcase.ps1` was corrected to fetch snapshot input from the runtime data bucket (`OBJECT_STORAGE_BUCKET`, currently `art-site`) instead of the public site bucket.
- `scripts/deploy-yc-web.ps1` was corrected to avoid sending forbidden `PORT` env to Yandex Serverless Container revisions.

## 2026-03-21 - Artwork editor moved to overlay drawer

- Reworked the admin lots page so the artwork editor no longer lives as a long inline block below the table.
- `Создать новый лот` now opens a dedicated right-side overlay drawer with the empty artwork form.
- `Открыть` now opens the selected artwork in the same overlay drawer instead of forcing the user to scroll down through the imported lots table.
- Updated styles in the static admin for:
  - fixed backdrop
  - right-side drawer
  - full-height scrolling editor panel
- Validation:
  - `npm run build:admin`
  - `powershell -ExecutionPolicy Bypass -File scripts/publish-admin.ps1`
  - live Playwright verification on `https://admin.art.solofarm.ru/login/`:
    - login with `admin / 333`
    - click `Создать новый лот` -> overlay drawer with `Новая картина`
    - close drawer
    - click `Открыть` on an existing lot -> overlay drawer with that artwork card

### Remaining follow-up

- The drawer intentionally blocks interaction with the table while open.
- If faster switching between lots is needed later, the next refinement would be in-drawer next/previous controls or direct row switching without closing the drawer first.

### Verification

- `npm run lint --workspace web`
- `npm run build --workspace web`
- `npm run build:admin`
- `GET https://api.art.solofarm.ru/api/public-snapshot` -> `200`
- `GET http://art.solofarm.ru/cold-mist/artwork/cold-mist-mist-01/` -> `200`
- Playwright live checks:
  - `https://admin.art.solofarm.ru/login/` opens
  - login succeeds
  - `/artworks/` shows imported editable lots
  - artwork detail opens with imported preview and metadata

### Still unresolved

- Showcase variants still need continued fidelity work against their source `code.html` / `screen.png`.

## 2026-03-22 - Architecture V2 runtime public snapshot

- Added a new backend domain contract for `site-assets`:
  - `apps/web/src/features/site-assets/types.ts`
  - `apps/web/src/server/seed-site-assets.ts`
  - `apps/web/src/server/site-asset-repository.ts`
- Extended the public snapshot contract to include:
  - `schemaVersion`
  - `revision`
  - `publishedAt`
  - `variantSiteAssets`
- `exportPublicSiteSnapshot()` now writes:
  - private runtime snapshot to `private/data/export/public-site.json`
  - public runtime snapshot to `s3://art.solofarm.ru/data/public-site.json`
- `apps/showcase` no longer treats `src/generated/public-site.json` as the primary runtime source:
  - runtime provider added in `apps/showcase/src/components/public/public-site-provider.tsx`
  - route rendering moved behind `apps/showcase/src/components/public/variant-route-client.tsx`
  - public snapshot URL default switched to `https://storage.yandexcloud.net/art.solofarm.ru/data/public-site.json`
- Public bucket CORS configured for:
  - `http://art.solofarm.ru`
  - `https://art.solofarm.ru`
  - `http://localhost:3000`
  - methods `GET`, `HEAD`
- `scripts/publish-showcase.ps1` now excludes `data/*` from `--delete`, so static republish no longer wipes the runtime-managed public snapshot object.

### Validation

- `npm run build:showcase`
- `bash scripts/docs-check.sh`
- `POST https://api.art.solofarm.ru/api/auth/login` with `admin / 333` -> `200`
- authenticated `POST https://api.art.solofarm.ru/api/admin/export/public-site` -> `200`
- `aws s3 ls s3://art.solofarm.ru/data/` -> `public-site.json` present
- `curl -I -H "Origin: http://art.solofarm.ru" https://storage.yandexcloud.net/art.solofarm.ru/data/public-site.json`
  - `Access-Control-Allow-Origin: http://art.solofarm.ru`
  - `200 OK`
- `http://art.solofarm.ru/cold-mist/` -> `200`
- `http://art.solofarm.ru/cold-mist/artwork/cold-mist-mist-01/` -> `200`

### Remaining gap

- Public runtime data is already decoupled from showcase republish, but the bucket-hosted site still needed one more pass to stop exporting route-per-lot pages entirely.

## 2026-03-22 - Runtime shell routing instead of per-lot export

- Replaced route-per-file showcase export with a runtime shell router:
  - new shell link: `apps/showcase/src/components/public/showcase-link.tsx`
  - new runtime router: `apps/showcase/src/components/public/runtime-path-router.tsx`
  - new catalog surface: `apps/showcase/src/components/public/variant-catalog-page.tsx`
- Root and not-found app routes now both render the runtime shell:
  - `apps/showcase/src/app/page.tsx`
  - `apps/showcase/src/app/not-found.tsx`
- Removed physical app routes for:
  - `apps/showcase/src/app/[variant]/page.tsx`
  - `apps/showcase/src/app/[variant]/gallery/page.tsx`
  - `apps/showcase/src/app/[variant]/about/page.tsx`
  - `apps/showcase/src/app/[variant]/contacts/page.tsx`
  - `apps/showcase/src/app/[variant]/artwork/[slug]/page.tsx`
- Showcase build now exports only:
  - `/`

## 2026-03-22 - Public rewrite gateway prepared

- Added `scripts/deploy-yc-showcase-gateway.ps1` to create/update a public API Gateway in front of the showcase bucket.
- The gateway spec uses `x-yc-apigateway-integration:object_storage` and rewrites unknown app paths back to `index.html` with `200`.
- This deploy step is now codified in the repo instead of being a future manual console-only operation.
- Live gateway validation on the default domain:
  - `https://d5d14jfg1u93gjd6nf2s.trruwy79.apigw.yandexcloud.net/cold-mist/artwork/cold-mist-mist-01/` -> `200`
  - `HEAD https://d5d14jfg1u93gjd6nf2s.trruwy79.apigw.yandexcloud.net/cold-mist/artwork/cold-mist-mist-01/` -> `200`
  - `HEAD https://d5d14jfg1u93gjd6nf2s.trruwy79.apigw.yandexcloud.net/_next/static/chunks/0gm.f4vqkef3q.css` -> `200`
- Managed certificate `art-site-public` for `art.solofarm.ru` has been requested, DNS challenge record created, but the certificate is still `VALIDATING`, so custom-domain cutover is not complete yet.
  - `/_not-found`
- Runtime shell still resolves working deep links like:
  - `/cold-mist/`
  - `/cold-mist/artwork/cold-mist-mist-01/`
- Public bucket cleanup effect:
  - `aws s3 ls s3://art.solofarm.ru/cold-mist/ --recursive` -> `0`
  - old physical route prefixes are no longer present in the bucket
  - total public bucket object count after republish: `46`

### Validation

- `npm run build:showcase`
- `powershell -ExecutionPolicy Bypass -File scripts/publish-showcase.ps1`
- `curl -I http://art.solofarm.ru/cold-mist/` -> `200`
- `curl -I http://art.solofarm.ru/cold-mist/artwork/cold-mist-mist-01/` -> `200`
- Playwright live snapshots confirm visible content on:
  - `http://art.solofarm.ru/cold-mist/`
  - `http://art.solofarm.ru/cold-mist/artwork/cold-mist-mist-01/`

### Remaining gap

- The shell routing pass removed the need for route-per-lot files, but the current website hosting stack still emits one noisy `404` request in the browser console.
- That is now an infra hardening issue, not a blocker for working static-shell navigation.

## 2026-03-21 - Public artwork detail contract pass

- `apps/showcase` artwork types now preserve runtime `photos[]` and `primaryPhotoId` instead of flattening all snapshot artwork records into a single-image-only shape too early.
- `apps/showcase/src/data/public-site.ts` now maps published snapshot photos into the public artwork dataset while still deriving compatibility fields `imageOriginal` / `imagePreview` from the primary photo.
- Added shared price formatting helper in `apps/showcase/src/shared/format.ts`.
- Public detail variants updated to show more real lot data from backend snapshot:
  - `deep-immersion` now surfaces `series`, `status`, `price`, and uses current artwork photos for the lower detail strip.
  - `etheric-pulse` now surfaces `series`, `status`, `price`, and uses current artwork photos for detail previews.
  - `olive-cream` now surfaces `series`, `status`, `price`, and uses current artwork photos for its supporting detail gallery.
  - `sage-sand` now surfaces `series`, `status`, `price`, and uses current artwork photos for lower-page detail shots.
  - `mint-rose` now prefers current artwork photos for detail shots and falls back to related artworks only when extra photos are absent.
  - `copper-glow` now prefers current artwork photos in the lower thumbnail rail, shows `series` in the sidebar, and surfaces lot price.
- Generic fallback detail page in `apps/showcase/src/app/[variant]/artwork/[slug]/page.tsx` now follows the same contract with `series`, `price`, and additional photos.

### Verification

- `npm run build:showcase`

### Still unresolved

- `cold-mist` detail still needs a dedicated follow-up pass for additional backend photo strip and price placement inside its custom layout.
- Some variants are now backend-driven in data but still need later fidelity polish to match their source templates 1:1.

## 2026-03-21 - Campaign pass for backend-driven texts and prototype wiring

- Seeded CMS text versions from current sketch copy at the backend repository layer:
  - `listContentVersions()` now auto-creates an initial editable version per `variant + page` when none exist yet
  - seeded version is immediately published as the active baseline instead of leaving the editor empty
- Added content version cloning:
  - backend route `POST /api/admin/content/versions/[id]/clone`
  - deterministic numeric suffix naming (`Имя` -> `Имя 2` -> `Имя 3`)
- Updated static admin content editor so it now supports:
  - `Сохранить`
  - `Сохранить как копию`
  - display of the currently published active version
- Extended artwork summaries with `year` and normalized old index records so grouped admin views can work against previously imported lots.
- Reworked admin lots list to support grouped views:
  - `Все`
  - `По году`
  - `По серии`
  - `По статусу`
  - repeat click on the active grouping toggles all groups between expanded and collapsed
- Continued global showcase wiring:
  - added admin entry buttons to `deep-immersion`, `copper-glow`, `mint-rose`, `olive-cream`, and `sage-sand`
  - `cold-mist`, `etheric-pulse`, `deep-immersion`, `mint-rose`, `olive-cream`, `sage-sand`, and `copper-glow` now use live artwork `imagePreview` / `imageOriginal` in key gallery/detail surfaces instead of template-only images where backend data already exists
- Validation:
  - `npm run build --workspace web`
  - `npm run build --workspace admin`
  - `npm run build:showcase`
  - `bash scripts/docs-check.sh`

### Still unresolved after this pass

- Showcase detail pages still use a simplified single-primary-photo contract; full multi-photo public presentation remains the next campaign.
- Home pages still intentionally keep some template-driven atmospheric blocks where they are decorative rather than data-backed.
- Remaining prototype pass still needs a full click-by-click audit of every CTA outside contact forms.
- Imported sketch artwork metadata is now editable, but richer multi-photo editorial curation per lot still needs manual follow-up where templates only supplied a single gallery image.

## 2026-03-21 - Gallery grouping, manual collapse controls, and shared order page

- Finished the remaining public artwork detail gaps that were still blocking the gallery campaign:
  - `cold-mist` detail now surfaces runtime lot price instead of a placeholder value and shows an extra backend-driven photo strip when artwork photos are available.
  - `copper-glow` detail now uses live series metadata in the mobile detail header instead of a hardcoded label.
- Added a shared client-side gallery browser state in `apps/showcase/src/components/public/gallery-browser.tsx` with:
  - `groupMode: all | year | series`
  - per-group manual collapse state
  - global collapse / expand actions
  - client-side progressive reveal through `IntersectionObserver`
- Implemented per-variant public gallery clients so each sketch keeps its own visual language while sharing the same runtime behavior:
  - `cold-mist-gallery-client.tsx`
  - `variant-gallery-clients.tsx`
- Public galleries across the active variants now support:
  - `Все / По году / По серии`
  - manual per-group collapse / expand
  - global `Свернуть все` / `Развернуть все`
  - infinite scroll over the published snapshot dataset
- Replaced the earlier one-flag admin grouped list with full per-group collapse state on the lots page:
  - each group can now be collapsed independently
  - global `Свернуть все` / `Развернуть все` are available
  - repeat click on the active grouping mode still works as a fast toggle, but is no longer the only control
- Added a new static admin route `/order/` with compact artwork cards and drag-and-drop reorder:
  - uses the existing reorder backend flow
  - edits the same global `sortOrder` used by every public sketch
  - includes filters by gallery visibility, year, series, and status
- Updated the static admin shell navigation so the new order page is reachable from the main sidebar.

### Validation

- `npm run build --workspace admin`
- `npm run build:showcase`
- `npm run build --workspace web`
- `bash scripts/docs-check.sh`
- `powershell -ExecutionPolicy Bypass -File scripts/publish-admin.ps1`
- `powershell -ExecutionPolicy Bypass -File scripts/publish-showcase.ps1`
- Live GET checks after publish:
  - `https://admin.art.solofarm.ru/order/` -> `200`
  - `http://art.solofarm.ru/cold-mist/gallery/` -> `200`
  - `http://art.solofarm.ru/etheric-pulse/gallery/` -> `200`
  - `http://art.solofarm.ru/mint-rose/gallery/` -> `200`

### Still unresolved

- Group collapse state in admin and public galleries is not persisted across page reloads yet.
- The new priority page currently targets desktop / pointer workflows first; touch-optimized drag-and-drop is a later refinement.
- The variants now have shared real grouping logic, but some gallery surfaces still need later fidelity polish to match their original template micro-states more closely.

## 2026-03-21 - Prototype CTA cleanup for public variants

- Removed the remaining obviously fake-looking gallery/detail actions that still suggested real behavior without being wired:
  - `etheric-pulse` footer links no longer point to `#`; they now lead to real internal routes for gallery, about, and contacts.
  - `cold-mist` detail secondary CTA now routes to contacts as a specification request instead of pretending to download a file.
  - `copper-glow` detail now uses a real inquiry tile instead of a `PLAY` placeholder square.
  - `copper-glow` detail secondary CTA now routes to contacts as a specification request instead of pretending to download a file.

### Validation

- `npm run build:showcase`
- `powershell -ExecutionPolicy Bypass -File scripts/publish-showcase.ps1`
- Live GET checks after publish:
  - `http://art.solofarm.ru/etheric-pulse/` -> `200`
  - `http://art.solofarm.ru/cold-mist/artwork/cold-mist-mist-01/` -> `200`
  - `http://art.solofarm.ru/copper-glow/artwork/copper-glow-thin-line/` -> `200`

### Still unresolved

- Contact forms remain the only intentionally fake flow.
- Some decorative labels such as static exhibition metadata are still present by design and may later be replaced only if a stronger backend source appears for them.

## 2026-03-21 - Archive flag, bulk actions, CMS stabilization, and touch-aware ordering

- Added `isArchived` as a separate editorial flag in the shared artwork model for backend, admin, and showcase layers.
- Normalized artwork summaries so admin and public layers now agree on:
  - `year`
  - `series`
  - `showInGallery`
  - `isArchived`
- Updated public filtering rules so showcase galleries now only render artworks where:
  - `showInGallery = true`
  - `isArchived = false`
- Added archive-aware backend batch actions through:
  - `POST /api/admin/artworks/batch`
  - supported actions: `delete`, `archive`, `unarchive`
- Updated artwork mutation routes to rebuild the published snapshot after create/update/delete/reorder/photo mutations and after batch actions.
- Reworked the admin lots page:
  - added `Показывать работы из архива`
  - `Все` mode now always groups lots into `Активные` and `Архив`
  - grouped modes no longer use separate collapse buttons
  - group title/header click now toggles collapse
  - repeat click on the active grouping filter toggles all groups in that mode
  - added multi-select, `Выбрать все в группе`, and bulk actions (`В архив`, `Из архива`, `Удалить`)
- Reworked public grouped galleries:
  - removed separate collapse buttons and explicit `Свернуть все / Развернуть все` controls
  - group title/header click toggles collapse
  - repeat click on active `По году` / `По серии` filter toggles all groups
  - infinite scroll stays active over the filtered, non-archived dataset
- Reworked the order page for touch-friendly use:
  - kept desktop drag-and-drop
  - added visible handle and explicit `Выше` / `Ниже` controls for touch/mobile use
  - added archive-aware filtering on the ordering surface
- Fixed the CMS content flow:
  - repaired server-side seed creation so the first default version is created deterministically instead of relying on a recursive code path
  - content save / clone / publish flow in admin now preserves the current version selection instead of racing multiple reloads
  - default sketch texts now appear as the first editable version for `variant + page`

### Validation

- Local checks:
  - `npm run build --workspace web`
  - `npm run build --workspace admin`
  - `npm run build:showcase`
  - `npm run lint --workspace web`
  - `npm run lint --workspace admin`
  - `bash scripts/docs-check.sh`
- Publish / deploy:
  - `powershell -ExecutionPolicy Bypass -File scripts/publish-admin.ps1`
  - `powershell -ExecutionPolicy Bypass -File scripts/publish-showcase.ps1`
  - `powershell -ExecutionPolicy Bypass -File scripts/deploy-yc-web.ps1`
- Live checks after rollout:
  - `GET https://api.art.solofarm.ru/api/health` -> `200`
  - authenticated `GET https://api.art.solofarm.ru/api/admin/content/versions?variantId=cold-mist&pageKey=home` -> `versions=1`
  - authenticated `GET https://api.art.solofarm.ru/api/admin/artworks` -> `artworks=43`
  - `GET https://admin.art.solofarm.ru/artworks/` -> `200`
  - `GET http://art.solofarm.ru/cold-mist/gallery/` -> `200`
  - `GET http://art.solofarm.ru/mint-rose/gallery/` -> `200`

### Still unresolved

- Imported sketch artworks still mostly have empty `year` / `series` metadata, so groupings work technically but many records will currently fall into `Год не указан` / `Без серии` until editorial enrichment in admin.
- The order page is now touch-usable, but it is not yet a full finger drag-and-drop experience; touch editing currently relies on explicit move controls rather than native touch reordering.
- Public galleries now enforce archive filtering, but a later UX pass may still be needed to polish each variant's grouping micro-interactions against its original sketch.

## 2026-03-21 - Admin polish: active preset contrast and touch drag

- Fixed the content version preset styling in the static admin so the selected preset no longer renders white text on a near-white button state.
- Strengthened `.button-secondary.active-chip` in `apps/admin/src/app/globals.css` so active content presets keep a dark background and white foreground consistently.
- Added pointer-based touch reordering to the admin order page:
  - drag now starts from the visible handle on touch devices
  - drop target is resolved from the pointer position
  - desktop HTML drag-and-drop still remains in place
  - explicit `Выше / Ниже` controls remain as a fallback for touch editing

### Validation

- `npm run build --workspace admin`
- `npm run lint --workspace admin`
- `powershell -ExecutionPolicy Bypass -File scripts/publish-admin.ps1`

### Bucket state check

- Verified current object counts:
  - public showcase bucket `art.solofarm.ru`: `3283` objects
  - runtime bucket `art-site`: `20601` objects
  - `art-site/private/data`: `20513` objects
  - `art-site/private/data/content`: `20464` objects
  - `art-site/media`: `88` objects
- Conclusion: the large object count is not caused by public pages or artwork media.
- The bulk of the growth is inside versioned CMS content storage and is consistent with the earlier buggy seed/content-version flow that could create excessive content objects before the server-side seed fix landed.

### Still unresolved

- The content bucket likely needs a dedicated cleanup/migration pass to prune the historical excess content-version objects that were already written before the fix.

## 2026-03-22 - Conservative cleanup of orphaned content objects

- Audited the runtime bucket after confirming that the large object count was concentrated almost entirely in the content prefix rather than in public pages or media.
- Recorded a local cleanup audit in:
  - `work/archive/bucket-audit-2026-03-22/content-keys.txt`
  - `work/archive/bucket-audit-2026-03-22/content-keep-keys.txt`
  - `work/archive/bucket-audit-2026-03-22/content-delete-keys.txt`
  - local backup of currently referenced live content files under `work/archive/bucket-audit-2026-03-22/content-keep-files/`
  - local backup of current publication files under `work/archive/bucket-audit-2026-03-22/publication/`
- Cleanup rule:
  - preserve all live `index.json` files
  - preserve all content-version JSON files referenced by those indices
  - preserve all content-version JSON files referenced by current `publication/*.json`
  - delete only the remaining orphaned files under `private/data/content/`
- Execution method:
  - built a local mirror of the 11 kept content files
  - applied `aws s3 sync ... --delete` from that mirror to `s3://art-site/private/data/content/`
  - this avoided hand-written mass deletes and kept the cleanup reproducible from the preserved manifest

### Validation

- Before cleanup:
  - `art-site/private/data/content`: `20464` objects
  - `art-site`: `20601` objects
- After cleanup:
  - `art-site/private/data/content`: `11` objects
  - `art-site`: `148` objects
- Post-cleanup runtime checks:
  - authenticated `GET https://api.art.solofarm.ru/api/admin/content/versions?variantId=cold-mist&pageKey=home` -> `versions=1`
  - live API auth still works after cleanup

### Still unresolved

- Only the content prefix was cleaned. If additional historical storage bloat appears later, it should be audited separately instead of assumed to be safe for bulk deletion.
- The local audit artifacts live in `work/archive/` and are intentionally not treated as application runtime state.

## 2026-03-22 - Site-assets editor foundation

- Added backend site-assets editor routes:
  - `GET /api/admin/site-assets/versions`
  - `POST /api/admin/site-assets/versions`
  - `GET /api/admin/site-assets/versions/[id]`
  - `PATCH /api/admin/site-assets/versions/[id]`
  - `POST /api/admin/site-assets/versions/[id]/clone`
  - `POST /api/admin/site-assets/versions/[id]/publish`
- Added static admin page `/site-assets` with:
  - variant picker
  - slot picker
  - version list
  - save
  - save as copy
  - publish
  - payload editing for `assetId`, `url`, `alt`, `caption`, `focalPoint`, `decorative`
  - preview area
- Updated admin shell navigation so the new editor is reachable from the main sidebar.
- Showcase runtime now passes published `variantSiteAssets` into selected variant components:
  - home hero images:
    - `deep-immersion`
    - `cold-mist`
    - `copper-glow`
    - `etheric-pulse`
    - `mint-rose`
    - `olive-cream`
    - `sage-sand`
  - about portrait images:
    - `deep-immersion`
    - `etheric-pulse`
    - `sage-sand`
- Each slot-aware surface still keeps a template-media fallback, so the visual result stays stable until an editor publishes replacement media.

### Validation

- `npm run build --workspace web`
- `npm run build --workspace admin`
- `npm run build:showcase`

### Still unresolved

- There is not yet a richer media picker / upload UX for page-media slots; the current editor intentionally starts from slot payload + URL editing.
- Only the first two planned slots are implemented in the domain/editor flow:
  - `home.heroImage`
  - `about.portraitImage`

## 2026-03-22 - Public gateway cutover on custom domain

- Verified the managed certificate:
  - `yc certificate-manager certificate get --name art-site-public --format json`
  - status: `ISSUED`
- Executed the final cutover:
  - `powershell -ExecutionPolicy Bypass -File scripts/deploy-yc-showcase-gateway.ps1 -CertificateWaitSeconds 10`
- Verified DNS now resolves the production domain to the gateway:
  - `nslookup art.solofarm.ru`
  - alias target: `d5d14jfg1u93gjd6nf2s.trruwy79.apigw.yandexcloud.net`
- Verified production responses through the custom domain:
  - `curl -I https://art.solofarm.ru/` -> `200`
  - `curl -I https://art.solofarm.ru/cold-mist/artwork/cold-mist-mist-01/` -> `200`

### Still unresolved

- The public domain cutover is complete, but the new `site-assets` backend routes are still not confirmed live on `api.art.solofarm.ru`; that remains a separate container rollout issue, not a gateway/certificate issue.

## 2026-03-22 - Backend rollout recovered for site-assets

- Confirmed that the old runtime problem was image-related rather than route/gateway-related:
  - existing `latest` container image returned `404` for `/api/admin/site-assets/versions`
  - locally built prebuilt runtime image returned `401`, which proved the route existed in the new code
- Built and pushed a dedicated prebuilt backend image:
  - `cr.yandex/crp5tssh5qkdk7mgcilj/art-site/api:site-assets-prebuilt`
- Extended deploy script:
  - `scripts/deploy-yc-web.ps1` now accepts `-SkipBuild`
- Rolled out the new revision with:
  - `powershell -ExecutionPolicy Bypass -File scripts/deploy-yc-web.ps1 -Tag site-assets-prebuilt -SkipBuild`
- Verified production API after rollout:
  - `curl -i https://api.art.solofarm.ru/api/health` -> `200`
  - `curl -i https://api.art.solofarm.ru/api/admin/site-assets/versions?...` -> `401 Unauthorized`
  - this confirms the route is now present on production and protected by auth instead of missing
- Verified active container revision:
  - revision `bba0n15gdj49a5d49e72`
  - image `cr.yandex/crp5tssh5qkdk7mgcilj/art-site/api:site-assets-prebuilt`

### Still unresolved

- Full authenticated end-to-end smoke for `/api/admin/site-assets/versions` from the CLI is still awkward because PowerShell web tooling intermittently throws a local `NullReferenceException` when reusing the session object, even though login itself succeeds and the auth cookie is issued.
- The reliable infrastructure conclusion is still clear:
  - route exists in production
  - auth cookie is issued
  - missing-route problem is resolved

## 2026-03-22 - Artwork photo upload repaired

- Reproduced the live bug against production API before the fix:
  - `POST /api/admin/artworks/{id}/photos` returned `500 Internal Server Error` for both `png` and `svg`
- Added upload-specific hardening in code:
  - structured JSON `serverError(...)` response helper in `apps/web/src/server/http.ts`
  - guarded upload route with explicit `try/catch` in `apps/web/src/app/api/admin/artworks/[id]/photos/route.ts`
  - raster-only v1 validation in `apps/web/src/server/media-service.ts`
  - removed per-object `public-read` ACL from media writes in `apps/web/src/server/object-storage.ts` / `media-service.ts`
  - split `uploadPending` from generic `pending` in `apps/admin/src/app/artworks/page.tsx`
- Verified local quality gates:
  - `npm run build --workspace web`
  - `npm run build --workspace admin`
  - `npm run lint --workspace web`
  - `npm run lint --workspace admin`
  - `bash scripts/docs-check.sh`
- Published admin:
  - `powershell -ExecutionPolicy Bypass -File scripts/publish-admin.ps1`
- Rolled backend twice while diagnosing:
  - first prebuilt revision proved the new code path was live, but upload still failed
  - container logs revealed the real runtime blocker:
    - `Error: Failed to load external module ... sharp ... linuxmusl-x64 runtime`
- To keep the upload flow operational even on the current prebuilt deploy path, media preview generation now degrades gracefully:
  - if `sharp` is unavailable, upload still succeeds
  - `urlPreview` falls back to `urlOriginal`
- Built and pushed the repaired prebuilt runtime image:
  - `cr.yandex/crp5tssh5qkdk7mgcilj/art-site/api:upload-fix-20260322`
- Deployed it with:
  - `powershell -ExecutionPolicy Bypass -File scripts/deploy-yc-web.ps1 -Tag upload-fix-20260322 -SkipBuild`
- Live verification after rollout:
  - `curl.exe -s -c tmp/art-upload-cookies.txt -H "Content-Type: application/json" --data-binary "@tmp/login.json" https://api.art.solofarm.ru/api/auth/login` -> `{"ok":true,...}`
  - `curl.exe -s -b tmp/art-upload-cookies.txt https://api.art.solofarm.ru/api/auth/session` -> `{"authenticated":true,...}`
  - `curl.exe -i -b tmp/art-upload-cookies.txt -F "file=@...screen.png;type=image/png" https://api.art.solofarm.ru/api/admin/artworks/c4c1abf0-56cd-4b59-b673-331681b55c87/photos` -> `201 Created`
  - response artwork now contains the newly added photo entry
  - `curl.exe -i -b tmp/art-upload-cookies.txt -F "file=@...placeholder-hidden.svg;type=image/svg+xml" .../photos` -> `400 Bad Request`
  - response body: `{"error":"Поддерживаются только JPEG, PNG и WEBP."}`

### Still unresolved

- The current prebuilt runtime path still does not provide working native `sharp` binaries, so uploaded photos may use `urlOriginal` as preview when preview generation cannot run.
- A fully native preview pipeline still needs one of:
  - a stable Linux Docker image build path for `apps/web`; or
  - a non-native preview generator that is safe for the prebuilt deployment path.

## 2026-04-26 - Variant-wide content preset editor

- Reworked the admin `Тексты` page so all editable texts for one selected variant are shown on one screen instead of switching page-by-page.
- Presets are now presented as variant-wide sets:
  - the UI derives preset names from existing page-level content versions;
  - selecting a preset loads the matching version for every page in the variant;
  - `Сохранить`, `Сохранить как копию`, and `Опубликовать` apply to all pages in the selected variant.
- Added a left sidebar structure tree below preset selection:
  - pages are collapsible;
  - field leaves scroll directly to the corresponding text field;
  - page sections remain visually separated in the main editor.
- Kept the backend/storage contract unchanged for this pass:
  - content is still stored as `variantId + pageKey` versions;
  - the new variant-wide preset behavior is an admin UX layer over the existing API.

### Validation

- `npm run build --workspace admin`
- `npm run lint --workspace admin`
- `bash scripts/docs-check.sh`
- `powershell -ExecutionPolicy Bypass -File scripts/publish-admin.ps1`
- `curl.exe -I https://admin.art.solofarm.ru/content/` -> `200`

### Still unresolved

- Publishing a variant-wide text preset currently calls the existing per-page publish API for each page, so the public snapshot may be rebuilt multiple times in one publish action.
- If this starts feeling slow in daily use, the next clean improvement is a backend aggregate route such as `POST /api/admin/content/presets/publish` that saves/publishes all pages and exports the snapshot once.

## 2026-04-26 - Aggregate content preset publication

- Added a dedicated backend route:
  - `POST /api/admin/content/presets/publish`
- Added repository-level aggregate publication:
  - saves or creates all page versions for one variant preset;
  - marks the selected page versions as published;
  - writes one combined publication state for the variant.
- Switched the admin `Тексты` page to call the aggregate route instead of looping over five per-page publish calls.
- Public snapshot export now runs once per variant preset publish action.
- The old page-level publish route remains available for narrower future flows, but it is no longer used by the variant-wide editor.

### Validation

- `npm run build --workspace web`
- `npm run build --workspace admin`
- `npm run lint --workspace web`
- `npm run lint --workspace admin`
- `bash scripts/docs-check.sh`
- `powershell -ExecutionPolicy Bypass -File scripts/publish-admin.ps1`
- built and pushed backend image:
  - `cr.yandex/crp5tssh5qkdk7mgcilj/art-site/api:aggregate-content-publish-20260426`
- deployed backend with:
  - `powershell -ExecutionPolicy Bypass -File scripts/deploy-yc-web.ps1 -Tag aggregate-content-publish-20260426 -SkipBuild`
- live checks:
  - `curl.exe -i https://api.art.solofarm.ru/api/health` -> `200`
  - unauthenticated `POST https://api.art.solofarm.ru/api/admin/content/presets/publish` -> `401`, confirming the route is live and protected
  - `curl.exe -I https://admin.art.solofarm.ru/content/` -> `200`

### Still unresolved

- I did not run an authenticated publish mutation from the CLI to avoid changing live text content just for a smoke test.
- The next manual smoke is safe to do in the admin UI: open `Тексты`, press `Опубликовать`, and confirm that the success message includes one snapshot revision.

## 2026-04-26 - Content tree polish and preset deletion

- Reworked the `Тексты` sidebar tree into a more standard Figma-like tree:
  - compact page rows with chevrons;
  - nested text-field rows;
  - hover state and active selected field state;
  - field rows still scroll to the corresponding editor block.
- Added preset deletion to the admin UI:
  - non-published named presets show a delete action;
  - deletion asks for confirmation;
  - after deletion, the editor reloads the published set.
- Added backend deletion support:
  - `POST /api/admin/content/presets/delete`;
  - deletes matching page-level content-version JSON files and cleans page indices;
  - refuses to delete a preset if any matching version is currently published active.

### Validation

- `npm run build --workspace web`
- `npm run build --workspace admin`
- `npm run lint --workspace web`
- `npm run lint --workspace admin`
- `bash scripts/docs-check.sh`
- `powershell -ExecutionPolicy Bypass -File scripts/publish-admin.ps1`
- built and pushed backend image:
  - `cr.yandex/crp5tssh5qkdk7mgcilj/art-site/api:content-tree-delete-20260426`
- deployed backend with:
  - `powershell -ExecutionPolicy Bypass -File scripts/deploy-yc-web.ps1 -Tag content-tree-delete-20260426 -SkipBuild`
- live checks:
  - `curl.exe -i https://api.art.solofarm.ru/api/health` -> `200`
  - unauthenticated `POST https://api.art.solofarm.ru/api/admin/content/presets/delete` -> `401`, confirming the route is live and protected
  - `curl.exe -I https://admin.art.solofarm.ru/content/` -> `200`

### Still unresolved

- I did not run an authenticated delete mutation from the CLI to avoid deleting live editor presets as a smoke test.
- Manual smoke path: create a copy preset in `Тексты`, delete that copy, and confirm the preset list reloads without touching the active published preset.

## 2026-04-26 - Preset deletion fix

- Root cause of the first deletion UX bug:
  - the preset list was built from any content version name found on any page;
  - old seeded page-specific names such as `Текущий home` could appear as if they were variant-wide presets;
  - deleting those names correctly failed server-side when they were active for one page, but the UI made that look like a broken delete action.
- Fixed the admin preset list so it only shows real variant-wide presets:
  - a named preset must exist on every page of the selected variant;
  - the special `Опубликованный набор` remains as the way to load the currently published mixed set;
  - delete is blocked for any preset that is active on at least one page.
- Hardened backend deletion:
  - deletion now returns an explicit `Content preset not found.` error if no matching versions were removed.

### Validation

- `npm run build --workspace admin`
- `npm run build --workspace web`
- `npm run lint --workspace admin`
- `npm run lint --workspace web`
- `bash scripts/docs-check.sh`
- `powershell -ExecutionPolicy Bypass -File scripts/publish-admin.ps1`
- built and pushed backend image:
  - `cr.yandex/crp5tssh5qkdk7mgcilj/art-site/api:content-preset-delete-fix-20260426`
- deployed backend with:
  - `powershell -ExecutionPolicy Bypass -File scripts/deploy-yc-web.ps1 -Tag content-preset-delete-fix-20260426 -SkipBuild`
- live checks:
  - `curl.exe -I https://admin.art.solofarm.ru/content/` -> `200`
  - `curl.exe -i https://api.art.solofarm.ru/api/health` -> `200`
  - unauthenticated `POST https://api.art.solofarm.ru/api/admin/content/presets/delete` -> `401`
