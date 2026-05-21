interface FloatWhatsappProps {
  phone: string;
}

export default function FloatWhatsapp({ phone }: FloatWhatsappProps) {
  // Clean phone number for URL
  const cleanPhone = phone.replace(/[^0-9+]/g, '');
  const whatsappUrl = `https://wa.me/${cleanPhone.replace('+', '')}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 group focus:outline-none focus:ring-2 focus:ring-emerald-400"
      aria-label="Fale Conosco no WhatsApp"
    >
      {/* Outer pulsing ring */}
      <span className="absolute inset-0 rounded-full bg-emerald-600/30 animate-ping group-hover:animate-none"></span>
      
      {/* WhatsApp Custom SVG or elegant Lucide icon */}
      <svg
        className="w-7 h-7 text-white fill-current transition-transform duration-300 group-hover:rotate-12"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.97-1.861-1.868-4.339-2.897-6.97-2.898-5.442 0-9.866 4.372-9.87 9.802 0 1.73.46 3.42 1.332 4.927l-.995 3.635 3.704-.95zm11.232-7.795c-.3-.15-1.77-.875-2.045-.975-.276-.1-.476-.15-.676.15-.2.3-.775.975-.95 1.174-.175.2-.35.225-.65.075-.3-.15-1.265-.467-2.41-1.485-.89-.795-1.49-1.777-1.665-2.078-.175-.3-.018-.462.13-.61.135-.133.3-.35.45-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.676-1.628-.926-2.228-.244-.588-.492-.51-.676-.52-.175-.008-.375-.01-.575-.01-.2 0-.525.075-.8.375-.276.3-1.05 1.025-1.05 2.5s1.075 2.9 1.225 3.1c.15.2 2.11 3.22 5.116 4.52.716.31 1.275.495 1.708.633.72.23 1.375.197 1.892.12.576-.086 1.77-.724 2.02-1.425.25-.7.25-1.3 .175-1.425-.075-.125-.275-.2-.575-.35z" />
      </svg>
      
      {/* Hover tooltip */}
      <span className="absolute right-16 bg-[#161616] text-[#f3f4f6] text-xs font-medium px-3 py-1.5 rounded-lg border border-white/10 opacity-0 pointer-events-none transition-opacity duration-300 group-hover:opacity-100 whitespace-nowrap">
        WhatsApp Live
      </span>
    </a>
  );
}
