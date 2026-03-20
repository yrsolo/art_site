# ART_SITE

Монорепозиторий для сайта-портфолио художницы с общей backend-частью и несколькими независимыми frontend-витринами. Проект развивается на `Next.js + TypeScript + Tailwind CSS`, при этом сравнение вариантов дизайна идёт через отдельные route-per-variant морды, а не через один theme layer.

## Что Это

Сайт объединяет:
- публичные витрины портфолио;
- детальные страницы работ;
- контакты и информацию об авторе;
- закрытую админку для управления картинами и изображениями.

## Зачем Это Нужно

Для этого проекта различия между эскизами принципиальны. Нельзя усреднять их в один общий публичный интерфейс. Поэтому backend, auth, repository и media flow остаются общими, а frontend-варианты сравниваются как отдельные витрины.

## Основные Возможности Текущего MVP

- каталог frontend-вариантов на `/`
- public routes в формате `/<variant>/...`
- локальная админка с логином по паролю и `httpOnly` cookie-сессией
- CRUD для картин
- локальное JSON-хранилище и локальные uploads
- каталог эскизов и matrix покрытия в `docs/catalog/sketch-catalog.md`

## Быстрый Старт

Смотрите:
- [Getting Started](docs/overview/getting-started.md)
- [Repository Map](docs/overview/repository-map.md)
- [Frontend Variants](docs/architecture/frontend-variants.md)
- [Sketch Catalog](docs/catalog/sketch-catalog.md)
- [Docs Map](docs/README.md)

## Структура Репозитория

- `apps/` — продуктовый код
- `docs/` — постоянная документация проекта
- `work/` — текущий рабочий контур и tracking
- `agent/` — правила и операционный контракт для агентной работы
- `brif/` — исходные материалы и ТЗ
- `ref/` — референсы и шаблоны дизайна

## Работа Агента

См.:
- [AGENTS.md](AGENTS.md)
- [agent/OPERATING_CONTRACT.md](agent/OPERATING_CONTRACT.md)

## Статус

Текущий этап: `variant architecture and sketch catalog`.

Сделано:
- локальный Next.js MVP с общей admin/data-частью;
- выделение независимых frontend-вариантов;
- route-per-variant public architecture;
- постоянный каталог эскизов в docs.
