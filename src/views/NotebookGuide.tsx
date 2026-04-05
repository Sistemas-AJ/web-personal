import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { BarChart2, ChevronRight, Terminal, Trash2 } from 'lucide-react';

export function NotebookGuide() {
  const [directoryItems, setDirectoryItems] = useState([
    { id: '001', title: 'Arquitectura de Notebooks para PhD', desc: 'Metodología de organización por clústeres de conocimiento.' },
    { id: '002', title: 'Curaduría de Audio Overviews', desc: 'Guía para controlar el tono y profundidad de la IA.' },
    { id: '003', title: 'Integración con NotebookLM Python API', desc: 'Automatización de subida de fuentes a gran escala.' }
  ]);

  useEffect(() => {
    const localData = JSON.parse(localStorage.getItem('notebook_library') || '[]');
    const deletedItems = JSON.parse(localStorage.getItem('deleted_notebook_items') || '[]');
    
    setDirectoryItems(prev => {
      let combined = [...prev, ...localData];
      const uniqueMap = new Map();
      combined.forEach(item => uniqueMap.set(item.id, item));
      let uniqueCombined = Array.from(uniqueMap.values());
      return uniqueCombined.filter((item: any) => !deletedItems.includes(item.id));
    });
  }, []);

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm("¿Seguro que deseas eliminar este directorio de recursos?")) {
      const deletedItems = JSON.parse(localStorage.getItem('deleted_notebook_items') || '[]');
      localStorage.setItem('deleted_notebook_items', JSON.stringify([...deletedItems, id]));
      
      setDirectoryItems(prevItems => prevItems.filter(item => item.id !== id));
    }
  };
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 max-w-7xl mx-auto space-y-12"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] uppercase tracking-widest font-mono font-bold mb-4">
            V5.0 STABLE RELEASE
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
            Repositorio de Recursos<br />
            <span className="text-brand-blue">NotebookLM Académico</span>
          </h1>
          <p className="mt-6 text-slate-500 max-w-2xl leading-relaxed">
            Guía estructurada y curada para la implementación de NotebookLM en entornos de investigación y docencia universitaria. Metodologías de "Curador Digital" para el Profesor Adolfo.
          </p>
        </div>
      </div>

      {/* Hero Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Guide Card */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-soft border border-slate-100 dark:border-slate-800">
          <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-4">GUIDE_01 / FUNDAMENTOS</p>
          <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-4">Manual Maestro de Configuración</h2>
          <p className="text-slate-500 mb-8 leading-relaxed max-w-xl">
            Estructura técnica para la carga de fuentes multidimensionales: PDF, Google Docs y Web Links. Optimización del contexto para la generación de resúmenes de alta fidelidad.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-mono font-bold">PDF_RECOVERY</span>
            <span className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-mono font-bold">CONTEXT_WINDOW</span>
            <button className="bg-brand-blue hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm">
              VER GUÍA COMPLETA
            </button>
          </div>
        </div>

        {/* Stats Card */}
        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-3xl p-8 shadow-soft border border-slate-100 dark:border-slate-800 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100 dark:bg-emerald-900 rounded-full blur-3xl opacity-50 -mr-10 -mt-10"></div>
          <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-lg flex items-center justify-center mb-6 relative z-10">
            <BarChart2 size={16} />
          </div>
          <h3 className="font-display font-bold text-slate-900 dark:text-white mb-6 relative z-10">Eficiencia de Procesamiento</h3>
          <div className="relative z-10">
            <div className="font-display text-6xl font-bold text-slate-900 dark:text-white tracking-tighter mb-2">98%</div>
            <p className="text-xs text-slate-500 italic">Precisión en citación académica detectada en V5.0</p>
          </div>
        </div>
      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Prompts Nav */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-soft border border-slate-100 dark:border-slate-800">
          <h3 className="font-display font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <Terminal size={18} className="text-brand-blue" />
            Prompts de Ingeniería
          </h3>
          <div className="space-y-1">
            {['Analizador Semántico Profundo', 'Extractor de Bibliografía APA 7', 'Generador de Flashcards Críticas', 'Sintetizador de Podcast Técnico'].map((item, i) => (
              <button key={i} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white group">
                <span className="font-medium text-left">{item}</span>
                <ChevronRight size={14} className="text-slate-300 group-hover:text-brand-blue transition-colors shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* Directory List */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-soft border border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-display font-bold text-slate-900 dark:text-white">Directorio Académico V5.0</h3>
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-blue"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700"></div>
            </div>
          </div>

          <div className="space-y-6">
            {directoryItems.map((item, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 group cursor-pointer border-b border-slate-50 dark:border-slate-800 pb-6 last:border-0 last:pb-0">
                <span className="font-mono text-xs font-bold text-slate-300 dark:text-slate-600 group-hover:text-brand-blue dark:group-hover:text-brand-blue transition-colors w-8">{item.id}</span>
                <div className="flex-1">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-brand-blue dark:group-hover:text-brand-blue transition-colors">{item.title}</h4>
                  <p className="text-xs text-slate-500 italic mt-1">{item.desc}</p>
                </div>
                <button className="text-[10px] font-mono font-bold text-brand-blue sm:opacity-0 sm:group-hover:opacity-100 transition-opacity mt-2 sm:mt-0 text-left sm:text-right">
                  ACCESS_DOCS
                </button>
                <button 
                  onClick={(e) => handleDelete(e, item.id)}
                  className="sm:opacity-0 sm:group-hover:opacity-100 transition-opacity text-slate-400 hover:text-red-500 mt-2 sm:mt-0 ml-4 p-1 rounded-md hover:bg-red-50 dark:hover:bg-red-500/10"
                  title="Eliminar de NotebookLM"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Methodology bottom */}
      <div className="pt-8 pb-4">
        <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-10 text-center">Metodología del Curador Digital</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {[
            { num: '01', title: 'INGESTA CRÍTICA', desc: 'Selección de fuentes primarias evitando ruido informativo. El valor reside en la calidad del dato, no en el volumen.' },
            { num: '02', title: 'REFINADO DINÁMICO', desc: 'Iteración sobre los resúmenes mediante prompts de contraste. Diálogo continuo con la IA para detectar sesgos.' },
            { num: '03', title: 'SÍNTESIS DOCENTE', desc: 'Conversión del conocimiento extraído en materiales pedagógicos accionables para el aula.' }
          ].map((item, i) => (
            <div key={i} className="space-y-4">
              <div className="font-display text-4xl text-brand-blue font-bold">{item.num}.</div>
              <h4 className="text-[11px] font-bold text-slate-900 dark:text-slate-200 uppercase tracking-widest">{item.title}</h4>
              <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
