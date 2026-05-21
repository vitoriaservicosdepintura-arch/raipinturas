import { useState, useEffect } from 'react';
import { Menu, X, Shield, ArrowUpRight, Sun, Moon } from 'lucide-react';
import { LogoSize, getSiteConfig, saveSiteConfig } from '../utils/db';

interface NavbarProps {
  logoText: string;
  logoUrl?: string;
  logoSize?: LogoSize | string;
  currentPath: string;
  setCurrentPath: (path: string) => void;
}

export default function Navbar({ logoText, logoUrl, logoSize = 'md', currentPath, setCurrentPath }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const sizeMap: Record<string, string> = {
    xs: 'h-6',
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-12',
    xl: 'h-14',
    '2xl': 'h-20'
  };
  const imgSizeClass = sizeMap[String(logoSize)] || 'h-10';

  const handleToggleTheme = () => {
    try {
      const cfg = getSiteConfig();
      const next = cfg.theme === 'light' ? 'dark' : 'light';
      saveSiteConfig({ ...cfg, theme: next });
      if (next === 'light') document.documentElement.classList.add('theme-light');
      else document.documentElement.classList.remove('theme-light');
    } catch (e) { console.error(e); }
  };

  const currentTheme = (() => {
    try { return getSiteConfig().theme || 'dark'; } catch { return 'dark'; }
  })();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { label: 'Início', id: 'home' },
    { label: 'Quem Somos', id: 'about' },
    { label: 'Portfólio', id: 'portfolio' },
    { label: 'Contato', id: 'contact' },
  ];

  const handleNavClick = (id: string) => {
    setIsOpen(false);
    
    if (currentPath !== '/') {
      setCurrentPath('/');
      // Wait a moment for page swap before scrolling
      setTimeout(() => {
        const element = document.getElementById(id);
        element?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.getElementById(id);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled || currentPath !== '/'
          ? 'bg-[#0c0c0c]/90 border-b border-white/5 backdrop-blur-md py-4'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Brand / Logo */}
        <button
          onClick={() => {
            setCurrentPath('/');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-3 group text-left focus:outline-none"
        >
          {logoUrl ? (
            <img
              src={logoUrl}
              alt="RV Logo"
              className={`${imgSizeClass} w-auto object-contain max-w-[120px] transition-transform duration-300 group-hover:scale-105`}
              onError={(e) => {
                // Fallback to text if image fails
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="w-8 h-8 rounded border border-white/20 flex items-center justify-center bg-white/5 font-serif-luxury font-bold text-sm tracking-tighter text-white">
              RV
            </div>
          )}
          <span className="font-serif-luxury text-sm tracking-[0.2em] font-semibold text-white group-hover:text-neutral-300 transition-colors uppercase max-w-[200px] leading-tight md:max-w-none">
            {logoText || 'RV PINTURAS & PAINTING'}
          </span>
        </button>

        {/* Desktop Nav */}
        {currentPath === '/' ? (
          <nav className="hidden md:flex items-center gap-8">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="text-xs uppercase tracking-widest text-[#a3a3a3] hover:text-[#f3f4f6] transition-colors relative py-1 focus:outline-none after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-white after:transition-all after:duration-300 hover:after:w-full"
              >
                {item.label}
              </button>
            ))}
          </nav>
        ) : (
          <button
            onClick={() => setCurrentPath('/')}
            className="hidden md:flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#a3a3a3] hover:text-[#f3f4f6] transition-colors focus:outline-none"
          >
            ← Voltar para o Site
          </button>
        )}

        {/* Right CTA Area */}
        <div className="hidden md:flex items-center gap-4">
          {/* Theme toggle */}
          <button onClick={handleToggleTheme} title="Alternar tema claro/escuro"
            className="text-[10px] p-2 rounded border border-white/10 hover:bg-white/5 transition-colors flex items-center gap-2">
            {currentTheme === 'light' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          {currentPath === '/admin' ? (
            <span className="text-[10px] tracking-widest font-semibold font-serif-luxury text-white bg-white/10 px-3 py-1 rounded border border-white/10 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" /> MODO ADMIN
            </span>
          ) : (
            <button
              onClick={() => setCurrentPath('/admin')}
              className="text-[10px] uppercase tracking-widest border border-white/20 hover:border-white text-[#a3a3a3] hover:text-white px-4 py-2 rounded transition-all duration-300 hover:bg-white/5 flex items-center gap-1.5 focus:outline-none"
            >
              Área Admin <ArrowUpRight className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Mobile menu toggle */}
        <div className="flex md:hidden items-center gap-3">
          {/* Mobile theme toggle */}
          <button onClick={handleToggleTheme} title="Tema" className="p-1 text-white/90">
            {currentTheme === 'light' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          {currentPath === '/admin' && (
            <span className="text-[9px] tracking-widest text-white bg-white/10 px-2 py-0.5 rounded border border-white/10 flex items-center gap-1">
              <Shield className="w-3 h-3" /> ADMIN
            </span>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white hover:text-neutral-300 focus:outline-none p-1"
            aria-label="Menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav overlay */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 top-[72px] bg-[#0c0c0c] z-50 flex flex-col px-8 py-12 gap-8 border-t border-white/5 animate-in fade-in slide-in-from-top duration-200">
          {currentPath === '/' ? (
            <nav className="flex flex-col gap-6">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className="text-left font-serif-luxury text-lg tracking-wider text-[#a3a3a3] hover:text-white py-1 focus:outline-none border-b border-white/5"
                >
                  {item.label}
                </button>
              ))}
            </nav>
          ) : (
            <button
              onClick={() => {
                setIsOpen(false);
                setCurrentPath('/');
              }}
              className="text-left font-serif-luxury text-lg tracking-wider text-[#a3a3a3] hover:text-white py-1 focus:outline-none border-b border-white/5"
            >
              ← Voltar ao Site
            </button>
          )}

          <div className="mt-8 pt-8 border-t border-white/10 flex flex-col gap-4">
            {currentPath === '/admin' ? (
              <div className="text-center text-xs tracking-widest font-semibold text-white bg-white/10 py-3 rounded border border-white/10 flex items-center justify-center gap-2">
                <Shield className="w-4 h-4" /> MODO ADMINISTRATIVO
              </div>
            ) : (
              <button
                onClick={() => {
                  setIsOpen(false);
                  setCurrentPath('/admin');
                }}
                className="w-full text-center text-xs uppercase tracking-widest border border-white/20 hover:border-white text-white py-3 rounded transition-all duration-300 hover:bg-white/5 flex items-center justify-center gap-1.5 focus:outline-none"
              >
                Painel Admin <Shield className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
