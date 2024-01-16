import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import AutoLoad from '@fastify/autoload'
import fastifyCookie from '@fastify/cookie'
import cors from '@fastify/cors'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Pass --options via CLI arguments in command to enable these options.
const options = {}

const app = async (fastify, opts) => {
  // Place here your custom code!

  fastify.register(cors, {
    origin: '*',
  })

  fastify.register(fastifyCookie, {
    secret: 'my-secret',
  })

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  fastify.register(AutoLoad, {
    dir: join(__dirname, 'plugins'),
    options: Object.assign({}, opts),
  })

  // This loads all plugins defined in routes
  // define your routes in one of these
  fastify.register(AutoLoad, {
    dir: join(__dirname, 'routes'),
    options: Object.assign({}, opts),
  })
}

export default app
export { app, options }