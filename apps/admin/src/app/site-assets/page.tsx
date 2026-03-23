"use client";

import { useEffect, useState } from "react";

import { AppShell } from "@/components/app-shell";
import { apiFetch } from "@/lib/api";
import { createEmptySiteAssetVersion } from "@/lib/defaults";
import { siteAssetLabels } from "@/lib/site-asset-schema";
import {
  siteAssetSlotKeys,
  type SiteAssetPayload,
  type SiteAssetSlotKey,
  type SiteAssetVersion,
  type SiteAssetVersionRecord,
  variantIds,
} from "@/lib/types";

function normalizePayload(payload: SiteAssetPayload): SiteAssetPayload {
  return {
    assetId: payload.assetId ?? "",
    url: payload.url ?? "",
    alt: payload.alt ?? "",
    caption: payload.caption ?? "",
    focalPoint: payload.focalPoint
      ? {
          x: Number.isFinite(payload.focalPoint.x) ? payload.focalPoint.x : 0.5,
          y: Number.isFinite(payload.focalPoint.y) ? payload.focalPoint.y : 0.5,
        }
      : null,
    decorative: Boolean(payload.decorative),
    variantOverrides: payload.variantOverrides,
  };
}

export default function SiteAssetsPage() {
  const [variantId, setVariantId] = useState<(typeof variantIds)[number]>("cold-mist");
  const [slotKey, setSlotKey] = useState<SiteAssetSlotKey>("home.heroImage");
  const [versions, setVersions] = useState<SiteAssetVersionRecord[]>([]);
  const [version, setVersion] = useState<SiteAssetVersion>(createEmptySiteAssetVersion("cold-mist", "home.heroImage"));
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  async function fetchVersion(versionId: string, nextVariantId = variantId, nextSlotKey = slotKey) {
    const response = await apiFetch<{ version: SiteAssetVersion }>(
      `/api/admin/site-assets/versions/${versionId}?variantId=${nextVariantId}&slotKey=${nextSlotKey}`,
    );
    return {
      ...response.version,
      payload: normalizePayload(response.version.payload),
    };
  }

  async function loadVersions(nextVariantId = variantId, nextSlotKey = slotKey, preferredVersionId?: string | null) {
    const response = await apiFetch<{ versions: SiteAssetVersionRecord[] }>(
      `/api/admin/site-assets/versions?variantId=${nextVariantId}&slotKey=${nextSlotKey}`,
    );
    setVersions(response.versions);

    const nextSelectedRecord =
      (preferredVersionId ? response.versions.find((item) => item.id === preferredVersionId) : undefined) ??
      (version.id ? response.versions.find((item) => item.id === version.id) : undefined) ??
      response.versions.find((item) => item.isPublishedActive) ??
      response.versions[0];

    if (nextSelectedRecord) {
      setVersion(await fetchVersion(nextSelectedRecord.id, nextVariantId, nextSlotKey));
      return;
    }

    setVersion(createEmptySiteAssetVersion(nextVariantId, nextSlotKey));
  }

  async function loadVersion(versionId: string, nextVariantId = variantId, nextSlotKey = slotKey) {
    setVersion(await fetchVersion(versionId, nextVariantId, nextSlotKey));
  }

  useEffect(() => {
    void loadVersions().catch((error) => {
      setMessage(error instanceof Error ? error.message : "Не удалось загрузить версии медиа.");
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slotKey, variantId]);

  function updatePayload(updates: Partial<SiteAssetPayload>) {
    setVersion((current) => ({
      ...current,
      payload: normalizePayload({
        ...current.payload,
        ...updates,
      }),
    }));
  }

  async function createVersion() {
    setPending(true);
    setMessage("");

    try {
      const response = await apiFetch<{ version: SiteAssetVersion }>("/api/admin/site-assets/versions", {
        method: "POST",
        body: JSON.stringify({
          variantId,
          slotKey,
          versionName: "Новая версия",
          payload: version.payload,
        }),
      });

      await loadVersions(variantId, slotKey, response.version.id);
      setMessage("Создана новая версия медиа.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Не удалось создать версию медиа.");
    } finally {
      setPending(false);
    }
  }

  async function saveVersion() {
    setPending(true);
    setMessage("");

    try {
      const path = version.id ? `/api/admin/site-assets/versions/${version.id}` : "/api/admin/site-assets/versions";
      const method = version.id ? "PATCH" : "POST";
      const response = await apiFetch<{ version: SiteAssetVersion }>(path, {
        method,
        body: JSON.stringify({
          variantId,
          slotKey,
          versionName: version.versionName,
          payload: version.payload,
          status: version.status,
        }),
      });

      await loadVersions(variantId, slotKey, response.version.id);
      setMessage("Версия медиа сохранена.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Не удалось сохранить версию медиа.");
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
      const response = await apiFetch<{ version: SiteAssetVersion }>(`/api/admin/site-assets/versions/${version.id}/clone`, {
        method: "POST",
        body: JSON.stringify({ variantId, slotKey }),
      });

      await loadVersions(variantId, slotKey, response.version.id);
      setMessage("Создана копия версии медиа.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Не удалось создать копию версии медиа.");
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
      await apiFetch(`/api/admin/site-assets/versions/${version.id}/publish`, {
        method: "POST",
        body: JSON.stringify({ variantId, slotKey }),
      });
      await loadVersions(variantId, slotKey, version.id);
      setMessage("Версия медиа опубликована и попала в public snapshot.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Не удалось опубликовать версию медиа.");
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
              <span>Слот</span>
              <select value={slotKey} onChange={(event) => setSlotKey(event.target.value as SiteAssetSlotKey)}>
                {siteAssetSlotKeys.map((item) => (
                  <option key={item} value={item}>
                    {siteAssetLabels[item]}
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
                  {variantId} / {siteAssetLabels[slotKey]}
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
                      setMessage(error instanceof Error ? error.message : "Не удалось загрузить версию медиа."),
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
                <input value={version.versionName} onChange={(event) => setVersion((current) => ({ ...current, versionName: event.target.value }))} />
              </label>

              <div className="field-grid two">
                <label className="field">
                  <span>Asset ID</span>
                  <input value={version.payload.assetId} onChange={(event) => updatePayload({ assetId: event.target.value })} />
                </label>
                <label className="field">
                  <span>URL</span>
                  <input value={version.payload.url} onChange={(event) => updatePayload({ url: event.target.value })} />
                </label>
              </div>

              <div className="field-grid two">
                <label className="field">
                  <span>Alt</span>
                  <input value={version.payload.alt} onChange={(event) => updatePayload({ alt: event.target.value })} />
                </label>
                <label className="field">
                  <span>Caption</span>
                  <input value={version.payload.caption} onChange={(event) => updatePayload({ caption: event.target.value })} />
                </label>
              </div>

              <div className="field-grid two">
                <label className="field">
                  <span>Focal X</span>
                  <input
                    type="number"
                    min="0"
                    max="1"
                    step="0.01"
                    value={version.payload.focalPoint?.x ?? 0.5}
                    onChange={(event) =>
                      updatePayload({
                        focalPoint: {
                          x: Number(event.target.value),
                          y: version.payload.focalPoint?.y ?? 0.5,
                        },
                      })
                    }
                  />
                </label>
                <label className="field">
                  <span>Focal Y</span>
                  <input
                    type="number"
                    min="0"
                    max="1"
                    step="0.01"
                    value={version.payload.focalPoint?.y ?? 0.5}
                    onChange={(event) =>
                      updatePayload({
                        focalPoint: {
                          x: version.payload.focalPoint?.x ?? 0.5,
                          y: Number(event.target.value),
                        },
                      })
                    }
                  />
                </label>
              </div>

              <label className="field" style={{ gap: 12, alignItems: "center", gridAutoFlow: "column", justifyContent: "start" }}>
                <input
                  type="checkbox"
                  checked={version.payload.decorative}
                  onChange={(event) => updatePayload({ decorative: event.target.checked })}
                />
                <span>Декоративное изображение</span>
              </label>

              {version.payload.url ? (
                <div className="table-card" style={{ padding: 16 }}>
                  <p className="admin-kicker">Превью</p>
                  <div style={{ position: "relative", marginTop: 12, overflow: "hidden", borderRadius: 18, background: "#f4f1ec", minHeight: 280 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={version.payload.url}
                      alt={version.payload.alt || "Site asset preview"}
                      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                </div>
              ) : null}
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
