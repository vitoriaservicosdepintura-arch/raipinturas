import { motion, useScroll, useTransform } from 'framer-motion';
import { Play } from 'lucide-react';
import { useRef } from 'react';
import type { LogoSize, LogoPosition } from '../utils/db';

interface HeroProps {
  title: string;
  subtitle: string;
  logoText: string;
  logoUrl?: string;
  logoSize?: LogoSize;
  logoPosition?: LogoPosition;
  videoUrl: string;
  onScrollToNext: () => void;
}

// Map size key → pixel dimensions for the logo container
const LOGO_SIZE_MAP: Record<LogoSize, string> = {
  xs: 'w-12 h-12',
  sm: 'w-16 h-16',
  md: 'w-24 h-24',
  lg: 'w-32 h-32',
  xl: 'w-44 h-44',
  '2xl': 'w-60 h-60',
};

// Map position → Tailwind absolute positioning classes (used when logo is floating, NOT inline)
// When position is 'center', the logo stays in the normal content flow.
// For all others, the logo is pulled out of flow and placed absolutely.
const POSITION_STYLE_MAP: Record<LogoPosition, React.CSSProperties> = {
  'top-left': { top: '6rem', left: '1.5rem' },
  'top-center': { top: '6rem', left: '50%', transform: 'translateX(-50%)' },
  'top-right': { top: '6rem', right: '1.5rem' },
  'center-left': { top: '50%', left: '1.5rem', transform: 'translateY(-50%)' },
  'center': {}, // inline – kept in content flow
  'center-right': { top: '50%', right: '1.5rem', transform: 'translateY(-50%)' },
  'bottom-left': { bottom: '6rem', left: '1.5rem' },
  'bottom-center': { bottom: '6rem', left: '50%', transform: 'translateX(-50%)' },
  'bottom-right': { bottom: '6rem', right: '1.5rem' },
};

export default function Hero({
  title,
  subtitle,
  logoText,
  logoUrl,
  logoSize = 'md',
  logoPosition = 'center',
  videoUrl,
  onScrollToNext,
}: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll();
  const yText = useTransform(scrollY, [0, 500], [0, 150]);
  const opacityText = useTransform(scrollY, [0, 500], [1, 0]);
  const scaleBg = useTransform(scrollY, [0, 800], [1, 1.15]);

  const sizeClass = LOGO_SIZE_MAP[logoSize] ?? LOGO_SIZE_MAP['md'];
  const isFloating = logoPosition !== 'center';
  const positionStyle = POSITION_STYLE_MAP[logoPosition] ?? {};

  // Logo element (shared between inline and floating)
  const LogoElement = () => (
    logoUrl ? (
      <div className={`hero-logo-wrapper p-3 bg-black/35 backdrop-blur-md rounded-xl border border-white/10 shadow-2xl flex items-center justify-center ${sizeClass}`}>
        <img
          src={logoUrl}
          alt={logoText || 'Logo'}
          className="w-full h-full object-contain"
          onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
        />
      </div>
    ) : (
      <div className={`hero-logo-wrapper ${sizeClass} rounded-full border border-white/20 bg-black/40 backdrop-blur-md flex items-center justify-center font-serif-luxury font-bold tracking-wider text-white shadow-2xl relative`}
        style={{ fontSize: `clamp(1rem, ${logoSize === 'xs' ? 1 : logoSize === 'sm' ? 1.25 : logoSize === 'md' ? 1.875 : logoSize === 'lg' ? 2.25 : logoSize === 'xl' ? 3 : 4}rem, 4rem)` }}
      >
        <span className="absolute inset-2 border border-white/5 rounded-full animate-pulse-slow" />
        RV
      </div>
    )
  );

  return (
    <section
      ref={containerRef}
      id="home"
      className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-[var(--site-bg)] text-[var(--site-text)]"
    >
      {/* Video Background */}
      <motion.div
        style={{ scale: scaleBg }}
        className="absolute inset-0 w-full h-full select-none pointer-events-none"
      >
        <div className="absolute inset-0 bg-black/60 z-10 hero-video-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] via-transparent to-black/40 z-10 hero-gradient-overlay" />
        <video
          autoPlay loop muted playsInline
          className="w-full h-full object-cover opacity-80 hero-video"
          src={videoUrl || 'https://videos.pexels.com/video-files/17211925/17211925-hd_1920_1080_30fps.mp4'}
        />
      </motion.div>

      {/* Decorative luxury guidelines */}
      <div className="absolute inset-0 z-10 pointer-events-none grid grid-cols-4 max-w-7xl mx-auto w-full px-6 opacity-10">
        <div className="border-l border-white h-full" />
        <div className="border-l border-white h-full" />
        <div className="border-l border-white h-full" />
        <div className="border-l border-white border-r h-full" />
      </div>

      {/* Floating Logo (when position != center) */}
      {isFloating && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 1.0, ease: 'easeOut' }}
          className="absolute z-30"
          style={positionStyle}
        >
          <LogoElement />
        </motion.div>
      )}

      {/* Foreground Content */}
      <motion.div
        style={{ y: yText, opacity: opacityText }}
        className="relative z-20 flex flex-col items-center justify-center text-center px-6 max-w-4xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      >
        {/* Inline Logo (center position only) */}
        {!isFloating && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 1.0, ease: 'easeOut' }}
            className="mb-8 flex justify-center"
          >
            <LogoElement />
          </motion.div>
        )}

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1.0 }}
          className="hero-title text-4xl sm:text-6xl md:text-7xl font-bold tracking-[0.25em] text-white font-serif-luxury uppercase drop-shadow-md select-none"
        >
          {title || 'RV PINTURAS & PAINTING'}
        </motion.h1>

        {/* Subtitle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1.2 }}
          className="mt-6 flex items-center gap-4 justify-center"
        >
          <div className="h-[1px] w-8 bg-white/30" />
          <p className="hero-subtitle text-sm sm:text-base md:text-lg tracking-[0.4em] uppercase text-neutral-300 font-light font-serif-luxury italic">
            "{subtitle || 'Dreams come true'}"
          </p>
          <div className="h-[1px] w-8 bg-white/30" />
        </motion.div>

        {/* Badges */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 1.0 }}
          className="mt-8 flex flex-wrap justify-center gap-3 text-[10px] sm:text-xs tracking-widest text-[#a3a3a3]"
        >
          <span className="border border-white/10 px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-sm">RESIDENCIAL</span>
          <span className="border border-white/10 px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-sm">INDUSTRIAL</span>
          <span className="border border-white/10 px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-sm">COMERCIAL</span>
          <span className="border border-white/10 px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-sm">DESIGN PREMIUM</span>
        </motion.div>
      </motion.div>

      {/* Audio hint */}
      <div className="absolute bottom-24 left-6 z-20 pointer-events-none hidden lg:flex items-center gap-3 text-[10px] tracking-widest text-neutral-400 animate-pulse">
        <Play className="w-3.5 h-3.5" /> OUÇA NOSSA TRILHA PREMIUM NO PLAYER ABAIXO
      </div>

      {/* Scroll Down */}
      <motion.button
        onClick={onScrollToNext}
        className="absolute bottom-10 z-20 flex flex-col items-center gap-2 group text-[#a3a3a3] hover:text-white transition-colors focus:outline-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1.0 }}
      >
        <span className="text-[10px] uppercase tracking-[0.3em] font-light">Scroll Down</span>
        <div className="w-6 h-10 border border-white/20 rounded-full flex justify-center p-1 group-hover:border-white transition-colors">
          <motion.div
            className="w-1 h-2 bg-white rounded-full"
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
        </div>
      </motion.button>
    </section>
  );
}
