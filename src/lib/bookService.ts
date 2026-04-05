const BASE_URL = 'http://localhost:4000/api';

export interface Book {
  id: string;
  title: string;
  author: string;
  year: string;
  type: string;
  description?: string;
  img: string;
  date: string;
  fileUrl?: string;
  fileName?: string;
}

async function request<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'Error en la API');
  }
  return res.json();
}

// GET all books
export const getBooks = (): Promise<Book[]> =>
  request<Book[]>('/books');

// POST — add new book
export const addBook = (data: Omit<Book, 'id' | 'date'>): Promise<Book> =>
  request<Book>('/books', { method: 'POST', body: JSON.stringify(data) });

// PUT — update a book (partial)
export const updateBook = (id: string, data: Partial<Book>): Promise<Book> =>
  request<Book>(`/books/${id}`, { method: 'PUT', body: JSON.stringify(data) });

// DELETE — remove a book
export const deleteBook = (id: string): Promise<Book> =>
  request<Book>(`/books/${id}`, { method: 'DELETE' });
