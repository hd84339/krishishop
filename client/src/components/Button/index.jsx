const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  ...props
}) => {
  const base = 'inline-flex items-center justify-center gap-2 font-body font-medium transition-all duration-300 rounded-full disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-primary-500 hover:bg-primary-400 text-white hover:shadow-lg hover:shadow-primary-500/30 hover:-translate-y-0.5 active:translate-y-0',
    outline: 'border border-primary-500/50 text-primary-400 hover:bg-primary-500 hover:text-white hover:border-primary-500',
    ghost: 'text-white/60 hover:text-white hover:bg-white/5',
    danger: 'bg-red-500 hover:bg-red-400 text-white hover:shadow-lg hover:shadow-red-500/30',
    earth: 'bg-earth-500 hover:bg-earth-400 text-white hover:shadow-lg hover:shadow-earth-500/30',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading && (
        <div className="w-4 h-4 rounded-full border-2 border-current/30 border-t-current animate-spin" />
      )}
      {children}
    </button>
  );
};

export default Button;
