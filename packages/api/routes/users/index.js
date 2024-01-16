import db from '@repo/db'
import { verify } from '@repo/db/passwords'

const users = async (fastify, opts) => {
  fastify.get('/', async function (request, reply) {
    let users = await db('users').select(
      'id',
      'username',
      'name',
      'created_at',
      'updated_at'
    )
    return { users }
  })

  fastify.post('/login', async function (request, reply) {
    const body = request.body
    const username = body.username
    const password = body.password

    let user = await db('users').where({ username }).first()
    if (!user) {
      return {
        success: false,
        errorMessage: 'Authentication failed.',
      }
    }

    // Verify password.
    const validPassword = await verify(password, user.password)
    if (!validPassword) {
      return {
        success: false,
        errorMessage: 'Authentication failed.',
      }
    }

    return {
      success: true,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
    }
  })
}

export default users
