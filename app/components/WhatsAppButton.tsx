export default function WhatsAppButton() {
  const waLink =
    "https://wa.me/6281298319944?text=Halo+Ladi+Consulting%2C+saya+ingin+konsultasi+infrastruktur+digital+untuk+bisnis+saya.";

  return (
    <aside aria-label="Kanal WhatsApp Langsung" className="fixed bottom-6 right-6 z-40">
      <a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#fa824b] hover:bg-[#e5723b] text-white font-bold text-xs uppercase tracking-wider shadow-xl shadow-[#fa824b]/30 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
      >
        <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
        <span>Chat Konsultan</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 17L17 7M17 7H7M17 7V17" />
        </svg>
      </a>
    </aside>
  );
}
