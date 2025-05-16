import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '../services/api';
import type { Notification } from '../types';

export function useNotifications() {
  const queryClient = useQueryClient();

  const { data: allNotifications, isLoading } = useQuery<Notification[]>({
    queryKey: ['notifications'],
    queryFn: async () => {
      const { data } = await notifications.list();
      return data;
    },
  });

  const { data: unreadCount } = useQuery<{ count: number }>({
    queryKey: ['notifications', 'unread', 'count'],
    queryFn: async () => {
      const { data } = await notifications.getUnreadCount();
      return data;
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (id: number) => {
      await notifications.markAsRead(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread', 'count'] });
    },
  });

  const markAsDeliveredMutation = useMutation({
    mutationFn: async (id: number) => {
      await notifications.markAsDelivered(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: async (id: number) => {
      await notifications.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread', 'count'] });
    },
  });

  return {
    notifications: allNotifications || [],
    unreadCount: unreadCount?.count || 0,
    isLoading,
    markAsRead: markAsReadMutation.mutate,
    markAsDelivered: markAsDeliveredMutation.mutate,
    deleteNotification: deleteNotificationMutation.mutate,
  };
} 