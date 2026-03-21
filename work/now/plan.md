# Plan

1. Расширить доменную модель данных лотов, фото, текстовых версий и admin settings
2. Перевести `apps/web` в backend-only runtime с Object Storage-backed repositories, API и session auth
3. Создать `apps/admin` как статический frontend с login, таблицей лотов, редактором карточки и настройками
4. Подключить `apps/showcase` к published snapshot вместо локально захардкоженных artworks/content
5. Обновить env/docs/scripts и прогнать build/lint/publish-проверки для нового контура

## Update 2026-03-20

1. Keep the rail fixed at the right center and detach it from variant-specific headers.
2. Replace the root chooser with a minimal square-preview catalog.
3. Close remaining public variant routes with dedicated components for `etheric-pulse`, `olive-cream`, and `sage-sand`.
4. Replace remaining generic `about` / `contacts` pages in dark variants where source-specific treatment exists.
5. Rebuild, republish, and verify the live static showcase.

## Update 2026-03-21 Infra rollout

1. Align repo scripts and env contracts with the actual target topology: `art`, `admin.art`, `api.art`.
2. Make `publish-admin` and API deploy scripts production-safe for the backend-only/container architecture.
3. Create and publish the static admin bucket on its own subdomain.
4. Deploy the backend runtime and expose it on `api.art.solofarm.ru`.
5. Verify DNS, HTTP responses, and cross-app wiring between static admin and API.

## Update 2026-03-21 Sketch-backed admin data

1. Stabilize the bucket-hosted admin navigation so static export quirks do not look like broken buttons.
2. Add a protected admin action for importing gallery images from current sketch variants into editable artwork records.
3. Store imported sketch images through the same runtime media pipeline used for regular artwork photos.
4. Rebuild and republish the public snapshot from the runtime data bucket after import.
5. Verify the live flow through `admin.art.solofarm.ru`, `api.art.solofarm.ru`, and the rebuilt showcase publication.

## Update 2026-03-21 Backend-driven showcase campaigns

1. Seed the CMS text store from current variant seed content so editors start from the real sketch copy instead of empty forms.
2. Add content version cloning with deterministic numeric suffixes and show which version is currently published.
3. Keep `apps/showcase` on published snapshot as the primary content source and remove remaining practical dependence on static text fallbacks.
4. Wire every variant layout to the live admin login and replace gallery/detail template media with real artwork photos where public routes are already backend-driven.
5. Add grouped artwork list modes in admin (`all`, `year`, `series`, `status`) with collapse/expand behavior for large imported datasets.
6. Rebuild, republish, redeploy, and verify `admin.art.solofarm.ru`, `api.art.solofarm.ru`, and `art.solofarm.ru` against the new content/data flow.

## Update 2026-03-21 Artwork detail contract

1. Extend `showcase` artwork mapping so published snapshot preserves `photos[]` and `primaryPhotoId` instead of collapsing everything to one image too early.
2. Upgrade public detail pages to render real lot metadata (`series`, `status`, `price`) and additional detail photos where the variant composition supports it.
3. Keep generic fallback detail aligned with the same contract so future variants do not silently regress to the old single-image shape.
4. Rebuild and republish the static showcase after this pass, then verify several live detail routes against the published runtime snapshot.

## Update 2026-03-21 Galleries, grouping, and ordering

1. Finish the remaining public detail gaps in `cold-mist` and `copper-glow` so every active artwork page uses the same backend-driven contract.
2. Add a shared showcase gallery-state layer for `all / year / series`, per-group collapse state, and progressive reveal over the published snapshot dataset.
3. Rework each variant gallery to use that state while keeping variant-specific controls, group headers, and collapse affordances visually native to its design language.
4. Replace the admin grouped list's single global collapse flag with full manual per-group collapse / expand plus explicit `Свернуть все` / `Развернуть все`.
5. Add a dedicated admin order page with compact artwork cards and drag-and-drop editing of the shared `sortOrder`.
6. Rebuild, republish, and live-verify the updated showcase, admin, and API surfaces after the new grouping / ordering flow is wired end-to-end.
