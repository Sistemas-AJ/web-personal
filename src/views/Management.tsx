import React from 'react';
import { motion } from 'motion/react';
import { Database, FolderKanban } from 'lucide-react';
import { LibraryAdminForm } from '../components/admin/LibraryAdminForm';

export function Management() {
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
            Gestión de Biblioteca
          </h1>
          <p className="mt-2 text-slate-500 max-w-2xl">
            Crea, edita y elimina recursos académicos desde un módulo separado para mantener la vista administrativa ligera.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-soft px-5 py-4">
            <div className="flex items-center gap-2 text-brand-blue mb-2">
              <FolderKanban size={16} />
              <span className="text-[10px] font-mono uppercase tracking-widest">Módulo activo</span>
            </div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Biblioteca</p>
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

      <LibraryAdminForm />
    </motion.div>
  );
}
