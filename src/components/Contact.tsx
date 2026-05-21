import { useState } from 'react';
import { Mail, Phone, MessageSquare, Send, Check } from 'lucide-react';

interface ContactProps {
  phone: string;
  email: string;
  whatsappUrl: string;
}

export default function Contact({ phone, email, whatsappUrl }: ContactProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const cleanPhone = phone.replace(/[^0-9+]/g, '');
  const activeWhatsappUrl = whatsappUrl || `https://wa.me/${cleanPhone.replace('+', '')}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      alert('Por favor, preencha todos os campos do formulário.');
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API request
    setTimeout(() => {
      // Save message mock in local storage
      try {
        const key = 'rv_messages';
        const existing = JSON.parse(localStorage.getItem(key) || '[]');
        const newMessage = {
          ...formData,
          id: Date.now().toString(),
          date: new Date().toLocaleDateString()
        };
        existing.push(newMessage);
        localStorage.setItem(key, JSON.stringify(existing));
      } catch (err) {
        console.error('Error saving message mockup:', err);
      }

      setIsSubmitting(false);
      setIsSent(true);
      setFormData({ name: '', email: '', message: '' });
      
      // Auto-reset sent checkmark after 4 seconds
      setTimeout(() => setIsSent(false), 4000);
    }, 1500);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <section 
      id="contact" 
      className="py-24 md:py-32 bg-[#0c0c0c] text-[#f3f4f6] relative overflow-hidden"
    >
      {/* Visual decorative circles */}
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-white/[0.01] rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-stretch">
          
          {/* Left Column: Direct Info */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#a3a3a3] font-semibold">
                Inicie Seu Projeto
              </span>
              <h2 className="text-3xl md:text-5xl font-light tracking-wider mt-2 mb-6 font-serif-luxury text-white">
                CONTATO
              </h2>
              <p className="text-xs md:text-sm text-neutral-400 font-light leading-relaxed font-sans max-w-sm mb-10">
                Atendemos toda a região de Portugal com foco em sofisticação residencial. Peça um orçamento sem compromisso e veja a diferença.
              </p>

              {/* Direct Channels */}
              <div className="space-y-6">
                
                {/* Telephone */}
                <a
                  href={`tel:${cleanPhone}`}
                  className="flex items-center gap-4 p-4 rounded-xl bg-[#111111] hover:bg-[#1a1a1a] border border-white/5 hover:border-white/15 transition-all group"
                >
                  <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-white group-hover:bg-white group-hover:text-black transition-all">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-widest text-[#a3a3a3] font-mono">Telefone</span>
                    <p className="text-sm font-semibold tracking-wider text-white mt-0.5 font-sans">
                      {phone || '(+351) 926 075 952'}
                    </p>
                  </div>
                </a>

                {/* Email */}
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-4 p-4 rounded-xl bg-[#111111] hover:bg-[#1a1a1a] border border-white/5 hover:border-white/15 transition-all group"
                >
                  <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-white group-hover:bg-white group-hover:text-black transition-all">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-widest text-[#a3a3a3] font-mono">E-mail Comercial</span>
                    <p className="text-sm font-semibold tracking-wider text-white mt-0.5 font-sans truncate max-w-[220px] sm:max-w-none">
                      {email || 'Raisantosviana00@gmail.com'}
                    </p>
                  </div>
                </a>

                {/* WhatsApp Callout */}
                <a
                  href={activeWhatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl bg-emerald-950/20 hover:bg-emerald-950/45 border border-emerald-900/30 hover:border-emerald-900/60 transition-all group"
                >
                  <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-emerald-600/10 border border-emerald-500/25 text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-widest text-emerald-400 font-mono">Conversar no WhatsApp</span>
                    <p className="text-sm font-semibold tracking-wider text-white mt-0.5 font-sans">
                      Iniciar Chat Imediato
                    </p>
                  </div>
                </a>

              </div>
            </div>

            {/* Footer Note */}
            <div className="mt-12 text-[10px] tracking-widest text-neutral-500 uppercase font-mono">
              Lisboa, Cascais, Sintra e Região • Portugal
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="p-8 md:p-10 rounded-2xl bg-[#111111] border border-white/5 h-full flex flex-col justify-between">
              <div>
                <h3 className="font-serif-luxury text-lg font-bold tracking-widest uppercase mb-6 text-white">
                  ENVIAR MENSAGEM
                </h3>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Input */}
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-[#a3a3a3] block mb-2 font-mono">
                      Seu Nome
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Ex: João Silva"
                      className="w-full bg-[#181818] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-white transition-colors font-sans"
                    />
                  </div>

                  {/* Email Input */}
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-[#a3a3a3] block mb-2 font-mono">
                      E-mail de Contato
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="Ex: joao@gmail.com"
                      className="w-full bg-[#181818] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-white transition-colors font-sans"
                    />
                  </div>

                  {/* Message Input */}
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-[#a3a3a3] block mb-2 font-mono">
                      Detalhes do Projeto
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={5}
                      placeholder="Descreva o serviço de pintura (ex: pintura interior de moradia de 3 quartos...)"
                      className="w-full bg-[#181818] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-white transition-colors font-sans resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting || isSent}
                    className={`w-full py-4 px-6 rounded-lg text-xs uppercase tracking-widest font-bold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                      isSent
                        ? 'bg-emerald-600 text-white border border-emerald-500'
                        : isSubmitting
                        ? 'bg-neutral-800 text-neutral-400 border border-neutral-700 cursor-not-allowed'
                        : 'bg-white text-black hover:bg-neutral-200 border border-transparent active:scale-98'
                    }`}
                  >
                    {isSent ? (
                      <>
                        <Check className="w-4 h-4" /> Mensagem Enviada com Sucesso!
                      </>
                    ) : isSubmitting ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-neutral-400 border-t-white rounded-full animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" /> Enviar Mensagem
                      </>
                    )}
                  </button>

                </form>
              </div>

              {/* Form security note */}
              <p className="text-[10px] text-neutral-600 font-sans text-center mt-6">
                * Seus dados estão seguros e serão utilizados exclusivamente para elaboração do seu orçamento.
              </p>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
