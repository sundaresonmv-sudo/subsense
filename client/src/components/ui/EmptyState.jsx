const EmptyState = ({
  title = 'No records found',
  description = 'Get started by creating your first item.',
  icon = null,
  actionButton = null,
  className = '',
}) => {
  return (
    <div
      className={`flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-8 text-center backdrop-blur-sm ${className}`}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-800 bg-slate-950 text-slate-400 shadow-inner">
        {icon || (
          <svg className="h-7 w-7 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        )}
      </div>

      <h3 className="mt-4 text-base font-semibold text-white">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-slate-400">{description}</p>

      {actionButton && <div className="mt-6">{actionButton}</div>}
    </div>
  );
};

export default EmptyState;
