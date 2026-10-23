import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, ApiError } from "../api";
import type { Book } from "../types";
import BookCard from "../components/BookCard";
import BookModal from "../components/BookModal";
import BookCover from "../components/BookCover";

const HERO_STACK = [
  { title: "Atomic Habits", author: "James Clear", coverColor: "#c9a227" },
  { title: "The Hobbit", author: "J.R.R. Tolkien", coverColor: "#2f5233" },
  { title: "Project Hail Mary", author: "Andy Weir", coverColor: "#14324a" },
];

export default function Home() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [featured, setFeatured] = useState<Book[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Book | null>(null);

  useEffect(() => {
    Promise.all([api.featured(), api.genres()])
      .then(([f, g]) => {
        setFeatured(f.slice(0, 4));
        setGenres(g);
      })
      .catch((e: unknown) => setError(e instanceof ApiError ? e.message : "Could not load books."));
  }, []);

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    navigate(`/catalogue${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ""}`);
  };

  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-copy">
            <span className="eyebrow">Your next chapter starts here</span>
            <h1>Find books you'll <em>love</em> to read.</h1>
            <p className="lead">
              Browse classics, page-turners and practical guides. Create a free account, fill your cart and keep reading.
            </p>
            <form className="hero-search" onSubmit={onSearch} role="search">
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by title or author" aria-label="Search books" />
              <button className="btn btn-dark" type="submit">Search</button>
            </form>
            <div className="hero-actions">
              <Link to="/catalogue" className="btn btn-blue">Browse catalogue</Link>
              <Link to="/register" className="btn btn-ghost">Create free account</Link>
            </div>
          </div>
          <div className="hero-stack" aria-hidden="true">
            {HERO_STACK.map((b, i) => (
              <div key={b.title} className={`stack-book s${i}`}><BookCover book={b} size="lg" /></div>
            ))}
          </div>
        </div>
      </section>

      <section className="container section">
        <div className="section-head">
          <h2>Shop by genre</h2>
          <Link to="/catalogue" className="link">See all books →</Link>
        </div>
        <div className="genre-chips">
          {genres.map((g) => (
            <Link key={g} to={`/catalogue?genre=${encodeURIComponent(g)}`} className="chip">{g}</Link>
          ))}
          {genres.length === 0 && !error && <span className="muted">Loading genres…</span>}
        </div>
      </section>

      <section className="container section">
        <div className="section-head">
          <h2>Featured books</h2>
          <Link to="/catalogue" className="link">Browse catalogue →</Link>
        </div>
        {error && <div className="alert alert-error">{error}</div>}
        <div className="book-grid fit">
          {featured.map((b) => <BookCard key={b.id} book={b} onOpen={setSelected} />)}
        </div>
      </section>

      <section className="container section">
        <div className="features">
          <div className="feature">
            <span className="feature-num">01</span>
            <h3>Curated catalogue</h3>
            <p>Search by title or author, filter by genre and sort by price, rating or year.</p>
          </div>
          <div className="feature">
            <span className="feature-num">02</span>
            <h3>Secure accounts</h3>
            <p>Passwords are hashed with BCrypt and stored safely in MongoDB.</p>
          </div>
          <div className="feature">
            <span className="feature-num">03</span>
            <h3>Easy cart</h3>
            <p>Add books, change quantities and see your total update instantly.</p>
          </div>
        </div>
      </section>

      <BookModal book={selected} onClose={() => setSelected(null)} />
    </>
  );
}
