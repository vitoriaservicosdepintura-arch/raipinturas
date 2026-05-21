import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SliderProps {
  images: string[];
}

export default function Slider({ images }: SliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Fallback if images array is empty or has less than 4 items
  const activeImages = images.length > 0 ? images : [
    'https://images.pexels.com/photos/8146318/pexels-photo-8146318.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
    'https://images.pexels.com/photos/6312361/pexels-photo-6312361.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
    'https://images.pexels.com/photos/6580413/pexels-photo-6580413.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
    'https://images.pexels.com/photos/6538888/pexels-photo-6538888.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200'
  ];

  // Auto-play effect
  useEffect(() => {
    if (isHovered) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeImages.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [activeImages.length, isHovered]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeImages.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + activeImages.length) % activeImages.length);
  };

  // Titles or subtitles corresponding to each slide index to make it look highly tailored
  const slideTitles = [
    { num: 'I', title: 'RESIDÊNCIAS URBANAS', subtitle: 'Sofisticação e acabamento ultra fosco' },
    { num: 'II', title: 'LUXURY CONDOS', subtitle: 'Harmonia cromática e texturas suaves' },
    { num: 'III', title: 'DETALHES QUE ENCATAM', subtitle: 'Paredes decorativas e alto brilho' },
    { num: 'IV', title: 'RENOVAÇÃO COMPLETA', subtitle: 'Precisão e elegância atemporal' }
  ];

  return (
    <section 
      id="slider-section"
      className="py-24 bg-[#0c0c0c] border-b border-white/5 relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#a3a3a3] font-semibold">
              Inspiração & Espaços
            </span>
            <h2 className="text-3xl md:text-5xl font-light tracking-wider mt-2 font-serif-luxury text-white">
              PINTURA RESIDENCIAL
            </h2>
          </div>
          <p className="text-xs text-[#a3a3a3] uppercase tracking-[0.2em] font-light max-w-sm">
            Exploração visual de texturas finas e coberturas arquitetônicas premium.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative h-[450px] md:h-[600px] w-full bg-[#111111] overflow-hidden rounded-2xl border border-white/10 group">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 w-full h-full"
            >
              {/* Image */}
              <img
                src={activeImages[currentIndex]}
                alt={`Premium Painting Showcase ${currentIndex + 1}`}
                className="w-full h-full object-cover select-none"
                loading="lazy"
              />
              {/* Radial gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20" />
            </motion.div>
          </AnimatePresence>

          {/* Absolute content inside slide */}
          <div className="absolute bottom-10 left-10 right-10 z-20 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="text-white max-w-lg">
              <span className="text-xs font-serif-luxury tracking-[0.3em] text-neutral-400 font-medium block mb-2">
                EXPOSIÇÃO {slideTitles[currentIndex % slideTitles.length]?.num || (currentIndex + 1)}
              </span>
              <h3 className="text-2xl md:text-4xl font-serif-luxury tracking-widest uppercase font-bold text-white leading-tight">
                {slideTitles[currentIndex % slideTitles.length]?.title || 'DESIGN DE INTERIOR'}
              </h3>
              <p className="text-xs md:text-sm tracking-wider text-neutral-300 font-light mt-1 font-sans">
                {slideTitles[currentIndex % slideTitles.length]?.subtitle || 'Trabalho residencial executado com maestria.'}
              </p>
            </div>

            {/* Slider navigation dots */}
            <div className="flex gap-2">
              {activeImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === currentIndex ? 'w-8 bg-white' : 'w-2 bg-white/30 hover:bg-white/60'
                  }`}
                  aria-label={`Ir para o slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Left Arrow */}
          <button
            onClick={handlePrev}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 flex items-center justify-center rounded-full bg-black/45 border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/85 active:scale-95 focus:outline-none"
            aria-label="Slide anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={handleNext}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 flex items-center justify-center rounded-full bg-black/45 border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/85 active:scale-95 focus:outline-none"
            aria-label="Próximo slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Slide progress counter */}
          <div className="absolute top-6 right-6 z-30 bg-black/55 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-[10px] tracking-widest text-neutral-300 font-mono">
            {currentIndex + 1} / {activeImages.length}
          </div>
        </div>

        {/* Small detail text */}
        <div className="mt-6 flex justify-between text-[10px] tracking-widest text-[#a3a3a3] uppercase font-light">
          <span>PORTUGAL RESIDENCES</span>
          <span>© RV PINTURAS & PAINTING</span>
        </div>
      </div>
    </section>
  );
}
