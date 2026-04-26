"use client";

import { useEffect, useMemo, useState } from "react";

import { AppShell } from "@/components/app-shell";
import { apiFetch } from "@/lib/api";
import { contentSchema, type ContentFieldDefinition } from "@/lib/content-schema";
import { createEmptyContentVersion } from "@/lib/defaults";
import { pageKeys, type ContentVersion, type ContentVersionRecord, type PageKey, variantIds } from "@/lib/types";

const pageLabels: Record<PageKey, string> = {
  home: "Главная",
  gallery: "Галерея",
  artwork: "Страница картины",
  about: "Биография",
  contacts: "Контакты",
};

const publishedPresetId = "__published__";
const defaultPresetName = "Новый пресет";

type PageVersions = Record<PageKey, ContentVersion>;
type VersionLists = Record<PageKey, ContentVersionRecord[]>;
type PresetOption = {
  id: string;
  label: string;
  versionName: string | null;
  isPublishedActive?: boolean;
};
type PresetPublishResponse = {
  versions: Partial<Record<PageKey, ContentVersion>>;
  export: {
    revision: string;
    publishedAt: string;
  };
};
type PresetDeleteResponse = {
  deletedCount: number;
};

function createEmptyPageVersions(variantId: string): PageVersions {
  const versions = {} as PageVersions;
  pageKeys.forEach((pageKey) => {
    versions[pageKey] = createEmptyContentVersion(variantId, pageKey);
  });
  return versions;
}

function createEmptyVersionLists(): VersionLists {
  const lists = {} as VersionLists;
  pageKeys.forEach((pageKey) => {
    lists[pageKey] = [];
  });
  return lists;
}

function fieldDomId(pageKey: PageKey, fieldKey: string) {
  return `content-field-${pageKey}-${fieldKey}`;
}

function nextPresetName(name: string) {
  const trimmed = name.trim() || defaultPresetName;
  const match = trimmed.match(/^(.*?)(?:\s+(\d+))?$/);
  const base = (match?.[1] || trimmed).trim();
  const number = match?.[2] ? Number(match[2]) : 1;
  return `${base} ${number + 1}`;
}

function pickRecordForPreset(records: ContentVersionRecord[], presetName: string | null) {
  if (presetName) {
    return records.find((item) => item.versionName === presetName) ?? records.find((item) => item.isPublishedActive) ?? records[0];
  }

  return records.find((item) => item.isPublishedActive) ?? records[0];
}

function getCommonPresetName(versions: PageVersions) {
  const names = pageKeys.map((pageKey) => versions[pageKey].versionName.trim()).filter(Boolean);
  const firstName = names[0];
  return firstName && names.every((name) => name === firstName) ? firstName : "";
}

export default function ContentPage() {
  const [variantId, setVariantId] = useState<(typeof variantIds)[number]>("cold-mist");
  const [versionLists, setVersionLists] = useState<VersionLists>(createEmptyVersionLists());
  const [pageVersions, setPageVersions] = useState<PageVersions>(createEmptyPageVersions("cold-mist"));
  const [presetName, setPresetName] = useState("Текущие тексты сайта");
  const [activePresetId, setActivePresetId] = useState(publishedPresetId);
  const [collapsedPages, setCollapsedPages] = useState<Partial<Record<PageKey, boolean>>>({});
  const [activeFieldId, setActiveFieldId] = useState("");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  const presetOptions = useMemo<PresetOption[]>(() => {
    const names = new Set<string>();
    pageKeys.forEach((pageKey) => {
      versionLists[pageKey].forEach((item) => {
        if (item.versionName.trim()) {
          names.add(item.versionName);
        }
      });
    });

    return [
      {
        id: publishedPresetId,
        label: "Опубликованный набор",
        versionName: null,
        isPublishedActive: true,
      },
      ...Array.from(names)
        .sort((left, right) => left.localeCompare(right, "ru"))
        .map((name) => ({
          id: name,
          label: name,
          versionName: name,
          isPublishedActive: pageKeys.every((pageKey) =>
            versionLists[pageKey].some((item) => item.versionName === name && item.isPublishedActive),
          ),
        })),
    ];
  }, [versionLists]);

  async function fetchVersion(versionId: string, nextVariantId: string, pageKey: PageKey) {
    const response = await apiFetch<{ version: ContentVersion }>(
      `/api/admin/content/versions/${versionId}?variantId=${nextVariantId}&pageKey=${pageKey}`,
    );
    return response.version;
  }

  async function loadVariant(nextVariantId = variantId, presetVersionName: string | null = null) {
    setPending(true);
    setMessage("");

    try {
      const listEntries = await Promise.all(
        pageKeys.map(async (pageKey) => {
          const response = await apiFetch<{ versions: ContentVersionRecord[] }>(
            `/api/admin/content/versions?variantId=${nextVariantId}&pageKey=${pageKey}`,
          );
          return [pageKey, response.versions] as const;
        }),
      );
      const nextLists = {} as VersionLists;
      listEntries.forEach(([pageKey, versions]) => {
        nextLists[pageKey] = versions;
      });

      const versionEntries = await Promise.all(
        pageKeys.map(async (pageKey) => {
          const record = pickRecordForPreset(nextLists[pageKey], presetVersionName);
          const nextVersion = record ? await fetchVersion(record.id, nextVariantId, pageKey) : createEmptyContentVersion(nextVariantId, pageKey);
          return [pageKey, nextVersion] as const;
        }),
      );
      const nextPageVersions = {} as PageVersions;
      versionEntries.forEach(([pageKey, version]) => {
        nextPageVersions[pageKey] = version;
      });

      setVersionLists(nextLists);
      setPageVersions(nextPageVersions);
      setActivePresetId(presetVersionName ?? publishedPresetId);
      setPresetName((presetVersionName ?? getCommonPresetName(nextPageVersions)) || "Текущие тексты сайта");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Не удалось загрузить тексты варианта.");
    } finally {
      setPending(false);
    }
  }

  useEffect(() => {
    void loadVariant(variantId, null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variantId]);

  function updatePayload(pageKey: PageKey, key: string, value: string | string[]) {
    setPageVersions((current) => ({
      ...current,
      [pageKey]: {
        ...current[pageKey],
        payload: {
          ...current[pageKey].payload,
          [key]: value,
        },
      },
    }));
  }

  async function savePageVersion(pageKey: PageKey, version: ContentVersion, nextName: string) {
    const body = JSON.stringify({
      variantId,
      pageKey,
      versionName: nextName,
      payload: version.payload,
      status: version.status,
    });

    if (version.id) {
      const response = await apiFetch<{ version: ContentVersion }>(`/api/admin/content/versions/${version.id}`, {
        method: "PATCH",
        body,
      });
      return response.version;
    }

    const response = await apiFetch<{ version: ContentVersion }>("/api/admin/content/versions", {
      method: "POST",
      body,
    });
    return response.version;
  }

  async function refreshLists(nextPresetName: string) {
    const listEntries = await Promise.all(
      pageKeys.map(async (pageKey) => {
        const response = await apiFetch<{ versions: ContentVersionRecord[] }>(
          `/api/admin/content/versions?variantId=${variantId}&pageKey=${pageKey}`,
        );
        return [pageKey, response.versions] as const;
      }),
    );
    const nextLists = {} as VersionLists;
    listEntries.forEach(([pageKey, versions]) => {
      nextLists[pageKey] = versions;
    });
    setVersionLists(nextLists);
    setActivePresetId(nextPresetName);
  }

  async function savePreset() {
    const nextName = presetName.trim() || defaultPresetName;
    setPending(true);
    setMessage("");

    try {
      const entries = await Promise.all(pageKeys.map(async (pageKey) => [pageKey, await savePageVersion(pageKey, pageVersions[pageKey], nextName)] as const));
      const nextVersions = {} as PageVersions;
      entries.forEach(([pageKey, version]) => {
        nextVersions[pageKey] = version;
      });
      setPageVersions(nextVersions);
      setPresetName(nextName);
      await refreshLists(nextName);
      setMessage("Пресет сохранён для всех страниц варианта.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Не удалось сохранить пресет.");
    } finally {
      setPending(false);
    }
  }

  async function savePresetCopy() {
    const nextName = nextPresetName(presetName);
    setPending(true);
    setMessage("");

    try {
      const entries = await Promise.all(
        pageKeys.map(async (pageKey) => {
          const response = await apiFetch<{ version: ContentVersion }>("/api/admin/content/versions", {
            method: "POST",
            body: JSON.stringify({
              variantId,
              pageKey,
              versionName: nextName,
              payload: pageVersions[pageKey].payload,
            }),
          });
          return [pageKey, response.version] as const;
        }),
      );
      const nextVersions = {} as PageVersions;
      entries.forEach(([pageKey, version]) => {
        nextVersions[pageKey] = version;
      });
      setPageVersions(nextVersions);
      setPresetName(nextName);
      await refreshLists(nextName);
      setMessage("Создана копия пресета для всех страниц.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Не удалось создать копию пресета.");
    } finally {
      setPending(false);
    }
  }

  async function publishPreset() {
    setPending(true);
    setMessage("");

    try {
      const nextName = presetName.trim() || defaultPresetName;
      const response = await apiFetch<PresetPublishResponse>("/api/admin/content/presets/publish", {
        method: "POST",
        body: JSON.stringify({
          variantId,
          versionName: nextName,
          pages: Object.fromEntries(
            pageKeys.map((pageKey) => [
              pageKey,
              {
                id: pageVersions[pageKey].id,
                payload: pageVersions[pageKey].payload,
              },
            ]),
          ),
        }),
      });

      const savedVersions = { ...pageVersions };
      pageKeys.forEach((pageKey) => {
        const version = response.versions[pageKey];
        if (version) {
          savedVersions[pageKey] = version;
        }
      });

      setPageVersions(savedVersions);
      setPresetName(nextName);
      await refreshLists(nextName);
      setMessage(`Пресет опубликован, public snapshot обновлён: ${response.export.revision}.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Не удалось опубликовать пресет.");
    } finally {
      setPending(false);
    }
  }

  async function deletePreset(item: PresetOption) {
    if (!item.versionName) {
      return;
    }

    const shouldDelete = window.confirm(`Удалить пресет «${item.label}» для всех страниц варианта?`);

    if (!shouldDelete) {
      return;
    }

    setPending(true);
    setMessage("");

    try {
      const response = await apiFetch<PresetDeleteResponse>("/api/admin/content/presets/delete", {
        method: "POST",
        body: JSON.stringify({
          variantId,
          versionName: item.versionName,
        }),
      });

      await loadVariant(variantId, null);
      setMessage(`Пресет удалён. Удалено версий: ${response.deletedCount}.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Не удалось удалить пресет.");
      setPending(false);
    }
  }

  function scrollToField(pageKey: PageKey, field: ContentFieldDefinition) {
    const nextFieldId = fieldDomId(pageKey, field.key);
    setActiveFieldId(nextFieldId);
    setCollapsedPages((current) => ({ ...current, [pageKey]: false }));
    window.setTimeout(() => {
      document.getElementById(nextFieldId)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 0);
  }

  function renderField(pageKey: PageKey, field: ContentFieldDefinition) {
    const payload = pageVersions[pageKey].payload;
    const value = payload[field.key];

    if (field.type === "string-array") {
      return (
        <label
          key={field.key}
          id={fieldDomId(pageKey, field.key)}
          className={`field content-field-anchor${activeFieldId === fieldDomId(pageKey, field.key) ? " active-content-field" : ""}`}
        >
          <span>{field.label}</span>
          <textarea
            value={Array.isArray(value) ? value.join("\n") : ""}
            onChange={(event) => updatePayload(pageKey, field.key, event.target.value.split("\n").filter(Boolean))}
          />
        </label>
      );
    }

    if (field.type === "textarea") {
      return (
        <label
          key={field.key}
          id={fieldDomId(pageKey, field.key)}
          className={`field content-field-anchor${activeFieldId === fieldDomId(pageKey, field.key) ? " active-content-field" : ""}`}
        >
          <span>{field.label}</span>
          <textarea value={typeof value === "string" ? value : ""} onChange={(event) => updatePayload(pageKey, field.key, event.target.value)} />
        </label>
      );
    }

    return (
      <label
        key={field.key}
        id={fieldDomId(pageKey, field.key)}
        className={`field content-field-anchor${activeFieldId === fieldDomId(pageKey, field.key) ? " active-content-field" : ""}`}
      >
        <span>{field.label}</span>
        <input value={typeof value === "string" ? value : ""} onChange={(event) => updatePayload(pageKey, field.key, event.target.value)} />
      </label>
    );
  }

  return (
    <AppShell>
      <div className="content-editor-layout">
        <aside className="table-card content-editor-sidebar">
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

          <div className="stack">
            <div>
              <p className="admin-kicker">Пресеты</p>
              <div className="content-preset-list">
                {presetOptions.map((item) => (
                  <div key={item.id} className={`content-preset-row${activePresetId === item.id ? " active" : ""}`}>
                    <button
                      className="content-preset-button"
                      type="button"
                      onClick={() => void loadVariant(variantId, item.versionName)}
                      disabled={pending}
                    >
                      <span>{item.label}</span>
                      {item.isPublishedActive ? <small>active</small> : null}
                    </button>
                    {item.versionName ? (
                      <button
                        className="content-preset-delete"
                        type="button"
                        onClick={() => void deletePreset(item)}
                        disabled={pending || item.isPublishedActive}
                        title={item.isPublishedActive ? "Опубликованный пресет удалить нельзя" : "Удалить пресет"}
                      >
                        ×
                      </button>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="admin-kicker">Структура</p>
              <div className="content-tree">
                {pageKeys.map((pageKey) => (
                  <div key={pageKey} className="content-tree-page">
                    <button
                      className="content-tree-node content-tree-page-button"
                      type="button"
                      onClick={() => setCollapsedPages((current) => ({ ...current, [pageKey]: !current[pageKey] }))}
                    >
                      <span className="content-tree-chevron">{collapsedPages[pageKey] ? "▸" : "▾"}</span>
                      <span className="content-tree-icon">□</span>
                      <span className="content-tree-label">{pageLabels[pageKey]}</span>
                    </button>
                    {!collapsedPages[pageKey] ? (
                      <div className="content-tree-fields">
                        {contentSchema[pageKey].map((field) => (
                          <button
                            key={field.key}
                            className={`content-tree-node content-tree-field${activeFieldId === fieldDomId(pageKey, field.key) ? " active" : ""}`}
                            type="button"
                            onClick={() => scrollToField(pageKey, field)}
                          >
                            <span className="content-tree-spacer" />
                            <span className="content-tree-icon">T</span>
                            <span className="content-tree-label">{field.label}</span>
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <section className="detail-card content-editor-main">
          <div className="actions" style={{ justifyContent: "space-between" }}>
            <div>
              <p className="admin-kicker">Редактор текстов</p>
              <h2>{variantId}</h2>
            </div>
            <div className="actions">
              <button className="button-secondary" type="button" onClick={savePreset} disabled={pending}>
                Сохранить
              </button>
              <button className="button-secondary" type="button" onClick={savePresetCopy} disabled={pending}>
                Сохранить как копию
              </button>
              <button className="button" type="button" onClick={publishPreset} disabled={pending}>
                Опубликовать
              </button>
            </div>
          </div>

          {message ? <p className="subtle">{message}</p> : null}

          <label className="field content-preset-name">
            <span>Название пресета</span>
            <input value={presetName} onChange={(event) => setPresetName(event.target.value)} />
          </label>

          <div className="content-page-stack">
            {pageKeys.map((pageKey) => (
              <section key={pageKey} className="content-page-section">
                <div className="content-page-heading">
                  <div>
                    <p className="admin-kicker">{pageKey}</p>
                    <h2>{pageLabels[pageKey]}</h2>
                  </div>
                  <span className="subtle">{pageVersions[pageKey].status}</span>
                </div>
                <div className="stack">{contentSchema[pageKey].map((field) => renderField(pageKey, field))}</div>
              </section>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
