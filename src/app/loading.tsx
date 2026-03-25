export default function Loading() {
  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Hero skeleton */}
      <div className="h-[75vh] skeleton" />

      {/* Rows skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {[1, 2, 3].map(i => (
          <div key={i}>
            <div className="skeleton h-7 w-48 rounded-xl mb-4" />
            <div className="flex gap-3 overflow-hidden">
              {[1, 2, 3, 4, 5, 6].map(j => (
                <div key={j} className="flex-shrink-0 w-44">
                  <div className="skeleton rounded-xl h-60 mb-2" />
                  <div className="skeleton h-4 rounded mb-1" />
                  <div className="skeleton h-3 rounded w-2/3" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
