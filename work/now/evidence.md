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
- Imported sketch artwork metadata is now editable, but richer multi-photo editorial curation per lot still needs manual follow-up where templates only supplied a single gallery image.
