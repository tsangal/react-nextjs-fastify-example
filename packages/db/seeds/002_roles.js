import { v4 as uuidv4 } from 'uuid'

export async function seed(knex) {
  const ADMIN_USERNAME = 'admin@localhost'

  const seedRoles = [
    {
      name: 'administrator',
      description: 'Administrators',
    },
  ]
  seedRoles.forEach((role) => {
    role.id = uuidv4()
  })

  await knex('roles').insert(seedRoles).onConflict('name').ignore()

  // Assign administrator role to admin user.
  const adminRole = await knex('roles')
    .first('id')
    .where({ name: 'administrator' })
  const adminUser = await knex('users')
    .where('username', ADMIN_USERNAME)
    .first()
  await knex('user_roles')
    .insert({
      user_id: adminUser.id,
      role_id: adminRole.id,
    })
    .onConflict(['user_id', 'role_id'])
    .ignore()
}
