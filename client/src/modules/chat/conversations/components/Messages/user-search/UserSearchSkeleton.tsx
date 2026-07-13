const SKELETON_ROWS = [0, 1, 2] as const

const UserSearchSkeleton = () => (
  <div className="space-y-2 px-2 py-3">
    {SKELETON_ROWS.map((item) => (
      <div key={item} className="flex animate-pulse items-center gap-3 rounded-md p-2">
        <div className="size-10 rounded-full bg-slate-200" />
        <div className="min-w-0 flex-1">
          <div className="mb-2 h-3 w-2/3 rounded bg-slate-200" />
          <div className="h-2 w-1/3 rounded bg-slate-100" />
        </div>
      </div>
    ))}
  </div>
)

export default UserSearchSkeleton
