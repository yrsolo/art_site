"use client";

import { useEffect, useMemo, useState } from "react";

import { AppShell } from "@/components/app-shell";
import { apiFetch, apiFormFetch } from "@/lib/api";
import { createEmptyArtwork } from "@/lib/defaults";
import { artworkStatuses, type Artwork, type ArtworkSummary } from "@/lib/types";

type GroupMode = "all" | "year" | "series" | "status";
type ArtworkGroup = {
  key: string;
  label: string;
  items: ArtworkSummary[];
};

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

function getYearGroupLabel(item: ArtworkSummary) {
  return item.year.trim() || "Год не указан";
}

function getSeriesGroupLabel(item: ArtworkSummary) {
  return item.series.trim() || "Без серии";
}

function getStatusGroupLabel(item: ArtworkSummary) {
  return formatStatus(item.status);
}

function buildGroups(items: ArtworkSummary[], groupMode: GroupMode, showArchived: boolean) {
  if (groupMode === "all") {
    const active = items.filter((item) => !item.isArchived);
    const archived = items.filter((item) => item.isArchived);
    const groups: ArtworkGroup[] = [];

    if (active.length) {
      groups.push({ key: "all:active", label: "Активные", items: active });
    }

    if (showArchived && archived.length) {
      groups.push({ key: "all:archive", label: "Архив", items: archived });
    }

    return groups;
  }

  const labelForItem =
    groupMode === "year"
      ? getYearGroupLabel
      : groupMode === "series"
        ? getSeriesGroupLabel
        : getStatusGroupLabel;

  const groups = new Map<string, ArtworkSummary[]>();

  for (const item of items) {
    const label = labelForItem(item);
    const current = groups.get(label) ?? [];
    current.push(item);
    groups.set(label, current);
  }

  return [...groups.entries()]
    .map(([label, entries]) => ({
      key: `${groupMode}:${label}`,
      label,
      items: entries,
    }))
    .sort((left, right) => left.label.localeCompare(right.label, "ru"));
}

export default function ArtworksPage() {
  const [items, setItems] = useState<ArtworkSummary[]>([]);
  const [artwork, setArtwork] = useState<Artwork>(createEmptyArtwork());
  const [editing, setEditing] = useState(true);
  const [pending, setPending] = useState(false);
  const [uploadPending, setUploadPending] = useState(false);
  const [message, setMessage] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [groupMode, setGroupMode] = useState<GroupMode>("all");
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
  const [showArchived, setShowArchived] = useState(false);
  const [selectedArtworkIds, setSelectedArtworkIds] = useState<string[]>([]);

  async function loadList(nextSelectedId?: string | null) {
    const response = await apiFetch<{ artworks: ArtworkSummary[] }>("/api/admin/artworks");
    setItems(response.artworks);

    if (!nextSelectedId) {
      if (response.artworks.length === 0) {
        setArtwork(createEmptyArtwork());
        setEditing(true);
      }
      return;
    }

    const artworkResponse = await apiFetch<{ artwork: Artwork }>(`/api/admin/artworks/${nextSelectedId}`);
    setArtwork(artworkResponse.artwork);
    setEditing(false);
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
  const visibleItems = useMemo(
    () => sortedItems.filter((item) => (showArchived ? true : !item.isArchived)),
    [showArchived, sortedItems],
  );
  const groupedItems = useMemo(() => buildGroups(visibleItems, groupMode, showArchived), [groupMode, showArchived, visibleItems]);
  const hasAnyCollapsed = useMemo(() => groupedItems.some((group) => collapsedGroups[group.key]), [collapsedGroups, groupedItems]);

  function updateField<Key extends keyof Artwork>(key: Key, value: Artwork[Key]) {
    setArtwork((current) => ({ ...current, [key]: value }));
  }

  function handleGroupModeClick(nextMode: GroupMode) {
    if (groupMode === nextMode) {
      const nextCollapsed = !hasAnyCollapsed;
      setCollapsedGroups(Object.fromEntries(groupedItems.map((group) => [group.key, nextCollapsed])));
      return;
    }

    setGroupMode(nextMode);
    setCollapsedGroups({});
  }

  function toggleGroup(groupKey: string) {
    setCollapsedGroups((current) => ({
      ...current,
      [groupKey]: !current[groupKey],
    }));
  }

  function toggleArtworkSelection(artworkId: string) {
    setSelectedArtworkIds((current) =>
      current.includes(artworkId) ? current.filter((id) => id !== artworkId) : [...current, artworkId],
    );
  }

  function toggleGroupSelection(group: ArtworkGroup) {
    const groupIds = group.items.map((item) => item.id);
    const allSelected = groupIds.every((id) => selectedArtworkIds.includes(id));

    setSelectedArtworkIds((current) =>
      allSelected ? current.filter((id) => !groupIds.includes(id)) : [...new Set([...current, ...groupIds])],
    );
  }

  function clearSelection() {
    setSelectedArtworkIds([]);
  }

  async function applyBulkAction(action: "delete" | "archive" | "unarchive") {
    if (selectedArtworkIds.length === 0) {
      return;
    }

    setPending(true);
    setMessage("");

    try {
      const response = await apiFetch<{ artworks: ArtworkSummary[] }>("/api/admin/artworks/batch", {
        method: "POST",
        body: JSON.stringify({ ids: selectedArtworkIds, action }),
      });

      setItems(response.artworks);
      if (artwork.id && selectedArtworkIds.includes(artwork.id) && action === "delete") {
        setArtwork(createEmptyArtwork());
        setDrawerOpen(false);
      }
      clearSelection();
      setMessage(
        action === "delete"
          ? "Выбранные лоты удалены."
          : action === "archive"
            ? "Выбранные лоты перенесены в архив."
            : "Выбранные лоты извлечены из архива.",
      );
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Не удалось применить массовое действие.");
    } finally {
      setPending(false);
    }
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
      setArtwork(createEmptyArtwork());
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

    setUploadPending(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.set("file", file);
      const response = await apiFormFetch<{ artwork: Artwork }>(`/api/admin/artworks/${artwork.id}/photos`, formData);
      setArtwork(response.artwork);
      await loadList(artwork.id);
      setMessage("Фото загружено.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Не удалось загрузить фото.");
    } finally {
      setUploadPending(false);
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

  function renderArtworkRow(item: ArtworkSummary) {
    const checked = selectedArtworkIds.includes(item.id);

    return (
      <div key={item.id} className={`table-row ${artwork.id === item.id ? "active" : ""}`}>
        <label className="table-check">
          <input type="checkbox" checked={checked} onChange={() => toggleArtworkSelection(item.id)} />
        </label>
        <div className="table-preview" style={{ backgroundImage: item.previewUrl ? `url(${item.previewUrl})` : undefined }} />
        <div>
          <strong>{item.title}</strong>
          <div className="subtle">{item.slug}</div>
        </div>
        <div>{item.series || "Без серии"}</div>
        <div>{item.year || "Год не указан"}</div>
        <div>{formatStatus(item.status)}</div>
        <div>{item.isArchived ? "Архив" : "Активна"}</div>
        <label>
          <input type="checkbox" checked={item.showInGallery} onChange={() => toggleGallery(item)} />
        </label>
        <button
          className="button-secondary"
          type="button"
          onClick={() => {
            void loadArtwork(item.id).catch((error) =>
              setMessage(error instanceof Error ? error.message : "Не удалось загрузить карточку."),
            );
          }}
        >
          Открыть
        </button>
      </div>
    );
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

        <div className="actions" style={{ marginBottom: 16, alignItems: "center" }}>
          <button className={groupMode === "all" ? "button" : "button-secondary"} type="button" onClick={() => handleGroupModeClick("all")}>
            Все
          </button>
          <button className={groupMode === "year" ? "button" : "button-secondary"} type="button" onClick={() => handleGroupModeClick("year")}>
            По году
          </button>
          <button className={groupMode === "series" ? "button" : "button-secondary"} type="button" onClick={() => handleGroupModeClick("series")}>
            По серии
          </button>
          <button className={groupMode === "status" ? "button" : "button-secondary"} type="button" onClick={() => handleGroupModeClick("status")}>
            По статусу
          </button>
          <label className="field" style={{ minWidth: 220, marginLeft: "auto" }}>
            <span>
              <input type="checkbox" checked={showArchived} onChange={(event) => setShowArchived(event.target.checked)} /> Показывать работы из архива
            </span>
          </label>
        </div>

        {selectedArtworkIds.length > 0 ? (
          <div className="bulk-bar">
            <strong>Выбрано: {selectedArtworkIds.length}</strong>
            <div className="actions">
              <button className="button-secondary" type="button" onClick={() => void applyBulkAction("archive")} disabled={pending}>
                В архив
              </button>
              <button className="button-secondary" type="button" onClick={() => void applyBulkAction("unarchive")} disabled={pending}>
                Из архива
              </button>
              <button className="button-danger" type="button" onClick={() => void applyBulkAction("delete")} disabled={pending}>
                Удалить
              </button>
              <button className="button-secondary" type="button" onClick={clearSelection}>
                Снять выделение
              </button>
            </div>
          </div>
        ) : null}

        {message ? (
          <p className="subtle" style={{ marginBottom: 16 }}>
            {message}
          </p>
        ) : null}

        <div className="table-grid">
          {groupedItems.map((group) => {
            const allSelected = group.items.length > 0 && group.items.every((item) => selectedArtworkIds.includes(item.id));

            return (
              <section key={group.key} className="panel grouped-panel">
                <div className="group-header">
                  <button className="group-heading-button" type="button" onClick={() => toggleGroup(group.key)}>
                    <div>
                      <strong>{group.label}</strong>
                      <div className="subtle">{group.items.length} шт.</div>
                    </div>
                  </button>
                  <button className="button-secondary" type="button" onClick={() => toggleGroupSelection(group)}>
                    {allSelected ? "Снять группу" : "Выбрать все в группе"}
                  </button>
                </div>
                {!collapsedGroups[group.key] ? (
                  <div className="table-grid" style={{ marginTop: 12 }}>
                    {group.items.map((item) => renderArtworkRow(item))}
                  </div>
                ) : null}
              </section>
            );
          })}
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

              <div className="field-grid two">
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
                  <span>
                    <input
                      type="checkbox"
                      checked={artwork.isArchived}
                      onChange={(event) => updateField("isArchived", event.target.checked)}
                      disabled={!editing}
                    />{" "}
                    В архиве
                  </span>
                </label>
              </div>

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
                  <label
                    className="button-secondary"
                    style={{ cursor: artwork.id && !uploadPending ? "pointer" : "not-allowed", opacity: artwork.id && !uploadPending ? 1 : 0.5 }}
                  >
                    {uploadPending ? "Загружаем фото…" : "Загрузить фото"}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={uploadPhoto}
                      disabled={!artwork.id || uploadPending}
                      hidden
                    />
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
                        <button className="button-secondary" type="button" onClick={() => void setPrimary(photo.id)}>
                          {artwork.primaryPhotoId === photo.id ? "Основное фото" : "Сделать основным"}
                        </button>
                        <button className="button-danger" type="button" onClick={() => void deletePhoto(photo.id)}>
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
