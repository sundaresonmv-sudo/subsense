const ErrorMessage = ({
  message,
  title = '',
  onDismiss = null,
  variant = 'error',
  className = '',
}) => {
  if (!message) return null;

  const variantStyles = {
    error: {
      bg: 'bg-rose-500/10 border-rose-500/30 text-rose-200',
      icon: (
        <svg className="h-5 w-5 text-rose-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      ),
    },
    warning: {
      bg: 'bg-amber-500/10 border-amber-500/30 text-amber-200',
      icon: (
        <svg className="h-5 w-5 text-amber-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      ),
    },
    info: {
      bg: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-200',
      icon: (
        <svg className="h-5 w-5 text-cyan-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    success: {
      bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200',
      icon: (
        <svg className="h-5 w-5 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
    },
  };

  const current = variantStyles[variant] || variantStyles.error;

  return (
    <div
      role="alert"
      className={`flex items-start gap-3 rounded-xl border p-4 text-sm backdrop-blur-sm ${current.bg} ${className}`}
    >
      {current.icon}
      <div className="flex-1">
        {title && <p className="font-semibold text-white">{title}</p>}
        <p className={title ? 'mt-0.5 text-xs' : ''}>{message}</p>
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="rounded-lg p-1 opacity-70 hover:opacity-100 hover:bg-slate-800/40 transition-opacity"
          aria-label="Dismiss alert"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
