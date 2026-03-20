# Environment Variables

## Источник

Секреты лежат локально в `.env` и не должны попадать в git.

Пример публичной схемы переменных находится в `.env.example`.
Для `apps/web` также есть локальный шаблон `apps/web/.env.example`.

## Нужные Группы Переменных

### Public Site

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SITE_DOMAIN`

### Admin Auth

- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `SESSION_SECRET`

### Object Storage

- `YC_STORAGE_BUCKET`
- `YC_STORAGE_REGION`
- `YC_ACCESS_KEY_ID`
- `YC_SECRET_ACCESS_KEY`
- `YC_STORAGE_ENDPOINT`

### Metadata Storage

- `ARTWORKS_DATA_FILE`

## Локальный MVP

На текущем этапе для локального сценария достаточно:
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `SESSION_SECRET`
- `ARTWORKS_DATA_FILE`

Yandex Cloud переменные пока не блокируют локальную разработку и понадобятся на следующем инфраструктурном этапе.

## Правила

- не коммитить реальные значения;
- не дублировать секреты в markdown;
- при добавлении новой переменной обновлять `.env.example` и этот файл.
