import React, { useState, useEffect } from 'react';
import { Terminal, Copy, Search, Filter, Plus, Code2, Sparkles, MessageSquare, FileText, Loader2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getPrompts, type Prompt } from '../lib/promptService';

const iconMap: Record<string, React.ElementType> = {
  Terminal,
  Code2,
  Sparkles,
  MessageSquare,
  FileText
};

export function Prompts() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Todos');

  const categories = ['Todos', ...Array.from(new Set(prompts.map(p => p.category)))];

  const filteredPrompts = activeCategory === 'Todos' 
    ? prompts 
    : prompts.filter(p => p.category === activeCategory);

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const data = await getPrompts();
        setPrompts(data);
      } catch (error) {
        console.error('Error cargando prompts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPrompts();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 max-w-7xl mx-auto space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-brand-blue/10 text-brand-blue text-[10px] uppercase tracking-widest font-mono font-bold mb-4">
            PROMPTING
          </div>
          <h1 className="font-display text-4xl font-bold text-slate-900 dark:text-white tracking-tight">Galería de Prompts</h1>
          <p className="mt-2 text-slate-500 max-w-2xl">Colección de instrucciones optimizadas para maximizar el rendimiento de modelos de lenguaje grandes (LLMs).</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar prompts..." 
              className="pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 dark:text-white rounded-xl text-sm focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all w-64"
            />
          </div>
          <button className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat) => (
          <button 
            key={cat} 
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
              activeCategory === cat 
                ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900' 
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid of Prompts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-400">
            <Loader2 className="animate-spin mb-4 text-brand-blue" size={32} />
            <p className="font-medium text-sm">Cargando prompts...</p>
          </div>
        ) : filteredPrompts.map((prompt) => {
          const Icon = iconMap[prompt.icon] || Terminal;
          return (
            <div key={prompt.id} className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-soft border border-slate-100 dark:border-slate-800 group hover:shadow-hover transition-all flex flex-col h-full">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800/50 text-brand-blue rounded-2xl flex items-center justify-center shrink-0 border border-slate-100 dark:border-slate-700">
                    <Icon size={24} />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white leading-tight">{prompt.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-brand-blue bg-blue-50 px-2 py-0.5 rounded">{prompt.category}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{prompt.model}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="text-slate-500 text-sm mb-6 flex-1">
                {prompt.description}
              </p>
              
              <div className="bg-slate-900 rounded-2xl p-5 relative group/code overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue rounded-full blur-3xl opacity-10 -mr-10 -mt-10"></div>
                
                <div className="flex items-center justify-between mb-3 relative z-10">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Estructura del Prompt</span>
                  <button className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 text-xs font-medium bg-white/5 hover:bg-white/10 px-2 py-1 rounded-lg">
                    <Copy size={12} />
                    Copiar
                  </button>
                </div>
                
                <pre className="text-slate-300 font-mono text-xs leading-relaxed whitespace-pre-wrap relative z-10 line-clamp-4 group-hover/code:line-clamp-none transition-all duration-300">
                  {prompt.code}
                </pre>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
