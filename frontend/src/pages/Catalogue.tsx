import { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { api, ApiError } from "../api";
import type { Book, SortOption } from "../types";
import BookCard from "../components/BookCard";
import BookModal from "../components/BookModal";
import { useAuth } from "../context/AuthContext";

const SORTS: [SortOption, string][] = [
  ["title", "Title (A–Z)"],
  ["price-asc", "Price: low to high"],
  ["price-desc", "Price: high to low"],
  ["rating", "Top rated"],
  ["newest", "Newest first"],
];

export default function Catalogue() {
  const [params, setParams] = useSearchParams();
  const location = useLocation();
  const { user } = useAuth();
  const q = params.get("q") || "";
  const genre = params.get("genre") || "All";
  const sort = (params.get("sort") as SortOption) || "title";

  const [search, setSearch] = useState(q);
  const [books, setBooks] = useState<Book[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Book | null>(null);
  const welcome = Boolean((location.state as { welcome?: boolean } | null)?.welcome) && user;

  useEffect(() => {
    api.genres().then(setGenres).catch(() => setGenres([]));
  }, []);

  // Debounce typing in the search box into the URL
  useEffect(() => {
    const id = window.setTimeout(() => {
      if (search.trim() === q) return;
      const next = new URLSearchParams(params);
      if (search.trim()) next.set("q", search.trim());
      else next.delete("q");
      setParams(next, { replace: true });
    }, 300);
    return () => window.clearTimeout(id);
  }, [search, q, params, setParams]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    api
      .books({ q, genre, sort })
      .then((b) => !cancelled && setBooks(b))
      .catch((e: unknown) => !cancelled && setError(e instanceof ApiError ? e.message : "Could not load books."))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [q, genre, sort]);

  const update = (key: string, value: string, fallback: string) => {
    const next = new URLSearchParams(params);
    if (value && value !== fallback) next.set(key, value);
    else next.delete(key);
    setParams(next);
  };

  return (
    <div className="container catalogue">
      <div className="page-head">
        <div>
          <span className="eyebrow">Catalogue</span>
          <h1>Browse books</h1>
          <p className="muted">{loading ? "Loading…" : `${books.length} ${books.length === 1 ? "book" : "books"}${genre !== "All" ? ` in ${genre}` : ""}${q ? ` matching “${q}”` : ""}`}</p>
        </div>
      </div>

      {welcome && <div className="alert alert-success">Welcome to ShelfLife, {user.fullName.split(" ")[0]}! Your account has been created.</div>}

      <div className="catalogue-layout">
        <aside className="filters" aria-label="Filters">
          <h2 className="filters-title">Genres</h2>
          <ul className="genre-list">
            {["All", ...genres].map((g) => (
              <li key={g}>
                <button className={g === genre ? "active" : ""} onClick={() => update("genre", g, "All")} aria-pressed={g === genre}>
                  {g}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <section>
          <div className="toolbar">
            <input
              className="toolbar-search"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search title or author"
              aria-label="Search title or author"
            />
            <select className="toolbar-genre" value={genre} onChange={(e) => update("genre", e.target.value, "All")} aria-label="Genre">
              {["All", ...genres].map((g) => <option key={g} value={g}>{g === "All" ? "All genres" : g}</option>)}
            </select>
            <select value={sort} onChange={(e) => update("sort", e.target.value, "title")} aria-label="Sort by">
              {SORTS.map(([v, label]) => <option key={v} value={v}>{label}</option>)}
            </select>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          {loading ? (
            <div className="book-grid">
              {Array.from({ length: 8 }).map((_, i) => <div key={i} className="book-card skeleton" />)}
            </div>
          ) : books.length === 0 && !error ? (
            <div className="empty">
              <h3>No books found</h3>
              <p className="muted">Try a different search or genre.</p>
              <button className="btn btn-ghost" onClick={() => { setSearch(""); setParams(new URLSearchParams()); }}>Clear filters</button>
            </div>
          ) : (
            <div className="book-grid">
              {books.map((b) => <BookCard key={b.id} book={b} onOpen={setSelected} />)}
            </div>
          )}
        </section>
      </div>

      <BookModal book={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
