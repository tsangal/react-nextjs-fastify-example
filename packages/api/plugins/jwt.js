import fp from 'fastify-plugin'
import jwt from '@fastify/jwt'

export default fp(async (fastify) => {
  fastify.register(jwt, {
    secret: 'my-secret',
    decoratorName: 'authToken',
  })

  fastify.addHook('onRequest', async (request, reply) => {
    try {
      await request.jwtVerify()
    } catch (err) {
      console.error(err)
    }
  })
})
