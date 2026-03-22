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

## Update 2026-03-21 Archive, CMS repair, and touch ordering

1. Add `isArchived` as a separate editorial flag in the artwork model and propagate it through repository summaries, admin DTOs, and published snapshot filtering.
2. Fix the text CMS flow so current sketch texts always appear as the default seeded version and save / clone / publish keep a stable current selection without losing payload.
3. Rework the admin lots list around archive-aware grouping, archive visibility toggles, title-click collapse, and bulk actions for delete / archive / unarchive.
4. Adapt the admin order page for touch interactions while keeping one shared `sortOrder` and adding archive-aware filtering.
5. Update public galleries so archived works are always excluded and group headers themselves become the collapse affordance without separate secondary buttons.

## Update 2026-03-22 Architecture V2

1. Extend the backend publication model with a versioned public snapshot that includes artworks, published variant content, and future-facing `site-assets` slots.
2. Write the published public snapshot not only into private runtime storage but also into a public bucket path that can be fetched directly by the static showcase.
3. Rework `apps/showcase` from build-time embedded snapshot usage to runtime loading of the public snapshot with graceful fallback to local seed data.
4. Introduce a dedicated `site-assets` domain contract for editable page media such as `home.heroImage` and `about.portraitImage`, even if the editor UI for these slots ships later.
5. Preserve existing visual variants while moving the public data flow toward `static shell + live data`, so content changes stop depending on front-end republish cycles.

## Update 2026-03-22 Architecture V2 follow-up

1. Keep the runtime public snapshot on a public storage object with CORS enabled so content updates do not depend on static shell republish.
2. Protect runtime-managed public data objects from `publish-showcase --delete`, especially the `data/` prefix in the public bucket.
3. Replace pre-generated variant/detail pages with a shell router that resolves `variant + slug` from `window.location.pathname`.
4. Keep `site-assets` in the publication contract now, then add editor/application use-cases for `home.heroImage` and `about.portraitImage` in a later campaign.
5. Deploy the public API Gateway rewrite/fallback layer for `art.solofarm.ru` so deep links return `200` without raw bucket website semantics.
6. After the gateway rollout, harden the remaining residual noisy `404` request from the browser runtime if it still appears.

## Update 2026-03-22 Site-assets implementation

1. Finalize backend editor routes for `site-assets` so slot media follows the same save / clone / publish workflow as texts.
2. Add a dedicated static admin page for page-media slots.
3. Thread published `variantSiteAssets` through the runtime shell and into selected home/about variant components.
4. Replace selected hardcoded home/about images with slot-aware values plus safe template fallbacks.
5. Rebuild, redeploy, and verify the new domain layer without waiting for the public certificate cutover.

## Update 2026-03-22 Public cutover completed

1. The public certificate is now issued and attached to API Gateway `art-site-public`.
2. `art.solofarm.ru` is now cut over to the rewrite gateway instead of the raw bucket website endpoint.
3. The next implementation focus can move away from certificate waiting and back to product/runtime work:
   - finish live backend rollout for the new `site-assets` admin routes;
   - start the next editor/domain pass on top of the now-complete public routing architecture.

## Update 2026-03-22 Backend rollout recovery

1. The `site-assets` backend routes are now confirmed present on the production API runtime.
2. Keep the new prebuilt-image deploy path available for future backend rollouts:
   - local `npm run build --workspace web`
   - minimal runtime image from prebuilt standalone output
   - `deploy-yc-web.ps1 -SkipBuild`
3. Next focus can return to product implementation instead of container plumbing:
   - richer `site-assets` UX
   - publication/editor passes on top of the now-stable runtime/public architecture.

## Update 2026-03-22 Artwork photo upload repair

1. Instrument the artwork photo upload route so failures come back as structured JSON with enough context to locate the failing step.
2. Remove the media upload dependency on per-object `public-read` ACL and let Object Storage policy handle public visibility.
3. Restrict supported upload types for v1 to `image/jpeg`, `image/png`, and `image/webp`, with `400` responses for unsupported files instead of raw `500`s.
4. Split upload pending UI from generic artwork save pending so the drawer no longer looks like a stuck save when only photo upload is in progress.
5. Redeploy admin + backend, then re-run live upload smoke with a real PNG/JPG against `api.art.solofarm.ru`.
