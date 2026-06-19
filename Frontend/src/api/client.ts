/**
 * Thin fetch wrapper around the backend API.
 *
 *  - Automatically attaches the admin bearer token (when present).
 *  - Parses JSON and surfaces backend error messages as thrown Errors.
 *  - Exposes token storage helpers used by the admin auth flow.
 */
const TOKEN_KEY = "apex_admin_token";

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string | null): void {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* ignore storage errors (e.g. private mode) */
  }
}

interface RequestOptions {
  method?: string;
  body?: unknown;
  auth?: boolean;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, auth = false } = options;
  const headers: Record<string, string> = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`/api${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const payload = isJson ? await res.json().catch(() => ({})) : null;

  if (!res.ok) {
    const message = (payload && (payload.error as string)) || `Xatolik (${res.status})`;
    throw new Error(message);
  }
  return payload as T;
}

export const api = {
  get: <T>(path: string, auth = false) => request<T>(path, { auth }),
  post: <T>(path: string, body?: unknown, auth = false) =>
    request<T>(path, { method: "POST", body, auth }),
  put: <T>(path: string, body?: unknown, auth = false) =>
    request<T>(path, { method: "PUT", body, auth }),
  del: <T>(path: string, auth = false) => request<T>(path, { method: "DELETE", auth }),
};

/** Uploads a file (as a data-URL) and returns its served URL. */
export async function uploadFile(file: File): Promise<string> {
  const base64 = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Faylni o'qishda xatolik."));
    reader.readAsDataURL(file);
  });
  const { url } = await api.post<{ url: string }>(
    "/upload",
    { base64, filename: file.name },
    true
  );
  return url;
}
