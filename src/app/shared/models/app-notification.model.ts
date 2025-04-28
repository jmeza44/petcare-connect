export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  duration?: number; // in milliseconds
  animation?: 'fade' | 'slideHorizontal' | 'slideVertical'; // default to 'fade' if undefined
}
