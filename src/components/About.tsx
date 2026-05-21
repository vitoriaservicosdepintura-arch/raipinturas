import { motion } from 'framer-motion';
import { Award, ShieldCheck, Sparkles } from 'lucide-react';

interface AboutProps {
  text: string;
  photoUrl: string;
  ownerName: string;
}

export default function About({ text, photoUrl, ownerName }: AboutProps) {
  // Pre-load backup defaults
  const activePhoto = photoUrl || 'https://images.pexels.com/photos/532220/pexels-photo-532220.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800';
  const activeOwnerName = ownerName || 'Rai Viana';

  return (
    <section 
      id="about" 
      className="py-24 md:py-32 bg-[#0c0c0c] border-b border-white/5 relative overflow-hidden"
    >
      {/* Background radial highlight */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-white/[0.01] rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Split Layout Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          
          {/* Left Column: Owner Portrait (Meio Corpo) */}
          <div className="lg:col-span-5 flex justify-center">
            <motion.div 
              className="relative w-full max-w-[380px] sm:max-w-[420px]"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 1.0, ease: 'easeOut' }}
            >
              {/* Outer Minimalist Border Line Offset */}
              <div className="absolute -top-4 -left-4 w-full h-full border border-white/10 rounded-2xl pointer-events-none translate-x-2 translate-y-2 transition-transform duration-500 group-hover:translate-x-0 group-hover:translate-y-0" />
              
              {/* Portrait Frame */}
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 bg-[#161616] group shadow-2xl">
                <img
                  src={activePhoto}
                  alt={`Proprietário ${activeOwnerName}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                
                {/* Cold gradient overlay on picture */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                
                {/* Bottom label */}
                <div className="absolute bottom-6 left-6 right-6 p-4 glass-panel rounded-lg border border-white/10">
                  <span className="text-[9px] uppercase tracking-[0.25em] text-[#a3a3a3] font-semibold block">
                    Fundador & Diretor Geral
                  </span>
                  <h4 className="font-serif-luxury text-sm font-bold text-white tracking-widest uppercase mt-0.5">
                    {activeOwnerName}
                  </h4>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Institutional Text */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 1.0, ease: 'easeOut', delay: 0.1 }}
            >
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#a3a3a3] font-bold">
                Tradição & Excelência
              </span>
              <h2 className="text-3xl md:text-5xl font-light tracking-wider mt-2 mb-8 font-serif-luxury text-white">
                QUEM SOMOS
              </h2>

              {/* Edit-ready rich content */}
              <div className="text-sm md:text-base text-neutral-300 leading-relaxed font-light space-y-6 font-sans">
                {text.split('\n').map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>

              {/* Signature quote layout */}
              <div className="mt-8 border-l border-white/20 pl-4 py-1 italic text-neutral-400 text-xs tracking-wider">
                "Nosso compromisso é entregar não apenas cores, mas a realização visual do seu lar. A pintura de luxo reside nos detalhes imperceptíveis."
              </div>

              {/* Core Corporate Strengths Cards */}
              <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-white/5">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded bg-white/5 border border-white/10 text-white mt-0.5">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-widest text-white font-semibold">Garantia Total</h4>
                    <p className="text-[10px] text-[#a3a3a3] mt-1 leading-normal font-sans">Durabilidade e resistência nos revestimentos.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded bg-white/5 border border-white/10 text-white mt-0.5">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-widest text-white font-semibold">Acabamento Fino</h4>
                    <p className="text-[10px] text-[#a3a3a3] mt-1 leading-normal font-sans">Atenção cirúrgica aos cantos e molduras.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded bg-white/5 border border-white/10 text-white mt-0.5">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-widest text-white font-semibold">Material Premium</h4>
                    <p className="text-[10px] text-[#a3a3a3] mt-1 leading-normal font-sans">Tintas ecológicas e compostos importados.</p>
                  </div>
                </div>
              </div>

            </motion.div>
          </div>

        </div>

      </div>
    </section>
  );
}
