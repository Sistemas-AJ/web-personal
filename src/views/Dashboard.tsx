import React from 'react';

interface DashboardProps {
  onNavigate?: (view: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  return (
    <main className="p-8 max-w-6xl mx-auto">
      <div className="mb-10 flex items-start justify-between gap-12 bg-white dark:bg-slate-900 p-8 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm transition-colors">
        <div className="max-w-xl">
          <p className="text-[10px] font-bold tracking-[0.2em] text-brand-blue uppercase mb-3">REPOSITORIO ACADÉMICO INTEGRADO</p>
          <h1 className="font-display text-5xl font-bold text-slate-900 dark:text-white hero-title mb-4">
            El Asesor <span className="text-brand-blue">Digital.</span>
          </h1>
          <p className="text-text-muted text-sm leading-relaxed">
            Sistema de inteligencia distribuida para la investigación avanzada. Un entorno diseñado para que la academia converja con la IA de vanguardia en una sola interfaz dinámica.
          </p>
        </div>
        <div className="hidden lg:flex flex-col items-end gap-2 text-right">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-text-muted uppercase">Modelos Activos:</span>
            <span className="bg-gray-100 text-[10px] px-2 py-1 rounded font-bold">Claude 3.5</span>
            <span className="bg-gray-100 text-[10px] px-2 py-1 rounded font-bold">GPT-4o</span>
          </div>
          <p className="text-[10px] text-text-muted mt-2 italic">Versión del sistema 5.0.24</p>
        </div>
      </div>

      <div className="space-y-12">
        <div>
          <h2 className="font-display text-2xl font-bold flex items-center gap-2">
            <span className="w-8 h-1 bg-brand-blue rounded-full"></span>
            Principales Herramientas
          </h2>
          <p className="text-text-muted text-xs mt-1 ml-10">Explora los módulos de investigación y generación optimizada.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <section className="md:col-span-2 bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm border border-gray-50 dark:border-slate-800 flex flex-col group hover:shadow-md transition-all cursor-pointer" onClick={() => onNavigate?.('prompts')}>
            <div className="h-56 overflow-hidden">
              <img alt="Abstract AI and technology connecting lines" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80" />
            </div>
            <div className="p-8 flex-grow flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <span className="bg-blue-50 text-brand-blue text-[10px] font-bold px-3 py-1 rounded-full uppercase">PROMPT_ENGINEERING</span>
                <span className="material-symbols-outlined text-brand-blue">trending_flat</span>
              </div>
              <h2 className="font-display text-3xl font-bold text-slate-900 dark:text-white mb-4">Galería de Prompts</h2>
              <p className="text-text-muted text-sm mb-8 max-w-lg leading-relaxed">
                Biblioteca curada de estructuras semánticas optimizadas para modelos LLM de última generación. Ingeniería de instrucciones aplicada a la academia.
              </p>
              <div className="mt-auto flex items-center gap-4">
                <button className="bg-brand-blue text-white px-8 py-3 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
                  Explorar Galería
                  <span className="material-symbols-outlined text-sm">bolt</span>
                </button>
              </div>
            </div>
          </section>

          <section className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm border border-gray-50 dark:border-slate-800 flex flex-col hover:shadow-md transition-all">
            <div className="h-44 overflow-hidden bg-gray-200 dark:bg-slate-800 relative">
              <img alt="Notebook context" className="w-full h-full object-cover grayscale opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCkvDvxzUUapqQfzvRcTvBDrte8W0qO2bREadVxOsYN2-qef3Ajl8Zhp8nkkTs2uCfYq-QAgEntbU3sRpfaKzzuV5ugrhnWgKcCeUNV6CNmqh757XXVd9Dh1OwScGqiGKFHqR55bAIm1IDx-X8dGQeRqQIz30TPOOxnCttvrJrUsFtnwa274TrZdqa7lkiU1UZwzHVrA7k6-pPMZjFG7Za5MQwYOBhwdpbLrjwmdwly56Xpl-Ya99-2BKYmSX8QRh2OFR4ahNyWjeI" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            <div className="p-8">
              <p className="text-[10px] font-bold text-text-muted tracking-widest mb-3 uppercase">ANALYSIS_TOOL</p>
              <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-4">NotebookLM</h2>
              <p className="text-text-muted text-sm mb-6 leading-relaxed">
                Tu fuente de verdad asistida por IA. Analiza documentos complejos y genera resúmenes académicos automáticos con precisión técnica.
              </p>
              <a 
                href="https://notebooklm.google.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-brand-blue text-sm font-bold flex items-center gap-2 group"
              >
                Acceder al Cuaderno
                <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </a>
            </div>
          </section>

          <section className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-50 dark:border-slate-800 p-8 flex flex-col justify-between hover:border-brand-blue/20 transition-all">
            <div>
              <div className="w-12 h-12 bg-blue-50 dark:bg-brand-blue/10 text-brand-blue flex items-center justify-center rounded-xl mb-6 shadow-sm">
                <span className="material-symbols-outlined text-2xl">edit_square</span>
              </div>
              <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white mb-3">Generador de Títulos</h2>
              <p className="text-text-muted text-sm leading-relaxed">
                Algoritmos de optimización semántica para encabezados de investigación de alto impacto y posicionamiento académico.
              </p>
            </div>
            <div className="pt-6 border-t border-gray-50 mt-8 flex justify-between items-center">
              <p className="text-[10px] font-bold text-emerald-500 tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                V2.4 ACTIVE
              </p>
              <button className="text-text-muted hover:text-brand-blue">
                <span className="material-symbols-outlined">launch</span>
              </button>
            </div>
          </section>

          <section className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-50 dark:border-slate-800 overflow-hidden flex hover:shadow-md transition-all cursor-pointer" onClick={() => onNavigate?.('library')}>
            <div className="p-8 flex-1 flex flex-col justify-between">
              <div>
                <p className="text-[10px] font-bold text-text-muted tracking-widest mb-3 uppercase">KNOWLEDGE_BASE</p>
                <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white mb-3">Libros de Investigación</h2>
                <p className="text-text-muted text-xs leading-relaxed">
                  Acceso al repositorio completo de publicaciones, papers y manuscritos digitales en formato PDF enriquecido para tu estudio.
                </p>
              </div>
              <div className="mt-6">
                <button className="flex items-center gap-2 text-brand-blue font-bold text-xs uppercase tracking-wider">
                  <span className="material-symbols-outlined text-base">book</span>
                  Abrir Biblioteca
                </button>
              </div>
            </div>
            <div className="w-32 lg:w-40 relative">
              <img alt="Library" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAtGE2AFFXbR8mZeGq5rWHvQxbJ6lTPOV-CCnFY23o-J30dcuPq27NQqeWE2prnl2Ar3uVoST6JNkRdlPdLghEbr0XcwuKcCsE8-QcbeH2Xl2JTyeNMiG7mjZrdigTlEUkSdWJkh6Ps8gTE7LWVr1mSfLxHiTPgSioghJmV2GHp6jHa3iR7-QCIILykbK6Es7XpfWsAxKyB99OgQH0WfmIl4Sh-2shcERC_bjTL-n_bRdSWKDTgRy1GkUZbT98EdXT1eDQn5gvIr-w" />
              <div className="absolute inset-0 bg-brand-blue/10"></div>
            </div>
          </section>

          <section className="bg-brand-blue dark:bg-slate-800 border border-transparent dark:border-slate-700 rounded-2xl shadow-xl p-8 text-white flex flex-col justify-between hover:scale-[1.02] transition-transform">
            <div>
              <div className="mb-6 flex justify-between items-center">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <span className="material-symbols-outlined text-2xl">apps</span>
                </div>
                <span className="material-symbols-outlined opacity-50">more_horiz</span>
              </div>
              <h2 className="font-display text-2xl font-bold mb-3">Miscelánea</h2>
              <p className="text-blue-100 text-sm leading-relaxed">
                Herramientas experimentales, recursos externos y utilidades de soporte seleccionadas para potenciar tu productividad académica.
              </p>
            </div>
            <div className="mt-8 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="blue-dot"></span>
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase">EXPLORE_MORE</span>
              </div>
              <span className="material-symbols-outlined">chevron_right</span>
            </div>
          </section>
        </div>
      </div>

      <section className="mt-20 p-12 bg-gray-50 dark:bg-slate-900 border border-dashed border-gray-200 dark:border-slate-800 text-center rounded-3xl" data-purpose="support-section">
        <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100 dark:border-slate-700">
          <span className="material-symbols-outlined text-brand-blue text-3xl">help_outline</span>
        </div>
        <h2 className="font-display text-3xl font-bold text-slate-900 dark:text-white mb-4">¿Necesitas ayuda con el repositorio?</h2>
        <p className="text-text-muted text-sm max-w-xl mx-auto mb-10 leading-relaxed">
          El sistema utiliza modelos de lenguaje de vanguardia para el procesamiento de activos. Si encuentras inconsistencias, nuestro soporte técnico está disponible.
        </p>
        <button className="bg-white border-2 border-brand-blue text-brand-blue px-10 py-3.5 rounded-xl font-bold text-sm hover:bg-brand-blue hover:text-white transition-all duration-300 shadow-sm">
          Contactar Soporte Técnico
        </button>
      </section>

      <footer className="mt-20 pt-8 border-t border-gray-100 dark:border-slate-800 pb-12 flex flex-col md:flex-row justify-between items-center text-[11px] text-text-muted">
        <div className="mb-4 md:mb-0">
          <span className="font-bold text-text-dark">Adolfo V5.0</span>
          <span className="mx-3 opacity-30">•</span>
          © 2024 Repositorio Digital Adolfo. Todos los derechos reservados.
        </div>
        <div className="flex space-x-8 uppercase tracking-widest font-bold">
          <a className="hover:text-brand-blue transition-colors" href="#">Privacidad</a>
          <a className="hover:text-brand-blue transition-colors" href="#">Términos</a>
          <a className="hover:text-brand-blue transition-colors" href="#">Contacto</a>
        </div>
      </footer>
    </main>
  );
}
