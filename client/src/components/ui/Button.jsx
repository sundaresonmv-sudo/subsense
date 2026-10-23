import LoadingSpinner from './LoadingSpinner';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  loading = false,
  onClick,
  className = '',
  icon = null,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none select-none';

  const variantStyles = {
    primary:
      'bg-cyan-500 text-slate-950 hover:bg-cyan-400 focus:ring-cyan-400 shadow-lg shadow-cyan-500/20 active:scale-[0.98]',
    secondary:
      'bg-slate-800 text-slate-100 hover:bg-slate-700 hover:text-white border border-slate-700/80 focus:ring-slate-400 active:scale-[0.98]',
    outline:
      'bg-transparent text-slate-200 border border-slate-700 hover:border-slate-500 hover:bg-slate-800/60 focus:ring-slate-400 active:scale-[0.98]',
    danger:
      'bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20 hover:border-rose-500/50 focus:ring-rose-500 active:scale-[0.98]',
    ghost:
      'bg-transparent text-slate-300 hover:text-white hover:bg-slate-800/50 focus:ring-slate-500 active:scale-[0.98]',
  };

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-5 py-3 gap-2.5 font-semibold',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant] || variantStyles.primary} ${
        sizeStyles[size] || sizeStyles.md
      } ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <LoadingSpinner size="sm" className={variant === 'primary' ? 'border-t-slate-950' : 'border-t-cyan-400'} />
          <span>{children}</span>
        </>
      ) : (
        <>
          {icon && <span className="shrink-0">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;
