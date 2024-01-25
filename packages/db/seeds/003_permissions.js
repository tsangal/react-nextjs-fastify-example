import { v4 as uuidv4 } from 'uuid'

const seedPermissions = [
  ['permission:list', 'List permissions'],
  ['permission:create', 'Create permissions'],
  ['permission:read', 'Read permission data'],
  ['permission:update', 'Update permission data'],
  ['permission:delete', 'Delete permissions'],
  ['role:list', 'List roles'],
  ['role:create', 'Create roles'],
  ['role:read', 'Read role data'],
  ['role:update', 'Update role data'],
  ['role:delete', 'Delete roles'],
  ['user:list', 'List users'],
  ['user:create', 'Create users'],
  ['user:read', 'Read user data'],
  ['user:update', 'Update user data'],
  ['user:delete', 'Delete users'],
]

export function seed(knex) {
  const perms = seedPermissions.map((seed) => ({
    id: uuidv4(),
    name: seed[0],
    description: seed[1],
  }))
  return knex('permissions').insert(perms).onConflict('name').ignore()
}
