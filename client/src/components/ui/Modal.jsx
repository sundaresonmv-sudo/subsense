import { useEffect } from 'react';

const Modal = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog box */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        className={`relative w-full ${
          sizeClasses[size] || sizeClasses.md
        } rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl shadow-cyan-950/30 overflow-hidden transition-all duration-200 z-10`}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800/80 px-6 py-4">
          <div>
            {title && (
              <h3 id="modal-title" className="text-lg font-semibold text-white">
                {title}
              </h3>
            )}
            {description && <p className="mt-1 text-xs text-slate-400">{description}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            aria-label="Close dialog"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content body */}
        <div className="px-6 py-5 max-h-[75vh] overflow-y-auto">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 border-t border-slate-800/80 bg-slate-950/50 px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
