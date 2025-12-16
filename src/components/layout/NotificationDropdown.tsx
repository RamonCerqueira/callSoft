"use client";

import { useNotificationStore, Notification } from "../../store/notificationStore";
import { Bell, Check, Trash2, X, Info, CheckCircle, AlertTriangle, AlertOctagon } from "lucide-react";
import { Button } from "../ui/button";
import { useEffect, useRef } from "react";

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationDropdown({ isOpen, onClose }: NotificationDropdownProps) {
  const { notifications, markAsRead, markAllAsRead, removeNotification, clearAll } = useNotificationStore();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-emerald-400" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      case 'error': return <AlertOctagon className="w-5 h-5 text-red-400" />;
      default: return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit'
    }).format(new Date(date));
  };

  return (
    <div 
      ref={dropdownRef}
      className="absolute top-16 right-6 w-80 md:w-96 bg-slate-900/95 border border-slate-700 rounded-xl shadow-2xl backdrop-blur-md z-50 overflow-hidden flex flex-col max-h-[80vh] animate-in fade-in zoom-in-95 duration-200"
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-700/50 flex items-center justify-between bg-slate-800/30">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-purple-400" />
          <h3 className="font-semibold text-white">Notificações</h3>
          <span className="bg-purple-500/20 text-purple-300 text-xs px-2 py-0.5 rounded-full border border-purple-500/30">
            {notifications.length}
          </span>
        </div>
        <div className="flex gap-1">
          {notifications.length > 0 && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={markAllAsRead}
              className="h-8 w-8 hover:bg-slate-700/50 text-slate-400 hover:text-white"
              title="Marcar todas como lidas"
            >
              <Check className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* List */}
      <div className="overflow-y-auto flex-1 custom-scrollbar">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center text-slate-500">
            <Bell className="w-12 h-12 mb-3 opacity-20" />
            <p className="text-sm">Nenhuma notificação no momento</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-700/30">
            {notifications.map((notification) => (
              <div 
                key={notification.id}
                className={`
                  p-4 transition-colors hover:bg-slate-800/40 relative group
                  ${!notification.read ? 'bg-purple-500/5' : ''}
                `}
              >
                <div className="flex gap-3">
                  <div className="mt-1 flex-shrink-0">
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <p className={`text-sm font-medium ${!notification.read ? 'text-white' : 'text-slate-300'}`}>
                        {notification.title}
                      </p>
                      <span className="text-[10px] text-slate-500 whitespace-nowrap ml-2">
                        {formatDate(notification.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 leading-snug line-clamp-2">
                      {notification.message}
                    </p>
                  </div>
                </div>

                {/* Actions overlay */}
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/80 p-1 rounded-lg backdrop-blur-sm">
                  {!notification.read && (
                    <button 
                      onClick={() => markAsRead(notification.id)}
                      className="p-1.5 hover:bg-emerald-500/20 text-slate-400 hover:text-emerald-400 rounded-md transition-colors"
                      title="Marcar como lida"
                    >
                      <Check size={14} />
                    </button>
                  )}
                  <button 
                    onClick={() => removeNotification(notification.id)}
                    className="p-1.5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-md transition-colors"
                    title="Remover"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="p-2 border-t border-slate-700/50 bg-slate-800/30">
          <Button 
            variant="ghost" 
            className="w-full h-8 text-xs text-slate-400 hover:text-red-400 hover:bg-red-500/10"
            onClick={clearAll}
          >
            Limpar todas as notificações
          </Button>
        </div>
      )}
    </div>
  );
}
