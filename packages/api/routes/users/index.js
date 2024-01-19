import { v4 as uuidv4 } from 'uuid'
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

    await sendAuthorization(user, reply)
  })

  fastify.post('/refreshAuth', async function (request, reply) {
    const body = request.body

    const cookieRefreshToken = fastify.jwt.verify(request.cookies.refresh_token)
    const userId = cookieRefreshToken.userId
    // TODO: check expiration date

    // Verify refresh token exists.
    const dbRefreshToken = await db('user_refresh_tokens')
      .where({ id: cookieRefreshToken.id })
      .first()
    if (!dbRefreshToken) {
      return {
        success: false,
        errorMessage: 'Authentication failed.',
      }
    }

    // Load user.
    const user = await db('users').where({ id: userId }).first()
    if (!user) {
      return {
        success: false,
        errorMessage: 'Authentication failed.',
      }
    }

    await sendAuthorization(user, reply)

    // Delete used refresh token.
    await db('user_refresh_tokens').where({ id: dbRefreshToken.id }).delete()
  })

  fastify.post('/logout', async function (request, reply) {
    const cookieRefreshToken = fastify.jwt.verify(request.cookies.refresh_token)
    if (cookieRefreshToken) {
      // Delete refresh token from db.
      await db('user_refresh_tokens')
        .where({ id: cookieRefreshToken.id })
        .delete()

      // Clear user's refresh token cookies.
      reply.cookie('refresh_token_expiry', null, {
        expires: Date.now(),
        path: '/',
      })
      reply.cookie('refresh_token', null, {
        expires: Date.now(),
        httpOnly: true,
        path: '/',
      })
    }
    reply.send({ success: true })
  })

  const AUTH_TOKEN_EXPIRY = 5
  function getAuthTokenExpiration(fromDate = undefined) {
    if (fromDate === undefined) {
      fromDate = new Date()
    }
    return Math.floor(fromDate / 1000) + AUTH_TOKEN_EXPIRY * 60
  }

  const REFRESH_TOKEN_EXPIRY = 15
  function getRefreshTokenExpiration(fromDate = undefined) {
    if (fromDate === undefined) {
      fromDate = new Date()
    }
    return Math.floor(fromDate / 1000) + REFRESH_TOKEN_EXPIRY * 60
  }

  async function createRefreshToken(user) {
    const refreshTokenId = uuidv4()
    const refreshTokenExpiry = getRefreshTokenExpiration()
    await db('user_refresh_tokens').insert({
      id: refreshTokenId,
      user_id: user.id,
      expiry_date: new Date(refreshTokenExpiry * 1000).toISOString(),
    })
    const refreshToken = {
      id: refreshTokenId,
      userId: user.id,
      exp: refreshTokenExpiry,
    }
    return refreshToken
  }

  async function sendAuthorization(user, reply) {
    const clientUser = {
      id: user.id,
      username: user.username,
      name: user.name,
      created_at: user.created_at,
      updated_at: user.updated_at,
    }

    const authTokenExpiry = getAuthTokenExpiration()
    const authToken = {
      user: clientUser,
      exp: authTokenExpiry,
    }
    const signedAuthToken = fastify.jwt.sign(authToken)

    const refreshToken = await createRefreshToken(user)
    const signedRefreshToken = fastify.jwt.sign(refreshToken)

    reply.cookie('refresh_token_expiry', refreshToken.exp, {
      expires: new Date(refreshToken.exp * 1000),
      path: '/',
    })
    reply.cookie('refresh_token', signedRefreshToken, {
      expires: new Date(refreshToken.exp * 1000),
      httpOnly: true,
      path: '/',
    })

    reply.send({
      success: true,
      user: clientUser,
      authToken: signedAuthToken,
      authTokenExpiry: authTokenExpiry * 1000,
      refreshTokenExpiry: refreshToken.exp * 1000,
    })

    return {
      authToken,
      refreshToken,
    }
  }
}

export default users
