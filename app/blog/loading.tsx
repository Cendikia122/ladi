export default function BlogLoading() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a]">
      {/* Header Hero */}
      <div className="bg-[#0f172a] text-white py-16 lg:py-24 border-b border-slate-800 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center space-y-4">
          <div className="h-4 w-32 rounded-full skeleton-shimmer-dark" />
          <div className="h-10 sm:h-12 w-3/4 rounded-2xl skeleton-shimmer-dark" />
          <div className="h-4 w-1/2 rounded-full skeleton-shimmer-dark opacity-75" />
        </div>
      </div>

      {/* Blog Cards Grid Skeleton */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Thumbnail */}
                <div className="aspect-[16/9] w-full skeleton-shimmer" />

                {/* Content */}
                <div className="p-7 space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="h-3 w-20 rounded-full skeleton-shimmer" />
                    <div className="h-3 w-16 rounded-full skeleton-shimmer" />
                  </div>
                  <div className="h-6 w-11/12 rounded-lg skeleton-shimmer" />
                  <div className="space-y-2 pt-1">
                    <div className="h-3.5 w-full rounded skeleton-shimmer" />
                    <div className="h-3.5 w-4/5 rounded skeleton-shimmer" />
                  </div>
                </div>
              </div>

              {/* Read button */}
              <div className="p-7 pt-0 border-t border-slate-100 mt-4">
                <div className="h-4 w-28 rounded skeleton-shimmer" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
