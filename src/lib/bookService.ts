import { DIRECTUS_ORIGIN, getDirectusAccessToken } from './directusAuth';

export interface Book {
  id: string;
  title: string;
  author: string;
  year: string;
  type: string;
  description?: string;
  img: string;
  date: string;
  publicationDate?: string;
  fileUrl?: string;
  coverId?: string | null;
  fileId?: string | null;
}

interface DirectusItemsResponse<T> {
  data: T;
  errors?: Array<{ message?: string }>;
}

export interface DirectusBookPayload {
  titulo: string;
  autor: string;
  year: string;
  tipo: string;
  descripcion: string;
  fecha_publicada?: string;
  portada?: string | null;
  archivo?: string | null;
}

interface DirectusBookRecord {
  id: string | number;
  titulo?: string;
  autor?: string;
  year?: string;
  tipo?: string;
  descripcion?: string;
  fecha_publicada?: string;
  portada?: string | { id?: string };
  archivo?: string | { id?: string };
}

const DIRECTUS_ITEMS_URL = `${DIRECTUS_ORIGIN}/items/ajbiblioteca`;
const DIRECTUS_FILES_URL = `${DIRECTUS_ORIGIN}/files`;
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

function normalizeBook(item: DirectusBookRecord): Book {
  const coverId = typeof item.portada === 'string' ? item.portada : item.portada?.id;
  const fileId = typeof item.archivo === 'string' ? item.archivo : item.archivo?.id;

  return {
    id: String(item.id),
    title: item.titulo || '',
    author: item.autor || '',
    year: item.year || '',
    type: item.tipo || 'General',
    description: item.descripcion || '',
    img: coverId ? `${DIRECTUS_ORIGIN}/assets/${coverId}` : '',
    date: item.fecha_publicada || '',
    publicationDate: item.fecha_publicada,
    fileUrl: fileId ? `${DIRECTUS_ORIGIN}/assets/${fileId}` : undefined,
    coverId: coverId || null,
    fileId: fileId || null,
  };
}

async function requestDirectus<T>(
  input: string,
  init?: RequestInit,
  requireAuth = false
): Promise<T> {
  const token = getDirectusAccessToken();
  if (requireAuth && !token) {
    throw new Error('Tu sesión de administrador no es válida. Inicia sesión nuevamente.');
  }

  const response = await fetch(input, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers || {}),
    },
  });

  const payload = (await response.json().catch(() => ({}))) as DirectusItemsResponse<T>;
  if (!response.ok) {
    const message = payload.errors?.[0]?.message || 'Error al conectar con Directus.';
    throw new Error(message);
  }

  return payload.data;
}

export const getBooks = async (): Promise<Book[]> => {
  try {
    const books = await requestDirectus<DirectusBookRecord[]>(DIRECTUS_ITEMS_URL);
    return books.map(normalizeBook);
  } catch {
    const seedData = await loadSeedBooks();
    return clone(seedData);
  }
};

export const addBook = async (data: DirectusBookPayload): Promise<Book> => {
  const created = await requestDirectus<DirectusBookRecord>(
    DIRECTUS_ITEMS_URL,
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
    true
  );
  return normalizeBook(created);
};

export const updateBook = async (id: string, data: Partial<DirectusBookPayload>): Promise<Book> => {
  const updated = await requestDirectus<DirectusBookRecord>(
    `${DIRECTUS_ITEMS_URL}/${id}`,
    {
      method: 'PATCH',
      body: JSON.stringify(data),
    },
    true
  );
  return normalizeBook(updated);
};

export const deleteBook = async (id: string): Promise<void> => {
  await requestDirectus<DirectusBookRecord | null>(
    `${DIRECTUS_ITEMS_URL}/${id}`,
    {
      method: 'DELETE',
    },
    true
  );
};

export async function uploadDirectusFile(file: File): Promise<string> {
  const token = getDirectusAccessToken();
  if (!token) {
    throw new Error('Tu sesión de administrador no es válida. Inicia sesión nuevamente.');
  }

  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(DIRECTUS_FILES_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const payload = (await response.json().catch(() => ({}))) as DirectusItemsResponse<
    { id?: string } | Array<{ id?: string }>
  >;

  if (!response.ok) {
    const message = payload.errors?.[0]?.message || 'No se pudo subir el archivo a Directus.';
    throw new Error(message);
  }

  const fileData = Array.isArray(payload.data) ? payload.data[0] : payload.data;
  if (!fileData?.id) {
    throw new Error('Directus no devolvió el ID del archivo subido.');
  }

  return fileData.id;
}
