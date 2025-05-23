
// Toast component
type ToastType = "success" | "error" | "warning" | "info";

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

function Toast({ message, type, onClose }: ToastProps) {
  const bgColor = {
    success: "bg-green-500/80",
    error: "bg-red-500/80",
    warning: "bg-yellow-500/80",
    info: "bg-blue-500/80",
  }[type];

  const Icon = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertCircle,
    info: Info,
  }[type];

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-4 right-4 ${bgColor} text-white px-4 py-3 rounded-lg shadow-lg backdrop-blur-sm flex items-center z-50 max-w-md animate-slide-in`}>
      <Icon size={20} className="mr-2 flex-shrink-0" />
      <p className="mr-6">{message}</p>
      <button 
        onClick={onClose} 
        className="absolute right-2 top-2 text-white/80 hover:text-white"
      >
        <X size={16} />
      </button>
    </div>
  );
}