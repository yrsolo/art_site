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
   - before build the script can pull `private/data/export/public-site.json` into generated input for the showcase build
2. Configure the bucket website entry point:
   - `index.html`
   - `404.html`
3. Sync `apps/showcase/out` to bucket `art.solofarm.ru`
4. Point DNS record `art.solofarm.ru` to `art.solofarm.ru.website.yandexcloud.net.`

## Static Admin Flow

1. Build the static admin:
   - `npm run build:admin`
2. Sync `apps/admin/out` to the admin bucket
3. Point `admin.art.solofarm.ru` to that bucket website endpoint
4. Build admin with correct `NEXT_PUBLIC_API_BASE_URL`

## API Runtime Flow

1. Build `apps/web`
2. Package and deploy it as Serverless Container
3. Attach environment/secrets for Object Storage access and session signing
4. Expose it as `api.art.solofarm.ru`

## Notes

- Public showcase should stay read-only and build from published snapshot data.
- Admin frontend must stay static; changing its UI should require only republishing the bucket, not redeploying the container.
- Container redeploy is needed only for backend code and secret/runtime changes.
