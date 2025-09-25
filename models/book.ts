export interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  genre: string;
  publisher: string | null;
  publishedYear: number | null;
  pages: number | null;
  language: string | null;
  description: string | null;
  available: boolean;
  borrowedAt: Date | null;
  dueDate: Date | null;
  createdAt: Date;
  updatedAt: Date | null;
}