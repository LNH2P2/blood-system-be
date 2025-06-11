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
  secret:
    process.env.JWT_SECRET ||
    'e1rsdcim0VSABvvUM4dvX0AIXyWOUHeuw6mLN4v2lkgpMWKM4IJ3hjPPsw08hsqiCl7vJ32c3AfqLZjC6bqJcYZKQZp+joTZUMPu5WR0SXQym1joPkRQ8C1x4cikIIu1ENF8kdwclMaDx4GEAxse5jPMxajpXDMTGnyfY//S4whLV+6W9XcpMlRRUzVN2FuYAoDVfswFuB3FbMZFbtTskwmQlm/4Imurq3euEZiUnalCoC+21NRLNVxZcyalev/vpxMQoDLXNfQNRYM67RiubtUHmwcScRFsaXdxEhBQU2TUX56ox+NgmZZfP+lwTEPT43fEDX9EWJ7+P5Llgiciqw',
  expired: process.env.JWT_EXPIRES_IN || '1h'
}
