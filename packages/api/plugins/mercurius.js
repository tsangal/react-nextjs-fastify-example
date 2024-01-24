'use strict'

import fp from 'fastify-plugin'
import mercurius from 'mercurius'
import mercuriusAuth from 'mercurius-auth'

import db from '@repo/db'

const schema = `
  directive @auth on OBJECT | FIELD_DEFINITION

  type Query {
    users: [User!]! @auth
  }

  type Mutation {
    deleteUser(id: String!): Int!
  }

  scalar DateTime

  type User {
    id: String!
    username: String!
    name: String!
    created_at: DateTime!
    updated_at: DateTime!
  }

`

const resolvers = {
  Query: {
    users: async () =>
      db('users').select('id', 'username', 'name', 'created_at', 'updated_at'),
  },

  Mutation: {
    deleteUser: async (_, { id }) => db('users').where({ id }).delete(),
  },
}

export default fp(async (fastify) => {
  fastify.register(mercurius, {
    schema,
    resolvers,
  })

  fastify.register(mercuriusAuth, {
    authContext(context) {
      return {
        user: context.reply.request.authToken?.user,
      }
    },
    async applyPolicy(authDirectiveAST, parent, args, context, info) {
      return context.auth?.user != null
    },
    authDirective: 'auth',
  })
})
