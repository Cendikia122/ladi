export default function Stats() {
  const metrics = [
    {
      id: "01",
      value: "<1.0s",
      label: "Kecepatan Global",
      detail: "Arsitektur static edge dengan waktu muat sub-detik di 300+ titik CDN internasional.",
    },
    {
      id: "02",
      value: "100%",
      label: "Kedaulatan Aset",
      detail: "Kepemilikan mutlak atas domain, kode sumber, dan data tanpa sistem sewa terkunci.",
    },
    {
      id: "03",
      value: "10 / 10",
      label: "Validasi Semantik",
      detail: "Kepatuhan penuh pada Google Knowledge Graph, Schema.org, dan protokol Core Web Vitals.",
    },
    {
      id: "04",
      value: "0 Lock-In",
      label: "Kemandirian Ekosistem",
      detail: "Infrastruktur terbuka yang tidak bergantung pada algoritma acak media sosial atau marketplace.",
    },
  ];

  return (
    <section id="infrastruktur" className="border-y border-white/[0.08] bg-[#08090a]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 md:py-28">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 divide-white/[0.08] sm:divide-x sm:divide-y-0 -mx-4 sm:mx-0">
          {metrics.map((item) => (
            <div key={item.id} className="px-6 py-6 sm:py-0 first:pl-0 last:pr-0">
              <div className="font-mono text-[11px] text-zinc-500 mb-4 tracking-wider">
                [{item.id} // PARAMETER]
              </div>
              <div className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2">
                {item.value}
              </div>
              <div className="text-sm font-medium text-zinc-200 mb-2">
                {item.label}
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {item.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
