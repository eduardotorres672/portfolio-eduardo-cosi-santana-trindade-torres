import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { QrCode, Cpu, Eye, EyeOff, MousePointerClick, LogIn, LogOut, User as UserIcon } from 'lucide-react';
import { auth, loginWithGoogle, logout } from '../../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [isMonochrome, setIsMonochrome] = useState(false);
  const [isHighlightActive, setIsHighlightActive] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <div className={`min-h-screen bg-premium-bg text-white flex flex-col font-sans overflow-x-hidden ${isMonochrome ? 'monochrome' : ''} ${isHighlightActive ? 'highlight-interactive' : ''}`}>
      {/* Background Orbs for 3D depth effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-purple-600/10 rounded-full blur-[120px]" />
      </div>

      <header className="sticky top-0 z-50 glass border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-premium-accent shadow-[0_0_20px_rgba(59,130,246,0.5)]">
            <QrCode size={24} className="text-white" />
          </div>
          <div className="flex flex-col h-10 justify-center">
            <h1 className="text-lg font-bold tracking-tight leading-none uppercase">
              Gerador de QR Virtual
            </h1>
            <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-medium">
              Minimalist • Premium • Fast
            </p>
          </div>
        </motion.div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-4 mr-4">
            {user ? (
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || ''} className="w-6 h-6 rounded-full" referrerPolicy="no-referrer" />
                ) : (
                  <UserIcon size={16} />
                )}
                <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-300 max-w-[100px] truncate">{user.displayName || user.email}</span>
                <button onClick={logout} className="text-zinc-500 hover:text-white transition-colors" title="Sair">
                  <LogOut size={14} />
                </button>
              </div>
            ) : (
              <button 
                onClick={handleLogin}
                className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold hover:bg-premium-accent hover:text-white transition-all"
              >
                <LogIn size={14} />
                <span>Admin Login</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 p-1 bg-white/5 rounded-full border border-white/10">
            <button 
              onClick={() => setIsMonochrome(!isMonochrome)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all text-[9px] uppercase tracking-widest font-bold ${
                isMonochrome 
                  ? 'bg-white text-black' 
                  : 'text-zinc-400 hover:text-white'
              }`}
              title="Modo Monocromático"
            >
              {isMonochrome ? <EyeOff size={12} /> : <Eye size={12} />}
              <span className="hidden sm:inline">Mono</span>
            </button>

            <div className="w-[1px] h-4 bg-white/10" />

            <button 
              onClick={() => setIsHighlightActive(!isHighlightActive)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all text-[9px] uppercase tracking-widest font-bold ${
                isHighlightActive 
                  ? 'bg-premium-accent text-white' 
                  : 'text-zinc-400 hover:text-white'
              }`}
              title="Destaque de Elementos Interativos"
            >
              <MousePointerClick size={12} />
              <span className="hidden sm:inline">Destaque</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="px-6 py-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-zinc-500 text-[10px] uppercase tracking-widest">
        <div>© 2026 GERADOR VIRTUAL</div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1"><Cpu size={12} /> AL-POWERED ENGINE</span>
          <span className="w-1 h-1 bg-zinc-700 rounded-full" />
          <span>ESTADO: OPERACIONAL</span>
        </div>
      </footer>
    </div>
  );
}
