export default function EventsLoading() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a]">
      {/* Header Hero */}
      <div className="bg-[#0f172a] text-white py-16 lg:py-24 border-b border-slate-800 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center space-y-4">
          <div className="h-4 w-36 rounded-full skeleton-shimmer-dark" />
          <div className="h-10 sm:h-12 w-3/4 rounded-2xl skeleton-shimmer-dark" />
          <div className="h-4 w-2/3 rounded-full skeleton-shimmer-dark opacity-75" />
        </div>
      </div>

      {/* Events Grid Skeleton */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6 flex flex-col justify-between overflow-hidden"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="h-4 w-28 rounded-full skeleton-shimmer" />
                  <div className="h-3.5 w-16 rounded-full skeleton-shimmer" />
                </div>

                <div className="h-7 w-full rounded-xl skeleton-shimmer" />

                <div className="space-y-2 p-4 rounded-2xl bg-[#f8fafc] border border-slate-100">
                  <div className="h-3.5 w-3/4 rounded skeleton-shimmer" />
                  <div className="h-3.5 w-1/2 rounded skeleton-shimmer" />
                </div>

                <div className="space-y-2 pt-1">
                  <div className="h-3 w-full rounded skeleton-shimmer" />
                  <div className="h-3 w-4/5 rounded skeleton-shimmer" />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="h-4 w-24 rounded skeleton-shimmer" />
                <div className="h-9 w-28 rounded-full skeleton-shimmer" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
