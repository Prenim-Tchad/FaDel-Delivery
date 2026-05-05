export const QUEUE_NAMES = {
  ORDER_PROCESSING: 'order-processing',
  ORDER_TIMEOUT: 'order-timeout',
  DRIVER_ASSIGNMENT_RETRY: 'driver-assignment-retry',
  NOTIFICATION_DISPATCH: 'notification-dispatch',
} as const;

export const JOB_NAMES = {
  // Order Processing
  PROCESS_NEW_ORDER: 'process-new-order',
  CONFIRM_ORDER: 'confirm-order',
  CANCEL_ORDER: 'cancel-order',

  // Order Timeout
  ORDER_TIMEOUT_CHECK: 'order-timeout-check',

  // Driver Assignment
  ASSIGN_DRIVER: 'assign-driver',
  RETRY_DRIVER_ASSIGNMENT: 'retry-driver-assignment',

  // Notifications
  SEND_PUSH_NOTIFICATION: 'send-push-notification',
  SEND_SMS: 'send-sms',
  SEND_EMAIL: 'send-email',
} as const;

// Délais et tentatives
export const QUEUE_CONFIG = {
  ORDER_TIMEOUT_MS: 5 * 60 * 1000, // 5 minutes
  DRIVER_RETRY_DELAY_MS: 60 * 1000, // 60 secondes
  DRIVER_RETRY_ATTEMPTS: 3, // 3 tentatives
  DEFAULT_JOB_ATTEMPTS: 3,
  DEFAULT_BACKOFF_DELAY: 5000,
} as const;
