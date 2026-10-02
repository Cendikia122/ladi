export default function RootLoading() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a]">
      {/* Skeleton Top Bar */}
      <div className="bg-[#0f172a] h-10 border-b border-slate-800 flex items-center justify-between px-4 sm:px-8">
        <div className="h-3 w-40 rounded-full skeleton-shimmer-dark opacity-60" />
        <div className="h-3 w-28 rounded-full skeleton-shimmer-dark opacity-60" />
      </div>

      {/* Skeleton Navbar */}
      <div className="bg-white/90 border-b border-slate-200/80 h-18 px-4 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl skeleton-shimmer" />
          <div className="h-5 w-24 rounded-lg skeleton-shimmer" />
        </div>
        <div className="hidden lg:flex items-center gap-6">
          <div className="h-4 w-16 rounded-md skeleton-shimmer" />
          <div className="h-4 w-20 rounded-md skeleton-shimmer" />
          <div className="h-4 w-20 rounded-md skeleton-shimmer" />
          <div className="h-4 w-16 rounded-md skeleton-shimmer" />
          <div className="h-4 w-16 rounded-md skeleton-shimmer" />
        </div>
        <div className="h-9 w-32 rounded-full skeleton-shimmer" />
      </div>

      {/* Skeleton Hero / Banner Section */}
      <div className="bg-[#0f172a] text-white py-20 px-4 sm:px-8 text-center space-y-5">
        <div className="max-w-3xl mx-auto space-y-4 flex flex-col items-center">
          <div className="h-4 w-36 rounded-full skeleton-shimmer-dark" />
          <div className="h-10 sm:h-12 w-3/4 rounded-2xl skeleton-shimmer-dark" />
          <div className="h-4 w-1/2 rounded-full skeleton-shimmer-dark opacity-80" />
        </div>
      </div>

      {/* Skeleton Content Grid Cards */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-5 overflow-hidden"
            >
              {/* Image thumbnail placeholder */}
              <div className="aspect-[16/9] w-full rounded-2xl skeleton-shimmer" />

              {/* Title & metadata */}
              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center">
                  <div className="h-3 w-20 rounded-full skeleton-shimmer" />
                  <div className="h-3 w-16 rounded-full skeleton-shimmer" />
                </div>
                <div className="h-6 w-5/6 rounded-lg skeleton-shimmer" />
                <div className="space-y-2">
                  <div className="h-3.5 w-full rounded skeleton-shimmer" />
                  <div className="h-3.5 w-4/5 rounded skeleton-shimmer" />
                </div>
              </div>

              {/* Action button */}
              <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                <div className="h-4 w-24 rounded-full skeleton-shimmer" />
                <div className="h-8 w-20 rounded-full skeleton-shimmer" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
