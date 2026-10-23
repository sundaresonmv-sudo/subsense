import { forwardRef } from 'react';

const Input = forwardRef(
  (
    {
      label,
      name,
      type = 'text',
      value,
      onChange,
      placeholder,
      required = false,
      error = '',
      helperText = '',
      disabled = false,
      icon = null,
      className = '',
      ...props
    },
    ref
  ) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={name} className="block text-xs font-medium uppercase tracking-wider text-slate-300">
            {label}
            {required && <span className="ml-1 text-cyan-400">*</span>}
          </label>
        )}
        <div className="relative rounded-lg">
          {icon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            className={`w-full rounded-lg border bg-slate-950/80 px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-60 ${
              icon ? 'pl-10' : ''
            } ${
              error
                ? 'border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/40'
                : 'border-slate-800 focus:border-cyan-500 focus:ring-cyan-500/40'
            } ${className}`}
            {...props}
          />
        </div>
        {error ? (
          <p className="text-xs text-rose-400">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-slate-400">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
