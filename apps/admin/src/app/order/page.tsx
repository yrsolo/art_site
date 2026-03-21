"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { AppShell } from "@/components/app-shell";
import { apiFetch } from "@/lib/api";
import type { ArtworkSummary, ArtworkStatus } from "@/lib/types";

type DragState = {
  draggedId: string | null;
  overId: string | null;
};

type PointerDragState = {
  pointerId: number;
  draggedId: string;
};

function formatStatus(status: ArtworkStatus) {
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

function reorderItems(items: ArtworkSummary[], draggedId: string, targetId: string) {
  if (draggedId === targetId) {
    return items;
  }

  const draggedIndex = items.findIndex((item) => item.id === draggedId);
  const targetIndex = items.findIndex((item) => item.id === targetId);

  if (draggedIndex === -1 || targetIndex === -1) {
    return items;
  }

  const next = [...items];
  const [dragged] = next.splice(draggedIndex, 1);
  next.splice(targetIndex, 0, dragged);
  return next;
}

function moveItem(items: ArtworkSummary[], itemId: string, direction: -1 | 1) {
  const index = items.findIndex((item) => item.id === itemId);

  if (index === -1) {
    return items;
  }

  const nextIndex = index + direction;

  if (nextIndex < 0 || nextIndex >= items.length) {
    return items;
  }

  const next = [...items];
  const [item] = next.splice(index, 1);
  next.splice(nextIndex, 0, item);
  return next;
}

export default function OrderPage() {
  const [items, setItems] = useState<ArtworkSummary[]>([]);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [dragState, setDragState] = useState<DragState>({ draggedId: null, overId: null });
  const pointerDragRef = useRef<PointerDragState | null>(null);
  const [showOnlyGallery, setShowOnlyGallery] = useState(true);
  const [showArchived, setShowArchived] = useState(false);
  const [yearFilter, setYearFilter] = useState("all");
  const [seriesFilter, setSeriesFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<"all" | ArtworkStatus>("all");

  useEffect(() => {
    apiFetch<{ artworks: ArtworkSummary[] }>("/api/admin/artworks")
      .then((response) => {
        setItems([...response.artworks].sort((left, right) => left.sortOrder - right.sortOrder));
      })
      .catch((error) => {
        setMessage(error instanceof Error ? error.message : "Не удалось загрузить порядок.");
      });
  }, []);

  const years = useMemo(() => {
    const values = new Set(items.map((item) => item.year.trim() || "Год не указан"));
    return ["all", ...[...values].sort((left, right) => left.localeCompare(right, "ru"))];
  }, [items]);

  const seriesOptions = useMemo(() => {
    const values = new Set(items.map((item) => item.series.trim() || "Без серии"));
    return ["all", ...[...values].sort((left, right) => left.localeCompare(right, "ru"))];
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const yearLabel = item.year.trim() || "Год не указан";
      const seriesLabel = item.series.trim() || "Без серии";

      if (!showArchived && item.isArchived) {
        return false;
      }

      if (showOnlyGallery && !item.showInGallery) {
        return false;
      }

      if (yearFilter !== "all" && yearFilter !== yearLabel) {
        return false;
      }

      if (seriesFilter !== "all" && seriesFilter !== seriesLabel) {
        return false;
      }

      if (statusFilter !== "all" && statusFilter !== item.status) {
        return false;
      }

      return true;
    });
  }, [items, seriesFilter, showArchived, showOnlyGallery, statusFilter, yearFilter]);

  async function saveOrder() {
    setPending(true);
    setMessage("");

    try {
      await apiFetch("/api/admin/artworks/reorder", {
        method: "POST",
        body: JSON.stringify({ ids: items.map((item) => item.id) }),
      });
      setMessage("Порядок выдачи сохранён.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Не удалось сохранить порядок.");
    } finally {
      setPending(false);
    }
  }

  function startPointerDrag(pointerId: number, artworkId: string) {
    pointerDragRef.current = {
      pointerId,
      draggedId: artworkId,
    };
    setDragState({
      draggedId: artworkId,
      overId: artworkId,
    });
  }

  function updatePointerDrag(clientX: number, clientY: number) {
    const current = pointerDragRef.current;

    if (!current) {
      return;
    }

    const element = document.elementFromPoint(clientX, clientY);
    const card = element?.closest<HTMLElement>("[data-order-card-id]");
    const overId = card?.dataset.orderCardId ?? current.draggedId;

    setDragState({
      draggedId: current.draggedId,
      overId,
    });
  }

  function finishPointerDrag() {
    const current = pointerDragRef.current;

    if (!current) {
      return;
    }

    pointerDragRef.current = null;
    setItems((existing) => reorderItems(existing, current.draggedId, dragState.overId ?? current.draggedId));
    setDragState({ draggedId: null, overId: null });
  }

  function cancelPointerDrag() {
    pointerDragRef.current = null;
    setDragState({ draggedId: null, overId: null });
  }

  return (
    <AppShell>
      <section className="table-card">
        <div className="actions" style={{ justifyContent: "space-between" }}>
          <div>
            <p className="admin-kicker">Порядок</p>
            <h2>Очередь галереи</h2>
            <p className="admin-muted">Один `sortOrder` управляет всеми эскизами. Мышью можно перетаскивать карточки, а на touch-экранах удобно пользоваться ручками и кнопками вверх/вниз.</p>
          </div>

          <button className="button" type="button" onClick={saveOrder} disabled={pending}>
            {pending ? "Сохраняем…" : "Сохранить порядок"}
          </button>
        </div>

        <div className="actions" style={{ marginTop: 20, alignItems: "flex-end" }}>
          <label className="field" style={{ minWidth: 180 }}>
            <span>Год</span>
            <select value={yearFilter} onChange={(event) => setYearFilter(event.target.value)}>
              {years.map((value) => (
                <option key={value} value={value}>
                  {value === "all" ? "Все годы" : value}
                </option>
              ))}
            </select>
          </label>

          <label className="field" style={{ minWidth: 220 }}>
            <span>Серия</span>
            <select value={seriesFilter} onChange={(event) => setSeriesFilter(event.target.value)}>
              {seriesOptions.map((value) => (
                <option key={value} value={value}>
                  {value === "all" ? "Все серии" : value}
                </option>
              ))}
            </select>
          </label>

          <label className="field" style={{ minWidth: 180 }}>
            <span>Статус</span>
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as "all" | ArtworkStatus)}>
              <option value="all">Все статусы</option>
              <option value="for_sale">Продаётся</option>
              <option value="sold">Продана</option>
              <option value="off_market">Снята с продажи</option>
              <option value="in_progress">В процессе</option>
            </select>
          </label>

          <label className="field" style={{ minWidth: 180 }}>
            <span>
              <input type="checkbox" checked={showOnlyGallery} onChange={(event) => setShowOnlyGallery(event.target.checked)} />{" "}
              Только показываемые
            </span>
          </label>

          <label className="field" style={{ minWidth: 180 }}>
            <span>
              <input type="checkbox" checked={showArchived} onChange={(event) => setShowArchived(event.target.checked)} />{" "}
              Показывать архив
            </span>
          </label>
        </div>

        {message ? (
          <p className="subtle" style={{ marginTop: 16 }}>
            {message}
          </p>
        ) : null}

        <div className="order-grid" style={{ marginTop: 24 }}>
          {filteredItems.map((item, index) => {
            const isDragging = dragState.draggedId === item.id;
            const isDropTarget = dragState.overId === item.id && dragState.draggedId !== item.id;

            return (
              <div
                key={item.id}
                draggable
                data-order-card-id={item.id}
                className={`order-card${isDragging ? " dragging" : ""}${isDropTarget ? " over" : ""}`}
                onDragStart={() => setDragState({ draggedId: item.id, overId: item.id })}
                onDragEnter={() => setDragState((current) => ({ ...current, overId: item.id }))}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  setItems((current) => reorderItems(current, dragState.draggedId ?? item.id, item.id));
                  setDragState({ draggedId: null, overId: null });
                }}
                onDragEnd={() => setDragState({ draggedId: null, overId: null })}
              >
                <div className="order-card-preview" style={{ backgroundImage: item.previewUrl ? `url(${item.previewUrl})` : undefined }} />
                <div className="order-card-body">
                  <div className="order-card-head">
                    <div className="order-card-order">#{index + 1}</div>
                    <button
                      className="order-card-handle"
                      type="button"
                      aria-label={`Переместить ${item.title}`}
                      onPointerDown={(event) => {
                        startPointerDrag(event.pointerId, item.id);
                        event.currentTarget.setPointerCapture(event.pointerId);
                      }}
                      onPointerMove={(event) => {
                        if (pointerDragRef.current?.pointerId !== event.pointerId) {
                          return;
                        }

                        updatePointerDrag(event.clientX, event.clientY);
                      }}
                      onPointerUp={(event) => {
                        if (pointerDragRef.current?.pointerId !== event.pointerId) {
                          return;
                        }

                        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                          event.currentTarget.releasePointerCapture(event.pointerId);
                        }

                        finishPointerDrag();
                      }}
                      onPointerCancel={(event) => {
                        if (pointerDragRef.current?.pointerId !== event.pointerId) {
                          return;
                        }

                        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                          event.currentTarget.releasePointerCapture(event.pointerId);
                        }

                        cancelPointerDrag();
                      }}
                    >
                      ≡
                    </button>
                  </div>
                  <strong>{item.title}</strong>
                  <div className="subtle">{item.series || "Без серии"}</div>
                  <div className="subtle">
                    {item.year || "Год не указан"} · {formatStatus(item.status)}
                  </div>
                  <div className="subtle">{item.isArchived ? "Архив" : "Активна"}</div>
                </div>
                <div className="order-card-touch-actions">
                  <button className="button-secondary" type="button" onClick={() => setItems((current) => moveItem(current, item.id, -1))}>
                    Выше
                  </button>
                  <button className="button-secondary" type="button" onClick={() => setItems((current) => moveItem(current, item.id, 1))}>
                    Ниже
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </AppShell>
  );
}
