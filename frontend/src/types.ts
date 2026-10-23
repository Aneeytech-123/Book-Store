export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  price: number;
  rating: number;
  description: string;
  pages: number;
  year: number;
  stock: number;
  coverColor: string;
  featured: boolean;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export type SortOption = "title" | "price-asc" | "price-desc" | "rating" | "newest";

export interface CartItem {
  book: Book;
  quantity: number;
}
