import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { BookOpen, CalendarDays, FileText, Image as ImageIcon, Loader2, Pencil, Plus, Save, Trash2, Upload, X } from 'lucide-react';
import { addBook, deleteBook, getBooks, updateBook, uploadDirectusFile, type Book, type DirectusBookPayload } from '../../lib/bookService';

interface LibraryFormState {
  title: string;
  author: string;
  year: string;
  type: string;
  description: string;
  publicationDate: string;
  img: string;
  fileUrl: string;
  pdfLabel: string;
  coverId: string | null;
  fileId: string | null;
}

const DEFAULT_COVER = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400';

const INITIAL_FORM: LibraryFormState = {
  title: '',
  author: '',
  year: '',
  type: 'Libro',
  description: '',
  publicationDate: '',
  img: '',
  fileUrl: '',
  pdfLabel: '',
  coverId: null,
  fileId: null,
};

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error(`No se pudo leer el archivo ${file.name}.`));
    reader.readAsDataURL(file);
  });
}

function mapBookToForm(book: Book): LibraryFormState {
  return {
    title: book.title || '',
    author: book.author || '',
    year: book.year || '',
    type: book.type || 'Libro',
    description: book.description || '',
    publicationDate: book.publicationDate || '',
    img: book.img || '',
    fileUrl: book.fileUrl || '',
    pdfLabel: book.fileUrl ? 'PDF registrado' : '',
    coverId: book.coverId || null,
    fileId: book.fileId || null,
  };
}

function sortBooks(items: Book[]) {
  return [...items].sort((a, b) => {
    const aTime = new Date(a.publicationDate || a.date).getTime();
    const bTime = new Date(b.publicationDate || b.date).getTime();
    return bTime - aTime;
  });
}

export function LibraryAdminForm() {
  const [items, setItems] = useState<Book[]>([]);
  const [form, setForm] = useState<LibraryFormState>(INITIAL_FORM);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    void loadItems();
  }, []);

  async function loadItems() {
    setLoading(true);
    try {
      const data = await getBooks();
      setItems(sortBooks(data));
    } catch {
      setError('No se pudo cargar la biblioteca.');
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setForm(INITIAL_FORM);
    setCoverFile(null);
    setPdfFile(null);
    setEditingId(null);
    setError('');
  }

  async function handleCoverChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      const img = await fileToDataUrl(file);
      setCoverFile(file);
      setForm((current) => ({ ...current, img, coverId: null }));
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo cargar la portada.');
    } finally {
      event.target.value = '';
    }
  }

  async function handlePdfChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      const fileUrl = await fileToDataUrl(file);
      setPdfFile(file);
      setForm((current) => ({
        ...current,
        fileUrl,
        pdfLabel: file.name,
        fileId: null,
      }));
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo cargar el PDF.');
    } finally {
      event.target.value = '';
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!form.title.trim()) {
      setError('El título es obligatorio.');
      return;
    }

    setSaving(true);
    setError('');

    const normalizedYear =
      form.year.trim() ||
      (form.publicationDate ? new Date(form.publicationDate).getFullYear().toString() : '');

    let portadaId = form.coverId;
    let archivoId = form.fileId;

    try {
      if (coverFile) {
        portadaId = await uploadDirectusFile(coverFile);
      }
      if (pdfFile) {
        archivoId = await uploadDirectusFile(pdfFile);
      }

      const payload: DirectusBookPayload = {
        titulo: form.title.trim(),
        autor: form.author.trim() || 'S/N',
        year: normalizedYear || 'N/D',
        tipo: form.type,
        descripcion: form.description.trim(),
        fecha_publicada: form.publicationDate || undefined,
        portada: portadaId || null,
        archivo: archivoId || null,
      };

      if (editingId) {
        await updateBook(editingId, payload);
      } else {
        await addBook(payload);
      }
      await loadItems();
      resetForm();
    } catch {
      setError('No se pudo guardar el registro de biblioteca.');
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(item: Book) {
    setEditingId(item.id);
    setForm(mapBookToForm(item));
    setCoverFile(null);
    setPdfFile(null);
    setError('');
  }

  async function handleDelete(item: Book) {
    if (!window.confirm(`¿Eliminar "${item.title}" de la biblioteca?`)) {
      return;
    }

    try {
      await deleteBook(item.id);
      if (editingId === item.id) {
        resetForm();
      }
      await loadItems();
    } catch {
      setError('No se pudo eliminar el registro seleccionado.');
    }
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-8">
      <section className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-soft border border-slate-100 dark:border-slate-800">
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-brand-blue/10 text-brand-blue text-[10px] uppercase tracking-widest font-mono font-bold mb-4">
              BIBLIOTECA
            </div>
            <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
              {editingId ? 'Editar recurso' : 'Nuevo recurso'}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Administra títulos, metadatos, portada y PDF desde el panel.
            </p>
          </div>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Cancelar edición
            </button>
          )}
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest font-mono">
              Título
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
              placeholder="Título del recurso"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest font-mono">
                Autor
              </label>
              <input
                type="text"
                value={form.author}
                onChange={(event) => setForm((current) => ({ ...current, author: event.target.value }))}
                placeholder="Autor o autores"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest font-mono">
                Año
              </label>
              <input
                type="number"
                value={form.year}
                onChange={(event) => setForm((current) => ({ ...current, year: event.target.value }))}
                placeholder="2025"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest font-mono">
                Tipo
              </label>
              <select
                value={form.type}
                onChange={(event) => setForm((current) => ({ ...current, type: event.target.value }))}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all"
              >
                <option value="Artículo">Artículo</option>
                <option value="Libro">Libro</option>
                <option value="General">General</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest font-mono">
                Fecha de publicación
              </label>
              <input
                type="date"
                value={form.publicationDate}
                onChange={(event) => setForm((current) => ({ ...current, publicationDate: event.target.value }))}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest font-mono">
              Descripción
            </label>
            <textarea
              value={form.description}
              onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
              placeholder="Resumen breve del contenido"
              className="w-full min-h-28 px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest font-mono">
                Portada imagen
              </label>
              <label className="block rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/30 p-4 cursor-pointer hover:border-brand-blue transition-colors">
                <input type="file" accept="image/*" className="hidden" onChange={handleCoverChange} />
                {form.img ? (
                  <div className="space-y-4">
                    <img src={form.img} alt="Portada" className="h-48 w-full object-contain rounded-xl bg-white dark:bg-slate-900" />
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Portada cargada</span>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.preventDefault();
                          setCoverFile(null);
                          setForm((current) => ({ ...current, img: '', coverId: null }));
                        }}
                        className="inline-flex items-center gap-1 text-red-500 hover:text-red-600"
                      >
                        <X size={14} />
                        Quitar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="h-48 rounded-xl flex flex-col items-center justify-center text-center text-slate-500">
                    <ImageIcon size={28} className="mb-3 text-brand-blue" />
                    <p className="text-sm font-medium">Seleccionar portada</p>
                    <p className="text-xs mt-1">JPG, PNG o WEBP</p>
                  </div>
                )}
              </label>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest font-mono">
                Archivo PDF
              </label>
              <label className="block rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/30 p-4 cursor-pointer hover:border-brand-blue transition-colors">
                <input type="file" accept="application/pdf" className="hidden" onChange={handlePdfChange} />
                <div className="h-48 rounded-xl flex flex-col items-center justify-center text-center text-slate-500">
                  <FileText size={28} className="mb-3 text-brand-blue" />
                  <p className="text-sm font-medium">{form.pdfLabel || 'Seleccionar PDF'}</p>
                  <p className="text-xs mt-1">
                    {form.fileUrl ? 'PDF listo para descarga en la biblioteca.' : 'Solo PDF'}
                  </p>
                  {form.fileUrl && (
                    <button
                      type="button"
                      onClick={(event) => {
                        event.preventDefault();
                        setPdfFile(null);
                        setForm((current) => ({ ...current, fileUrl: '', pdfLabel: '', fileId: null }));
                      }}
                      className="mt-4 inline-flex items-center gap-1 text-red-500 hover:text-red-600"
                    >
                      <X size={14} />
                      Quitar PDF
                    </button>
                  )}
                </div>
              </label>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
          )}

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-blue hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-medium transition-colors"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : editingId ? <Save size={16} /> : <Plus size={16} />}
              {editingId ? 'Guardar cambios' : 'Crear recurso'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium transition-colors"
            >
              <X size={16} />
              Limpiar
            </button>
          </div>
        </form>
      </section>

      <section className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-soft border border-slate-100 dark:border-slate-800">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Biblioteca registrada</h2>
            <p className="mt-2 text-sm text-slate-500">Edita o elimina recursos existentes desde este panel.</p>
          </div>
          <div className="rounded-2xl bg-slate-100 dark:bg-slate-800 px-4 py-3 text-right">
            <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Recursos</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{items.length}</p>
          </div>
        </div>

        <div className="space-y-3 max-h-[840px] overflow-y-auto pr-1">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-slate-400">
              <Loader2 size={28} className="animate-spin" />
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 p-8 text-center text-slate-500">
              No hay recursos en biblioteca.
            </div>
          ) : (
            items.map((item) => (
              <motion.div
                key={item.id}
                layout
                className="rounded-2xl border border-slate-100 dark:border-slate-800 p-4 hover:border-brand-blue/30 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={item.img || DEFAULT_COVER}
                    alt={item.title}
                    className="w-16 h-20 rounded-xl object-cover bg-slate-100 dark:bg-slate-800 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-brand-blue bg-blue-50 dark:bg-brand-blue/10 px-2 py-1 rounded-full">
                        {item.type}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {item.publicationDate || item.date}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white leading-tight">{item.title}</h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {item.author || 'S/N'} {item.year ? `• ${item.year}` : ''}
                    </p>
                    {item.description && (
                      <p className="mt-2 text-xs text-slate-500 line-clamp-3">{item.description}</p>
                    )}
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(item)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-50 dark:bg-brand-blue/10 text-brand-blue text-sm font-medium hover:bg-blue-100 dark:hover:bg-brand-blue/20 transition-colors"
                      >
                        <Pencil size={14} />
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(item)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-500 text-sm font-medium hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
                      >
                        <Trash2 size={14} />
                        Eliminar
                      </button>
                      {item.fileUrl && (
                        <a
                          href={item.fileUrl}
                          download={`${item.title}.pdf`}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        >
                          <Upload size={14} />
                          Descargar PDF
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/50 p-4">
            <div className="flex items-center gap-2 text-brand-blue mb-2">
              <BookOpen size={16} />
              <span className="text-[10px] font-mono uppercase tracking-widest">Títulos</span>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{items.length}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/50 p-4">
            <div className="flex items-center gap-2 text-brand-blue mb-2">
              <FileText size={16} />
              <span className="text-[10px] font-mono uppercase tracking-widest">Con PDF</span>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {items.filter((item) => item.fileUrl).length}
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/50 p-4">
            <div className="flex items-center gap-2 text-brand-blue mb-2">
              <CalendarDays size={16} />
              <span className="text-[10px] font-mono uppercase tracking-widest">Con fecha</span>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {items.filter((item) => item.publicationDate).length}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
