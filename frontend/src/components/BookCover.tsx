import type { CSSProperties } from "react";
import type { Book } from "../types";

/** Generated cover: coloured spine, title and author. No image files needed. */
export default function BookCover({ book, size = "md" }: { book: Pick<Book, "title" | "author" | "coverColor">; size?: "sm" | "md" | "lg" }) {
  return (
    <div className={`cover cover-${size}`} style={{ "--cover": book.coverColor || "#1e2635" } as CSSProperties} aria-hidden="true">
      <div className="cover-spine" />
      <div className="cover-body">
        <span className="cover-rule" />
        <span className="cover-title">{book.title}</span>
        <span className="cover-author">{book.author}</span>
      </div>
    </div>
  );
}
