import React from 'react';
import { Management } from '../views/Management';
import { ArrowLeft, LayoutDashboard, ShieldCheck, LogOut } from 'lucide-react';

interface AdminLayoutProps {
  onExit: () => void;
}

export function AdminLayout({ onExit }: AdminLayoutProps) {
  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex-shrink-0 flex flex-col fixed h-screen z-50">
        {/* Logo */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 bg-brand-blue rounded-lg flex items-center justify-center">
            <ShieldCheck size={18} className="text-white" />
          </div>
          <div>
            <span className="font-display font-bold text-slate-900 dark:text-white text-sm block">Panel Admin</span>
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Acceso restringido</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-grow p-4 space-y-1">
          <p className="px-3 py-2 text-[10px] font-bold text-slate-500 dark:text-slate-600 uppercase tracking-widest">Gestión</p>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm bg-blue-50 dark:bg-brand-blue/10 text-brand-blue font-medium border border-blue-100 dark:border-brand-blue/20">
            <LayoutDashboard size={18} />
            Gestión de Contenidos
          </button>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={onExit}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all text-sm group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Volver al sitio
          </button>
          <div className="mt-3 flex items-center gap-3 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-brand-blue/20 flex items-center justify-center">
              <ShieldCheck size={16} className="text-brand-blue" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Administrador</p>
              <p className="text-[10px] text-slate-500">Sesión activa</p>
            </div>
            <button
              onClick={onExit}
              title="Cerrar sesión"
              className="ml-auto p-1 text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400 transition-colors"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-grow ml-64 overflow-y-auto min-h-screen bg-slate-50 dark:bg-slate-950">
        <Management />
      </div>
    </div>
  );
}
