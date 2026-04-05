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

const STORAGE_KEY = 'database_library';
const libraryUrl = new URL('../../database/library.json', import.meta.url).href;

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

async function loadSeedBooks(): Promise<Book[]> {
  const res = await fetch(libraryUrl);
  if (!res.ok) {
    throw new Error('No se pudo cargar database/library.json');
  }
  return res.json();
}

async function readBooks(): Promise<Book[]> {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored) as Book[];
  }

  const seedData = await loadSeedBooks();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seedData));
  return clone(seedData);
}

function writeBooks(data: Book[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export const getBooks = async (): Promise<Book[]> => {
  const books = await readBooks();
  return clone(books);
};

export const addBook = async (data: Omit<Book, 'id' | 'date'>): Promise<Book> => {
  const books = await readBooks();
  const book: Book = {
    id: Date.now().toString(),
    date: new Date().toISOString().split('T')[0],
    img: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400',
    ...data,
  };
  const nextBooks = [book, ...books];
  writeBooks(nextBooks);
  return clone(book);
};

export const updateBook = async (id: string, data: Partial<Book>): Promise<Book> => {
  const books = await readBooks();
  const idx = books.findIndex((book) => book.id === id);
  if (idx === -1) {
    throw new Error('Libro no encontrado');
  }
  books[idx] = { ...books[idx], ...data };
  writeBooks(books);
  return clone(books[idx]);
};

export const deleteBook = async (id: string): Promise<Book> => {
  const books = await readBooks();
  const idx = books.findIndex((book) => book.id === id);
  if (idx === -1) {
    throw new Error('Libro no encontrado');
  }
  const [deleted] = books.splice(idx, 1);
  writeBooks(books);
  return clone(deleted);
};
