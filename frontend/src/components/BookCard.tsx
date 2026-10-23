import { useState } from "react";
import type { Book } from "../types";
import { formatPrice } from "../api";
import { useCart } from "../context/CartContext";
import BookCover from "./BookCover";
import Stars from "./Stars";

export default function BookCard({ book, onOpen }: { book: Book; onOpen: (book: Book) => void }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  const onAdd = () => {
    add(book);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1200);
  };

  return (
    <article className="book-card">
      <button className="book-cover-btn" onClick={() => onOpen(book)} aria-label={`View details for ${book.title}`}>
        <BookCover book={book} />
      </button>
      <div className="book-info">
        <span className="book-genre">{book.genre}</span>
        <h3 className="book-title">
          <button className="link-plain" onClick={() => onOpen(book)}>{book.title}</button>
        </h3>
        <p className="book-author">{book.author}</p>
        <div className="book-meta">
          <Stars rating={book.rating} />
          <span className="muted small">{book.rating.toFixed(1)}</span>
        </div>
        <div className="book-buy">
          <span className="price">{formatPrice(book.price)}</span>
          <button className={`btn btn-sm ${added ? "btn-success" : "btn-dark"}`} onClick={onAdd} disabled={book.stock === 0}>
            {book.stock === 0 ? "Sold out" : added ? "Added ✓" : "Add to cart"}
          </button>
        </div>
      </div>
    </article>
  );
}
