import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 4000;

app.use(cors({ origin: '*' }));
app.use(express.json());

// ─── Generic helpers ───────────────────────────────────────────────────────────
const dbPath = (name: string) =>
  path.join(__dirname, `../database/${name}.json`);

const readFile = (name: string): any[] => {
  try {
    return JSON.parse(fs.readFileSync(dbPath(name), 'utf-8'));
  } catch {
    return [];
  }
};

const writeFile = (name: string, data: any[]) =>
  fs.writeFileSync(dbPath(name), JSON.stringify(data, null, 2), 'utf-8');

// ─── /api/books ────────────────────────────────────────────────────────────────
app.get('/api/books', (_req: Request, res: Response) => {
  res.json(readFile('library'));
});

app.post('/api/books', (req: Request, res: Response) => {
  const books = readFile('library');
  const book = {
    id: Date.now().toString(),
    date: new Date().toISOString().split('T')[0],
    img: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400',
    ...req.body,
  };
  books.unshift(book);
  writeFile('library', books);
  res.status(201).json(book);
});

app.put('/api/books/:id', (req: Request, res: Response) => {
  const books = readFile('library');
  const idx = books.findIndex((b) => b.id === req.params.id);
  if (idx === -1) { res.status(404).json({ error: 'Libro no encontrado' }); return; }
  books[idx] = { ...books[idx], ...req.body };
  writeFile('library', books);
  res.json(books[idx]);
});

app.delete('/api/books/:id', (req: Request, res: Response) => {
  const books = readFile('library');
  const idx = books.findIndex((b) => b.id === req.params.id);
  if (idx === -1) { res.status(404).json({ error: 'Libro no encontrado' }); return; }
  const [deleted] = books.splice(idx, 1);
  writeFile('library', books);
  res.json(deleted);
});

// ─── /api/prompts ──────────────────────────────────────────────────────────────
app.get('/api/prompts', (_req: Request, res: Response) => {
  res.json(readFile('prompts'));
});

app.post('/api/prompts', (req: Request, res: Response) => {
  const prompts = readFile('prompts');
  const prompt = {
    id: Date.now().toString(),
    icon: 'Terminal',
    ...req.body,
  };
  prompts.unshift(prompt);
  writeFile('prompts', prompts);
  res.status(201).json(prompt);
});

app.put('/api/prompts/:id', (req: Request, res: Response) => {
  const prompts = readFile('prompts');
  const idx = prompts.findIndex((p) => p.id === req.params.id);
  if (idx === -1) { res.status(404).json({ error: 'Prompt no encontrado' }); return; }
  prompts[idx] = { ...prompts[idx], ...req.body };
  writeFile('prompts', prompts);
  res.json(prompts[idx]);
});

app.delete('/api/prompts/:id', (req: Request, res: Response) => {
  const prompts = readFile('prompts');
  const idx = prompts.findIndex((p) => p.id === req.params.id);
  if (idx === -1) { res.status(404).json({ error: 'Prompt no encontrado' }); return; }
  const [deleted] = prompts.splice(idx, 1);
  writeFile('prompts', prompts);
  res.json(deleted);
});

// ─── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 API corriendo en http://localhost:${PORT}`);
  console.log(`   /api/books   — biblioteca`);
  console.log(`   /api/prompts — galería de prompts`);
});
