const apiBaseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    const errorBody = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(errorBody?.error ?? `Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function apiFormFetch<T>(path: string, formData: FormData, init?: Omit<RequestInit, "body">): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    method: init?.method ?? "POST",
    body: formData,
    credentials: "include",
  });

  if (!response.ok) {
    const errorBody = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(errorBody?.error ?? `Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}
