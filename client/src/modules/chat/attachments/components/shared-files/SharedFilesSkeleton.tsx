const SharedFilesSkeleton = () => (
  <div className="space-y-2">
    {[0, 1, 2].map((item) => (
      <div key={item} className="flex animate-pulse items-center gap-3 rounded-md p-2">
        <div className="size-10 rounded bg-slate-200" />
        <div className="min-w-0 flex-1">
          <div className="mb-2 h-3 w-3/4 rounded bg-slate-200" />
          <div className="h-2 w-1/2 rounded bg-slate-100" />
        </div>
      </div>
    ))}
  </div>
)

export default SharedFilesSkeleton
