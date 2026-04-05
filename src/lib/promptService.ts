const BASE_URL = 'http://localhost:4000/api';

export interface Prompt {
  id: string;
  title: string;
  category: string;
  model: string;
  description: string;
  code: string;
  icon: string;
}

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
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

export const getPrompts = (): Promise<Prompt[]> =>
  request<Prompt[]>('/prompts');

export const addPrompt = (data: Omit<Prompt, 'id'>): Promise<Prompt> =>
  request<Prompt>('/prompts', { method: 'POST', body: JSON.stringify(data) });

export const updatePrompt = (id: string, data: Partial<Prompt>): Promise<Prompt> =>
  request<Prompt>(`/prompts/${id}`, { method: 'PUT', body: JSON.stringify(data) });

export const deletePrompt = (id: string): Promise<Prompt> =>
  request<Prompt>(`/prompts/${id}`, { method: 'DELETE' });
