"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { apiFetch } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");

    try {
      await apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });

      router.push("/artworks");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Не удалось войти.");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="login-shell">
      <form className="login-card login-grid" onSubmit={handleSubmit}>
        <div>
          <p className="admin-kicker">ART_SITE Admin</p>
          <h1>Вход в админку</h1>
          <p className="admin-muted">Статический frontend на бакете, backend и авторизация живут в отдельном API-контуре.</p>
        </div>

        <label className="field">
          <span>Логин</span>
          <input value={username} onChange={(event) => setUsername(event.target.value)} required />
        </label>

        <label className="field">
          <span>Пароль</span>
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
        </label>

        {error ? <p className="subtle">{error}</p> : null}

        <button className="button" type="submit" disabled={pending}>
          {pending ? "Входим…" : "Войти"}
        </button>
      </form>
    </main>
  );
}
