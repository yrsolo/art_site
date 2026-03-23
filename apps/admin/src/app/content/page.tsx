"use client";

import { useEffect, useState } from "react";

import { AppShell } from "@/components/app-shell";
import { apiFetch } from "@/lib/api";
import { contentSchema } from "@/lib/content-schema";
import { createEmptyContentVersion } from "@/lib/defaults";
import { pageKeys, type ContentVersion, type ContentVersionRecord, type PageKey, variantIds } from "@/lib/types";

function payloadToForm(payload: Record<string, unknown>) {
  return { ...payload };
}

export default function ContentPage() {
  const [variantId, setVariantId] = useState<(typeof variantIds)[number]>("cold-mist");
  const [pageKey, setPageKey] = useState<PageKey>("home");
  const [versions, setVersions] = useState<ContentVersionRecord[]>([]);
  const [version, setVersion] = useState<ContentVersion>(createEmptyContentVersion("cold-mist", "home"));
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  async function fetchVersion(versionId: string, nextVariantId = variantId, nextPageKey = pageKey) {
    const response = await apiFetch<{ version: ContentVersion }>(
      `/api/admin/content/versions/${versionId}?variantId=${nextVariantId}&pageKey=${nextPageKey}`,
    );
    return response.version;
  }

  async function loadVersions(nextVariantId = variantId, nextPageKey = pageKey, preferredVersionId?: string | null) {
    const response = await apiFetch<{ versions: ContentVersionRecord[] }>(
      `/api/admin/content/versions?variantId=${nextVariantId}&pageKey=${nextPageKey}`,
    );
    setVersions(response.versions);

    const nextSelectedRecord =
      (preferredVersionId ? response.versions.find((item) => item.id === preferredVersionId) : undefined) ??
      (version.id ? response.versions.find((item) => item.id === version.id) : undefined) ??
      response.versions.find((item) => item.isPublishedActive) ??
      response.versions[0];

    if (nextSelectedRecord) {
      setVersion(await fetchVersion(nextSelectedRecord.id, nextVariantId, nextPageKey));
      return;
    }

    setVersion(createEmptyContentVersion(nextVariantId, nextPageKey));
  }

  async function loadVersion(versionId: string, nextVariantId = variantId, nextPageKey = pageKey) {
    setVersion(await fetchVersion(versionId, nextVariantId, nextPageKey));
  }

  useEffect(() => {
    void loadVersions().catch((error) => {
      setMessage(error instanceof Error ? error.message : "Не удалось загрузить версии.");
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageKey, variantId]);

  function updatePayload(key: string, value: string | string[]) {
    setVersion((current) => ({
      ...current,
      payload: {
        ...current.payload,
        [key]: value,
      },
    }));
  }

  async function createVersion() {
    setPending(true);
    setMessage("");

    try {
      const response = await apiFetch<{ version: ContentVersion }>("/api/admin/content/versions", {
        method: "POST",
        body: JSON.stringify({
          variantId,
          pageKey,
          versionName: "Новая версия",
          payload: version.payload,
        }),
      });

      await loadVersions(variantId, pageKey, response.version.id);
      setMessage("Создана новая версия.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Не удалось создать версию.");
    } finally {
      setPending(false);
    }
  }

  async function saveVersion() {
    setPending(true);
    setMessage("");

    try {
      const path = version.id ? `/api/admin/content/versions/${version.id}` : "/api/admin/content/versions";
      const method = version.id ? "PATCH" : "POST";
      const response = await apiFetch<{ version: ContentVersion }>(path, {
        method,
        body: JSON.stringify({
          variantId,
          pageKey,
          versionName: version.versionName,
          payload: version.payload,
          status: version.status,
        }),
      });

      await loadVersions(variantId, pageKey, response.version.id);
      setMessage("Версия сохранена.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Не удалось сохранить версию.");
    } finally {
      setPending(false);
    }
  }

  async function cloneVersion() {
    if (!version.id) {
      return;
    }

    setPending(true);
    setMessage("");

    try {
      const response = await apiFetch<{ version: ContentVersion }>(`/api/admin/content/versions/${version.id}/clone`, {
        method: "POST",
        body: JSON.stringify({ variantId, pageKey }),
      });

      await loadVersions(variantId, pageKey, response.version.id);
      setMessage("Создана копия версии.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Не удалось создать копию версии.");
    } finally {
      setPending(false);
    }
  }

  async function publishVersion() {
    if (!version.id) {
      return;
    }

    setPending(true);
    setMessage("");

    try {
      await apiFetch(`/api/admin/content/versions/${version.id}/publish`, {
        method: "POST",
        body: JSON.stringify({ variantId, pageKey }),
      });
      await loadVersions(variantId, pageKey, version.id);
      setMessage("Версия опубликована и snapshot обновлён.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Не удалось опубликовать версию.");
    } finally {
      setPending(false);
    }
  }

  return (
    <AppShell>
      <div className="page-grid">
        <section className="table-card">
          <div className="field-grid two">
            <label className="field">
              <span>Вариант</span>
              <select value={variantId} onChange={(event) => setVariantId(event.target.value as (typeof variantIds)[number])}>
                {variantIds.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span>Страница</span>
              <select value={pageKey} onChange={(event) => setPageKey(event.target.value as PageKey)}>
                {pageKeys.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </section>

        <div className="artwork-page-grid">
          <section className="table-card">
            <div className="actions" style={{ justifyContent: "space-between" }}>
              <div>
                <p className="admin-kicker">Версии</p>
                <h2>
                  {variantId} / {pageKey}
                </h2>
              </div>
              <button className="button-secondary" type="button" onClick={createVersion} disabled={pending}>
                Создать версию
              </button>
            </div>

            <div className="table-grid">
              {versions.map((item) => (
                <button
                  key={item.id}
                  className={`button-secondary${item.id === version.id ? " active-chip" : ""}`}
                  type="button"
                  onClick={() =>
                    void loadVersion(item.id).catch((error) =>
                      setMessage(error instanceof Error ? error.message : "Не удалось загрузить версию."),
                    )
                  }
                >
                  {item.versionName} · {item.status}
                  {item.isPublishedActive ? " · active" : ""}
                </button>
              ))}
            </div>
          </section>

          <section className="detail-card">
            <div className="actions" style={{ justifyContent: "space-between" }}>
              <div>
                <p className="admin-kicker">Редактор</p>
                <h2>{version.versionName}</h2>
              </div>
              <div className="actions">
                <button className="button-secondary" type="button" onClick={saveVersion} disabled={pending}>
                  Сохранить
                </button>
                <button className="button-secondary" type="button" onClick={cloneVersion} disabled={!version.id || pending}>
                  Сохранить как копию
                </button>
                <button className="button" type="button" onClick={publishVersion} disabled={!version.id || pending}>
                  Опубликовать
                </button>
              </div>
            </div>

            {message ? <p className="subtle">{message}</p> : null}

            <div className="stack">
              <label className="field">
                <span>Имя версии</span>
                <input
                  value={version.versionName}
                  onChange={(event) => setVersion((current) => ({ ...current, versionName: event.target.value }))}
                />
              </label>

              {contentSchema[pageKey].map((field) => {
                const payload = payloadToForm(version.payload);
                const value = payload[field.key];

                if (field.type === "string-array") {
                  return (
                    <label key={field.key} className="field">
                      <span>{field.label}</span>
                      <textarea
                        value={Array.isArray(value) ? value.join("\n") : ""}
                        onChange={(event) => updatePayload(field.key, event.target.value.split("\n").filter(Boolean))}
                      />
                    </label>
                  );
                }

                if (field.type === "textarea") {
                  return (
                    <label key={field.key} className="field">
                      <span>{field.label}</span>
                      <textarea
                        value={typeof value === "string" ? value : ""}
                        onChange={(event) => updatePayload(field.key, event.target.value)}
                      />
                    </label>
                  );
                }

                return (
                  <label key={field.key} className="field">
                    <span>{field.label}</span>
                    <input
                      value={typeof value === "string" ? value : ""}
                      onChange={(event) => updatePayload(field.key, event.target.value)}
                    />
                  </label>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
