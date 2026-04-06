import { DIRECTUS_ORIGIN, getDirectusAccessToken } from './directusAuth';

export interface Prompt {
  id: string;
  title: string;
  category: string;
  model: string;
  description: string;
  code: string;
  icon: string;
}

interface DirectusItemsResponse<T> {
  data: T;
  errors?: Array<{ message?: string }>;
}

export interface DirectusPromptPayload {
  titulo: string;
  categoria: string;
  modelo: string;
  Descripcion: string;
  promp: string;
}

interface DirectusPromptRecord {
  id: string | number;
  titulo?: string;
  categoria?: string;
  modelo?: string;
  Descripcion?: string;
  promp?: string;
}

const DIRECTUS_ITEMS_URL = `${DIRECTUS_ORIGIN}/items/prompts`;
const promptsUrl = new URL('../../database/prompts.json', import.meta.url).href;

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

async function loadSeedPrompts(): Promise<Prompt[]> {
  const res = await fetch(promptsUrl);
  if (!res.ok) {
    throw new Error('No se pudo cargar database/prompts.json');
  }
  return res.json();
}

function normalizePrompt(item: DirectusPromptRecord): Prompt {
  return {
    id: String(item.id),
    title: item.titulo || '',
    category: item.categoria || '',
    model: item.modelo || '',
    description: item.Descripcion || '',
    code: item.promp || '',
    icon: 'Terminal',
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

export const getPrompts = async (): Promise<Prompt[]> => {
  try {
    const prompts = await requestDirectus<DirectusPromptRecord[]>(DIRECTUS_ITEMS_URL);
    return prompts.map(normalizePrompt);
  } catch {
    const seedData = await loadSeedPrompts();
    return clone(seedData);
  }
};

export const addPrompt = async (data: DirectusPromptPayload): Promise<Prompt> => {
  const created = await requestDirectus<DirectusPromptRecord>(
    DIRECTUS_ITEMS_URL,
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
    true
  );
  return normalizePrompt(created);
};

export const updatePrompt = async (id: string, data: Partial<DirectusPromptPayload>): Promise<Prompt> => {
  const updated = await requestDirectus<DirectusPromptRecord>(
    `${DIRECTUS_ITEMS_URL}/${id}`,
    {
      method: 'PATCH',
      body: JSON.stringify(data),
    },
    true
  );
  return normalizePrompt(updated);
};

export const deletePrompt = async (id: string): Promise<void> => {
  await requestDirectus<DirectusPromptRecord | null>(
    `${DIRECTUS_ITEMS_URL}/${id}`,
    {
      method: 'DELETE',
    },
    true
  );
};
