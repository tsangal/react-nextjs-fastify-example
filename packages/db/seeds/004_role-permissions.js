const ADMIN_ROLE_NAME = 'administrator'

export async function seed(knex) {
  const permissions = await knex('permissions').select()
  const permissionsNameMap = new Map()
  for (const permission of permissions) {
    permissionsNameMap.set(permission.name, permission)
  }

  const seedRolePermissions = []

  // Add permissions for administrator role.
  const adminRole = await knex('roles').first().where({ name: ADMIN_ROLE_NAME })
  if (!adminRole) {
    console.error('Admin role not found. Not seeding role-permissions.')
  } else {
    for (const permission of permissions) {
      seedRolePermissions.push({
        role_id: adminRole.id,
        permission_id: permission.id,
      })
    }
  }

  return knex('role_permissions')
    .insert(seedRolePermissions)
    .onConflict(['role_id', 'permission_id'])
    .ignore()
}
