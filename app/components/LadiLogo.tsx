import Image from "next/image";

export default function LadiLogo({
  inverted = false,
  showTagline = true,
  height = 36,
  className = "",
}: {
  inverted?: boolean;
  showTagline?: boolean;
  height?: number;
  className?: string;
}) {
  // Rasio aspek logo resmi 566 x 206 (~2.75 : 1)
  const width = Math.round(height * (566 / 206));
  const logoSrc = inverted ? "/logo-white.png" : "/logo.png";

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      <div className="relative shrink-0 flex items-center">
        <Image
          src={logoSrc}
          alt="Ladi (Layanan Digital)"
          width={width}
          height={height}
          priority
          className="object-contain h-auto"
          style={{ width: `${width}px`, height: `${height}px` }}
        />
      </div>

      {showTagline && (
        <span
          className={`hidden sm:inline-block font-mono text-[9px] font-bold tracking-widest uppercase pl-2.5 border-l ${
            inverted
              ? "text-slate-400 border-slate-700"
              : "text-slate-500 border-slate-300"
          }`}
        >
          Layanan Digital
        </span>
      )}
    </div>
  );
}
