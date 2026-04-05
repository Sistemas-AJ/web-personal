import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, Eye, EyeOff, ShieldCheck, ArrowLeft, Mail, Loader2 } from 'lucide-react';
import { loginToDirectus } from '../lib/directusAuth';

interface AdminLoginProps {
  onSuccess: () => void;
  onBack: () => void;
}

export function AdminLogin({ onSuccess, onBack }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [shaking, setShaking] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await loginToDirectus(email.trim(), password);
      setError('');
      onSuccess();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'No se pudo iniciar sesión.';
      setError(message);
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
      setPassword('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-blue rounded-full blur-3xl opacity-10" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={shaking ? { x: [0, -10, 10, -8, 8, -4, 4, 0] } : { opacity: 1, y: 0 }}
        transition={shaking ? { duration: 0.5 } : { duration: 0.4 }}
        className="relative w-full max-w-sm"
      >
        {/* Back button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-slate-300 transition-colors text-sm mb-8 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Volver al sitio
        </button>

        {/* Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-2xl">
          {/* Icon */}
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-blue-50 dark:bg-brand-blue/10 border border-blue-100 dark:border-brand-blue/20 rounded-2xl flex items-center justify-center">
              <ShieldCheck className="text-brand-blue" size={32} />
            </div>
          </div>

          <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white text-center mb-1">Panel de Administración</h1>
          <p className="text-slate-500 text-sm text-center mb-8">Acceso restringido. Autentícate con tu usuario de Directus.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest font-mono">
                Correo
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(''); }}
                  placeholder="usuario@dominio.com"
                  autoFocus
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest font-mono">
                Contraseña
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 dark:text-red-400 text-xs font-medium pt-1"
                >
                  {error}
                </motion.p>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting || !email.trim() || !password}
              className="w-full bg-brand-blue hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 rounded-xl font-medium transition-all shadow-lg shadow-blue-900/10 dark:shadow-blue-900/30 flex items-center justify-center gap-2 mt-2"
            >
              {submitting ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />}
              {submitting ? 'Validando acceso...' : 'Ingresar al panel'}
            </button>
          </form>
        </div>

        <p className="text-center text-slate-500 dark:text-slate-700 text-[11px] font-mono mt-6 uppercase tracking-widest">
          Acceso reservado para administradores
        </p>
      </motion.div>
    </div>
  );
}
