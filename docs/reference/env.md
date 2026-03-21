# Environment Variables

## Источник

Секреты лежат локально в `.env` и не должны попадать в git.

Пример публичной схемы переменных находится в `.env.example`.
Для `apps/web` также есть локальный шаблон `apps/web/.env.example`.

## Нужные Группы Переменных

### API Runtime

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_API_BASE_URL`
- `SESSION_SIGNING_SECRET`
- `ADMIN_BOOTSTRAP_PASSWORD`
- `COOKIE_NAME`
- `COOKIE_SECURE`
- `COOKIE_SAMESITE`
- `COOKIE_PATH`
- `COOKIE_DOMAIN`
- `SESSION_TTL_SECONDS`
- `ADMIN_ALLOWED_ORIGINS`

### Object Storage

- `OBJECT_STORAGE_MODE`
- `OBJECT_STORAGE_ENDPOINT`
- `OBJECT_STORAGE_REGION`
- `OBJECT_STORAGE_BUCKET`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `OBJECT_STORAGE_DATA_PREFIX`
- `OBJECT_STORAGE_MEDIA_PREFIX`
- `OBJECT_STORAGE_PUBLIC_SNAPSHOT_PREFIX`
- `PUBLIC_SITE_SNAPSHOT_KEY`

### Локальные Fallback Пути

- `LOCAL_RUNTIME_ROOT`
- `LOCAL_PUBLIC_SNAPSHOT_FILE`
- `LOCAL_MEDIA_ROOT`

### Static Admin Publish

- `NEXT_PUBLIC_ADMIN_BASE_URL`
- `ADMIN_OBJECT_STORAGE_BUCKET`
- `ADMIN_BUCKET_CERTIFICATE_ID`

## Локальный MVP

Для локального сценария можно стартовать в `OBJECT_STORAGE_MODE=local`.
Тогда runtime складывает JSON и exported snapshot в локальную `.runtime-storage`, а static admin/showcase продолжают собираться без облачного bucket.

В production-режиме основной источник истины — Object Storage-backed JSON.

## Правила

- не коммитить реальные значения;
- не дублировать секреты в markdown;
- при добавлении новой переменной обновлять `.env.example` и этот файл.
