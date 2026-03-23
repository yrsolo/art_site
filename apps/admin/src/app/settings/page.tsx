"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { AppShell } from "@/components/app-shell";
import { apiFetch } from "@/lib/api";

export default function SettingsPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [passwordIsDefault, setPasswordIsDefault] = useState(false);
  const [pendingAction, setPendingAction] = useState("");

  useEffect(() => {
    apiFetch<{ passwordIsDefault: boolean }>("/api/admin/settings")
      .then((response) => setPasswordIsDefault(response.passwordIsDefault))
      .catch((error) => setMessage(error instanceof Error ? error.message : "Не удалось загрузить настройки."));
  }, []);

  async function logout() {
    await apiFetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  async function changePassword() {
    setPendingAction("password");
    try {
      await apiFetch("/api/auth/change-password", {
        method: "POST",
        body: JSON.stringify({ nextPassword: password }),
      });

      setPassword("");
      setPasswordIsDefault(false);
      setMessage("Пароль обновлён.");
    } finally {
      setPendingAction("");
    }
  }

  async function importSketchLots() {
    setPendingAction("import");
    try {
      const response = await apiFetch<{ created: number; skipped: number; total: number }>("/api/admin/import/sketch-artworks", {
        method: "POST",
      });
      setMessage(`Импорт завершён: создано ${response.created}, пропущено ${response.skipped}, всего эскизных работ ${response.total}.`);
    } finally {
      setPendingAction("");
    }
  }

  async function exportSnapshot() {
    setPendingAction("export");
    try {
      const response = await apiFetch<{ generatedAt: string }>("/api/admin/export/public-site", { method: "POST" });
      setMessage(`Public snapshot пересобран: ${response.generatedAt}.`);
    } finally {
      setPendingAction("");
    }
  }

  return (
    <AppShell>
      <div className="page-grid">
        <section className="detail-card">
          <p className="admin-kicker">Настройки</p>
          <h2>Безопасность и публикация</h2>
          <p className="subtle">
            {passwordIsDefault
              ? "Сейчас используется bootstrap-пароль. Он не блокирует работу, но его стоит сменить."
              : "Пароль уже заменён на рабочий."}
          </p>

          <div className="field-grid" style={{ marginTop: 20 }}>
            <label className="field">
              <span>Новый пароль</span>
              <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
            </label>
            <div className="actions">
              <button className="button" type="button" onClick={changePassword} disabled={pendingAction !== ""}>
                {pendingAction === "password" ? "Сохраняем..." : "Сменить пароль"}
              </button>
              <button className="button-secondary" type="button" onClick={logout} disabled={pendingAction !== ""}>
                Выйти
              </button>
            </div>
          </div>
        </section>

        <section className="detail-card">
          <p className="admin-kicker">Данные витрины</p>
          <h2>Эскизные лоты и snapshot</h2>
          <p className="subtle">
            Здесь можно один раз перевести текущие картинки из эскизных галерей в живые редактируемые лоты и пересобрать published
            snapshot для публичной витрины.
          </p>

          <div className="actions" style={{ marginTop: 20 }}>
            <button className="button" type="button" onClick={importSketchLots} disabled={pendingAction !== ""}>
              {pendingAction === "import" ? "Импортируем..." : "Импортировать лоты из эскизов"}
            </button>
            <button className="button-secondary" type="button" onClick={exportSnapshot} disabled={pendingAction !== ""}>
              {pendingAction === "export" ? "Собираем..." : "Пересобрать public snapshot"}
            </button>
          </div>

          {message ? <p className="subtle" style={{ marginTop: 16 }}>{message}</p> : null}
        </section>
      </div>
    </AppShell>
  );
}
