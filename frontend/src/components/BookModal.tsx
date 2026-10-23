import { useEffect } from "react";
import type { Book } from "../types";
import { formatPrice } from "../api";
import { useCart } from "../context/CartContext";
import BookCover from "./BookCover";
import Stars from "./Stars";

export default function BookModal({ book, onClose }: { book: Book | null; onClose: () => void }) {
  const { add } = useCart();

  useEffect(() => {
    if (!book) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [book, onClose]);

  if (!book) return null;

  return (
    <div className="overlay" onMouseDown={onClose}>
      <div className="modal" role="dialog" aria-modal="true" aria-label={book.title} onMouseDown={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        <div className="modal-grid">
          <BookCover book={book} size="lg" />
          <div className="modal-info">
            <span className="book-genre">{book.genre}</span>
            <h2>{book.title}</h2>
            <p className="muted">by {book.author}</p>
            <div className="book-meta"><Stars rating={book.rating} /><span className="muted small">{book.rating.toFixed(1)} / 5</span></div>
            <p className="modal-desc">{book.description}</p>
            <dl className="facts">
              <div><dt>Published</dt><dd>{book.year}</dd></div>
              <div><dt>Pages</dt><dd>{book.pages}</dd></div>
              <div><dt>In stock</dt><dd>{book.stock > 0 ? `${book.stock} copies` : "Sold out"}</dd></div>
            </dl>
            <div className="modal-buy">
              <span className="price big">{formatPrice(book.price)}</span>
              <button className="btn btn-dark" disabled={book.stock === 0} onClick={() => { add(book); onClose(); }}>
                Add to cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
