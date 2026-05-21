import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Clock, Eye, Layers } from 'lucide-react';
import { Project } from '../utils/db';

interface PortfolioProps {
  projects: Project[];
}

export default function Portfolio({ projects }: PortfolioProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'completed' | 'ongoing'>('all');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const completedProjects = projects.filter((p) => p.category === 'completed');
  const ongoingProjects = projects.filter((p) => p.category === 'ongoing');

  const filteredProjects = projects.filter((p) => {
    if (activeTab === 'completed') return p.category === 'completed';
    if (activeTab === 'ongoing') return p.category === 'ongoing';
    return true;
  });

  return (
    <section 
      id="portfolio" 
      className="py-24 bg-[#0c0c0c] border-b border-white/5 relative"
    >
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#a3a3a3] font-semibold">
              Nosso Acervo de Projetos
            </span>
            <h2 className="text-3xl md:text-5xl font-light tracking-wider mt-2 font-serif-luxury text-white">
              PORTFÓLIO
            </h2>
          </div>

          {/* Luxury Tab Switcher */}
          <div className="flex bg-[#111111] p-1.5 rounded-lg border border-white/10 select-none">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs uppercase tracking-widest rounded transition-all duration-300 focus:outline-none ${
                activeTab === 'all'
                  ? 'bg-white text-black font-semibold shadow-md'
                  : 'text-[#a3a3a3] hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" /> Todos ({projects.length})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs uppercase tracking-widest rounded transition-all duration-300 focus:outline-none ${
                activeTab === 'completed'
                  ? 'bg-white text-black font-semibold shadow-md'
                  : 'text-[#a3a3a3] hover:text-white'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Concluídos ({completedProjects.length})
            </button>
            <button
              onClick={() => setActiveTab('ongoing')}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs uppercase tracking-widest rounded transition-all duration-300 focus:outline-none ${
                activeTab === 'ongoing'
                  ? 'bg-white text-black font-semibold shadow-md'
                  : 'text-[#a3a3a3] hover:text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5" /> Em Andamento ({ongoingProjects.length})
            </button>
          </div>
        </div>

        {/* Dynamic Project Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl bg-white/5">
            <p className="text-xs uppercase tracking-widest text-[#a3a3a3]">
              Nenhum projeto cadastrado nesta categoria.
            </p>
          </div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project) => {
                const isCompleted = project.category === 'completed';

                return (
                  <motion.div
                    layout
                    key={project.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5 }}
                    className="group relative flex flex-col justify-between rounded-xl overflow-hidden bg-[#111111] border border-white/5 shadow-lg hover:border-white/20 transition-all duration-300"
                  >
                    {/* Project Image */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-900">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-15">
                        <button
                          onClick={() => setSelectedImage(project.image)}
                          className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest bg-white text-black px-4 py-2 rounded-full font-semibold hover:bg-neutral-200 transition-all active:scale-95"
                        >
                          <Eye className="w-3.5 h-3.5" /> Ampliar Imagem
                        </button>
                      </div>

                      {/* Category Badge */}
                      <div className="absolute top-4 left-4 z-20">
                        {isCompleted ? (
                          <span className="flex items-center gap-1 bg-white/10 backdrop-blur-md text-[9px] uppercase tracking-widest font-semibold px-2.5 py-1 rounded-full border border-white/20 text-[#f3f4f6]">
                            ✔ Concluído
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 bg-orange-500/20 backdrop-blur-md text-[9px] uppercase tracking-widest font-semibold px-2.5 py-1 rounded-full border border-orange-500/30 text-orange-300 animate-pulse">
                            🔧 Em progresso
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Description Details Card */}
                    <div className="p-6">
                      <h3 className="font-serif-luxury text-sm font-bold tracking-wider text-white uppercase truncate">
                        {project.title}
                      </h3>
                      {project.description ? (
                        <p className="text-xs text-[#a3a3a3] mt-2 leading-relaxed font-sans font-light line-clamp-3">
                          {project.description}
                        </p>
                      ) : (
                        <p className="text-xs text-[#525252] mt-2 italic font-sans font-light">
                          Nenhuma descrição disponível.
                        </p>
                      )}
                    </div>

                    {/* Card Footer Detail */}
                    <div className="px-6 pb-6 pt-3 border-t border-white/[0.03] flex items-center justify-between text-[9px] tracking-widest text-[#a3a3a3] uppercase font-mono">
                      <span>RV PINTURAS</span>
                      <span className={isCompleted ? 'text-neutral-500' : 'text-orange-400'}>
                        {isCompleted ? '100% PRONTO' : 'EM REFORMA'}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}

      </div>

      {/* Lightbox Modal (Expand Image) */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 bg-black/95 z-55 flex items-center justify-center p-4 cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-5xl max-h-[85vh] overflow-hidden rounded-xl border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage}
                alt="Enlarged Project Preview"
                className="max-w-full max-h-[85vh] object-contain rounded-xl"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 bg-black/70 hover:bg-black text-white p-2 rounded-full border border-white/10 text-xs font-mono tracking-widest"
              >
                ✕ Fechar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
