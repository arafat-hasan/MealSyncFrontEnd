import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mealEvents } from '../services/api';
import type { MealEvent } from '../types';
import dayjs from 'dayjs';

export function useMealEvents(startDate?: string, endDate?: string) {
  const queryClient = useQueryClient();
  const today = dayjs();
  const defaultStartDate = startDate || today.format('YYYY-MM-DD');
  const defaultEndDate = endDate || today.add(30, 'day').format('YYYY-MM-DD');

  const { data: events, isLoading } = useQuery<MealEvent[]>({
    queryKey: ['mealEvents', defaultStartDate, defaultEndDate],
    queryFn: async () => {
      const { data } = await mealEvents.list(defaultStartDate, defaultEndDate);
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (eventData: Partial<MealEvent>) => {
      const { data } = await mealEvents.create(eventData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mealEvents'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<MealEvent> }) => {
      const response = await mealEvents.update(id, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mealEvents'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await mealEvents.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mealEvents'] });
    },
  });

  const getEventById = async (id: number) => {
    const { data } = await mealEvents.get(id);
    return data;
  };

  return {
    events: events || [],
    isLoading,
    createEvent: createMutation.mutate,
    updateEvent: updateMutation.mutate,
    deleteEvent: deleteMutation.mutate,
    getEventById,
  };
} 