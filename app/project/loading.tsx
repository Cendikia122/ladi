export default function ProjectLoading() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a]">
      {/* Top Header Placeholder */}
      <div className="bg-[#0f172a] text-white py-16 lg:py-24 border-b border-slate-800 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center space-y-4">
          <div className="h-4 w-32 rounded-full skeleton-shimmer-dark" />
          <div className="h-10 sm:h-12 w-3/4 rounded-2xl skeleton-shimmer-dark" />
          <div className="h-4 w-2/3 rounded-full skeleton-shimmer-dark opacity-75" />
        </div>
      </div>

      {/* Case Studies Skeleton List */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-12">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="p-6 sm:p-10 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-8 overflow-hidden"
          >
            {/* Header row */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl skeleton-shimmer shrink-0" />
                <div className="space-y-2">
                  <div className="h-7 w-64 rounded-xl skeleton-shimmer" />
                  <div className="h-4 w-40 rounded-md skeleton-shimmer" />
                </div>
              </div>
              <div className="h-9 w-36 rounded-full skeleton-shimmer hidden sm:block" />
            </div>

            {/* Banner preview */}
            <div className="aspect-[21/9] sm:aspect-[24/9] w-full rounded-2xl skeleton-shimmer" />

            {/* 3 boxes: Problem, Solution, Impact */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-[#f8fafc] border border-slate-200/80 space-y-3">
                <div className="h-3.5 w-24 rounded skeleton-shimmer" />
                <div className="h-3 w-full rounded skeleton-shimmer" />
                <div className="h-3 w-4/5 rounded skeleton-shimmer" />
              </div>

              <div className="p-6 rounded-2xl bg-[#f8fafc] border border-slate-200/80 space-y-3">
                <div className="h-3.5 w-24 rounded skeleton-shimmer" />
                <div className="h-3 w-full rounded skeleton-shimmer" />
                <div className="h-3 w-4/5 rounded skeleton-shimmer" />
              </div>

              <div className="p-6 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-3">
                <div className="h-3.5 w-24 rounded skeleton-shimmer" />
                <div className="h-4 w-full rounded skeleton-shimmer" />
              </div>
            </div>

            {/* Bottom action bar */}
            <div className="pt-4 flex items-center justify-between border-t border-slate-100">
              <div className="h-4 w-48 rounded skeleton-shimmer" />
              <div className="h-10 w-44 rounded-full skeleton-shimmer" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
