const StatCard = ({
  title,
  value,
  subtitle,
  trend,
  icon,
  badge,
  color = 'cyan',
  className = '',
}) => {
  const colorMap = {
    cyan: {
      border: 'hover:border-cyan-500/40',
      iconBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      glow: 'group-hover:shadow-cyan-500/5',
    },
    emerald: {
      border: 'hover:border-emerald-500/40',
      iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      glow: 'group-hover:shadow-emerald-500/5',
    },
    violet: {
      border: 'hover:border-violet-500/40',
      iconBg: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
      glow: 'group-hover:shadow-violet-500/5',
    },
    amber: {
      border: 'hover:border-amber-500/40',
      iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      glow: 'group-hover:shadow-amber-500/5',
    },
    rose: {
      border: 'hover:border-rose-500/40',
      iconBg: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      glow: 'group-hover:shadow-rose-500/5',
    },
  };

  const scheme = colorMap[color] || colorMap.cyan;

  return (
    <div
      className={`group relative overflow-hidden rounded-xl border border-slate-800/80 bg-slate-900/90 p-5 shadow-lg shadow-black/40 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 ${scheme.border} ${scheme.glow} ${className}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-white">{value}</p>
        </div>
        {icon && (
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${scheme.iconBg} shadow-inner`}
          >
            {icon}
          </div>
        )}
      </div>

      {(subtitle || trend || badge) && (
        <div className="mt-4 flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/60 text-xs">
          {trend && (
            <span
              className={`inline-flex items-center gap-1 font-medium ${
                trend.positive ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              <svg
                className={`h-3.5 w-3.5 ${trend.positive ? '' : 'rotate-180'}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              {trend.value}
            </span>
          )}
          {trend?.label && <span className="text-slate-400">{trend.label}</span>}
          {subtitle && !trend && <span className="text-slate-400">{subtitle}</span>}
          {badge && (
            <span className="ml-auto rounded-full bg-slate-800 px-2 py-0.5 text-[11px] font-medium text-slate-300 border border-slate-700/60">
              {badge}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default StatCard;
