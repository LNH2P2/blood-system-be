import { AppConfig } from '@config/app-config.type'
import { registerAs } from '@nestjs/config'

export default registerAs<AppConfig>('app', () => {
  console.info(`Register AppConfig from environment variables`)

  const port = process.env.APP_PORT
    ? parseInt(process.env.APP_PORT, 10)
    : process.env.PORT
      ? parseInt(process.env.PORT, 10)
      : 3000

  return {
    nodeEnv: process.env.NODE_ENV || 'development',
    name: process.env.APP_NAME || 'app',
    url: process.env.APP_URL || `http://localhost:${port}`,
    port,
    debug: process.env.APP_DEBUG === 'true',
    apiPrefix: process.env.API_PREFIX || 'api',
    corsOrigin: getCorsOrigin()
  }
})

function getCorsOrigin() {
  const corsOrigin = process.env.APP_CORS_ORIGIN
  if (corsOrigin === 'true') return true
  if (corsOrigin === '*') return '*'
  if (!corsOrigin || corsOrigin === 'false') return false

  return corsOrigin.split(',').map((origin) => origin.trim())
}
