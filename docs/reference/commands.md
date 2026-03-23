# Commands

## Текущий Статус

Репозиторий теперь собран из трёх продуктовых приложений:
- `apps/showcase`
- `apps/admin`
- `apps/web`

## Базовый Набор

- `npm install`
- `npm run dev`
- `npm run lint`
- `npm run build`
- `npm run start`
- `npm run dev:admin`
- `npm run build:admin`
- `npm run dev:showcase`
- `npm run build:showcase`

## Дополнительно

Команды выше запускаются из корня репозитория через workspace.

Также доступны служебные скрипты:
- `bash scripts/test.sh`
- `bash scripts/docs-check.sh`
- `powershell -ExecutionPolicy Bypass -File scripts/publish-showcase.ps1`
- `powershell -ExecutionPolicy Bypass -File scripts/publish-admin.ps1`
- `powershell -ExecutionPolicy Bypass -File scripts/deploy-yc-web.ps1`

Полезные живые entrypoints:
- `https://art.solofarm.ru/`
- `https://admin.art.solofarm.ru/login/`
- `https://api.art.solofarm.ru/api/health`

`apps/web` — это backend-only runtime.
`apps/showcase` и `apps/admin` — статические сборки для Object Storage.
