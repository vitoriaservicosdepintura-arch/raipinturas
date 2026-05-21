export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  category: 'completed' | 'ongoing';
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  url: string;
}

export type LogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type LogoPosition = 'top-left' | 'top-center' | 'top-right' | 'center-left' | 'center' | 'center-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';

export interface SiteConfig {
  heroTitle: string;
  heroSubtitle: string;
  heroLogoText: string;
  heroLogoUrl: string; // Base64 or image link
  heroLogoSize: LogoSize;
  navLogoSize?: LogoSize;
  theme?: 'dark' | 'light';
  heroLogoPosition: LogoPosition;
  heroVideoUrl: string;
  sliderImages: string[];
  aboutText: string;
  aboutPhoto: string;
  aboutOwnerName: string;
  contactPhone: string;
  contactEmail: string;
  contactWhatsapp: string;
  portfolio: Project[];
  songs: Song[];
  mediaLibrary: string[];
}

const DEFAULT_PORTFOLIO: Project[] = [
  {
    id: 'p1',
    title: 'Villa Premium Cascais',
    description: 'Pintura exterior de alto padrão com isolamento térmico e acabamento fosco ultra-durável.',
    image: 'https://images.pexels.com/photos/8146318/pexels-photo-8146318.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
    category: 'completed'
  },
  {
    id: 'p2',
    title: 'Cobertura Minimalista Estoril',
    description: 'Pintura interna em tons frios de cinza e branco premium com efeitos de iluminação integrados.',
    image: 'https://images.pexels.com/photos/6312361/pexels-photo-6312361.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
    category: 'completed'
  },
  {
    id: 'p3',
    title: 'Galeria de Arte e Hall Lisboa',
    description: 'Acabamentos acetinados de luxo em superfícies de gesso acartonado e tetos decorativos.',
    image: 'https://images.pexels.com/photos/10779198/pexels-photo-10779198.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
    category: 'completed'
  },
  {
    id: 'p4',
    title: 'Penthouse Parque das Nações',
    description: 'Aplicação de microcimento decorativo e texturas de concreto aparente nas paredes principais.',
    image: 'https://images.pexels.com/photos/6587820/pexels-photo-6587820.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
    category: 'ongoing'
  },
  {
    id: 'p5',
    title: 'Mansão Rústica Moderna Sintra',
    description: 'Pintura com cal mineral e restauração de paredes históricas integradas com design minimalista.',
    image: 'https://images.pexels.com/photos/7195732/pexels-photo-7195732.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
    category: 'ongoing'
  }
];

const DEFAULT_SONGS: Song[] = [
  {
    id: 's1',
    title: 'Ambient Dreamscape',
    artist: 'RV Ambient Collection',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
  },
  {
    id: 's2',
    title: 'Minimalist Lounge',
    artist: 'Cold White Beats',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
  },
  {
    id: 's3',
    title: 'Premium Spaces',
    artist: 'Acoustic Relax',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3'
  }
];

const DEFAULT_SLIDER_IMAGES = [
  'https://images.pexels.com/photos/8146318/pexels-photo-8146318.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  'https://images.pexels.com/photos/6312361/pexels-photo-6312361.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  'https://images.pexels.com/photos/6580413/pexels-photo-6580413.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  'https://images.pexels.com/photos/6538888/pexels-photo-6538888.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200'
];

const DEFAULT_MEDIA_LIBRARY = [
  'https://images.pexels.com/photos/8146318/pexels-photo-8146318.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  'https://images.pexels.com/photos/6312361/pexels-photo-6312361.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  'https://images.pexels.com/photos/6580413/pexels-photo-6580413.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  'https://images.pexels.com/photos/6538888/pexels-photo-6538888.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  'https://images.pexels.com/photos/10779198/pexels-photo-10779198.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  'https://images.pexels.com/photos/6587820/pexels-photo-6587820.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  'https://images.pexels.com/photos/7195732/pexels-photo-7195732.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  'https://images.pexels.com/photos/7218683/pexels-photo-7218683.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  'https://images.pexels.com/photos/8481711/pexels-photo-8481711.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  'https://images.pexels.com/photos/7217976/pexels-photo-7217976.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  'https://images.pexels.com/photos/532220/pexels-photo-532220.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800'
];

export const INITIAL_SITE_CONFIG: SiteConfig = {
  heroTitle: 'RV PINTURAS & PAINTING',
  heroSubtitle: 'Dreams come true',
  heroLogoText: 'RV PINTURAS & PAINTING',
  heroLogoUrl: '', // Default uses beautiful minimalist text/svg logo
  heroLogoSize: 'md',
  navLogoSize: 'md',
  theme: 'dark',
  heroLogoPosition: 'center',
  heroVideoUrl: 'https://videos.pexels.com/video-files/17211925/17211925-hd_1920_1080_30fps.mp4',
  sliderImages: DEFAULT_SLIDER_IMAGES,
  aboutText: 'Com anos de experiência e sede em Portugal, a RV Pinturas & Painting redefine o conceito de pintura residencial premium. Sob a liderança do proprietário Rai Viana, nossa equipe executa cada projeto como uma obra de arte única. Combinamos técnicas tradicionais com as tecnologias mais modernas de revestimento e acabamento para entregar superfícies perfeitas, duráveis e com estética luxuosa. Deixe-nos transformar o seu lar no espaço dos seus sonhos com precisão milimétrica e acabamento sofisticado.',
  aboutPhoto: 'https://images.pexels.com/photos/532220/pexels-photo-532220.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800',
  aboutOwnerName: 'Rai Viana',
  contactPhone: '(+351) 926 075 952',
  contactEmail: 'Raisantosviana00@gmail.com',
  contactWhatsapp: 'https://wa.me/351926075952',
  portfolio: DEFAULT_PORTFOLIO,
  songs: DEFAULT_SONGS,
  mediaLibrary: DEFAULT_MEDIA_LIBRARY
};

const STORAGE_KEY = 'rv_pinturas_site_config';

export function getSiteConfig(): SiteConfig {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SITE_CONFIG));
      return INITIAL_SITE_CONFIG;
    }
    const parsed = JSON.parse(data);

    // Ensure all fields exist to prevent runtime issues
    return {
      ...INITIAL_SITE_CONFIG,
      ...parsed,
      portfolio: parsed.portfolio || DEFAULT_PORTFOLIO,
      songs: parsed.songs || DEFAULT_SONGS,
      mediaLibrary: parsed.mediaLibrary || DEFAULT_MEDIA_LIBRARY,
      sliderImages: parsed.sliderImages || DEFAULT_SLIDER_IMAGES,
      heroLogoSize: parsed.heroLogoSize || 'md',
      navLogoSize: parsed.navLogoSize || 'md',
      theme: parsed.theme || 'dark',
      heroLogoPosition: parsed.heroLogoPosition || 'center',
    };
  } catch (error) {
    console.error('Error loading config from localStorage:', error);
    return INITIAL_SITE_CONFIG;
  }
}

export function saveSiteConfig(config: SiteConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    // Dispatch custom event to notify all components of changes
    window.dispatchEvent(new Event('site_config_updated'));
  } catch (error) {
    console.error('Error saving config to localStorage:', error);
  }
}

export function resetSiteConfig(): SiteConfig {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SITE_CONFIG));
    window.dispatchEvent(new Event('site_config_updated'));
    return INITIAL_SITE_CONFIG;
  } catch (error) {
    console.error('Error resetting config:', error);
    return INITIAL_SITE_CONFIG;
  }
}
