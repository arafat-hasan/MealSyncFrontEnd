export interface User {
  id: number;
  name: string;
  email: string;
  username: string;
  department: string;
  employee_id: string;
  role: 'admin' | 'employee' | 'manager';
  notification_enabled: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  image_url: string;
  average_rating: number;
  created_at: string;
  updated_at: string;
}

export interface MenuSet {
  id: number;
  menu_set_name: string;
  menu_set_description: string;
  menu_set_items: MenuSetItem[];
  created_at: string;
  updated_at: string;
}

export interface MenuSetItem {
  id: number;
  menu_item_id: number;
  menu_set_id: number;
  menu_item: MenuItem;
}

export interface MealEvent {
  id: number;
  name: string;
  description: string;
  event_date: string;
  event_duration: number;
  cutoff_time: string;
  addresses: MealEventAddress[];
  menu_sets: MealEventSet[];
  created_at: string;
  updated_at: string;
}

export interface MealEventAddress {
  id: number;
  address_id: number;
  meal_event_id: number;
  address: EventAddress;
}

export interface EventAddress {
  id: number;
  name: string;
  address_line: string;
}

export interface MealEventSet {
  id: number;
  meal_event_id: number;
  menu_set_id: number;
  label: string;
  note: string;
  menu_set: MenuSet;
}

export interface MealRequest {
  id: number;
  user_id: number;
  meal_event_id: number;
  menu_set_id: number;
  event_address_id: number;
  request_items: MealRequestItem[];
  confirmed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface MealRequestItem {
  id: number;
  meal_request_id: number;
  menu_item_id: number;
  menu_set_id: number;
  quantity: number;
  is_selected: boolean;
  notes: string;
  menu_item: MenuItem;
}

export interface MenuItemComment {
  id: number;
  menu_item_id: number;
  meal_event_id: number;
  user_id: number;
  comment: string;
  rating: number;
  parent_id: number | null;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: number;
  user_id: number;
  type: 'reminder' | 'confirmation' | 'admin-message' | 'event-info';
  message: string;
  payload: string;
  read: boolean;
  delivered: boolean;
  read_at: string | null;
  delivered_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

export interface ErrorResponse {
  error: string;
  code: string;
  details: string;
  request_id: string;
} 