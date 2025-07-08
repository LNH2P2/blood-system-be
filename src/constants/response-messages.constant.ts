export const RESPONSE_MESSAGES = {
  // Hospital Messages
  HOSPITAL: {
    CREATED: 'Hospital created successfully',
    UPDATED: 'Hospital updated successfully',
    DELETED: 'Hospital deleted successfully',
    FOUND: 'Hospital retrieved successfully',
    LIST: 'Hospitals retrieved successfully',
    ACTIVATED: 'Hospital activated successfully',
    DEACTIVATED: 'Hospital deactivated successfully',
    ADD_BLOOD: 'Blood inventory updated successfully',
    REMOVE_BLOOD: 'Blood removed from inventory successfully'
  },
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
  },

  // User messages
  USER_MESSAGE: {
    CREATED_SUCCESS: 'User created successfully',
    UPDATED_SUCCESS: 'User updated successfully',
    CTEATED_ADDRESS_SUCCESS: 'Address created successfully',
    UPDATED_ADDRESS_SUCCESS: 'Address updated successfully',
    DELETED_ADDRESS_SUCCESS: 'Address deleted successfully',
    BLOCK_SUCCESS: 'User blocked successfully',
    UNBLOCK_SUCCESS: 'User unblocked successfully',
    GET_ALL_SUCCESS: 'Get all users successfully',
    GET_SUCCESS: 'Get user successfully',
    UPADTE_PASSWORD: 'Update password successfully',
    RESET_PASSWORD: 'Reset password successfully',
    DELETE_SUCCESS: 'User deleted successfully',
    VERIFY_SUCCESS: 'Email verified successfully',
    RESEND_VERIFICATION_EMAIL_SUCCESS: 'Resend verification email successfully',
    LOGIN_SUCCESS: 'Login successfully',
    LOGOUT_SUCCESS: 'Logout successfully',
    REFRESH_TOKEN_SUCCESS: 'Refresh token successfully',
    SEND_OTP_SUCCESS: 'Send OTP successfully',
    //error
    NOT_FOUND: 'User not found',
    EMAIL_EXISTED: 'Email already exists',
    EMAIL_NOT_EXISTED: 'Email not exists',
    USERNAME_EXISTED: 'Username already exists',
    USERNAME_NOT_EXISTED: 'Username not exists',
    PHONE_NUMBER_EXISTED: 'Phone number already exists',
    PHONE_NUMBER_NOT_EXISTED: 'Phone number not exists',
    PASSWORD_NOT_MATCH: 'Password and confirm password do not match',
    PASSWORD_INCORRECT: 'Old password is incorrect',
    EMAIL_USERNAME_PASSWORD_IS_NULL: 'Email, username, and password cannot be empty',
    CAN_NOT_CHANGE_PASSWORD: 'Can not change password',
    CODE_EXPIRED: 'Code expired',
    WRONG_PASSWORD: 'Wrong password',
    WRONG_USERNAME: 'Wrong username',
    UNVERIFIED_EMAIL: 'Email is not verified',
    USERNAME_OR_PASSWORD_IS_WRONG: 'Username or password is wrong',
    TOKEN_NOT_FOUND: 'Token not found',
    TOKEN_EXPIRED: 'Token expired',
    INVALID_REFRESH_TOKEN: 'Invalid refresh token',
    CONFIRM_PASSWORD_NOT_MATCH: 'Confirm password does not match',
    ADDRESS_NOT_FOUND: 'Address not found',
    
  },

  ERROR_MESSAGE: {
    VALIDATION_ERROR: 'Validation error occurred',
    INTERNAL_SERVER_ERROR: 'An internal server error occurred',
    ID_INVALID: 'The provided ID is invalid'
  }
} as const
