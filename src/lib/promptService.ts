export interface Prompt {
  id: string;
  title: string;
  category: string;
  model: string;
  description: string;
  code: string;
  icon: string;
}

const STORAGE_KEY = 'database_prompts';
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

async function readPrompts(): Promise<Prompt[]> {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored) as Prompt[];
  }

  const seedData = await loadSeedPrompts();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seedData));
  return clone(seedData);
}

function writePrompts(data: Prompt[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export const getPrompts = async (): Promise<Prompt[]> => {
  const prompts = await readPrompts();
  return clone(prompts);
};

export const addPrompt = async (data: Omit<Prompt, 'id'>): Promise<Prompt> => {
  const prompts = await readPrompts();
  const prompt: Prompt = {
    id: Date.now().toString(),
    icon: 'Terminal',
    ...data,
  };
  const nextPrompts = [prompt, ...prompts];
  writePrompts(nextPrompts);
  return clone(prompt);
};

export const updatePrompt = async (id: string, data: Partial<Prompt>): Promise<Prompt> => {
  const prompts = await readPrompts();
  const idx = prompts.findIndex((prompt) => prompt.id === id);
  if (idx === -1) {
    throw new Error('Prompt no encontrado');
  }
  prompts[idx] = { ...prompts[idx], ...data };
  writePrompts(prompts);
  return clone(prompts[idx]);
};

export const deletePrompt = async (id: string): Promise<Prompt> => {
  const prompts = await readPrompts();
  const idx = prompts.findIndex((prompt) => prompt.id === id);
  if (idx === -1) {
    throw new Error('Prompt no encontrado');
  }
  const [deleted] = prompts.splice(idx, 1);
  writePrompts(prompts);
  return clone(deleted);
};
