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
- интеграция с Yandex Object Storage;
- Docker-сборка;
- production admin/deploy контур для закрытой части.

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
