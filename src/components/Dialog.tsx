export const Dialog = ({ open, onClose, title, description, children }) => {
    if (!open) return null;
  
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />
        <div className="relative bg-gray-900 rounded-lg p-6 max-w-md w-full mx-4 space-y-4 border border-white/10">
          {title && <h2 className="text-xl font-semibold text-white">{title}</h2>}
          {description && <p className="text-gray-300">{description}</p>}
          {children}
        </div>
      </div>
    );
  };