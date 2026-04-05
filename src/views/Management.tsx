import React, { useState } from 'react';
import { Upload, CheckCircle2, RefreshCw, BarChart2, FileText, Link as LinkIcon, Calendar, Terminal, BookOpen, X, Pencil, Image as ImageIcon } from 'lucide-react';
import { motion } from 'motion/react';
import * as bookService from '../lib/bookService';
import * as promptService from '../lib/promptService';

export function Management() {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [dragActiveCover, setDragActiveCover] = useState(false);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    type: 'Libro / Monografía', category: 'Inteligencia Artificial', title: '', author: '', year: '', url: '', model: '', description: '', code: '', destination: 'library'
  });

  const [systemItems, setSystemItems] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  React.useEffect(() => { loadSystemItems(); }, []);

  const loadSystemItems = async () => {
    let libraryItems: any[] = [];
    let promptItems: any[] = [];
    try {
      const books = await bookService.getBooks();
      libraryItems = books.map((i) => ({ ...i, sysType: 'Biblioteca' }));
    } catch { /* API not running */ }
    try {
      const prompts = await promptService.getPrompts();
      promptItems = prompts.map((i) => ({ ...i, sysType: 'Prompt' }));
    } catch { /* API not running */ }
    // NotebookLM still from localStorage
    const notebook = JSON.parse(localStorage.getItem('notebook_library') || '[]').map((i:any) => ({...i, sysType: 'NotebookLM'}));
    const delNot = JSON.parse(localStorage.getItem('deleted_notebook_items') || '[]');
    setSystemItems([...libraryItems, ...notebook.filter((i:any)=>!delNot.includes(i.id)), ...promptItems].reverse());
  };

  const handleSaveResource = async () => {
    if (formData.destination === 'prompts') {
      if (!formData.title || !formData.category || !formData.code) return alert('Faltan campos');
      try {
        await promptService.addPrompt({
          title: formData.title,
          category: formData.category,
          model: formData.model || 'GPT-4o',
          description: formData.description || '',
          code: formData.code,
          icon: 'Terminal',
        });
      } catch {
        return alert('Error: el servidor API no está activo. Ejecuta "npm run server" en otra terminal.');
      }
    } else {
      if (!formData.title) return alert('Falta el Título');
      if (formData.destination === 'library') {
        // Use API for library
        try {
          await bookService.addBook({
            title: formData.title,
            author: formData.author || 'S/N',
            year: formData.year || '2025',
            type: formData.type.split(' / ')[0],
            description: formData.description || '',
            img: coverImage ? URL.createObjectURL(coverImage) : 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80',
          });
        } catch {
          return alert('Error: el servidor API no está activo. Ejecuta "npm run server" en otra terminal.');
        }
      } else {
        const nb = { id: `UI-${Date.now().toString().slice(-3)}`, title: formData.title, desc: formData.description || `Autor: ${formData.author}` };
        localStorage.setItem('notebook_library', JSON.stringify([...JSON.parse(localStorage.getItem('notebook_library') || '[]'), nb]));
      }
    }
    setFormData({ type: 'Libro / Monografía', category: 'Inteligencia Artificial', title: '', author: '', year: '', url: '', model: '', description: '', code: '', destination: formData.destination });
    setFile(null); setCoverImage(null);
    await loadSystemItems();
    alert('¡Guardado exitoso!');
  };

  const handleSysDelete = async (item: any) => {
    if (!window.confirm(`¿Eliminar "${item.title}"?`)) return;
    if (item.sysType === 'Biblioteca') {
      try { await bookService.deleteBook(item.id); }
      catch { return alert('Error: el servidor API no está activo.'); }
    } else if (item.sysType === 'Prompt') {
      try { await promptService.deletePrompt(item.id); }
      catch { return alert('Error: el servidor API no está activo.'); }
    } else {
      const key = 'deleted_notebook_items';
      localStorage.setItem(key, JSON.stringify([...JSON.parse(localStorage.getItem(key) || '[]'), item.id]));
    }
    await loadSystemItems();
  };

  const handleSysEdit = async (item: any, newTitle: string) => {
    if (!newTitle.trim()) return;
    if (item.sysType === 'Biblioteca') {
      try { await bookService.updateBook(item.id, { title: newTitle.trim() }); }
      catch { return alert('Error: el servidor API no está activo.'); }
    } else if (item.sysType === 'Prompt') {
      try { await promptService.updatePrompt(item.id, { title: newTitle.trim() }); }
      catch { return alert('Error: el servidor API no está activo.'); }
    } else {
      const lib = JSON.parse(localStorage.getItem('notebook_library') || '[]');
      const idx = lib.findIndex((i: any) => i.id === item.id);
      if (idx !== -1) { lib[idx].title = newTitle.trim(); localStorage.setItem('notebook_library', JSON.stringify(lib)); }
    }
    setEditingId(null);
    await loadSystemItems();
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDragCover = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActiveCover(true);
    } else if (e.type === "dragleave") {
      setDragActiveCover(false);
    }
  };

  const handleDropCover = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActiveCover(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setCoverImage(e.dataTransfer.files[0]);
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setCoverImage(e.target.files[0]);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 max-w-7xl mx-auto space-y-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-brand-blue/10 text-brand-blue text-[10px] uppercase tracking-widest font-mono font-bold mb-4">
            ADMINISTRACIÓN
          </div>
          <h1 className="font-display text-4xl font-bold text-slate-900 dark:text-white tracking-tight">Gestión de Contenidos</h1>
          <p className="mt-2 text-slate-500">Ingreso y sincronización de recursos en la plataforma.</p>
        </div>
        
        <button className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-sm flex items-center gap-2">
          <Upload size={18} />
          Carga Masiva
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-soft border border-slate-100 dark:border-slate-800">
          <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-6">Nuevo Recurso Académico</h2>
          
          <form className="space-y-6">
            <div className="space-y-3 mb-6">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest font-mono">Destino Central del Recurso</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${formData.destination === 'library' ? 'border-brand-blue bg-blue-50/50 dark:bg-brand-blue/10 shadow-sm' : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                  <input type="radio" name="destination" value="library" checked={formData.destination === 'library'} onChange={e => setFormData({...formData, destination: e.target.value})} className="w-4 h-4" />
                  <p className="text-sm font-bold text-slate-900 dark:text-white">Biblioteca</p>
                </label>
                <label className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${formData.destination === 'notebook' ? 'border-brand-blue bg-blue-50/50 dark:bg-brand-blue/10 shadow-sm' : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                  <input type="radio" name="destination" value="notebook" checked={formData.destination === 'notebook'} onChange={e => setFormData({...formData, destination: e.target.value})} className="w-4 h-4" />
                  <p className="text-sm font-bold text-slate-900 dark:text-white">NotebookLM</p>
                </label>
                <label className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${formData.destination === 'prompts' ? 'border-brand-blue bg-blue-50/50 dark:bg-brand-blue/10 shadow-sm' : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                  <input type="radio" name="destination" value="prompts" checked={formData.destination === 'prompts'} onChange={e => setFormData({...formData, destination: e.target.value})} className="w-4 h-4" />
                  <p className="text-sm font-bold text-slate-900 dark:text-white">Prompts</p>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest font-mono">Categoría / Tema principal</label>
                <input type="text" list="cat-opts" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white rounded-xl text-sm outline-none transition-all" />
                <datalist id="cat-opts"><option value="Inteligencia Artificial"/><option value="Metodología"/><option value="Docencia"/></datalist>
              </div>

              {formData.destination !== 'prompts' ? (
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest font-mono">Tipo de Archivo</label>
                  <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white rounded-xl text-sm outline-none transition-all appearance-none">
                    <option>Libro / Monografía</option><option>Artículo Científico</option><option>Tesis</option>
                  </select>
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest font-mono">Modelo o LLM Sugerido</label>
                  <input type="text" value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} placeholder="Ej. GPT-4o" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white rounded-xl text-sm outline-none transition-all" />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest font-mono">Título del Recurso / Prompt</label>
              <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Título claro y descriptivo..." className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white rounded-xl text-sm outline-none transition-all" />
            </div>

            {formData.destination === 'prompts' && (
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest font-mono">Cuerpo del Prompt</label>
                <textarea value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} placeholder="Escribe el prompt..." className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white rounded-xl text-sm outline-none h-32 font-mono" />
              </div>
            )}

            {formData.destination !== 'prompts' && (
              <>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest font-mono">Autor(es) y Año</label>
                  <div className="flex gap-4">
                    <input type="text" value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} placeholder="Autor" className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white rounded-xl text-sm outline-none" />
                    <input type="number" value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} placeholder="Año" className="w-24 px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white rounded-xl text-sm outline-none" />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest font-mono">Descripción Opcional</label>
              <input type="text" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Resumen del recurso..." className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 dark:text-white rounded-xl text-sm outline-none transition-all" />
            </div>

            {formData.destination !== 'prompts' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Cover Upload */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest font-mono">Portada (Imagen)</label>
                
                {!coverImage ? (
                  <div 
                    className={`border-2 border-dashed rounded-2xl p-6 transition-all flex flex-col items-center justify-center cursor-pointer group relative h-48 ${dragActiveCover ? 'border-brand-blue bg-blue-50/50' : 'border-slate-200 hover:bg-slate-50 hover:border-brand-blue/30'}`}
                    onDragEnter={handleDragCover}
                    onDragLeave={handleDragCover}
                    onDragOver={handleDragCover}
                    onDrop={handleDropCover}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110 ${dragActiveCover ? 'bg-brand-blue text-white' : 'bg-blue-50 text-brand-blue'}`}>
                      <ImageIcon size={20} />
                    </div>
                    <p className="text-xs font-bold text-slate-700 mb-1 text-center">
                      {dragActiveCover ? 'Suelta la imagen...' : 'Subir o arrastrar portada'}
                    </p>
                    <p className="text-[10px] text-slate-400">JPG, PNG o WEBP</p>
                    <input 
                      type="file" 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                      onChange={handleCoverChange}
                      accept="image/*"
                    />
                  </div>
                ) : (
                  <div className="relative h-48 rounded-2xl overflow-hidden border border-slate-200 group flex items-center justify-center bg-slate-50">
                    <img src={URL.createObjectURL(coverImage)} alt="Preview" className="h-full object-contain mx-auto" />
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button 
                        type="button" 
                        onClick={() => setCoverImage(null)}
                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-lg"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Document Upload */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest font-mono">Archivo Adjunto</label>
                
                {!file ? (
                  <div 
                    className={`border-2 border-dashed rounded-2xl p-6 transition-all flex flex-col items-center justify-center cursor-pointer group relative h-48 ${dragActive ? 'border-brand-blue bg-blue-50/50' : 'border-slate-200 hover:bg-slate-50 hover:border-brand-blue/30'}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110 ${dragActive ? 'bg-brand-blue text-white' : 'bg-blue-50 text-brand-blue'}`}>
                      <Upload size={20} />
                    </div>
                    <p className="text-xs font-bold text-slate-700 mb-1 text-center">
                      {dragActive ? 'Suelta el archivo aquí...' : 'Subir o arrastrar documento'}
                    </p>
                    <p className="text-[10px] text-slate-400">PDF, EPUB, DOCX o TXT</p>
                    <input 
                      type="file" 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                      onChange={handleChange}
                      accept=".pdf,.epub,.docx,.txt"
                    />
                  </div>
                ) : (
                  <div className="relative h-48 rounded-2xl border border-brand-blue/30 bg-blue-50/30 p-6 flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 bg-brand-blue text-white rounded-xl flex items-center justify-center mb-3 shadow-md">
                      <FileText size={24} />
                    </div>
                    <p className="text-sm font-bold text-slate-700 line-clamp-1 mb-1">{file.name}</p>
                    <p className="text-xs text-slate-500 mb-4">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                    <button 
                      type="button" 
                      onClick={() => setFile(null)}
                      className="px-4 py-2 text-xs font-bold text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      Quitar archivo
                    </button>
                  </div>
                )}
              </div>
            </div>
            )}

            <div className="pt-6 mt-2 flex items-center justify-end gap-4 border-t border-slate-100">
              <button 
                type="button" 
                onClick={() => {
                  setFormData({ type: 'Libro / Monografía', category: 'Inteligencia Artificial', title: '', author: '', year: '', url: '', destination: 'library' });
                  setFile(null);
                  setCoverImage(null);
                }}
                className="px-6 py-3 rounded-xl font-medium text-slate-600 hover:bg-slate-50 transition-all"
              >
                Cancelar
              </button>
              <button 
                type="button" 
                onClick={handleSaveResource}
                className="bg-brand-blue hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-medium transition-all shadow-sm flex items-center gap-2"
              >
                Guardar Recurso
                <CheckCircle2 size={18} />
              </button>
            </div>
          </form>
        </div>

        {/* Status & Sync Section */}
        <div className="space-y-8">
          {/* System Status */}
          <div className="bg-slate-900 rounded-3xl p-8 shadow-soft text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue rounded-full blur-3xl opacity-20 -mr-10 -mt-10"></div>
            
            <h3 className="font-display text-xl font-bold mb-6 flex items-center gap-2">
              <BarChart2 size={20} className="text-brand-blue" />
              Estado del Sistema
            </h3>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400">Almacenamiento</span>
                  <span className="font-mono font-bold">45%</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-blue rounded-full w-[45%]"></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400">Límite de Prompts</span>
                  <span className="font-mono font-bold">128 / 500</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full w-[25%]"></div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800">
              <button className="w-full bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2">
                <RefreshCw size={16} />
                Sincronizar NotebookLM
              </button>
              <p className="text-center text-[10px] text-slate-500 font-mono mt-3 uppercase tracking-widest">
                Última sinc: Hace 2 horas
              </p>
            </div>
          </div>

          {/* Centralized Resource Manager */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-soft border border-slate-100 dark:border-slate-800 h-[600px] flex flex-col">
            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-6">Administrador de Datos</h3>
            
            <div className="flex-1 overflow-y-auto pr-2 space-y-2 scrollbar-hide">
              {systemItems.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-slate-500 text-sm">No hay recursos personalizados registrados.</p>
                </div>
              ) : systemItems.map((item, i) => (
                <div key={item.id || i} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 shrink-0 group-hover:bg-white dark:group-hover:bg-slate-700 transition-all shadow-sm">
                      {item.sysType === 'Prompt' ? <Terminal size={16} /> : item.sysType === 'NotebookLM' ? <FileText size={16} /> : <BookOpen size={16} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      {editingId === (item.id || i) ? (
                        <div className="flex items-center gap-2">
                          <input
                            autoFocus
                            value={editingTitle}
                            onChange={e => setEditingTitle(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter') handleSysEdit(item, editingTitle); if (e.key === 'Escape') setEditingId(null); }}
                            className="flex-1 text-sm font-bold bg-white dark:bg-slate-800 border border-brand-blue rounded-lg px-2 py-1 outline-none text-slate-900 dark:text-white"
                          />
                          <button onClick={() => handleSysEdit(item, editingTitle)} className="p-1 text-white bg-brand-blue hover:bg-blue-700 rounded-lg transition-colors" title="Guardar">
                            <CheckCircle2 size={14} />
                          </button>
                          <button onClick={() => setEditingId(null)} className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors" title="Cancelar">
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-brand-blue transition-colors">{item.title}</h4>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-brand-blue bg-brand-blue/10 px-2 py-0.5 rounded">{item.sysType}</span>
                      </div>
                    </div>
                  </div>
                  {editingId !== (item.id || i) && (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all shrink-0">
                      <button
                        onClick={() => { setEditingId(item.id || i); setEditingTitle(item.title); }}
                        className="p-2 text-slate-400 hover:text-brand-blue hover:bg-blue-50 dark:hover:bg-brand-blue/10 rounded-lg transition-colors"
                        title="Editar título"
                      >
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => handleSysDelete(item)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors" title="Eliminar">
                        <X size={15} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Architecture Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-soft border border-slate-100 dark:border-slate-800">
        <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white mb-6">Arquitectura de Secciones</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Prompts', count: 128, color: 'bg-blue-500' },
            { label: 'Libros', count: 45, color: 'bg-indigo-500' },
            { label: 'Artículos', count: 210, color: 'bg-violet-500' },
            { label: 'Notebooks', count: 12, color: 'bg-fuchsia-500' }
          ].map((stat, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-slate-700">{stat.label}</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{stat.count}</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full ${stat.color} rounded-full`} style={{ width: `${Math.random() * 60 + 20}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
