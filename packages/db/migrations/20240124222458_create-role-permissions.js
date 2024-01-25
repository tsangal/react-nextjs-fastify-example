export function up(knex) {
  return knex.schema.createTable('role_permissions', (table) => {
    table.primary(['role_id', 'permission_id'])
    table
      .uuid('role_id')
      .references('id')
      .inTable('roles')
      .onUpdate('CASCADE')
      .onDelete('CASCADE')
    table
      .uuid('permission_id')
      .references('id')
      .inTable('permissions')
      .onUpdate('CASCADE')
      .onDelete('CASCADE')
    table.timestamps(true, true)
  })
}

export function down(knex) {
  return knex.schema.dropTableIfExists('role_permissions')
}
