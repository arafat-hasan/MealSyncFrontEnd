import axios from 'axios';
import type { AuthResponse, User, MealEvent, MenuItem, MenuSet, MealRequest, MenuItemComment, Notification } from '../types';

const BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth API
export const auth = {
  login: (email: string, password: string) => 
    api.post<AuthResponse>('/login', { email, password }),
  
  register: (data: {
    email: string;
    password: string;
    name: string;
    username: string;
    department: string;
    employee_id: string;
  }) => api.post<{ user: User }>('/register', data),
  
  refreshToken: (refresh_token: string) =>
    api.post<AuthResponse>('/refresh', { refresh_token }),
};

// Meal Events API
export const mealEvents = {
  list: (startDate: string, endDate: string) =>
    api.get<MealEvent[]>('/meals', { params: { start_date: startDate, end_date: endDate } }),
  
  get: (id: number) => 
    api.get<MealEvent>(`/meals/${id}`),
  
  create: (data: Partial<MealEvent>) =>
    api.post<MealEvent>('/meals', data),
  
  update: (id: number, data: Partial<MealEvent>) =>
    api.put<MealEvent>(`/meals/${id}`, data),
  
  delete: (id: number) =>
    api.delete(`/meals/${id}`),
};

// Menu Items API
export const menuItems = {
  list: () => 
    api.get<MenuItem[]>('/menu-items'),
  
  get: (id: number) =>
    api.get<MenuItem>(`/menu-items/${id}`),
  
  create: (data: Partial<MenuItem>) =>
    api.post<MenuItem>('/menu-items', data),
  
  update: (id: number, data: Partial<MenuItem>) =>
    api.put<MenuItem>(`/menu-items/${id}`, data),
  
  delete: (id: number) =>
    api.delete(`/menu-items/${id}`),
  
  getByCategory: (category: string) =>
    api.get<MenuItem[]>(`/menu-items/category/${category}`),
};

// Menu Sets API
export const menuSets = {
  list: () =>
    api.get<MenuSet[]>('/menu-sets'),
  
  get: (id: number) =>
    api.get<MenuSet>(`/menu-sets/${id}`),
  
  create: (data: Partial<MenuSet>) =>
    api.post<MenuSet>('/menu-sets', data),
  
  update: (id: number, data: Partial<MenuSet>) =>
    api.put<MenuSet>(`/menu-sets/${id}`, data),
  
  delete: (id: number) =>
    api.delete(`/menu-sets/${id}`),
  
  getItems: (id: number) =>
    api.get<MenuItem[]>(`/menu-sets/${id}/items`),
  
  addItem: (id: number, menuItemId: number) =>
    api.post(`/menu-sets/${id}/items`, { menu_item_id: menuItemId }),
  
  removeItem: (id: number, menuItemId: number) =>
    api.delete(`/menu-sets/${id}/items/${menuItemId}`),
};

// Meal Requests API
export const mealRequests = {
  list: () =>
    api.get<MealRequest[]>('/meal-requests'),
  
  get: (id: number) =>
    api.get<MealRequest>(`/meal-requests/${id}`),
  
  create: (data: Partial<MealRequest>) =>
    api.post<MealRequest>('/meal-requests', data),
  
  update: (id: number, data: Partial<MealRequest>) =>
    api.put<MealRequest>(`/meal-requests/${id}`, data),
  
  delete: (id: number) =>
    api.delete(`/meal-requests/${id}`),
  
  updateStatus: (id: number, status: string) =>
    api.put(`/meal-requests/${id}/status`, { status }),
};

// Comments API
export const comments = {
  list: (mealEventId: number) =>
    api.get<MenuItemComment[]>(`/meals/${mealEventId}/comments`),
  
  get: (mealEventId: number, commentId: number) =>
    api.get<MenuItemComment>(`/meals/${mealEventId}/comments/${commentId}`),
  
  create: (mealEventId: number, data: Partial<MenuItemComment>) =>
    api.post<MenuItemComment>(`/meals/${mealEventId}/comments`, data),
  
  update: (mealEventId: number, commentId: number, data: Partial<MenuItemComment>) =>
    api.put<MenuItemComment>(`/meals/${mealEventId}/comments/${commentId}`, data),
  
  delete: (mealEventId: number, commentId: number) =>
    api.delete(`/meals/${mealEventId}/comments/${commentId}`),
  
  getReplies: (commentId: number) =>
    api.get<MenuItemComment[]>(`/comments/${commentId}/replies`),
};

// Notifications API
export const notifications = {
  list: () =>
    api.get<Notification[]>('/notifications'),
  
  getUnread: () =>
    api.get<Notification[]>('/notifications/unread'),
  
  getUnreadCount: () =>
    api.get<{ count: number }>('/notifications/unread/count'),
  
  markAsRead: (id: number) =>
    api.put(`/notifications/${id}/read`),
  
  markAsDelivered: (id: number) =>
    api.put(`/notifications/${id}/delivered`),
  
  delete: (id: number) =>
    api.delete(`/notifications/${id}`),
};

export default api; 