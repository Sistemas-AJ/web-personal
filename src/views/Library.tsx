import React, { useState, useEffect } from 'react';
import { BookOpen, Search, Filter, Download, ExternalLink, Star, Clock, FileText, Loader2, Trash2, Pencil, X, Image as ImageIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { getBooks, deleteBook, updateBook, type Book as LibraryItem } from '../lib/bookService';


export function Library() {
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await getBooks();
        const sorted = [...data].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setItems(sorted);
      } catch (error) {
        console.error('Error cargando biblioteca:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const featured = items.length > 0 ? items[0] : null;
  const recentItems = items.length > 0 ? items.slice(1) : [];

  const handleDownload = (e: React.MouseEvent, item: LibraryItem) => {
    e.stopPropagation();
    if (item.fileUrl) {
      const a = document.createElement('a');
      a.href = item.fileUrl;
      a.download = `${item.title}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      // Mockup download file for predefined items
      const dummyText = `Documento de demostración para:\n\nTítulo: ${item.title}\nAutor: ${item.author}\nAño: ${item.year}\n\nEste es un archivo generado automáticamente porque el recurso original no contiene un PDF adjunto real en la base de datos de prueba.`;
      const blob = new Blob([dummyText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${item.title.replace(/\s+/g, '_')}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 max-w-7xl mx-auto space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-brand-blue text-[10px] uppercase tracking-widest font-mono font-bold mb-4">
            REPOSITORIO
          </div>
          <h1 className="font-display text-4xl font-bold text-slate-900 dark:text-white tracking-tight">Biblioteca de Consulta</h1>
          <p className="mt-2 text-slate-500 max-w-2xl">Colección curada de libros, artículos y monografías para investigación y desarrollo.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar en biblioteca..." 
              className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all w-64"
            />
          </div>
          <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors">
            <Filter size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-8">
          
          {/* Featured Entry – minimal text */}
          {!loading && featured && (
            <div className="bg-slate-900 dark:bg-slate-800 rounded-3xl p-8 shadow-soft text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue rounded-full blur-3xl opacity-20 -mr-20 -mt-20"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-brand-blue bg-blue-900/50 px-2 py-1 rounded">DESTACADO</span>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">{featured.type}</span>
                </div>
                <h2 className="font-display text-3xl font-bold mb-2 leading-tight">{featured.title}</h2>
                <p className="text-slate-400 font-medium mb-4">{featured.author} &bull; {featured.year}</p>
                <p className="text-slate-300 mb-6 leading-relaxed max-w-2xl line-clamp-3">
                  {featured.description || "Sin descripción disponible."}
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <button className="bg-brand-blue hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 text-sm">
                    <BookOpen size={16} /> Leer Resumen
                  </button>
                  <button onClick={(e) => handleDownload(e, featured)} className="bg-white/10 hover:bg-white/20 text-white px-6 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 text-sm">
                    <Download size={16} /> Descargar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Grid of Books */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">Agregados Recientemente</h3>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-sm font-medium">Todos</button>
                <button className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium transition-colors">Libros</button>
                <button className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium transition-colors">Artículos</button>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="animate-spin text-slate-400" size={32} />
                </div>
              ) : recentItems.map((item) => (
                <div key={item.id} className="bg-white dark:bg-slate-900 rounded-xl px-5 py-3.5 border border-slate-100 dark:border-slate-800 group hover:border-brand-blue/30 hover:shadow-sm transition-all flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-brand-blue/10 text-brand-blue flex items-center justify-center shrink-0">
                      <BookOpen size={15} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[9px] font-mono uppercase tracking-widest text-brand-blue bg-blue-50 dark:bg-brand-blue/10 px-1.5 py-0.5 rounded">{item.type}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{item.year}</span>
                      </div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm leading-snug group-hover:text-brand-blue transition-colors">{item.title}</h4>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-slate-400 shrink-0">
                    <button onClick={(e) => handleDownload(e, item)} className="p-1.5 hover:text-brand-blue hover:bg-blue-50 dark:hover:bg-brand-blue/10 rounded-lg transition-colors" title="Descargar">
                      <Download size={14} />
                    </button>
                    <button className="p-1.5 hover:text-brand-blue hover:bg-blue-50 dark:hover:bg-brand-blue/10 rounded-lg transition-colors" title="Enlace externo">
                      <ExternalLink size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Stats */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-soft border border-slate-100">
            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-4">Estadísticas</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <BookOpen size={18} className="text-brand-blue" />
                  <span className="text-sm font-medium text-slate-700">Total Libros</span>
                </div>
                <span className="font-mono font-bold text-slate-900 dark:text-white">142</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <FileText size={18} className="text-indigo-500" />
                  <span className="text-sm font-medium text-slate-700">Artículos</span>
                </div>
                <span className="font-mono font-bold text-slate-900 dark:text-white">356</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Star size={18} className="text-amber-500" />
                  <span className="text-sm font-medium text-slate-700">Favoritos</span>
                </div>
                <span className="font-mono font-bold text-slate-900 dark:text-white">28</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 shadow-soft text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-3xl opacity-10 -mr-10 -mt-10"></div>
            
            <h3 className="font-display text-lg font-bold mb-2 relative z-10">Repositorio de NotebookLM</h3>
            <p className="text-blue-100 text-sm mb-6 relative z-10">Sincroniza tus fuentes documentales directamente con Google NotebookLM para análisis avanzado.</p>
            
            <button className="w-full bg-white text-brand-blue hover:bg-blue-50 px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 relative z-10 shadow-sm">
              <ExternalLink size={16} />
              Abrir NotebookLM
            </button>
          </div>
          
          <div className="bg-white rounded-3xl p-6 shadow-soft border border-slate-100">
            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-4">Actividad Reciente</h3>
            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
              {[
                { action: 'Leído', title: 'Capítulo 4: Redes Neuronales', time: 'Hace 2h' },
                { action: 'Descargado', title: 'Paper: GPT-4 Technical Report', time: 'Ayer' },
                { action: 'Agregado', title: 'Libro: Clean Code', time: 'Hace 3 días' }
              ].map((item, i) => (
                <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-4 h-4 rounded-full border-2 border-white bg-slate-200 group-hover:bg-brand-blue transition-colors shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm"></div>
                  <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-3 rounded-xl bg-slate-50 border border-slate-100 group-hover:border-brand-blue/30 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-brand-blue">{item.action}</span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1"><Clock size={10}/> {item.time}</span>
                    </div>
                    <p className="text-xs font-medium text-slate-700 line-clamp-1">{item.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </motion.div>
  );
}
