import crypto from "node:crypto";

export function nowIso() {
  return new Date().toISOString();
}

export function newId() {
  return crypto.randomUUID();
}

export function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function arrayMove<T>(items: T[], from: number, to: number) {
  const clone = [...items];
  const [item] = clone.splice(from, 1);

  if (item === undefined) {
    return clone;
  }

  clone.splice(to, 0, item);
  return clone;
}
