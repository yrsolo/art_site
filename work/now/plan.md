# Plan

1. Расширить доменную модель данных лотов, фото, текстовых версий и admin settings
2. Перевести `apps/web` в backend-only runtime с Object Storage-backed repositories, API и session auth
3. Создать `apps/admin` как статический frontend с login, таблицей лотов, редактором карточки и настройками
4. Подключить `apps/showcase` к published snapshot вместо локально захардкоженных artworks/content
5. Обновить env/docs/scripts и прогнать build/lint/publish-проверки для нового контура

## Update 2026-03-20

1. Keep the rail fixed at the right center and detach it from variant-specific headers.
2. Replace the root chooser with a minimal square-preview catalog.
3. Close remaining public variant routes with dedicated components for `etheric-pulse`, `olive-cream`, and `sage-sand`.
4. Replace remaining generic `about` / `contacts` pages in dark variants where source-specific treatment exists.
5. Rebuild, republish, and verify the live static showcase.
