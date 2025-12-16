import { create } from 'zustand';

export type NotificationType = 'info' | 'success' | 'warning' | 'error';
export type NotificationCategory = 'users' | 'system' | 'security' | 'financial' | 'tickets';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  category: NotificationCategory;
  read: boolean;
  timestamp: Date;
  showToast?: boolean;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  preferences: Record<NotificationCategory, boolean>;
  addNotification: (notification: Omit<Notification, 'id' | 'read' | 'timestamp'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  hideToast: (id: string) => void;
  clearAll: () => void;
  togglePreference: (category: NotificationCategory) => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [
    {
      id: '1',
      title: 'Bem-vindo!',
      message: 'O sistema de notificações está ativo.',
      type: 'success',
      category: 'system',
      read: false,
      timestamp: new Date(),
      showToast: false,
    },
    {
      id: '2',
      title: 'Manutenção',
      message: 'O sistema passará por manutenção às 22h.',
      type: 'warning',
      category: 'system',
      read: false,
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      showToast: false,
    }
  ],
  unreadCount: 2,
  preferences: {
    users: true,
    system: true,
    security: true,
    financial: true,
    tickets: true,
  },
  addNotification: (data) => {
    const { preferences } = get();
    // Only add if category is enabled in preferences
    if (preferences[data.category]) {
      set((state) => {
        const newNotification: Notification = {
          id: Math.random().toString(36).substring(7),
          ...data,
          read: false,
          timestamp: new Date(),
          showToast: true, // Show toast by default for new notifications
        };
        return {
          notifications: [newNotification, ...state.notifications],
          unreadCount: state.unreadCount + 1,
        };
      });
    }
  },
  markAsRead: (id) =>
    set((state) => {
      const newNotifications = state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      );
      return {
        notifications: newNotifications,
        unreadCount: newNotifications.filter((n) => !n.read).length,
      };
    }),
  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    })),
  removeNotification: (id) =>
    set((state) => {
      const newNotifications = state.notifications.filter((n) => n.id !== id);
      return {
        notifications: newNotifications,
        unreadCount: newNotifications.filter((n) => !n.read).length,
      };
    }),
  hideToast: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, showToast: false } : n
      ),
    })),
  clearAll: () => set({ notifications: [], unreadCount: 0 }),
  togglePreference: (category) =>
    set((state) => ({
      preferences: {
        ...state.preferences,
        [category]: !state.preferences[category],
      },
    })),
}));
