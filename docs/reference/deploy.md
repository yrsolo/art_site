# Deploy

## Current Direction

The current application is best published as a single Docker image and run in Yandex Cloud Serverless Containers.

This keeps:
- public variants
- admin
- API routes

inside one runtime while the project is still in the MVP stage.

## Current Cloud Findings

- Public DNS zone `solofarm.ru.` already exists in Yandex Cloud.
- `art.solofarm.ru` is not configured yet.
- Object Storage bucket `art-site` exists and can be used later for uploaded assets.
- A Yandex Container Registry already exists: `crp5tssh5qkdk7mgcilj`.

## Files Added For Deploy

- `Dockerfile`
- `.dockerignore`
- `scripts/deploy-yc-web.ps1`

## Deploy Flow

1. Build the production image from repo root.
2. Push the image to Yandex Container Registry.
3. Create or update a Serverless Container.
4. Allow unauthenticated invoke for preview-stage public access.
5. Bind `art.solofarm.ru` after the container endpoint is known.

## Known Blocker

At the moment, local Docker access is unstable on this workstation: Docker API calls return `500 Internal Server Error`.

Because of that, image build and push could not be completed from this session, even though the repo is now prepared for it.

## Next Infra Step

As soon as Docker responds normally again:

1. Run `scripts/deploy-yc-web.ps1`
2. Inspect the created Serverless Container URL
3. Create DNS record for `art.solofarm.ru`
4. After preview publication, move asset storage and upload flow to Object Storage
