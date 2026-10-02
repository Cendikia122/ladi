export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a]">
      {/* Admin Top Header Skeleton */}
      <div className="bg-[#0f172a] h-16 border-b border-slate-800 px-4 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-24 h-7 rounded-lg skeleton-shimmer-dark" />
          <div className="h-5 w-32 rounded-full skeleton-shimmer-dark hidden sm:block" />
        </div>
        <div className="flex items-center gap-4">
          <div className="h-4 w-28 rounded skeleton-shimmer-dark" />
          <div className="h-8 w-24 rounded-full skeleton-shimmer-dark" />
        </div>
      </div>

      {/* Main Admin Content Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-8">
        {/* Status bar */}
        <div className="h-14 rounded-2xl bg-white border border-slate-200 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full skeleton-shimmer" />
            <div className="h-4 w-64 rounded skeleton-shimmer" />
          </div>
          <div className="h-4 w-32 rounded skeleton-shimmer" />
        </div>

        {/* Title & Action Buttons */}
        <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="h-8 w-72 rounded-xl skeleton-shimmer" />
            <div className="h-4 w-96 rounded skeleton-shimmer" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-32 rounded-full skeleton-shimmer" />
            <div className="h-10 w-32 rounded-full skeleton-shimmer" />
            <div className="h-10 w-32 rounded-full skeleton-shimmer" />
          </div>
        </div>

        {/* Metric Cards Grid (3 cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-7 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4"
            >
              <div className="flex justify-between items-center">
                <div className="h-4 w-28 rounded skeleton-shimmer" />
                <div className="w-8 h-8 rounded-xl skeleton-shimmer" />
              </div>
              <div className="h-10 w-20 rounded-xl skeleton-shimmer" />
              <div className="h-3 w-40 rounded skeleton-shimmer" />
            </div>
          ))}
        </div>

        {/* Table Container Skeleton */}
        <div className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
          <div className="flex justify-between items-center pb-4 border-b border-slate-100">
            <div className="h-6 w-48 rounded-lg skeleton-shimmer" />
            <div className="h-8 w-24 rounded-full skeleton-shimmer" />
          </div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((row) => (
              <div
                key={row}
                className="h-14 rounded-xl bg-[#f8fafc] border border-slate-100 flex items-center justify-between px-4"
              >
                <div className="h-4 w-60 rounded skeleton-shimmer" />
                <div className="h-4 w-28 rounded skeleton-shimmer" />
                <div className="h-4 w-20 rounded-full skeleton-shimmer" />
                <div className="h-8 w-24 rounded-lg skeleton-shimmer" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
