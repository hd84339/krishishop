const Loader = ({ fullScreen = false, size = 'md' }) => {
  const sizes = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-2',
    lg: 'w-16 h-16 border-3',
  };

  const spinner = (
    <div className={`${sizes[size]} rounded-full border-primary-500/30 border-t-primary-500 animate-spin`} />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-dark/90 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="flex flex-col items-center gap-4">
          {spinner}
          <p className="font-body text-white/50 text-sm animate-pulse">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      {spinner}
    </div>
  );
};

export default Loader;
