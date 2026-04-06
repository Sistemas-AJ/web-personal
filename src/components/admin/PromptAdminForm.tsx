import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { FileText, Loader2, Pencil, Plus, Save, Sparkles, Terminal, Trash2, X } from 'lucide-react';
import { addPrompt, deletePrompt, getPrompts, updatePrompt, type DirectusPromptPayload, type Prompt } from '../../lib/promptService';

interface PromptFormState {
  title: string;
  category: string;
  model: string;
  description: string;
  code: string;
}

const INITIAL_FORM: PromptFormState = {
  title: '',
  category: '',
  model: '',
  description: '',
  code: '',
};

export function PromptAdminForm() {
  const [items, setItems] = useState<Prompt[]>([]);
  const [form, setForm] = useState<PromptFormState>(INITIAL_FORM);
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
      const data = await getPrompts();
      setItems(data);
    } catch {
      setError('No se pudieron cargar los prompts.');
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setForm(INITIAL_FORM);
    setEditingId(null);
    setError('');
  }

  function handleEdit(item: Prompt) {
    setEditingId(item.id);
    setForm({
      title: item.title || '',
      category: item.category || '',
      model: item.model || '',
      description: item.description || '',
      code: item.code || '',
    });
    setError('');
  }

  async function handleDelete(item: Prompt) {
    if (!window.confirm(`¿Eliminar "${item.title}" de prompts?`)) {
      return;
    }

    try {
      await deletePrompt(item.id);
      if (editingId === item.id) {
        resetForm();
      }
      await loadItems();
    } catch {
      setError('No se pudo eliminar el prompt seleccionado.');
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!form.title.trim()) {
      setError('El título es obligatorio.');
      return;
    }

    if (!form.code.trim()) {
      setError('El contenido del prompt es obligatorio.');
      return;
    }

    setSaving(true);
    setError('');

    const payload: DirectusPromptPayload = {
      titulo: form.title.trim(),
      categoria: form.category.trim() || 'General',
      modelo: form.model.trim() || 'General',
      Descripcion: form.description.trim(),
      promp: form.code.trim(),
    };

    try {
      if (editingId) {
        await updatePrompt(editingId, payload);
      } else {
        await addPrompt(payload);
      }
      await loadItems();
      resetForm();
    } catch {
      setError('No se pudo guardar el prompt.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_0.95fr] gap-8">
      <section className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-soft border border-slate-100 dark:border-slate-800">
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-brand-blue/10 text-brand-blue text-[10px] uppercase tracking-widest font-mono font-bold mb-4">
              PROMPTS
            </div>
            <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
              {editingId ? 'Editar prompt' : 'Nuevo prompt'}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Gestiona las instrucciones almacenadas en Directus sin mezclar esta lógica con la vista principal.
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
              placeholder="Nombre del prompt"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest font-mono">
                Categoría
              </label>
              <input
                type="text"
                value={form.category}
                onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
                placeholder="Ej. Investigación"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest font-mono">
                Modelo
              </label>
              <input
                type="text"
                value={form.model}
                onChange={(event) => setForm((current) => ({ ...current, model: event.target.value }))}
                placeholder="Ej. GPT-4o"
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
              placeholder="Breve resumen del prompt"
              className="w-full min-h-24 px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest font-mono">
              Prompt
            </label>
            <textarea
              value={form.code}
              onChange={(event) => setForm((current) => ({ ...current, code: event.target.value }))}
              placeholder="Escribe el prompt completo"
              className="w-full min-h-48 px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-sm text-slate-100 outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all font-mono"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-blue hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-medium transition-colors"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : editingId ? <Save size={16} /> : <Plus size={16} />}
              {editingId ? 'Guardar cambios' : 'Crear prompt'}
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
            <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Prompts registrados</h2>
            <p className="mt-2 text-sm text-slate-500">Edita o elimina prompts existentes desde el panel.</p>
          </div>
          <div className="rounded-2xl bg-slate-100 dark:bg-slate-800 px-4 py-3 text-right">
            <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Prompts</p>
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
              No hay prompts registrados.
            </div>
          ) : (
            items.map((item) => (
              <motion.div
                key={item.id}
                layout
                className="rounded-2xl border border-slate-100 dark:border-slate-800 p-5 hover:border-brand-blue/30 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-brand-blue/10 text-brand-blue flex items-center justify-center shrink-0">
                    <Terminal size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-brand-blue bg-blue-50 dark:bg-brand-blue/10 px-2 py-1 rounded-full">
                        {item.category || 'General'}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{item.model || 'General'}</span>
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white leading-tight">{item.title}</h3>
                    {item.description && (
                      <p className="mt-2 text-sm text-slate-500 line-clamp-3">{item.description}</p>
                    )}
                    <pre className="mt-3 text-xs text-slate-500 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 whitespace-pre-wrap line-clamp-4 font-mono">
                      {item.code}
                    </pre>
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
              <Sparkles size={16} />
              <span className="text-[10px] font-mono uppercase tracking-widest">Total</span>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{items.length}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/50 p-4">
            <div className="flex items-center gap-2 text-brand-blue mb-2">
              <FileText size={16} />
              <span className="text-[10px] font-mono uppercase tracking-widest">Categorías</span>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {new Set(items.map((item) => item.category).filter(Boolean)).size}
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/50 p-4">
            <div className="flex items-center gap-2 text-brand-blue mb-2">
              <Terminal size={16} />
              <span className="text-[10px] font-mono uppercase tracking-widest">Modelos</span>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {new Set(items.map((item) => item.model).filter(Boolean)).size}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
