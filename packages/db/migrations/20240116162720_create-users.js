export function up(knex) {
  return knex.schema.createTable('users', (table) => {
    table.uuid('id').primary()
    table.string('username').notNullable().unique()
    table.string('password')
    table.string('name', 100)
    table.timestamps(true, true)
  })
}

export function down(knex) {
  return knex.schema.dropTableIfExists('users')
}
