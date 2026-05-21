import React, { useState, useCallback } from 'react';
import {
  Shield,
  Home,
  User,
  Briefcase,
  Phone,
  Music,
  Image as ImageIcon,
  MessageSquare,
  Save,
  Trash2,
  Plus,
  RotateCcw,
  LogOut,
  Unlock,
  Upload,
  Check,
  Eye,
  Sun,
  Moon
} from 'lucide-react';
import { SiteConfig, Project, Song, saveSiteConfig, resetSiteConfig, LogoSize, LogoPosition } from '../utils/db';

interface AdminPanelProps {
  config: SiteConfig;
  onConfigChange: (newConfig: SiteConfig) => void;
  onClose: () => void;
}

type TabKey = 'home' | 'about' | 'portfolio' | 'contact' | 'music' | 'media' | 'messages';
type SaveStatus = 'idle' | 'saving' | 'saved';

export default function AdminPanel({ config, onConfigChange, onClose }: AdminPanelProps) {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('rv_admin_logged') === 'true';
  });
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Active Tab State
  const [activeTab, setActiveTab] = useState<TabKey>('home');

  // Per-section save status
  const [sectionStatus, setSectionStatus] = useState<Record<TabKey, SaveStatus>>({
    home: 'idle', about: 'idle', portfolio: 'idle',
    contact: 'idle', music: 'idle', media: 'idle', messages: 'idle'
  });

  // Local site configuration states
  const [heroTitle, setHeroTitle] = useState(config.heroTitle);
  const [heroSubtitle, setHeroSubtitle] = useState(config.heroSubtitle);
  const [heroLogoText, setHeroLogoText] = useState(config.heroLogoText);
  const [heroLogoUrl, setHeroLogoUrl] = useState(config.heroLogoUrl);
  const [heroLogoSize, setHeroLogoSize] = useState<LogoSize>(config.heroLogoSize || 'md');
  const [heroLogoPosition, setHeroLogoPosition] = useState<LogoPosition>(config.heroLogoPosition || 'center');
  const [navLogoSize, setNavLogoSize] = useState<LogoSize>(config.navLogoSize || 'md');
  const [siteTheme, setSiteTheme] = useState<'dark' | 'light'>(config.theme || 'dark');
  const [heroVideoUrl, setHeroVideoUrl] = useState(config.heroVideoUrl);
  const [sliderImages, setSliderImages] = useState<string[]>([...config.sliderImages]);

  const [aboutText, setAboutText] = useState(config.aboutText);
  const [aboutPhoto, setAboutPhoto] = useState(config.aboutPhoto);
  const [aboutOwnerName, setAboutOwnerName] = useState(config.aboutOwnerName);

  const [contactPhone, setContactPhone] = useState(config.contactPhone);
  const [contactEmail, setContactEmail] = useState(config.contactEmail);
  const [contactWhatsapp, setContactWhatsapp] = useState(config.contactWhatsapp);

  const [portfolioList, setPortfolioList] = useState<Project[]>([...config.portfolio]);
  const [mediaLibrary, setMediaLibrary] = useState<string[]>([...config.mediaLibrary]);

  const [messages, setMessages] = useState(() => {
    try { return JSON.parse(localStorage.getItem('rv_messages') || '[]'); }
    catch { return []; }
  });

  const [newProject, setNewProject] = useState<Omit<Project, 'id'>>({
    title: '', description: '', image: '', category: 'completed'
  });

  const [songDrafts, setSongDrafts] = useState<Song[]>(() => {
    const list = [...config.songs];
    while (list.length < 3) {
      list.push({ id: `s_${Date.now()}_${list.length}`, title: 'Nova Trilha', artist: 'Artista', url: '' });
    }
    return list.slice(0, 3);
  });

  // Helper: build full config from current state
  const buildCurrentConfig = useCallback((): SiteConfig => ({
    heroTitle, heroSubtitle, heroLogoText, heroLogoUrl, heroLogoSize, heroLogoPosition, heroVideoUrl,
    navLogoSize,
    theme: siteTheme,
    sliderImages, aboutText, aboutPhoto, aboutOwnerName,
    contactPhone, contactEmail, contactWhatsapp,
    portfolio: portfolioList,
    songs: songDrafts.filter(s => s.url !== ''),
    mediaLibrary
  }), [
    heroTitle, heroSubtitle, heroLogoText, heroLogoUrl, heroLogoSize, heroLogoPosition, heroVideoUrl,
    navLogoSize,
    siteTheme,
    sliderImages, aboutText, aboutPhoto, aboutOwnerName,
    contactPhone, contactEmail, contactWhatsapp,
    portfolioList, songDrafts, mediaLibrary
  ]);

  // --- Generic section save ---
  const saveSection = (tab: TabKey, partial?: Partial<SiteConfig>) => {
    setSectionStatus(prev => ({ ...prev, [tab]: 'saving' }));

    const currentFull = buildCurrentConfig();
    const updatedConfig: SiteConfig = { ...currentFull, ...(partial || {}) };

    setTimeout(() => {
      saveSiteConfig(updatedConfig);
      onConfigChange(updatedConfig);
      setSectionStatus(prev => ({ ...prev, [tab]: 'saved' }));
      setTimeout(() => setSectionStatus(prev => ({ ...prev, [tab]: 'idle' })), 3000);
    }, 600);
  };

  // Section-specific saves
  const saveHome = () => saveSection('home');
  const saveAbout = () => saveSection('about');
  const savePortfolio = () => saveSection('portfolio');
  const saveContact = () => saveSection('contact');
  const saveMusic = () => saveSection('music');
  const saveMedia = () => saveSection('media');

  // Save button renderer
  const SaveButton = ({ tab, onClick }: { tab: TabKey; onClick: () => void }) => {
    const status = sectionStatus[tab];
    return (
      <button
        onClick={onClick}
        disabled={status === 'saving'}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs uppercase tracking-widest font-bold transition-all shadow-lg ${status === 'saved'
            ? 'bg-emerald-600 text-white cursor-default'
            : status === 'saving'
              ? 'bg-neutral-800 text-neutral-400 cursor-not-allowed'
              : 'bg-white text-black hover:bg-neutral-200 active:scale-95 cursor-pointer'
          }`}
      >
        {status === 'saved' ? (
          <><Check className="w-3.5 h-3.5" /> Salvo com Sucesso!</>
        ) : status === 'saving' ? (
          <><span className="w-3 h-3 border-2 border-neutral-400 border-t-white rounded-full animate-spin" /> Salvando...</>
        ) : (
          <><Save className="w-3.5 h-3.5" /> Salvar Seção</>
        )}
      </button>
    );
  };

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin123') {
      setIsAuthenticated(true);
      sessionStorage.setItem('rv_admin_logged', 'true');
      setAuthError('');
    } else {
      setAuthError('Usuário ou senha incorretos.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('rv_admin_logged');
  };

  // File utils
  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    callback: (url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await fileToBase64(file);
      callback(base64);
      if (!mediaLibrary.includes(base64)) {
        setMediaLibrary(prev => [base64, ...prev]);
      }
    } catch { alert('Erro ao carregar imagem.'); }
  };

  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await fileToBase64(file);
      setSongDrafts(prev => {
        const updated = [...prev];
        updated[index] = { ...updated[index], url: base64 };
        return updated;
      });
    } catch { alert('Erro ao carregar áudio.'); }
  };

  const handleAddGeneralImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await fileToBase64(file);
      setMediaLibrary(prev => [base64, ...prev]);
    } catch { alert('Erro ao carregar imagem.'); }
  };

  const handleDeleteMessage = (id: string) => {
    if (!window.confirm('Excluir esta mensagem permanentemente?')) return;
    const updated = messages.filter((m: any) => m.id !== id);
    setMessages(updated);
    localStorage.setItem('rv_messages', JSON.stringify(updated));
  };

  const handleDeleteProject = (id: string) => {
    if (!window.confirm('Excluir este projeto do portfólio?')) return;
    setPortfolioList(prev => prev.filter(p => p.id !== id));
  };

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.title) { alert('Informe o título do projeto.'); return; }
    const created: Project = {
      id: `p_${Date.now()}`,
      ...newProject,
      image: newProject.image || 'https://images.pexels.com/photos/8146318/pexels-photo-8146318.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200'
    };
    setPortfolioList(prev => [created, ...prev]);
    setNewProject({ title: '', description: '', image: '', category: 'completed' });
  };

  const handleSliderImageChange = (index: number, url: string) => {
    setSliderImages(prev => { const u = [...prev]; u[index] = url; return u; });
  };

  // Global Save All
  const handleSaveAll = () => {
    const tabs: TabKey[] = ['home', 'about', 'portfolio', 'contact', 'music', 'media'];
    tabs.forEach(t => setSectionStatus(prev => ({ ...prev, [t]: 'saving' })));
    const updatedConfig = buildCurrentConfig();
    setTimeout(() => {
      saveSiteConfig(updatedConfig);
      onConfigChange(updatedConfig);
      tabs.forEach(t => setSectionStatus(prev => ({ ...prev, [t]: 'saved' })));
      setTimeout(() => tabs.forEach(t => setSectionStatus(prev => ({ ...prev, [t]: 'idle' }))), 3000);
    }, 800);
  };

  const handleResetDefaults = () => {
    if (!window.confirm('Resetar TUDO para o design padrão? Isso apagará fotos e textos editados.')) return;
    const reseted = resetSiteConfig();
    onConfigChange(reseted);
    setHeroTitle(reseted.heroTitle);
    setHeroSubtitle(reseted.heroSubtitle);
    setHeroLogoText(reseted.heroLogoText);
    setHeroLogoUrl(reseted.heroLogoUrl);
    setHeroLogoSize(reseted.heroLogoSize || 'md');
    setNavLogoSize(reseted.navLogoSize || 'md');
    setSiteTheme(reseted.theme || 'dark');
    setHeroLogoPosition(reseted.heroLogoPosition || 'center');
    setHeroVideoUrl(reseted.heroVideoUrl);
    setSliderImages([...reseted.sliderImages]);
    setAboutText(reseted.aboutText);
    setAboutPhoto(reseted.aboutPhoto);
    setAboutOwnerName(reseted.aboutOwnerName);
    setContactPhone(reseted.contactPhone);
    setContactEmail(reseted.contactEmail);
    setContactWhatsapp(reseted.contactWhatsapp);
    setPortfolioList([...reseted.portfolio]);
    setSongDrafts([...reseted.songs]);
    setMediaLibrary([...reseted.mediaLibrary]);
    alert('Configurações redefinidas com sucesso!');
  };

  // --- LOGIN SCREEN ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0c0c0c] text-white flex items-center justify-center px-6 py-20 relative">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-white/[0.02] rounded-full blur-[80px] pointer-events-none" />
        <div className="w-full max-w-md p-8 md:p-10 rounded-2xl bg-[#111111] border border-white/10 shadow-2xl relative z-10">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center bg-white/5 text-white mb-4">
              <Shield className="w-8 h-8" />
            </div>
            <span className="text-[10px] tracking-[0.3em] text-[#a3a3a3] uppercase font-bold">Painel de Controle</span>
            <h1 className="font-serif-luxury text-xl font-bold tracking-widest text-white uppercase mt-1">LOGIN ADMINISTRATIVO</h1>
            <p className="text-[11px] text-[#737373] mt-2 font-mono">Autenticação obrigatória para alteração de conteúdo</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-5">
            {authError && (
              <div className="p-3 bg-red-950/20 border border-red-900/50 rounded-lg text-xs text-red-400 text-center font-mono">{authError}</div>
            )}
            <div>
              <label className="text-[10px] uppercase tracking-widest text-[#a3a3a3] block mb-2 font-mono">Usuário</label>
              <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} placeholder="admin"
                className="w-full bg-[#181818] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-white transition-colors" />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest text-[#a3a3a3] block mb-2 font-mono">Senha</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
                className="w-full bg-[#181818] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-white transition-colors" />
            </div>
            <button type="submit"
              className="w-full py-3.5 bg-white text-black hover:bg-neutral-200 rounded-lg text-xs uppercase tracking-widest font-bold transition-all flex items-center justify-center gap-2 cursor-pointer mt-8">
              <Unlock className="w-3.5 h-3.5" /> Entrar no Painel
            </button>
          </form>
          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-[10px] text-neutral-500 font-mono">
              Dica: use <span className="text-white">admin</span> / <span className="text-white">admin123</span>
            </p>
            <button onClick={onClose} className="text-[10px] uppercase tracking-widest text-neutral-400 hover:text-white mt-4 transition-colors block mx-auto underline">← Voltar ao site</button>
          </div>
        </div>
      </div>
    );
  }

  // --- TAB MENU ITEMS ---
  const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: 'home', label: '1. Home / Hero', icon: <Home className="w-4 h-4" /> },
    { key: 'about', label: '2. Quem Somos', icon: <User className="w-4 h-4" /> },
    { key: 'portfolio', label: '3. Portfólio', icon: <Briefcase className="w-4 h-4" /> },
    { key: 'contact', label: '4. Contatos', icon: <Phone className="w-4 h-4" /> },
    { key: 'music', label: '5. Música / Áudio', icon: <Music className="w-4 h-4" /> },
    { key: 'media', label: '6. Media / Imagens', icon: <ImageIcon className="w-4 h-4" /> },
    { key: 'messages', label: 'Leads / Mensagens', icon: <MessageSquare className="w-4 h-4" /> },
  ];

  // --- ADMIN DASHBOARD ---
  return (
    <div className="min-h-screen bg-[#0c0c0c] text-white flex flex-col">
      {/* Header bar */}
      <div className="sticky top-0 z-30 bg-[#111111]/95 border-b border-white/10 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded border border-white/20 flex items-center justify-center bg-white/5">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <h1 className="font-serif-luxury text-sm font-bold tracking-widest text-white uppercase">PAINEL DE GESTÃO RV</h1>
            <p className="text-[10px] text-neutral-400 font-mono">Edição em Tempo Real • Salve por Seção ou Tudo de uma vez</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* View Site */}
          <button onClick={onClose}
            className="hidden sm:flex items-center gap-1.5 text-[10px] uppercase tracking-widest border border-white/10 hover:border-white/30 text-neutral-400 hover:text-white px-3 py-2 rounded transition-colors">
            <Eye className="w-3.5 h-3.5" /> Ver Site
          </button>
          {/* Theme Toggle */}
          <div className="hidden sm:flex items-center gap-2 px-2 py-1 rounded border border-white/10">
            <button onClick={() => setSiteTheme('dark')}
              className={`px-2 py-1 rounded text-[10px] ${siteTheme === 'dark' ? 'bg-white text-black' : 'text-neutral-300'}`}>
              <Moon className="w-3.5 h-3.5 inline-block mr-2" /> Escuro
            </button>
            <button onClick={() => setSiteTheme('light')}
              className={`px-2 py-1 rounded text-[10px] ${siteTheme === 'light' ? 'bg-white text-black' : 'text-neutral-300'}`}>
              <Sun className="w-3.5 h-3.5 inline-block mr-2" /> Claro
            </button>
          </div>
          {/* Reset */}
          <button onClick={handleResetDefaults}
            className="hidden sm:flex items-center gap-1.5 text-[10px] uppercase tracking-widest border border-white/10 hover:border-red-900/60 text-neutral-400 hover:text-red-400 px-3 py-2 rounded transition-colors">
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
          {/* Save All */}
          <button onClick={handleSaveAll}
            className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest px-4 py-2 rounded font-bold transition-all shadow-lg bg-white text-black hover:bg-neutral-200 active:scale-95 cursor-pointer">
            <Save className="w-3.5 h-3.5" /> Salvar Tudo
          </button>
          {/* Logout */}
          <button onClick={handleLogout} className="p-2 text-neutral-400 hover:text-white transition-colors" title="Sair">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 max-w-7xl mx-auto w-full px-6 py-8 gap-8">

        {/* Sidebar */}
        <aside className="lg:col-span-3 flex flex-col gap-2">
          <span className="text-[9px] uppercase tracking-widest text-[#a3a3a3] font-semibold px-3 mb-2 font-mono">SEÇÕES DO WEBSITE</span>
          {tabs.map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`w-full flex items-center justify-between text-left text-xs uppercase tracking-widest p-3 rounded-lg border transition-all ${activeTab === key
                  ? 'bg-white/10 text-white border-white/20 font-semibold'
                  : 'hover:bg-white/5 text-neutral-400 border-transparent'
                }`}
            >
              <span className="flex items-center gap-2">{icon} {label}</span>
              {key === 'messages' && (
                <span className="bg-white/20 text-white text-[9px] px-1.5 py-0.5 rounded-full font-mono font-bold">{messages.length}</span>
              )}
              {sectionStatus[key] === 'saved' && key !== 'messages' && (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              )}
            </button>
          ))}
          <div className="mt-8 border-t border-white/5 pt-6 text-center lg:text-left">
            <button onClick={onClose} className="text-xs uppercase tracking-widest text-[#a3a3a3] hover:text-white underline transition-colors">
              ← Visualizar Site
            </button>
          </div>
        </aside>

        {/* Content Panel */}
        <main className="lg:col-span-9 bg-[#111111] border border-white/10 rounded-2xl p-6 md:p-8 flex flex-col gap-8">

          {/* ===== TAB 1: HOME / HERO ===== */}
          {activeTab === 'home' && (
            <div className="space-y-6">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h3 className="font-serif-luxury text-lg tracking-widest uppercase text-white mb-1">1. Home / Hero</h3>
                  <p className="text-xs text-neutral-400">Ajuste textos, logo, vídeo de fundo e imagens do slider.</p>
                </div>
                <SaveButton tab="home" onClick={saveHome} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-[#a3a3a3] block mb-2 font-mono">Título Principal</label>
                  <input type="text" value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)}
                    className="w-full bg-[#181818] border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-white transition-colors" />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-[#a3a3a3] block mb-2 font-mono">Subtítulo / Slogan</label>
                  <input type="text" value={heroSubtitle} onChange={(e) => setHeroSubtitle(e.target.value)}
                    className="w-full bg-[#181818] border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-white transition-colors" />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-[#a3a3a3] block mb-2 font-mono">Texto da Logo no Topo</label>
                  <input type="text" value={heroLogoText} onChange={(e) => setHeroLogoText(e.target.value)}
                    className="w-full bg-[#181818] border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-white transition-colors" />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-[#a3a3a3] block mb-2 font-mono">Vídeo de Fundo (Link MP4)</label>
                  <input type="text" value={heroVideoUrl} onChange={(e) => setHeroVideoUrl(e.target.value)} placeholder="Link direto MP4"
                    className="w-full bg-[#181818] border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-white transition-colors" />
                </div>
              </div>

              {/* Logo Upload + Size + Position */}
              <div className="border-t border-white/5 pt-6 space-y-6">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-[#a3a3a3] block mb-3 font-mono">Logotipo da Marca (Upload)</label>
                  <div className="flex items-center gap-6">
                    {/* Preview */}
                    <div className="w-20 h-20 rounded-xl border border-white/10 bg-[#181818] flex items-center justify-center p-2 flex-shrink-0">
                      {heroLogoUrl
                        ? <img src={heroLogoUrl} alt="Logo" className="max-w-full max-h-full object-contain" />
                        : <span className="text-[10px] text-neutral-500 font-mono text-center">Sem logo</span>
                      }
                    </div>
                    <div className="space-y-2">
                      <input type="file" accept="image/*" id="logo-upload-input" className="hidden"
                        onChange={(e) => handleImageUpload(e, setHeroLogoUrl)} />
                      <label htmlFor="logo-upload-input"
                        className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 border border-white/10 rounded text-[10px] uppercase tracking-widest text-neutral-300 hover:bg-white/5 transition-colors">
                        <Upload className="w-3.5 h-3.5" /> Upload Imagem
                      </label>
                      {heroLogoUrl && (
                        <button onClick={() => setHeroLogoUrl('')}
                          className="ml-3 text-[10px] uppercase tracking-widest text-red-400 hover:text-red-300 transition-colors">
                          Remover
                        </button>
                      )}
                      <p className="text-[10px] text-neutral-500">Se não enviar, exibe monograma "RV" automático.</p>
                    </div>

                    {/* Nav Logo Size Selector (inline, next to upload) */}
                    <div className="ml-4">
                      <label className="text-[10px] uppercase tracking-widest text-[#a3a3a3] block mb-2 font-mono">Tamanho da Logo no Menu (Topo Esquerdo)</label>
                      <div className="flex flex-wrap gap-2 max-w-xs">
                        {(['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as LogoSize[]).map((size) => {
                          const labels: Record<LogoSize, string> = { xs: 'XS', sm: 'SM', md: 'MD', lg: 'LG', xl: 'XL', '2xl': '2XL' };
                          return (
                            <button
                              key={size}
                              type="button"
                              onClick={() => setNavLogoSize(size)}
                              className={`px-2 py-1 rounded-md text-[10px] uppercase tracking-widest font-mono border transition-all ${navLogoSize === size
                                  ? 'bg-white text-black border-white font-bold'
                                  : 'bg-[#181818] text-neutral-400 border-white/10 hover:border-white/30 hover:text-white'
                                }`}
                            >
                              {labels[size]}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Logo Size Selector */}
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-[#a3a3a3] block mb-3 font-mono">Tamanho da Logo na Hero</label>
                  <div className="flex flex-wrap gap-2">
                    {(['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as LogoSize[]).map((size) => {
                      const labels: Record<LogoSize, string> = { xs: 'XS – 48px', sm: 'SM – 64px', md: 'MD – 96px', lg: 'LG – 128px', xl: 'XL – 176px', '2xl': '2XL – 240px' };
                      return (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setHeroLogoSize(size)}
                          className={`px-3 py-2 rounded-lg text-[10px] uppercase tracking-widest font-mono border transition-all ${heroLogoSize === size
                              ? 'bg-white text-black border-white font-bold'
                              : 'bg-[#181818] text-neutral-400 border-white/10 hover:border-white/30 hover:text-white'
                            }`}
                        >
                          {labels[size]}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Logo Position Selector – 3×3 Grid */}
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-[#a3a3a3] block mb-3 font-mono">Posição da Logo na Hero</label>
                  <div className="grid grid-cols-3 gap-1.5 w-48">
                    {([
                      'top-left', 'top-center', 'top-right',
                      'center-left', 'center', 'center-right',
                      'bottom-left', 'bottom-center', 'bottom-right'
                    ] as LogoPosition[]).map((pos) => {
                      const icons: Record<LogoPosition, string> = {
                        'top-left': '↖', 'top-center': '↑', 'top-right': '↗',
                        'center-left': '←', 'center': '✦', 'center-right': '→',
                        'bottom-left': '↙', 'bottom-center': '↓', 'bottom-right': '↘'
                      };
                      const labels: Record<LogoPosition, string> = {
                        'top-left': 'Topo Esq', 'top-center': 'Topo Centro', 'top-right': 'Topo Dir',
                        'center-left': 'Meio Esq', 'center': 'Centro', 'center-right': 'Meio Dir',
                        'bottom-left': 'Base Esq', 'bottom-center': 'Base Centro', 'bottom-right': 'Base Dir'
                      };
                      return (
                        <button
                          key={pos}
                          type="button"
                          title={labels[pos]}
                          onClick={() => setHeroLogoPosition(pos)}
                          className={`aspect-square rounded-lg flex items-center justify-center text-base transition-all border ${heroLogoPosition === pos
                              ? 'bg-white text-black border-white scale-105 shadow-lg'
                              : 'bg-[#181818] text-neutral-400 border-white/10 hover:border-white/30 hover:text-white'
                            }`}
                        >
                          {icons[pos]}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-[10px] text-neutral-500 mt-2 font-mono">
                    Posição atual: <span className="text-white">{heroLogoPosition}</span>
                    {' • '} Tamanho: <span className="text-white">{heroLogoSize}</span>
                  </p>
                </div>
                {/* removed duplicate nav logo size selector (moved inline next to upload) */}
              </div>

              {/* Slider Images */}
              <div className="border-t border-white/5 pt-6">
                <h4 className="text-[10px] uppercase tracking-widest text-[#a3a3a3] mb-4 font-mono">Imagens do Slider da Home (4 fotos)</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Array.from({ length: 4 }).map((_, idx) => {
                    const image = sliderImages[idx] || '';
                    return (
                      <div key={idx} className="space-y-2 border border-white/5 p-3 rounded-lg bg-[#181818]">
                        <span className="text-[10px] font-mono text-neutral-500">Imagem {idx + 1}</span>
                        <div className="aspect-video w-full rounded overflow-hidden bg-neutral-900 border border-white/10">
                          {image
                            ? <img src={image} alt={`Slide ${idx + 1}`} className="w-full h-full object-cover" />
                            : <div className="w-full h-full flex items-center justify-center text-[10px] text-neutral-600 italic">Vazia</div>
                          }
                        </div>
                        <input type="file" accept="image/*" id={`slider-upload-${idx}`} className="hidden"
                          onChange={(e) => handleImageUpload(e, (url) => handleSliderImageChange(idx, url))} />
                        <label htmlFor={`slider-upload-${idx}`}
                          className="cursor-pointer flex items-center justify-center gap-1 py-1.5 text-[9px] uppercase tracking-widest text-white bg-white/5 hover:bg-white/10 rounded border border-white/10 transition-colors w-full">
                          <Upload className="w-2.5 h-2.5" /> Upload
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Section Save Footer */}
              <div className="border-t border-white/5 pt-6 flex justify-end">
                <SaveButton tab="home" onClick={saveHome} />
              </div>
            </div>
          )}

          {/* ===== TAB 2: QUEM SOMOS ===== */}
          {activeTab === 'about' && (
            <div className="space-y-6">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h3 className="font-serif-luxury text-lg tracking-widest uppercase text-white mb-1">2. Quem Somos</h3>
                  <p className="text-xs text-neutral-400">Informações institucionais sobre Rai Viana e a empresa.</p>
                </div>
                <SaveButton tab="about" onClick={saveAbout} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-8 space-y-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-[#a3a3a3] block mb-2 font-mono">Texto Institucional</label>
                    <textarea value={aboutText} onChange={(e) => setAboutText(e.target.value)} rows={8}
                      className="w-full bg-[#181818] border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-white transition-colors resize-none font-sans" />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-[#a3a3a3] block mb-2 font-mono">Nome Exibido</label>
                    <input type="text" value={aboutOwnerName} onChange={(e) => setAboutOwnerName(e.target.value)} placeholder="Ex: Rai Viana"
                      className="w-full bg-[#181818] border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-white transition-colors" />
                  </div>
                </div>

                <div className="md:col-span-4 space-y-4 border-l border-white/5 pl-0 md:pl-6">
                  <label className="text-[10px] uppercase tracking-widest text-[#a3a3a3] block mb-2 font-mono">Foto do Proprietário</label>
                  <div className="aspect-[3/4] w-full rounded-xl overflow-hidden bg-neutral-900 border border-white/10">
                    {aboutPhoto
                      ? <img src={aboutPhoto} alt="Foto" className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-xs text-neutral-600">Sem Foto</div>
                    }
                  </div>
                  <input type="file" accept="image/*" id="owner-photo-upload" className="hidden"
                    onChange={(e) => handleImageUpload(e, setAboutPhoto)} />
                  <label htmlFor="owner-photo-upload"
                    className="cursor-pointer w-full text-center inline-block px-3 py-2 border border-white/10 rounded text-[10px] uppercase tracking-widest text-white hover:bg-white/5 transition-colors">
                    <Upload className="w-3.5 h-3.5 inline mr-1" /> Alterar Foto
                  </label>
                </div>
              </div>

              <div className="border-t border-white/5 pt-6 flex justify-end">
                <SaveButton tab="about" onClick={saveAbout} />
              </div>
            </div>
          )}

          {/* ===== TAB 3: PORTFÓLIO ===== */}
          {activeTab === 'portfolio' && (
            <div className="space-y-6">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h3 className="font-serif-luxury text-lg tracking-widest uppercase text-white mb-1">3. Portfólio</h3>
                  <p className="text-xs text-neutral-400">Adicione e gerencie projetos concluídos e em andamento.</p>
                </div>
                <SaveButton tab="portfolio" onClick={savePortfolio} />
              </div>

              {/* Add project form */}
              <form onSubmit={handleAddProject} className="p-5 rounded-xl border border-white/10 bg-[#161616] space-y-4">
                <h4 className="text-xs uppercase tracking-widest font-bold text-white flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-emerald-500" /> Adicionar Novo Projeto
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-5">
                    <label className="text-[9px] uppercase tracking-widest text-[#a3a3a3] block mb-1 font-mono">Título</label>
                    <input type="text" value={newProject.title}
                      onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                      placeholder="Ex: Villa Sintra" className="w-full bg-[#202020] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-white transition-colors" />
                  </div>
                  <div className="md:col-span-3">
                    <label className="text-[9px] uppercase tracking-widest text-[#a3a3a3] block mb-1 font-mono">Categoria</label>
                    <select value={newProject.category}
                      onChange={(e) => setNewProject({ ...newProject, category: e.target.value as 'completed' | 'ongoing' })}
                      className="w-full bg-[#202020] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-white transition-colors">
                      <option value="completed">Concluído ✔</option>
                      <option value="ongoing">Em Andamento 🔧</option>
                    </select>
                  </div>
                  <div className="md:col-span-4">
                    <label className="text-[9px] uppercase tracking-widest text-[#a3a3a3] block mb-1 font-mono">Imagem</label>
                    <input type="file" accept="image/*" id="new-project-image" className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) { const b = await fileToBase64(file); setNewProject({ ...newProject, image: b }); }
                      }} />
                    <label htmlFor="new-project-image"
                      className="cursor-pointer flex items-center justify-center gap-1.5 px-3 py-2 bg-[#2a2a2a] border border-white/10 rounded text-[9px] uppercase tracking-widest text-neutral-300 hover:bg-neutral-800 transition-colors w-full">
                      <Upload className="w-3 h-3" /> Upload Imagem
                    </label>
                  </div>
                </div>
                <div>
                  <label className="text-[9px] uppercase tracking-widest text-[#a3a3a3] block mb-1 font-mono">Descrição</label>
                  <textarea value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    placeholder="Descreva o trabalho realizado." rows={2}
                    className="w-full bg-[#202020] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-white transition-colors resize-none" />
                </div>
                {newProject.image && (
                  <div className="flex items-center gap-3">
                    <img src={newProject.image} alt="Preview" className="w-16 h-12 object-cover rounded border border-white/10" />
                    <span className="text-[9px] text-[#a3a3a3]">Imagem carregada</span>
                  </div>
                )}
                <button type="submit"
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs uppercase tracking-widest font-bold transition-colors cursor-pointer">
                  + Adicionar Projeto
                </button>
              </form>

              {/* Current Projects */}
              <div className="border-t border-white/5 pt-6">
                <h4 className="text-[10px] uppercase tracking-widest text-[#a3a3a3] mb-4 font-mono">Projetos Atuais ({portfolioList.length})</h4>
                <div className="space-y-3">
                  {portfolioList.map((project) => (
                    <div key={project.id} className="flex items-center justify-between p-3 bg-[#181818] rounded-lg border border-white/5 hover:border-white/10 transition-colors">
                      <div className="flex items-center gap-3">
                        <img src={project.image} alt={project.title} className="w-14 h-11 object-cover rounded bg-neutral-900" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-white">{project.title}</span>
                            <span className={`text-[8px] uppercase tracking-widest px-1.5 py-0.5 rounded font-mono font-bold ${project.category === 'completed' ? 'bg-neutral-800 text-neutral-300' : 'bg-orange-500/20 text-orange-300'
                              }`}>
                              {project.category === 'completed' ? 'Concluído' : 'Em progresso'}
                            </span>
                          </div>
                          <p className="text-[10px] text-neutral-400 truncate max-w-[280px] sm:max-w-[450px]">{project.description || 'Sem descrição'}</p>
                        </div>
                      </div>
                      <button onClick={() => handleDeleteProject(project.id)}
                        className="p-2 text-[#a3a3a3] hover:text-red-400 transition-colors" title="Remover">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-white/5 pt-6 flex justify-end">
                <SaveButton tab="portfolio" onClick={savePortfolio} />
              </div>
            </div>
          )}

          {/* ===== TAB 4: CONTATOS ===== */}
          {activeTab === 'contact' && (
            <div className="space-y-6">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h3 className="font-serif-luxury text-lg tracking-widest uppercase text-white mb-1">4. Contatos</h3>
                  <p className="text-xs text-neutral-400">Atualize os canais de contato do seu negócio.</p>
                </div>
                <SaveButton tab="contact" onClick={saveContact} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-[#a3a3a3] block mb-2 font-mono">Telefone</label>
                  <input type="text" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full bg-[#181818] border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-white transition-colors" />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-[#a3a3a3] block mb-2 font-mono">Email Comercial</label>
                  <input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full bg-[#181818] border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-white transition-colors" />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-[#a3a3a3] block mb-2 font-mono">Link WhatsApp</label>
                  <input type="text" value={contactWhatsapp} onChange={(e) => setContactWhatsapp(e.target.value)}
                    className="w-full bg-[#181818] border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-white transition-colors" />
                  <p className="text-[9px] text-neutral-500 mt-1">Ex: https://wa.me/351926075952</p>
                </div>
              </div>

              {/* Live Preview */}
              <div className="border border-white/5 rounded-xl p-5 bg-[#161616]">
                <h4 className="text-[10px] uppercase tracking-widest text-[#a3a3a3] mb-3 font-mono">Preview em Tempo Real</h4>
                <div className="flex flex-wrap gap-6 text-sm">
                  <div className="flex items-center gap-2 text-white/70">
                    <Phone className="w-4 h-4 text-white" />
                    <span className="text-white font-mono text-xs">{contactPhone || '—'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/70">
                    <span className="text-[10px] uppercase text-neutral-400 font-mono">Email:</span>
                    <span className="text-white font-mono text-xs">{contactEmail || '—'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/70">
                    <span className="text-[10px] uppercase text-neutral-400 font-mono">WhatsApp:</span>
                    <span className="text-white font-mono text-xs truncate max-w-[200px]">{contactWhatsapp || '—'}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/5 pt-6 flex justify-end">
                <SaveButton tab="contact" onClick={saveContact} />
              </div>
            </div>
          )}

          {/* ===== TAB 5: MÚSICA ===== */}
          {activeTab === 'music' && (
            <div className="space-y-6">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h3 className="font-serif-luxury text-lg tracking-widest uppercase text-white mb-1">5. Música / Áudio</h3>
                  <p className="text-xs text-neutral-400">Até 3 faixas na playlist flutuante. Upload de áudio ou link direto.</p>
                </div>
                <SaveButton tab="music" onClick={saveMusic} />
              </div>

              <div className="space-y-6">
                {songDrafts.map((song, idx) => (
                  <div key={song.id} className="p-4 rounded-xl border border-white/10 bg-[#161616] space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono tracking-widest text-white uppercase bg-white/5 border border-white/10 px-2 py-0.5 rounded">
                        FAIXA {idx + 1}
                      </span>
                      <span className="text-[9px] font-mono text-neutral-500">
                        {song.url ? (song.url.startsWith('data:') ? '✔ Arquivo Local' : '✔ Link Web') : '— Vazia'}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[9px] uppercase tracking-widest text-[#a3a3a3] block mb-1 font-mono">Título</label>
                        <input type="text" value={song.title}
                          onChange={(e) => { const u = [...songDrafts]; u[idx].title = e.target.value; setSongDrafts(u); }}
                          className="w-full bg-[#202020] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-white transition-colors" />
                      </div>
                      <div>
                        <label className="text-[9px] uppercase tracking-widest text-[#a3a3a3] block mb-1 font-mono">Artista / Álbum</label>
                        <input type="text" value={song.artist}
                          onChange={(e) => { const u = [...songDrafts]; u[idx].artist = e.target.value; setSongDrafts(u); }}
                          className="w-full bg-[#202020] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-white transition-colors" />
                      </div>
                    </div>
                    <div>
                      <label className="text-[9px] uppercase tracking-widest text-[#a3a3a3] block mb-1 font-mono">Link de áudio ou Upload</label>
                      <input type="text" value={song.url}
                        onChange={(e) => { const u = [...songDrafts]; u[idx].url = e.target.value; setSongDrafts(u); }}
                        placeholder="https://site.com/musica.mp3 ou https://site.com/musica.wav"
                        className="w-full bg-[#202020] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-white transition-colors font-mono mb-2" />
                      <div className="flex items-center gap-3">
                        <input type="file" accept="audio/*" id={`audio-upload-${idx}`} className="hidden"
                          onChange={(e) => handleAudioUpload(e, idx)} />
                        <label htmlFor={`audio-upload-${idx}`}
                          className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#2a2a2a] border border-white/10 rounded text-[9px] uppercase tracking-widest text-neutral-300 hover:bg-neutral-800 transition-colors">
                          <Upload className="w-3 h-3" /> Upload de Áudio
                        </label>
                        {song.url && (
                          <button onClick={() => { const u = [...songDrafts]; u[idx].url = ''; setSongDrafts(u); }}
                            className="text-[9px] uppercase tracking-widest text-red-400 hover:text-red-300">
                            Apagar Trilha
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/5 pt-6 flex justify-end">
                <SaveButton tab="music" onClick={saveMusic} />
              </div>
            </div>
          )}

          {/* ===== TAB 6: MEDIA / IMAGENS ===== */}
          {activeTab === 'media' && (
            <div className="space-y-6">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h3 className="font-serif-luxury text-lg tracking-widest uppercase text-white mb-1">6. Media / Imagens</h3>
                  <p className="text-xs text-neutral-400">Biblioteca global de imagens reutilizáveis no site.</p>
                </div>
                <SaveButton tab="media" onClick={saveMedia} />
              </div>

              <div className="p-5 rounded-xl border border-white/10 bg-[#161616]">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs uppercase tracking-widest font-bold text-white">Carregar Nova Imagem</h4>
                    <p className="text-[10px] text-neutral-400 mt-1">Salva localmente na biblioteca para uso em todo o site.</p>
                  </div>
                  <div>
                    <input type="file" accept="image/*" id="general-image-upload" className="hidden" onChange={handleAddGeneralImage} />
                    <label htmlFor="general-image-upload"
                      className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2.5 bg-white text-black rounded text-xs uppercase tracking-widest font-bold hover:bg-neutral-200 active:scale-95 transition-all">
                      <Upload className="w-3.5 h-3.5" /> Upload Imagem
                    </label>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/5 pt-6">
                <h4 className="text-[10px] uppercase tracking-widest text-[#a3a3a3] mb-4 font-mono">
                  Biblioteca ({mediaLibrary.length} itens)
                </h4>
                {mediaLibrary.length === 0 ? (
                  <p className="text-xs text-neutral-500 italic text-center py-10">Biblioteca vazia. Faça upload de imagens acima.</p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
                    {mediaLibrary.map((img, idx) => (
                      <div key={idx} className="group relative aspect-square rounded-lg overflow-hidden bg-neutral-900 border border-white/10 hover:border-white/30 transition-colors">
                        <img src={img} alt={`Lib ${idx}`} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                          <span className="text-[8px] font-mono text-neutral-400">#{idx + 1}</span>
                          <div className="space-y-1">
                            <button onClick={() => { navigator.clipboard.writeText(img); alert('URL copiada!'); }}
                              className="w-full py-1 text-[8px] uppercase tracking-widest bg-white text-black rounded font-bold hover:bg-neutral-200 text-center">
                              Copiar URL
                            </button>
                            <button onClick={() => { if (window.confirm('Remover?')) setMediaLibrary(prev => prev.filter((_, i) => i !== idx)); }}
                              className="w-full py-1 text-[8px] uppercase tracking-widest bg-red-950 text-red-300 rounded font-bold hover:bg-red-900 text-center">
                              Excluir
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="border-t border-white/5 pt-6 flex justify-end">
                <SaveButton tab="media" onClick={saveMedia} />
              </div>
            </div>
          )}

          {/* ===== TAB 7: MENSAGENS ===== */}
          {activeTab === 'messages' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-serif-luxury text-lg tracking-widest uppercase text-white mb-1">Leads / Mensagens</h3>
                <p className="text-xs text-neutral-400">Mensagens e orçamentos enviados pelo formulário de contato.</p>
              </div>

              {messages.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-white/10 rounded-xl bg-white/5">
                  <p className="text-xs uppercase tracking-widest text-[#a3a3a3]">Nenhuma mensagem recebida ainda.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg: any) => (
                    <div key={msg.id} className="p-5 rounded-xl border border-white/10 bg-[#161616] space-y-3 relative group">
                      <button onClick={() => handleDeleteMessage(msg.id)}
                        className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                        <div>
                          <span className="text-[10px] text-neutral-500 font-mono">{msg.date}</span>
                          <h4 className="text-xs uppercase tracking-widest text-white font-bold">{msg.name}</h4>
                        </div>
                        <a href={`mailto:${msg.email}`} className="text-xs text-neutral-300 hover:text-white underline truncate">{msg.email}</a>
                      </div>
                      <p className="text-xs text-neutral-400 bg-[#202020] p-3 rounded-lg leading-relaxed">{msg.message}</p>
                      <a href={`mailto:${msg.email}?subject=Contato RV Pinturas`}
                        className="inline-flex items-center gap-1 text-[9px] uppercase tracking-widest text-neutral-300 hover:text-white border border-white/15 px-3 py-1 rounded hover:bg-white/5">
                        Responder por E-mail
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Panel Footer */}
          <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between text-[10px] tracking-widest text-neutral-500 font-mono">
            <span>© RV PINTURAS CMS • Todas as alterações salvas localmente</span>
            <button onClick={onClose} className="text-white hover:underline uppercase">← Voltar ao site</button>
          </div>
        </main>
      </div>
    </div>
  );
}
