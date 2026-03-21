"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { AppShell } from "@/components/app-shell";
import { apiFetch } from "@/lib/api";

export default function SettingsPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [passwordIsDefault, setPasswordIsDefault] = useState(false);

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
    await apiFetch("/api/auth/change-password", {
      method: "POST",
      body: JSON.stringify({ nextPassword: password }),
    });

    setPassword("");
    setPasswordIsDefault(false);
    setMessage("Пароль обновлён.");
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
              <button className="button" type="button" onClick={changePassword}>
                Сменить пароль
              </button>
              <button className="button-secondary" type="button" onClick={logout}>
                Выйти
              </button>
            </div>
          </div>

          {message ? <p className="subtle">{message}</p> : null}
        </section>
      </div>
    </AppShell>
  );
}
