import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Database, FolderKanban, LibraryBig, Sparkles } from 'lucide-react';
import { LibraryAdminForm } from '../components/admin/LibraryAdminForm';
import { PromptAdminForm } from '../components/admin/PromptAdminForm';

type AdminSection = 'library' | 'prompts';

export function Management() {
  const [activeSection, setActiveSection] = useState<AdminSection>('library');

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 max-w-7xl mx-auto space-y-8"
    >
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-brand-blue/10 text-brand-blue text-[10px] uppercase tracking-widest font-mono font-bold mb-4">
            ADMINISTRACIÓN
          </div>
          <h1 className="font-display text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
            Gestión de Contenidos
          </h1>
          <p className="mt-2 text-slate-500 max-w-2xl">
            Administra Biblioteca y Prompts desde módulos separados dentro de la misma vista.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-soft px-5 py-4">
            <div className="flex items-center gap-2 text-brand-blue mb-2">
              <FolderKanban size={16} />
              <span className="text-[10px] font-mono uppercase tracking-widest">Módulo activo</span>
            </div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              {activeSection === 'library' ? 'Biblioteca' : 'Prompts'}
            </p>
          </div>
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-soft px-5 py-4">
            <div className="flex items-center gap-2 text-brand-blue mb-2">
              <Database size={16} />
              <span className="text-[10px] font-mono uppercase tracking-widest">Persistencia</span>
            </div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Base activa</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setActiveSection('library')}
          className={`inline-flex items-center gap-2 px-5 py-3 rounded-2xl border text-sm font-medium transition-colors ${
            activeSection === 'library'
              ? 'bg-slate-900 text-white border-slate-900 dark:bg-slate-100 dark:text-slate-900 dark:border-slate-100'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <LibraryBig size={16} />
          Biblioteca
        </button>
        <button
          type="button"
          onClick={() => setActiveSection('prompts')}
          className={`inline-flex items-center gap-2 px-5 py-3 rounded-2xl border text-sm font-medium transition-colors ${
            activeSection === 'prompts'
              ? 'bg-slate-900 text-white border-slate-900 dark:bg-slate-100 dark:text-slate-900 dark:border-slate-100'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <Sparkles size={16} />
          Prompts
        </button>
      </div>

      {activeSection === 'library' ? <LibraryAdminForm /> : <PromptAdminForm />}
    </motion.div>
  );
}
