export default function HomePage() {
  return (
    <main className="api-shell">
      <div className="api-card">
        <p className="api-eyebrow">ART_SITE API</p>
        <h1>Backend-only runtime</h1>
        <p>
          Этот контейнер держит только авторизацию, CRUD API, uploads и публикацию snapshot. Публичная витрина и
          админский frontend должны публиковаться как статические сборки отдельно.
        </p>
        <p className="api-note">Проверьте `/api/health`, `/api/auth/session` и admin API routes.</p>
      </div>
    </main>
  );
}
