interface SharedFilesHeaderProps {
  count: number
}

const SharedFilesHeader = ({ count }: SharedFilesHeaderProps) => (
  <div className="mb-3 flex items-center justify-between">
    <h4 className="text-sm font-semibold text-slate-900">Files</h4>
    <span className="text-xs font-medium text-slate-500">{count}</span>
  </div>
)

export default SharedFilesHeader
