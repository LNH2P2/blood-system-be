export const RESPONSE_MESSAGES = {
  // Donation Request Messages
  DONATION_REQUEST: {
    CREATED: 'Donation request created successfully',
    UPDATED: 'Donation request updated successfully',
    DELETED: 'Donation request deleted successfully',
    FOUND: 'Donation request retrieved successfully',
    LIST: 'Donation requests retrieved successfully',
    SCHEDULED: 'Donation request scheduled successfully'
  },

  // Blog Messages
  BLOG: {
    CREATED: 'Blog post created successfully',
    UPDATED: 'Blog post updated successfully',
    DELETED: 'Blog post deleted successfully',
    PUBLISHED: 'Blog post published successfully',
    FOUND: 'Blog post retrieved successfully',
    LIST: 'Blog posts retrieved successfully'
  },

  // Notification Messages
  NOTIFICATION: {
    CREATED: 'Notification created successfully',
    UPDATED: 'Notification updated successfully',
    DELETED: 'Notification deleted successfully',
    SENT: 'Notification sent successfully',
    FOUND: 'Notification retrieved successfully',
    LIST: 'Notifications retrieved successfully'
  },

  // Cat Messages (for demo)
  CAT: {
    CREATED: 'Cat registered successfully',
    UPDATED: 'Cat information updated successfully',
    DELETED: 'Cat removed successfully',
    FOUND: 'Cat information retrieved successfully',
    LIST: 'Cats list retrieved successfully'
  },

  // Common Messages
  COMMON: {
    SUCCESS: 'Operation completed successfully',
    FAILED: 'Operation failed',
    NOT_FOUND: 'Resource not found',
    UNAUTHORIZED: 'Unauthorized access',
    FORBIDDEN: 'Access forbidden'
  }
} as const
