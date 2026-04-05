import React from 'react';
import { Lock } from 'lucide-react';

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  onAdminAccess: () => void;
}

export function Sidebar({ currentView, setCurrentView, onAdminAccess }: SidebarProps) {
  const navItem = (view: string, icon: string, label: string) => (
    <button
      onClick={() => setCurrentView(view)}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm ${
        currentView === view
          ? 'bg-blue-50 dark:bg-brand-blue/10 text-brand-blue font-medium'
          : 'text-text-muted hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-text-dark dark:hover:text-slate-200'
      }`}
    >
      <span className="material-symbols-outlined text-[20px]">{icon}</span>
      {label}
    </button>
  );

  return (
    <aside className="w-72 bg-sidebar-bg dark:bg-slate-900 border-r border-gray-100 dark:border-slate-800 flex-shrink-0 flex flex-col fixed h-screen z-50">
      {/* Logo */}
      <div className="p-6 border-b border-gray-50 dark:border-slate-800 flex items-center gap-3">
        <div className="w-8 h-8 bg-brand-blue rounded flex items-center justify-center text-white">
          <span className="material-symbols-outlined text-sm">school</span>
        </div>
        <span className="font-display font-bold text-xl tracking-tight text-slate-900 dark:text-white">Adolfo</span>
      </div>

      {/* Nav */}
      <nav className="flex-grow p-4 space-y-1 overflow-y-auto">
        <p className="px-3 py-2 text-[10px] font-bold text-text-muted uppercase tracking-widest">Navegación</p>
        {navItem('dashboard', 'dashboard', 'Dashboard')}

        <div className="pt-6">
          <p className="px-3 py-2 text-[10px] font-bold text-text-muted uppercase tracking-widest">Categorías</p>
          {navItem('prompts', 'terminal', 'Prompts')}
          {navItem('notebookGuide', 'auto_stories', 'NotebookLM')}
          {navItem('library', 'library_books', 'Misceláneos')}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-50 dark:border-slate-800 space-y-2">
        {/* Admin access button — subtle */}
        <button
          onClick={onAdminAccess}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-400 dark:text-slate-600 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-400 transition-all text-xs group"
        >
          <Lock size={13} className="shrink-0" />
          <span>Panel de administración</span>
        </button>

        {/* User card */}
        <div className="flex items-center gap-3 p-2 rounded-lg bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center text-text-muted dark:text-slate-300">
            <span className="material-symbols-outlined">person</span>
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold truncate">Estudiante Académico</p>
            <p className="text-[10px] text-text-muted truncate">Profesor Adolfo V5.0</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
