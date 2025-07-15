export const DEFAULT_PAGE_NUMBER = 1
export const DEFAULT_PAGE_SIZE = 10
export const IS_PUBLIC = 'isPublic'

export enum Environment {
  LOCAL = 'local',
  DEVELOPMENT = 'development',
  STAGING = 'staging',
  PRODUCTION = 'production',
  TEST = 'test'
}

export enum Order {
  ASC = 'ASC',
  DESC = 'DESC'
}

export const DEFAULT_PAGE_LIMIT = 10
export const DEFAULT_CURRENT_PAGE = 1
export const SYSTEM_USER_ID = 'system'

export const jwtConstants = {
  secret_access:
    process.env.JWT_ACCESS_SECRET ||
    'e1rsdcim0VSABvvUM4dvX0AIXyWOUHeuw6mLN4v2lkgpMWKM4IJ3hjPPsw08hsqiCl7vJ32c3AfqLZjC6bqJcYZKQZp+joTZUMPu5WR0SXQym1joPkRQ8C1x4cikIIu1ENF8kdwclMaDx4GEAxse5jPMxajpXDMTGnyfY//S4whLV+6W9XcpMlRRUzVN2FuYAoDVfswFuB3FbMZFbtTskwmQlm/4Imurq3euEZiUnalCoC+21NRLNVxZcyalev/vpxMQoDLXNfQNRYM67RiubtUHmwcScRFsaXdxEhBQU2TUX56ox+NgmZZfP+lwTEPT43fEDX9EWJ7+P5Llgiciqw',
  expired_access: process.env.JWT_ACCESS_EXPIRES_IN || '3h',
  secret_refresh:
    process.env.JWT_REFRESH_SECRET ||
    '1o0WCPP+U1qyHiSKboYqSjVjBnGZYwJMhomYR+Th0hKqaCj1K059TpmOSeCtnTyTwi/DKkdKfxCVQcNq7r6bhphTtLeiFHXml3xwbmarVxzpJdz45UmbQTDXxyE/eSYaQmKMxu+VXdr45Sd+h2/qdiUGc00ZmyKA5ho/IzyGa/gs29AlautPzzYhfEhRv14DFHs/5sirlSpzGf8W0IUoRTakSw4mrZyWeOy2tNo/QEXUTbXwS1CmW2dGFgsQcA9OuHrTdlU4GA4DDXGhg7Jekp+l0VuivcNZF4H/vyGfTaGKPdy42/WOD0zhpOe5wAC4c6fb+w83uBCxfw',
  expired_refresh: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
}
