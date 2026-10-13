import LadiLogo from "@/app/components/LadiLogo";

export default function AdminLoginLoading() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-4 px-4">
        <div className="flex justify-center opacity-80">
          <LadiLogo inverted={true} />
        </div>
        <div className="bg-white/5 border border-white/10 p-8 rounded-3xl space-y-4 backdrop-blur-sm">
          <div className="w-8 h-8 border-2 border-white/80 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-slate-300 font-medium tracking-wide">
            Memuat portal login Ladi...
          </p>
        </div>
      </div>
    </div>
  );
}
