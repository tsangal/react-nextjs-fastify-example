export async function up(knex) {
  await knex.schema.createTable('user_roles', (table) => {
    table.primary(['user_id', 'role_id'])
    table
      .uuid('user_id')
      .references('id')
      .inTable('users')
      .onUpdate('CASCADE')
      .onDelete('CASCADE')
      .notNullable()
      .index()
    table
      .uuid('role_id')
      .references('id')
      .inTable('roles')
      .onUpdate('CASCADE')
      .onDelete('CASCADE')
      .notNullable()
      .index()
    table.timestamps(true, true)
  })

  await knex.schema.table('users', (table) => {
    table.dropColumn('role_id')
  })
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('user_roles')
}
