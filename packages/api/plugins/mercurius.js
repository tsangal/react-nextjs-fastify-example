'use strict'

import fp from 'fastify-plugin'
import mercurius from 'mercurius'
import mercuriusAuth from 'mercurius-auth'

import db from '@repo/db'

const schema = `
  directive @auth on OBJECT | FIELD_DEFINITION
  directive @hasPermissions(grants: [String]) on OBJECT | FIELD_DEFINITION
  directive @hasRoles(roles: [String]) on OBJECT | FIELD_DEFINITION

  type Query {
    permissions: [Permission!]! @hasPermissions(grants: ["permission:list"])
    roles: [Role!]! @hasPermissions(grants: ["role:list"])
    users: [User!]! @hasPermissions(grants: ["user:list"])
  }

  type Mutation {
    deletePermission(id: String!): Int! @hasPermissions(grants: ["permission:delete"])
    deleteRole(id: String!): Int! @hasPermissions(grants: ["role:delete"])
    deleteUser(id: String!): Int! @hasPermissions(grants: ["user:delete"])
  }

  scalar DateTime

  type Permission {
    id: String!
    name: String!
    description: String
    created_at: DateTime!
    updated_at: DateTime!
  }

  type Role {
    id: String!
    name: String!
    description: String
    permissions: [Permission!]
    created_at: DateTime!
    updated_at: DateTime!
  }

  type User {
    id: String!
    username: String!
    name: String!
    roles: [Role!]
    created_at: DateTime!
    updated_at: DateTime!
  }
`

const resolvers = {
  Query: {
    permissions: async () =>
      db('permissions').select(
        'id',
        'name',
        'description',
        'created_at',
        'updated_at'
      ),
    roles: async () =>
      db('roles').select(
        'id',
        'name',
        'description',
        'created_at',
        'updated_at'
      ),
    users: async () =>
      db('users').select('id', 'username', 'name', 'created_at', 'updated_at'),
  },

  Mutation: {
    deletePermission: async (_, { id }) =>
      db('permissions').where({ id }).delete(),
    deleteRole: async (_, { id }) => db('roles').where({ id }).delete(),
    deleteUser: async (_, { id }) => db('users').where({ id }).delete(),
  },

  Role: {
    permissions: async (parent, args, context, info) => {
      if (parent.permissions !== undefined) {
        return parent.permissions
      }
      const rolePermissions = await db('permissions')
        .join(
          'role_permissions',
          'role_permissions.permission_id',
          '=',
          'permissions.id'
        )
        .where('role_permissions.role_id', '=', parent.id)
      return rolePermissions
    },
  },

  User: {
    roles: async (parent, args, context, info) => {
      if (parent.roles !== undefined) {
        return parent.roles
      }
      const userRoles = await db('roles')
        .join('user_roles', 'user_roles.role_id', '=', 'roles.id')
        .where('user_roles.user_id', '=', parent.id)
      return userRoles
    },
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
    async applyPolicy(policy, parent, args, context, info) {
      if (context.auth?.user != null) {
        return true
      }
      const err = new mercurius.ErrorWithProps('Access denied.')
      err.statusCode = 401
      return err
    },
    authDirective: 'auth',
  })

  fastify.register(mercuriusAuth, {
    authContext(context) {
      return {
        permissions: context.reply.request.authToken?.permissions,
      }
    },
    async applyPolicy(policy, parent, args, context, info) {
      const userPermissions = context.auth?.permissions
      if (userPermissions) {
        const grants = policy.arguments[0].value.values.map((v) => v.value)
        const success = grants.every((grant) => userPermissions.includes(grant))
        if (success) {
          return true
        }
      }
      const err = new mercurius.ErrorWithProps('Access denied.')
      err.statusCode = 401
      return err
    },
    authDirective: 'hasPermissions',
  })

  fastify.register(mercuriusAuth, {
    authContext(context) {
      return {
        roles: context.reply.request.authToken?.roles,
      }
    },
    async applyPolicy(policy, parent, args, context, info) {
      const userRoles = context.auth?.roles
      if (userRoles) {
        const required = policy.arguments[0].value.values.map((v) => v.value)
        const success = required.every((require) => userRoles.includes(require))
        if (success) {
          return true
        }
      }
      const err = new mercurius.ErrorWithProps('Access denied.')
      err.statusCode = 401
      return err
    },
    authDirective: 'hasRoles',
  })
})
