"use client";

import { useNotificationStore, Notification } from "../../store/notificationStore";
import { useEffect } from "react";
import { X, CheckCircle, AlertTriangle, AlertOctagon, Info } from "lucide-react";

export function ToastContainer() {
  const { notifications, hideToast } = useNotificationStore();
  const toasts = notifications.filter((n) => n.showToast);

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-emerald-400" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      case 'error': return <AlertOctagon className="w-5 h-5 text-red-400" />;
      default: return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  const getBorderColor = (type: Notification['type']) => {
    switch (type) {
      case 'success': return 'border-emerald-500/50 bg-emerald-500/10';
      case 'warning': return 'border-amber-500/50 bg-amber-500/10';
      case 'error': return 'border-red-500/50 bg-red-500/10';
      default: return 'border-blue-500/50 bg-blue-500/10';
    }
  };

  return (
    <div className="fixed top-20 right-6 z-[60] flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem 
          key={toast.id} 
          toast={toast} 
          onClose={() => hideToast(toast.id)} 
          getIcon={getIcon}
          getBorderColor={getBorderColor}
        />
      ))}
    </div>
  );
}

function ToastItem({ 
  toast, 
  onClose, 
  getIcon, 
  getBorderColor 
}: { 
  toast: Notification; 
  onClose: () => void;
  getIcon: (type: Notification['type']) => React.ReactNode;
  getBorderColor: (type: Notification['type']) => string;
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // Auto hide after 5 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div 
      className={`
        pointer-events-auto w-80 md:w-96 p-4 rounded-xl border backdrop-blur-md shadow-xl 
        flex gap-3 items-start animate-in slide-in-from-right-full duration-300
        bg-slate-900/90 ${getBorderColor(toast.type)}
      `}
    >
      <div className="flex-shrink-0 mt-0.5">
        {getIcon(toast.type)}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-white mb-1">{toast.title}</h4>
        <p className="text-sm text-slate-300 leading-snug">{toast.message}</p>
      </div>
      <button 
        onClick={onClose}
        className="text-slate-400 hover:text-white transition-colors"
      >
        <X size={16} />
      </button>
    </div>
  );
}
