import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './views/Dashboard';
import { Library } from './views/Library';
import { Prompts } from './views/Prompts';
import { NotebookGuide } from './views/NotebookGuide';
import { AdminLogin } from './views/AdminLogin';
import { AdminLayout } from './layouts/AdminLayout';
import { clearStoredDirectusAuth, hasStoredDirectusAuth } from './lib/directusAuth';

type Zone = 'public' | 'admin-login' | 'admin';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [zone, setZone] = useState<Zone>('public');

  const renderPublicView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentView} />;
      case 'library':
        return <Library />;
      case 'prompts':
        return <Prompts />;
      case 'notebookGuide':
        return <NotebookGuide />;
      default:
        return <Dashboard onNavigate={setCurrentView} />;
    }
  };

  // Admin login screen
  if (zone === 'admin-login') {
    return (
      <AdminLogin
        onSuccess={() => setZone('admin')}
        onBack={() => setZone('public')}
      />
    );
  }

  // Admin panel
  if (zone === 'admin') {
    return (
      <AdminLayout onExit={() => {
        clearStoredDirectusAuth();
        setZone('public');
      }} />
    );
  }

  // Public zone
  return (
    <div className="bg-brand-bg dark:bg-slate-950 text-text-dark dark:text-slate-200 font-sans antialiased min-h-screen flex">
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        onAdminAccess={() => setZone(hasStoredDirectusAuth() ? 'admin' : 'admin-login')}
      />
      <div className="flex-grow ml-72 flex flex-col min-h-screen">
        <Header />
        <div className="flex-1 overflow-y-auto">
          {renderPublicView()}
        </div>
      </div>
    </div>
  );
}

export default App;
