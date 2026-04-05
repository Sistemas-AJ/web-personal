import React, { useState, useEffect } from 'react';

export function Header() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    }
  }, [isDark]);

  return (
    <header className="h-16 border-b border-gray-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-40 px-8 flex items-center justify-between">
      <div className="flex items-center gap-4 w-1/2">
        <div className="relative w-full max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-gray-400 text-sm">search</span>
          </div>
          <input 
            className="block w-full pl-9 pr-3 py-2 border border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50 dark:text-white rounded-lg text-xs placeholder-gray-500 focus:ring-1 focus:ring-brand-blue focus:border-brand-blue transition-all outline-none" 
            placeholder="Buscar en el repositorio..." 
            type="text" 
          />
        </div>
      </div>
      <div className="flex items-center gap-6">
        <span className="text-[10px] font-bold text-emerald-500 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded">ESTADO: ONLINE</span>
        
        <button 
          onClick={() => setIsDark(!isDark)}
          className="text-text-muted hover:text-brand-blue dark:text-slate-400 dark:hover:text-brand-blue transition-colors"
          title="Alternar Modo Oscuro"
        >
          <span className="material-symbols-outlined text-[20px]">
            {isDark ? 'light_mode' : 'dark_mode'}
          </span>
        </button>

        <button className="text-text-muted hover:text-brand-blue dark:text-slate-400 dark:hover:text-brand-blue transition-colors">
          <span className="material-symbols-outlined text-[20px]">notifications</span>
        </button>
        <button className="text-text-muted hover:text-brand-blue dark:text-slate-400 dark:hover:text-brand-blue transition-colors">
          <span className="material-symbols-outlined text-[20px]">settings</span>
        </button>
      </div>
    </header>
  );
}
