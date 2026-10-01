export default function LadiLogo({
  inverted = false,
  showTagline = true,
}: {
  inverted?: boolean;
  showTagline?: boolean;
}) {
  return (
    <div className="flex items-center gap-2.5 select-none">
      {/* Brand Monogram Icon */}
      <div className="w-8 h-8 rounded-lg bg-[#1853a7] flex items-center justify-center relative shadow-sm">
        <span className="text-white font-extrabold text-base leading-none">L</span>
        {/* Signature Orange Dot */}
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#fa824b] border-2 border-white" />
      </div>

      <div className="flex flex-col">
        <div className="flex items-baseline font-extrabold text-2xl tracking-tight leading-none">
          <span className={inverted ? "text-white" : "text-[#1853a7]"}>Lad</span>
          <span className="relative inline-block">
            {/* The stem of "i" without dot */}
            <span className={inverted ? "text-white" : "text-[#1853a7]"}>ı</span>
            {/* The signature orange dot on the 'i' */}
            <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#fa824b]" />
          </span>
        </div>
        {showTagline && (
          <span className={`text-[10px] font-semibold tracking-wider uppercase mt-0.5 ${
            inverted ? "text-slate-400" : "text-slate-500"
          }`}>
            Consulting
          </span>
        )}
      </div>
    </div>
  );
}
