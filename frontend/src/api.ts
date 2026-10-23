import type { AuthResponse, Book, LoginPayload, RegisterPayload, SortOption, User } from "./types";

export const API_URL = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, "") || "http://localhost:8080";

/** Error thrown for any failed API call, with per-field messages when the server sends them. */
export class ApiError extends Error {
  status: number;
  fieldErrors: Record<string, string>;

  constructor(status: number, message: string, fieldErrors: Record<string, string> = {}) {
    super(message);
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

const TOKEN_KEY = "shelflife.token";

export const tokenStore = {
  get(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },
  set(token: string | null) {
    try {
      if (token) localStorage.setItem(TOKEN_KEY, token);
      else localStorage.removeItem(TOKEN_KEY);
    } catch {
      /* storage blocked: stay logged in for this tab only */
    }
  },
};

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  if (options.body) headers.set("Content-Type", "application/json");
  const token = tokenStore.get();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, { ...options, headers });
  } catch {
    throw new ApiError(0, "Can't reach the ShelfLife server. Make sure the Spring Boot backend is running.");
  }

  if (res.status === 204) return undefined as T;
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new ApiError(res.status, data?.message || `Request failed (${res.status})`, data?.fieldErrors || {});
  }
  return data as T;
}

export const api = {
  books(params: { q?: string; genre?: string; sort?: SortOption } = {}) {
    const qs = new URLSearchParams();
    if (params.q) qs.set("q", params.q);
    if (params.genre && params.genre !== "All") qs.set("genre", params.genre);
    if (params.sort) qs.set("sort", params.sort);
    const query = qs.toString();
    return request<Book[]>(`/api/books${query ? `?${query}` : ""}`);
  },
  featured: () => request<Book[]>("/api/books/featured"),
  genres: () => request<string[]>("/api/books/genres"),
  book: (id: string) => request<Book>(`/api/books/${encodeURIComponent(id)}`),
  register: (body: RegisterPayload) => request<AuthResponse>("/api/auth/register", { method: "POST", body: JSON.stringify(body) }),
  login: (body: LoginPayload) => request<AuthResponse>("/api/auth/login", { method: "POST", body: JSON.stringify(body) }),
  me: () => request<User>("/api/auth/me"),
  logout: () => request<void>("/api/auth/logout", { method: "POST" }),
};

const inr = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2, minimumFractionDigits: 0 });
export const formatPrice = (n: number) => inr.format(n);
