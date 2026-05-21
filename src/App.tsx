import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Sparkles } from 'lucide-react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Slider from './components/Slider';
import About from './components/About';
import Portfolio from './components/Portfolio';
import Contact from './components/Contact';
import MusicPlayer from './components/MusicPlayer';
import FloatWhatsapp from './components/FloatWhatsapp';
import AdminPanel from './components/AdminPanel';
import { getSiteConfig, SiteConfig } from './utils/db';

export default function App() {
  const [config, setConfig] = useState<SiteConfig>(() => getSiteConfig());
  const [currentPath, setCurrentPath] = useState<'/' | '/admin'>(() => {
    return window.location.hash === '#/admin' ? '/admin' : '/';
  });

  // Track window hash change for back/forward navigation
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#/admin') {
        setCurrentPath('/admin');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setCurrentPath('/');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Listen to configuration updates from the Admin Panel
  useEffect(() => {
    const handleConfigUpdate = () => {
      setConfig(getSiteConfig());
    };

    window.addEventListener('site_config_updated', handleConfigUpdate);
    return () => window.removeEventListener('site_config_updated', handleConfigUpdate);
  }, []);

  // Apply theme class to <html> so global CSS can switch light/dark
  useEffect(() => {
    const theme = config.theme || 'dark';
    if (theme === 'light') {
      document.documentElement.classList.add('theme-light');
    } else {
      document.documentElement.classList.remove('theme-light');
    }
  }, [config.theme]);

  // Safe navigation function
  const handleSetPath = (path: string) => {
    if (path === '/admin') {
      window.location.hash = '#/admin';
      setCurrentPath('/admin');
    } else {
      window.location.hash = '#/';
      setCurrentPath('/');
    }
  };

  const scrollToNextSection = () => {
    const nextElem = document.getElementById('slider-section');
    nextElem?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[var(--site-bg)] text-[var(--site-text)] flex flex-col justify-between selection:bg-[var(--selection-bg)] selection:text-[var(--selection-text)]">

      {/* Dynamic Navigation Bar */}
      <Navbar
        logoText={config.heroLogoText}
        logoUrl={config.heroLogoUrl}
        logoSize={config.navLogoSize}
        currentPath={currentPath}
        setCurrentPath={handleSetPath}
      />

      {/* Main Content Workspace */}
      <main className="flex-grow">
        {currentPath === '/admin' ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <AdminPanel
              config={config}
              onConfigChange={(newConfig) => setConfig(newConfig)}
              onClose={() => handleSetPath('/')}
            />
          </motion.div>
        ) : (
          <div className="relative">
            {/* HERO SECTION */}
            <Hero
              title={config.heroTitle}
              subtitle={config.heroSubtitle}
              logoText={config.heroLogoText}
              logoUrl={config.heroLogoUrl}
              logoSize={config.heroLogoSize}
              logoPosition={config.heroLogoPosition}
              videoUrl={config.heroVideoUrl}
              onScrollToNext={scrollToNextSection}
            />

            {/* SPLIT HERO DECORATIVE BANNER */}
            <section className="bg-black py-10 border-y border-white/5 overflow-hidden">
              <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-between gap-6 text-[10px] sm:text-xs tracking-[0.3em] text-[#a3a3a3] uppercase font-mono">
                <span className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5" /> PINTURA RESIDENCIAL DE LUXO</span>
                <span>•</span>
                <span>DURABILIDADE E REVESTIMENTOS ESPECIAIS</span>
                <span>•</span>
                <span>LISBOA & ALGARVE PORTUGAL</span>
              </div>
            </section>

            {/* PROJECTS SLIDER (4 IMAGES) */}
            <Slider images={config.sliderImages} />

            {/* QUEM SOMOS */}
            <About
              text={config.aboutText}
              photoUrl={config.aboutPhoto}
              ownerName={config.aboutOwnerName}
            />

            {/* PORTFOLIO (COMPLETED & ONGOING GRIDS) */}
            <Portfolio projects={config.portfolio} />

            {/* CONTACT & MESSAGE REQUEST FORM */}
            <Contact
              phone={config.contactPhone}
              email={config.contactEmail}
              whatsappUrl={config.contactWhatsapp}
            />
          </div>
        )}
      </main>

      {/* Elegant minimalist footer */}
      {currentPath !== '/admin' && (
        <footer className="bg-[#080808] border-t border-white/5 py-12 text-[#a3a3a3]">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h3 className="font-serif-luxury text-sm tracking-widest text-white uppercase font-bold">
                {config.heroLogoText || 'RV PINTURAS & PAINTING'}
              </h3>
              <p className="text-[10px] tracking-wider text-neutral-500 mt-2 max-w-xs font-light">
                Elevando o padrão de revestimento residencial com acabamentos de luxo. Dreams come true.
              </p>
            </div>

            {/* Quick Admin Access Link */}
            <div className="flex flex-col items-center md:items-end gap-3">
              <div className="flex gap-6 text-xs uppercase tracking-widest">
                <a href="#home" className="hover:text-white transition-colors">Início</a>
                <a href="#about" className="hover:text-white transition-colors">Sobre</a>
                <a href="#portfolio" className="hover:text-white transition-colors">Projetos</a>
                <button
                  onClick={() => handleSetPath('/admin')}
                  className="hover:text-white flex items-center gap-1 transition-colors text-white/70"
                >
                  <Shield className="w-3.5 h-3.5" /> Painel Admin
                </button>
              </div>
              <p className="text-[10px] text-neutral-600 font-mono mt-1">
                © {new Date().getFullYear()} RV Pinturas & Painting. Todos os direitos reservados.
              </p>
            </div>
          </div>
        </footer>
      )}

      {/* PERSISTENT FLOATING CONTROLS (Only visible on front-end) */}
      {currentPath !== '/admin' && (
        <>
          {/* Left: Floating Music Player */}
          <MusicPlayer songs={config.songs} />

          {/* Right: Floating WhatsApp Link */}
          <FloatWhatsapp phone={config.contactPhone} />
        </>
      )}

    </div>
  );
}
