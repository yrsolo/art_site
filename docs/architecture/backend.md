# Backend

## Общий Подход

Backend теперь живёт как отдельный runtime-контур внутри `apps/web`, но не отдаёт основной frontend UI.
Публичная витрина и админский интерфейс публикуются как статические сборки отдельно от контейнера.

## Что Нужно Реализовать В MVP

- `login`
- `logout`
- `session check`
- `change password`
- `artwork CRUD`
- `photo upload/delete/set primary`
- `content version CRUD`
- `publish content version`
- `export public snapshot`

## Требования

- контейнер держит только auth, API, uploads и публикацию данных;
- проверка пароля только на сервере;
- сессия через `httpOnly cookie`;
- источник истины для данных хранится в JSON-документах в Object Storage;
- отдельный слой интеграции с Object Storage нужен и для JSON-данных, и для media.

## Что Не Нужен Делать Сразу

- полноценную RBAC-систему;
- регистрацию пользователей;
- сложный audit log;
- очередь и фоновые пайплайны без прямой необходимости;
- отдельную БД, если bucket-backed JSON уже покрывает текущий MVP.
