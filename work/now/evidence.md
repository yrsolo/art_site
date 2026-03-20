# Evidence

## Подтверждено По Репозиторию

- в `brif/brif.md` зафиксирован стек `Next.js + TypeScript + Tailwind CSS`;
- в брифе предусмотрены публичный сайт и закрытая админка;
- в `ref/template/` уже лежат дизайн-референсы для нескольких вариантов визуального направления.

## Сделано На Этом Этапе

- поднят `Next.js` app в `apps/web`;
- реализованы публичные страницы `/`, `/gallery`, `/artwork/[slug]`, `/about`, `/contacts`;
- добавлен переключатель тем с сохранением выбора в cookie;
- реализованы локальные адаптеры `ArtworkRepository` и `AssetStorage`;
- добавлены admin login, защищённая страница `/admin` и CRUD-операции;
- загрузка изображений сохраняет файлы в `apps/web/public/uploads`;
- корневые команды `npm run dev`, `npm run lint`, `npm run build` теперь ведут в `apps/web`;
- локально подтверждены `lint`, `build`, public routes, redirect в `/admin/login`, `401` без сессии на admin API и успешный API-доступ после логина.

## Не Подтверждено Кодом Пока Что

- интеграция с Yandex Object Storage;
- Docker-сборка;
- deploy-конфигурация;
- production env и домен `art.solofarm.ru`.

Эти пункты остаются следующим инфраструктурным этапом после стабилизации локального MVP.
