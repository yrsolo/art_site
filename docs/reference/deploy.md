# Deploy

## Current Direction

Deploy теперь разбит на три независимых контура:

- `apps/showcase` — статическая публичная витрина в Object Storage
- `apps/admin` — статическая админка в отдельном bucket/domain или на отдельном prefix
- `apps/web` — backend-only runtime в контейнере для auth, API, uploads и export snapshot

## Current Cloud Findings

- Public DNS zone `solofarm.ru.` already exists in Yandex Cloud.
- `art.solofarm.ru` can be served through Object Storage website hosting.
- Existing bucket `art-site` can be used as data/media bucket or as shared operational bucket.
- `admin.art.solofarm.ru` remains the clean target for static admin publication, but for v1 the same storage account may still be used with a dedicated bucket.

## Static Preview Flow

1. Build the static showcase:
   - `npm run build:showcase`
2. Configure the bucket website entry point:
   - `index.html`
   - `404.html`
3. Sync `apps/showcase/out` to bucket `art.solofarm.ru`
4. Point DNS record `art.solofarm.ru` to `art.solofarm.ru.website.yandexcloud.net.`

Important:
- the public site bucket is `art.solofarm.ru`
- the snapshot source bucket is the runtime data bucket from `OBJECT_STORAGE_BUCKET` (currently `art-site`)
- these are intentionally different roles and should not be confused during publish
- the static showcase shell now reads live data from the public storage URL for `data/public-site.json`; any generated snapshot bundled into the app is only a fallback layer
- `publish-showcase` must not delete the runtime-managed `data/` prefix in the public bucket

## Static Admin Flow

1. Build the static admin:
   - `npm run build:admin`
2. Sync `apps/admin/out` to the admin bucket
3. Point `admin.art.solofarm.ru` to that bucket website endpoint
4. Build admin with correct `NEXT_PUBLIC_API_BASE_URL`
5. If HTTPS is needed on the bucket host, request a managed certificate and attach it with `yc storage bucket set-https`

Live entrypoint:
- `https://admin.art.solofarm.ru/login/`

## API Runtime Flow

1. Build `apps/web`
2. Package and deploy it as Serverless Container
3. Attach environment/secrets for Object Storage access and session signing
4. Expose it through API Gateway as `api.art.solofarm.ru`

## Current Live State

- `art.solofarm.ru` -> working static showcase bucket
- `admin.art.solofarm.ru` -> working static admin bucket with HTTPS
- `api.art.solofarm.ru` -> working API Gateway domain backed by Serverless Container

## Operational Note

If `admin` is served from `admin.art.solofarm.ru` and API is served from `api.art.solofarm.ru`, the backend must return CORS headers for the admin origin and set session cookies with a shared domain such as `.art.solofarm.ru`. This repo now includes and uses that application-side support in production.

## Notes

- Public showcase should stay read-only and fetch published snapshot data from the published public storage object for `data/public-site.json`.
- Admin frontend must stay static; changing its UI should require only republishing the bucket, not redeploying the container.
- Container redeploy is needed only for backend code and secret/runtime changes.
- Importing current sketch gallery images into editable runtime lots is now a backend operation triggered from admin settings, not a manual one-off storage task.
- Public content changes should become visible after snapshot publication without a showcase republish cycle.

### Public Bucket CORS

If the showcase reads the snapshot from `https://storage.yandexcloud.net/art.solofarm.ru/data/public-site.json`, the bucket needs a CORS policy that allows:
- `GET`
- `HEAD`
- origins `http://art.solofarm.ru`, `https://art.solofarm.ru`

Local development can additionally allow:
- `http://localhost:3000`
