export enum ErrorCode {
  // Common Validation
  V000 = 'common.validation.error',
  V001 = 'user.validation.is_empty',
  V002 = 'user.validation.is_invalid',
  V003 = 'common.validation.is_invalid_string',
  V004 = 'common.validation.is_not_empty',
  V005 = 'common.validation.is_invalid_date_format',
  V006 = 'common.validation.is_invalid_time_format',
  V007 = 'common.validation.is_invalid_phone_number',

  // Validation

  // Error
  E001 = 'user.error.username_or_email_exists_or_phone_number_exists',
  E002 = 'user.error.not_found',
  E003 = 'user.error.email_exists',
  E004 = 'user.error.phone_number_exists',
  E005 = 'password.error.can_not_change',
  E006 = 'id.error.is_invalid',
  E007 = 'user.error.email_not_exists',
  E008 = 'user.error.code_expired',
  E009 = 'user.error.wrong_password',
  E010 = 'user.error.wrong_username',
  E011 = 'user.error.unverified_email',
  E012 = 'user.error.token_not_found',
  E013 = 'user.error.token_expired',
  E014 = 'user.error.refresh_token_not_found',
  E015 = 'user.error.refresh_token_expired',
  E016 = 'user.error.password_not_match',
  E017 = 'user.error.address_not_found'
}
