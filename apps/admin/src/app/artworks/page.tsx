"use client";

import { useEffect, useMemo, useState } from "react";

import { AppShell } from "@/components/app-shell";
import { apiFetch, apiFormFetch } from "@/lib/api";
import { createEmptyArtwork } from "@/lib/defaults";
import { artworkStatuses, type Artwork, type ArtworkSummary } from "@/lib/types";

function formatStatus(status: string) {
  switch (status) {
    case "for_sale":
      return "Продаётся";
    case "sold":
      return "Продана";
    case "off_market":
      return "Снята с продажи";
    case "in_progress":
      return "В процессе";
    default:
      return status;
  }
}

export default function ArtworksPage() {
  const [items, setItems] = useState<ArtworkSummary[]>([]);
  const [artwork, setArtwork] = useState<Artwork>(createEmptyArtwork());
  const [editing, setEditing] = useState(true);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);

  async function loadList(nextSelectedId?: string | null) {
    const response = await apiFetch<{ artworks: ArtworkSummary[] }>("/api/admin/artworks");
    setItems(response.artworks);

    const fallbackId = nextSelectedId ?? response.artworks[0]?.id ?? null;
    if (fallbackId) {
      const artworkResponse = await apiFetch<{ artwork: Artwork }>(`/api/admin/artworks/${fallbackId}`);
      setArtwork(artworkResponse.artwork);
      setEditing(false);
    } else {
      setArtwork(createEmptyArtwork());
      setEditing(true);
    }
  }

  async function loadArtwork(id: string) {
    const response = await apiFetch<{ artwork: Artwork }>(`/api/admin/artworks/${id}`);
    setArtwork(response.artwork);
    setEditing(false);
    setDrawerOpen(true);
  }

  useEffect(() => {
    void loadList().catch((error) => {
      setMessage(error instanceof Error ? error.message : "Не удалось загрузить лоты.");
    });
  }, []);

  const sortedItems = useMemo(() => [...items].sort((left, right) => left.sortOrder - right.sortOrder), [items]);

  function updateField<Key extends keyof Artwork>(key: Key, value: Artwork[Key]) {
    setArtwork((current) => ({ ...current, [key]: value }));
  }

  async function saveArtwork() {
    setPending(true);
    setMessage("");

    try {
      let savedArtwork: Artwork;

      if (artwork.id) {
        const response = await apiFetch<{ artwork: Artwork }>(`/api/admin/artworks/${artwork.id}`, {
          method: "PATCH",
          body: JSON.stringify(artwork),
        });
        savedArtwork = response.artwork;
      } else {
        const response = await apiFetch<{ artwork: Artwork }>("/api/admin/artworks", {
          method: "POST",
          body: JSON.stringify(artwork),
        });
        savedArtwork = response.artwork;
      }

      setArtwork(savedArtwork);
      await loadList(savedArtwork.id);
      setEditing(false);
      setDrawerOpen(true);
      setMessage("Карточка сохранена.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Не удалось сохранить лот.");
    } finally {
      setPending(false);
    }
  }

  async function deleteCurrentArtwork() {
    if (!artwork.id) {
      return;
    }

    setPending(true);
    setMessage("");

    try {
      await apiFetch(`/api/admin/artworks/${artwork.id}`, { method: "DELETE" });
      await loadList(null);
      setDrawerOpen(false);
      setMessage("Лот удалён.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Не удалось удалить лот.");
    } finally {
      setPending(false);
    }
  }

  async function uploadPhoto(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file || !artwork.id) {
      return;
    }

    setPending(true);

    try {
      const formData = new FormData();
      formData.set("file", file);
      const response = await apiFormFetch<{ artwork: Artwork }>(`/api/admin/artworks/${artwork.id}/photos`, formData);
      setArtwork(response.artwork);
      await loadList(artwork.id);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Не удалось загрузить фото.");
    } finally {
      setPending(false);
      event.target.value = "";
    }
  }

  async function deletePhoto(photoId: string) {
    if (!artwork.id) {
      return;
    }

    const response = await apiFetch<{ artwork: Artwork }>(`/api/admin/artworks/${artwork.id}/photos/${photoId}`, {
      method: "DELETE",
    });
    setArtwork(response.artwork);
    await loadList(artwork.id);
  }

  async function setPrimary(photoId: string) {
    if (!artwork.id) {
      return;
    }

    const response = await apiFetch<{ artwork: Artwork }>(`/api/admin/artworks/${artwork.id}/photos/${photoId}/primary`, {
      method: "POST",
    });
    setArtwork(response.artwork);
    await loadList(artwork.id);
  }

  async function toggleGallery(summary: ArtworkSummary) {
    const fullArtwork =
      artwork.id === summary.id ? artwork : (await apiFetch<{ artwork: Artwork }>(`/api/admin/artworks/${summary.id}`)).artwork;

    await apiFetch(`/api/admin/artworks/${summary.id}`, {
      method: "PATCH",
      body: JSON.stringify({ ...fullArtwork, showInGallery: !summary.showInGallery }),
    });

    await loadList(summary.id);
  }

  return (
    <AppShell>
      <section className="table-card">
        <div className="actions" style={{ justifyContent: "space-between" }}>
          <div>
            <p className="admin-kicker">Лоты</p>
            <h2>Все картины</h2>
          </div>

          <button
            className="button-secondary"
            type="button"
            onClick={() => {
              setMessage("");
              setArtwork(createEmptyArtwork());
              setEditing(true);
              setDrawerOpen(true);
            }}
          >
            Создать новый лот
          </button>
        </div>

        {message ? <p className="subtle" style={{ marginBottom: 16 }}>{message}</p> : null}

        <div className="table-grid">
          {sortedItems.map((item) => (
            <div key={item.id} className={`table-row ${artwork.id === item.id ? "active" : ""}`}>
              <div className="table-preview" style={{ backgroundImage: item.previewUrl ? `url(${item.previewUrl})` : undefined }} />
              <div>
                <strong>{item.title}</strong>
                <div className="subtle">{item.slug}</div>
              </div>
              <div>{item.series || "Без серии"}</div>
              <div>{formatStatus(item.status)}</div>
              <label>
                <input type="checkbox" checked={item.showInGallery} onChange={() => toggleGallery(item)} />
              </label>
              <button
                className="button-secondary"
                type="button"
                onClick={() => {
                  loadArtwork(item.id).catch((error) => setMessage(error instanceof Error ? error.message : "Не удалось загрузить карточку."));
                }}
              >
                Открыть
              </button>
            </div>
          ))}
        </div>
      </section>

      {drawerOpen ? (
        <div className="admin-drawer-backdrop" onClick={() => setDrawerOpen(false)} role="presentation">
          <section className="admin-drawer detail-card" onClick={(event) => event.stopPropagation()}>
            <div className="actions" style={{ justifyContent: "space-between" }}>
              <div>
                <p className="admin-kicker">{artwork.id ? "Карточка лота" : "Новый лот"}</p>
                <h2>{artwork.title || "Новая картина"}</h2>
              </div>

              <div className="actions">
                {artwork.id ? (
                  <button className="button-secondary" type="button" onClick={() => setEditing((current) => !current)}>
                    {editing ? "Режим просмотра" : "Режим редактирования"}
                  </button>
                ) : null}
                {artwork.id ? (
                  <button className="button-danger" type="button" onClick={deleteCurrentArtwork} disabled={pending}>
                    Удалить
                  </button>
                ) : null}
                <button className="button-secondary" type="button" onClick={() => setDrawerOpen(false)}>
                  Закрыть
                </button>
              </div>
            </div>

            <div className="stack">
              <div className="field-grid two">
                <label className="field">
                  <span>Название</span>
                  <input value={artwork.title} onChange={(event) => updateField("title", event.target.value)} disabled={!editing} />
                </label>
                <label className="field">
                  <span>Slug</span>
                  <input value={artwork.slug} onChange={(event) => updateField("slug", event.target.value)} disabled={!editing} />
                </label>
                <label className="field">
                  <span>Серия</span>
                  <input value={artwork.series} onChange={(event) => updateField("series", event.target.value)} disabled={!editing} />
                </label>
                <label className="field">
                  <span>Год</span>
                  <input value={artwork.year} onChange={(event) => updateField("year", event.target.value)} disabled={!editing} />
                </label>
                <label className="field">
                  <span>Материалы</span>
                  <input value={artwork.materials} onChange={(event) => updateField("materials", event.target.value)} disabled={!editing} />
                </label>
                <label className="field">
                  <span>Размер</span>
                  <input value={artwork.size} onChange={(event) => updateField("size", event.target.value)} disabled={!editing} />
                </label>
                <label className="field">
                  <span>Цена</span>
                  <input value={artwork.price} onChange={(event) => updateField("price", event.target.value)} disabled={!editing} />
                </label>
                <label className="field">
                  <span>Валюта</span>
                  <input value={artwork.currency} onChange={(event) => updateField("currency", event.target.value)} disabled={!editing} />
                </label>
                <label className="field">
                  <span>Статус</span>
                  <select value={artwork.status} onChange={(event) => updateField("status", event.target.value as Artwork["status"])} disabled={!editing}>
                    {artworkStatuses.map((status) => (
                      <option key={status} value={status}>
                        {formatStatus(status)}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="field">
                  <span>Порядок</span>
                  <input
                    type="number"
                    value={artwork.sortOrder}
                    onChange={(event) => updateField("sortOrder", Number(event.target.value))}
                    disabled={!editing}
                  />
                </label>
              </div>

              <label className="field">
                <span>
                  <input
                    type="checkbox"
                    checked={artwork.showInGallery}
                    onChange={(event) => updateField("showInGallery", event.target.checked)}
                    disabled={!editing}
                  />{" "}
                  Показывать в галерее
                </span>
              </label>

              <label className="field">
                <span>Описание</span>
                <textarea value={artwork.description} onChange={(event) => updateField("description", event.target.value)} disabled={!editing} />
              </label>

              <div className="actions">
                <button className="button" type="button" onClick={saveArtwork} disabled={pending || !editing}>
                  {pending ? "Сохраняем…" : "Сохранить"}
                </button>
              </div>

              <div className="panel">
                <div className="actions" style={{ justifyContent: "space-between" }}>
                  <div>
                    <h2>Фотографии</h2>
                    <p className="subtle">Можно загружать несколько фото, удалять их и выбирать основное превью.</p>
                  </div>
                  <label className="button-secondary" style={{ cursor: artwork.id ? "pointer" : "not-allowed", opacity: artwork.id ? 1 : 0.5 }}>
                    Загрузить фото
                    <input type="file" accept="image/*" onChange={uploadPhoto} disabled={!artwork.id} hidden />
                  </label>
                </div>

                <div className="photo-grid">
                  {artwork.photos.map((photo) => (
                    <div key={photo.id} className="photo-card">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={photo.urlPreview || photo.urlOriginal} alt={photo.alt || artwork.title} className="photo-thumb" />
                      <div className="field-grid" style={{ marginTop: 12 }}>
                        <label className="field">
                          <span>Alt</span>
                          <input
                            value={photo.alt}
                            onChange={async (event) => {
                              if (!artwork.id) return;
                              const response = await apiFetch<{ artwork: Artwork }>(`/api/admin/artworks/${artwork.id}/photos/${photo.id}`, {
                                method: "PATCH",
                                body: JSON.stringify({ alt: event.target.value, caption: photo.caption }),
                              });
                              setArtwork(response.artwork);
                            }}
                            disabled={!editing}
                          />
                        </label>
                        <label className="field">
                          <span>Подпись</span>
                          <input
                            value={photo.caption}
                            onChange={async (event) => {
                              if (!artwork.id) return;
                              const response = await apiFetch<{ artwork: Artwork }>(`/api/admin/artworks/${artwork.id}/photos/${photo.id}`, {
                                method: "PATCH",
                                body: JSON.stringify({ alt: photo.alt, caption: event.target.value }),
                              });
                              setArtwork(response.artwork);
                            }}
                            disabled={!editing}
                          />
                        </label>
                      </div>
                      <div className="actions" style={{ marginTop: 12 }}>
                        <button className="button-secondary" type="button" onClick={() => setPrimary(photo.id)}>
                          {artwork.primaryPhotoId === photo.id ? "Основное фото" : "Сделать основным"}
                        </button>
                        <button className="button-danger" type="button" onClick={() => deletePhoto(photo.id)}>
                          Удалить
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      ) : null}
    </AppShell>
  );
}
