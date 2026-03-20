# Deploy

## Current Direction

Public preview now has a simpler first stage:

- `apps/showcase` is exported as a static site
- the static export is published to Yandex Object Storage website hosting
- `art.solofarm.ru` points to the website endpoint

This is intentionally separate from the future admin runtime.

Admin, authentication, uploads, and mutable API routes stay in `apps/web` and can move to Docker later without blocking publication of the public fronts.

## Current Cloud Findings

- Public DNS zone `solofarm.ru.` already exists in Yandex Cloud.
- `art.solofarm.ru` can be served through Object Storage website hosting.
- The preview bucket should match the host name: `art.solofarm.ru`.
- Existing bucket `art-site` can stay reserved for future application assets.

## Static Preview Flow

1. Build the static showcase:
   - `npm run build:showcase`
2. Configure the bucket website entry point:
   - `index.html`
   - `404.html`
3. Sync `apps/showcase/out` to bucket `art.solofarm.ru`
4. Point DNS record `art.solofarm.ru` to `art.solofarm.ru.website.yandexcloud.net.`

## Notes

- For Object Storage website hosting, nested routes should be exported with trailing slashes so each route resolves through its own `index.html`.
- The public showcase should remain read-only. Admin and uploads are intentionally deferred to the later containerized runtime.

## Later Step

When we are ready to ship admin and authenticated uploads:

1. Build and run `apps/web` in Docker
2. Publish the runtime to Serverless Containers or another compute target
3. Keep `art.solofarm.ru` either on the static showcase or switch it to the full app after approval
4. Move uploaded assets to Object Storage-backed APIs
