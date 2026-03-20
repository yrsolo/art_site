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

## Не Подтверждено Кодом Пока Что

- точный 1:1 перенос каждого `code.html` и `screen.png` в production-grade React implementation;
- полнота page coverage для missing screens внутри отдельных organic variants;
- интеграция с Yandex Object Storage;
- Docker-сборка;
- deploy-конфигурация;
- production env и домен `art.solofarm.ru`.

Эти пункты остаются следующими этапами после стабилизации variant architecture и последовательного faithful transfer каждого эскиза.
